// src/store/casesStore.ts
import { create } from 'zustand';
import { db, auth } from '../lib/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { CaseDigest } from '../types';

// ============================================================
// TYPES
// ============================================================
interface CasesState {
  cases: CaseDigest[];
  loading: boolean;
  loadingMore: boolean; // 🟢 NEW: Tracks if we are fetching the next batch
  hasMore: boolean;     // 🟢 NEW: Tells UI if there are more cases to load
  lastDoc: QueryDocumentSnapshot<DocumentData, DocumentData> | null; // 🟢 NEW: The pagination cursor
  hasFetched: boolean;
  error: string | null;
  fetchCases: (uid?: string) => Promise<void>;
  fetchMoreCases: () => Promise<void>; // 🟢 NEW: Function to load the next 50
  addCase: (newCase: Partial<CaseDigest>) => Promise<void>;
  updateCase: (id: string, updatedData: Partial<CaseDigest>) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  clearCases: () => void;
}

// ============================================================
// CONSTANTS
// ============================================================
const CASES_LIMIT = 50;

// ============================================================
// STORE
// ============================================================
export const useCasesStore = create<CasesState>((set, get) => ({
  cases: [],
  loading: false,
  loadingMore: false,
  hasMore: true,
  lastDoc: null,
  hasFetched: false,
  error: null,

  // ----------------------------------------------------------
  // 1. INITIAL FETCH (Loads the first 50 cases)
  // ----------------------------------------------------------
  fetchCases: async (passedUid?: string) => {
    if (get().hasFetched) return;

    const userId = passedUid || auth.currentUser?.uid;
    if (!userId) {
      console.warn('Fetch blocked: user is not authenticated.');
      return;
    }

    set({ loading: true, error: null });

    try {
      // ⚠️ REQUIRES COMPOSITE INDEX in Firestore
      const q = query(
        collection(db, 'cases'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'), 
        limit(CASES_LIMIT)
      );

      const querySnapshot = await getDocs(q);
      const fetchedCases = querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as CaseDigest);

      // Save the last document as the cursor for the next batch
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      set({ 
        cases: fetchedCases, 
        lastDoc: lastVisible || null,
        hasMore: fetchedCases.length === CASES_LIMIT, // If we got 50, there might be more
        loading: false, 
        hasFetched: true 
      });

    } catch (error: any) {
      console.error('Error fetching cases:', error);
      if (error?.code === 'failed-precondition') {
        console.error('Firestore composite index is missing. Click the link in the Firebase error to build it.');
        set({ loading: false, error: 'Database index not configured. Check console for the creation link.' });
      } else {
        set({ loading: false, error: 'Failed to load cases. Please check your connection.' });
      }
    }
  },

  // ----------------------------------------------------------
  // 🟢 2. FETCH MORE CASES (Pagination / Infinite Scroll)
  // ----------------------------------------------------------
  fetchMoreCases: async () => {
    const { loadingMore, hasMore, lastDoc, cases } = get();
    const userId = auth.currentUser?.uid;

    if (!userId || loadingMore || !hasMore || !lastDoc) return;

    set({ loadingMore: true, error: null });

    try {
      const q = query(
        collection(db, 'cases'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc), // 🟢 Start exactly where the last batch ended
        limit(CASES_LIMIT)
      );

      const querySnapshot = await getDocs(q);
      const fetchedCases = querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as CaseDigest);
      const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      set({
        cases: [...cases, ...fetchedCases], // Append new cases to existing list
        lastDoc: newLastVisible || null,
        hasMore: fetchedCases.length === CASES_LIMIT,
        loadingMore: false
      });

    } catch (error) {
      console.error('Error fetching more cases:', error);
      set({ loadingMore: false, error: 'Failed to load older cases.' });
    }
  },

  // ----------------------------------------------------------
  // 3. ADD CASE
  // ----------------------------------------------------------
  addCase: async (newCase) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const { id, ...cleanData } = newCase;
    const payload = { ...cleanData, userId, createdAt: serverTimestamp() };

    const tempId = `temp-${Date.now()}`;
    const optimisticCase: CaseDigest = {
      ...cleanData,
      id: tempId,
      userId,
      createdAt: new Date().toISOString(),
    } as CaseDigest;

    // Add to the TOP of the list
    set((state) => ({ cases: [optimisticCase, ...state.cases] }));

    try {
      const docRef = await addDoc(collection(db, 'cases'), payload);
      set((state) => ({
        cases: state.cases.map((c) => (c.id === tempId ? { ...c, id: docRef.id } : c)),
      }));
    } catch (error) {
      set((state) => ({
        cases: state.cases.filter((c) => c.id !== tempId),
        error: 'Failed to save the case. Please try again.',
      }));
    }
  },

  // ----------------------------------------------------------
  // 4. UPDATE CASE
  // ----------------------------------------------------------
  updateCase: async (id, updatedData) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const existing = get().cases.find((c) => c.id === id);
    if (!existing || existing.userId !== userId) return;

    const { id: _id, ...cleanUpdateData } = updatedData;

    set((state) => ({
      cases: state.cases.map((c) => (c.id === id ? { ...c, ...cleanUpdateData } : c)),
    }));

    try {
      await updateDoc(doc(db, 'cases', id), cleanUpdateData);
    } catch (error) {
      set((state) => ({
        cases: state.cases.map((c) => (c.id === id ? existing : c)),
        error: 'Failed to update the case.',
      }));
    }
  },

  // ----------------------------------------------------------
  // 5. DELETE CASE
  // ----------------------------------------------------------
  deleteCase: async (id) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const existing = get().cases.find((c) => c.id === id);
    if (!existing || existing.userId !== userId) return;

    set((state) => ({ cases: state.cases.filter((c) => c.id !== id) }));

    try {
      await deleteDoc(doc(db, 'cases', id));
    } catch (error) {
      set((state) => ({
        cases: [existing, ...state.cases],
        error: 'Failed to delete the case.',
      }));
    }
  },

  // ----------------------------------------------------------
  // 6. CLEAR CASES (Reset all pagination states)
  // ----------------------------------------------------------
  clearCases: () =>
    set({ 
      cases: [], 
      hasFetched: false, 
      loading: false, 
      loadingMore: false,
      hasMore: true,
      lastDoc: null,
      error: null 
    }),
}));