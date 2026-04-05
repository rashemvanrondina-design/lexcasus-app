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
  limit // 🟢 IMPORTED: To protect your billing quota
} from 'firebase/firestore';
import { Note } from '../types'; 

interface NotesState {
  notes: Note[];
  loading: boolean;
  hasFetched: boolean; // 🟢 SECURITY GUARD: Prevents duplicate reads
  
  fetchNotes: (userId?: string) => Promise<void>;
  saveNote: (noteData: Partial<Note>) => Promise<void>; 
  removeNote: (id: string) => Promise<void>;
  
  clearNotes: () => void; // 🟢 DATA WIPE: For safe logouts
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  loading: false,
  hasFetched: false,

  fetchNotes: async (passedUserId?: string) => {
    // 🟢 THE IRONCLAD BYPASS: If we checked Firebase once, don't do it again!
    if (get().hasFetched) return; 

    const userId = passedUserId || auth.currentUser?.uid; 
    
    if (!userId) {
      console.warn("Fetch blocked: No user ID provided.");
      return;
    }
    
    set({ loading: true });
    try {
      const q = query(
        collection(db, 'notes'), 
        where('userId', '==', userId),
        orderBy('title', 'asc'),
        limit(100) // 🟢 EXHIBIT C: Cap the fetch to 100 notes at a time to prevent billing spikes
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedNotes = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as Note[];
      
      // Filter out the E-Codal notes.
      const personalNotes = fetchedNotes.filter(note => note.type !== 'codal_annotation');

      // 🟢 Lock the gate: Mark hasFetched as true
      set({ notes: personalNotes, loading: false, hasFetched: true });
    } catch (error) {
      console.error("Error fetching notes:", error);
      set({ loading: false });
    }
  },

  saveNote: async (noteData: Partial<Note>) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      const isNewNote = !noteData.id || noteData.id.startsWith('temp-');

      if (isNewNote) {
        // 📝 CREATE NEW
        const { id, ...cleanData } = noteData; 
        const payload = {
          title: noteData.title || "",
          content: noteData.content || "",
          tags: noteData.tags || [],
          linkedCases: noteData.linkedCases || [],
          linkedProvisions: noteData.linkedProvisions || [],
          userId,
          type: 'general', 
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const docRef = await addDoc(collection(db, 'notes'), payload);
        const createdNote = { id: docRef.id, ...payload } as Note;
        
        // 🟢 UPDATE LOCAL STATE & SORT
        set((state) => ({
          notes: [...state.notes.filter(n => !n.id.startsWith('temp-')), createdNote]
            .sort((a, b) => a.title.localeCompare(b.title))
        }));
      } else {
        // 🖋️ UPDATE EXISTING
        const noteRef = doc(db, 'notes', noteData.id!);
        const updatePayload = {
          ...noteData,
          updatedAt: new Date().toISOString(),
        };
        await updateDoc(noteRef, updatePayload);
        
        set((state) => ({
          notes: state.notes
            .map((n) => (n.id === noteData.id ? { ...n, ...updatePayload } : n))
            .sort((a, b) => a.title.localeCompare(b.title)),
        }));
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
  },

  removeNote: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
      set((state) => ({
        notes: state.notes.filter((n) => n.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  },

  // 🟢 THE DATA WIPE
  clearNotes: () => set({ notes: [], hasFetched: false, loading: false }),
}));