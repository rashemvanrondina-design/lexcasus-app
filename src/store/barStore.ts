import { create } from 'zustand';
import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy
} from 'firebase/firestore';

export interface BarQuestion {
  id: string;
  subject: string;
  subsubject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  suggestedAnswer: string;
  createdAt?: string;
}

interface BarState {
  questions: BarQuestion[];
  loading: boolean;
  hasFetched: boolean; // 🟢 SECURITY GUARD: Prevents infinite reads if DB is empty
  
  fetchQuestions: () => Promise<void>;
  addQuestion: (q: Omit<BarQuestion, 'id'>) => Promise<void>;
  updateQuestion: (id: string, q: Partial<BarQuestion>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
}

export const useBarStore = create<BarState>((set, get) => ({
  questions: [],
  loading: false,
  hasFetched: false,
  
  fetchQuestions: async () => {
    // 🟢 THE BYPASS: Only fetch once per session!
    if (get().hasFetched) return; 
    
    set({ loading: true });
    try {
      // 🟢 ORDER BY: Keep questions neatly organized by newest first
      const q = query(collection(db, 'bar_questions'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      
      const fetchedQuestions = snap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as BarQuestion));
      
      set({ questions: fetchedQuestions, loading: false, hasFetched: true });
    } catch (error) {
      console.error("Failed to fetch bar questions", error);
      set({ loading: false });
    }
  },
  
  addQuestion: async (q) => {
    try {
      const payload = { ...q, createdAt: new Date().toISOString() };
      const docRef = await addDoc(collection(db, 'bar_questions'), payload);
      
      const newQuestion = { id: docRef.id, ...payload } as BarQuestion;
      
      // 🟢 OPTIMISTIC UPDATE: Add to local array instantly (0 reads)
      set((state) => ({
        questions: [newQuestion, ...state.questions]
      }));
    } catch (error) { 
      console.error("Failed to add question", error); 
    }
  },
  
  updateQuestion: async (id, q) => {
    try {
      const docRef = doc(db, 'bar_questions', id);
      await updateDoc(docRef, q);
      
      // 🟢 OPTIMISTIC UPDATE: Edit the local array instantly (0 reads)
      set((state) => ({
        questions: state.questions.map((question) => 
          question.id === id ? { ...question, ...q } : question
        )
      }));
    } catch (error) { 
      console.error("Failed to update question", error); 
    }
  },
  
  deleteQuestion: async (id) => {
    try {
      await deleteDoc(doc(db, 'bar_questions', id));
      
      // 🟢 OPTIMISTIC UPDATE: Remove from local array instantly (0 reads)
      set((state) => ({
        questions: state.questions.filter((question) => question.id !== id)
      }));
    } catch (error) { 
      console.error("Failed to delete question", error); 
    }
  }
}));