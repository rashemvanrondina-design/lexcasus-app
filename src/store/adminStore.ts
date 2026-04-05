import { create } from 'zustand';
import { db } from '../lib/firebase';
import { 
  collection, getDocs, doc, updateDoc, deleteDoc, 
  query, orderBy, limit, getCountFromServer,
  getDoc, setDoc // 🟢 AMENDMENT: Added for Announcement Settings
} from 'firebase/firestore';
import { User, SubscriptionPlan } from '../types';

interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalQuestions: number;
  premiumUsers: number;
  premiumPlusUsers: number;
  basicUsers: number; 
}

interface ActivityLog {
  id: string;
  action: string;
  detail: string;
  type: 'user' | 'subscription' | 'question' | 'case' | 'codal';
  timestamp: any;
}

interface AdminState {
  users: User[];
  activities: ActivityLog[];
  stats: AdminStats;
  loading: boolean;
  
  // 🟢 NEW: Announcement State
  announcements: any | null; 

  hasFetchedStats: boolean;
  hasFetchedActivities: boolean;

  fetchAdminStats: () => Promise<void>;
  fetchRecentActivity: () => Promise<void>;
  updateUserSubscription: (userId: string, plan: SubscriptionPlan) => Promise<void>;
  toggleUserStatus: (userId: string, currentStatus: boolean) => Promise<void>;
  deleteUserRecord: (userId: string) => Promise<void>;
  
  // 🟢 NEW: Announcement Methods
  fetchAnnouncements: () => Promise<void>;
  updateAnnouncements: (data: any) => Promise<void>;

  clearAdminData: () => void; 
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  activities: [],
  announcements: null, // 🟢 Default state
  stats: {
    totalUsers: 0,
    activeSubscriptions: 0,
    totalQuestions: 0,
    premiumUsers: 0,
    premiumPlusUsers: 0, 
    basicUsers: 0,
  },
  loading: false,
  hasFetchedStats: false,
  hasFetchedActivities: false,

  updateUserSubscription: async (userId, plan) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { subscription: plan });
      
      set((state) => {
        const updatedUsers = state.users.map(u => 
          u.id === userId ? { ...u, subscription: plan } : u
        );

        return {
          users: updatedUsers,
          stats: {
            ...state.stats,
            premiumPlusUsers: updatedUsers.filter(u => u.subscription === 'premium_plus').length,
            premiumUsers: updatedUsers.filter(u => u.subscription === 'premium').length,
            basicUsers: updatedUsers.filter(u => u.subscription === 'free').length,
            activeSubscriptions: updatedUsers.filter(u => u.subscription !== 'free').length,
          }
        };
      });
    } catch (error) {
      console.error("Subscription Update Failed:", error);
    }
  },

  toggleUserStatus: async (userId, currentStatus) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { isActive: !currentStatus });
      
      set((state) => ({
        users: state.users.map(u => 
          u.id === userId ? { ...u, isActive: !currentStatus } : u
        )
      }));
    } catch (error) {
      console.error("Status Toggle Failed:", error);
    }
  },

  deleteUserRecord: async (userId: string) => {
    set((state) => {
      const remainingUsers = state.users.filter(u => u.id !== userId);
      return {
        users: remainingUsers,
        stats: {
          ...state.stats,
          totalUsers: remainingUsers.length,
          premiumPlusUsers: remainingUsers.filter(u => u.subscription === 'premium_plus').length,
          premiumUsers: remainingUsers.filter(u => u.subscription === 'premium').length,
          basicUsers: remainingUsers.filter(u => u.subscription === 'free').length,
          activeSubscriptions: remainingUsers.filter(u => u.subscription !== 'free').length,
        }
      };
    });

    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.error("Firebase Execution Failed:", error);
      alert("Notice: The user was hidden from your screen, but Firebase blocked the actual deletion. Please check your Firestore Security Rules!");
    }
  },

  fetchRecentActivity: async () => {
    if (get().hasFetchedActivities) return; 

    try {
      const q = query(collection(db, 'activity_logs'), orderBy('timestamp', 'desc'), limit(10));
      const snap = await getDocs(q);
      const logs = snap.docs.map(d => ({ id: d.id, ...d.data() })) as ActivityLog[];
      
      set({ activities: logs, hasFetchedActivities: true });
    } catch (error) {
      console.error("Failed to fetch activity logs:", error);
    }
  },

  fetchAdminStats: async () => {
    if (get().hasFetchedStats) return; 
    
    set({ loading: true });
    try {
      const userSnap = await getDocs(collection(db, 'users'));
      const allUsers = userSnap.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        createdAt: d.data().createdAt || new Date().toISOString() 
      })) as User[];
      
      const questionsQuery = collection(db, 'bar_questions');
      const questionsSnapshot = await getCountFromServer(questionsQuery);
      const totalBarQuestions = questionsSnapshot.data().count;

      set({
        users: allUsers,
        stats: {
          totalUsers: allUsers.length,
          premiumPlusUsers: allUsers.filter(u => u.subscription === 'premium_plus').length,
          premiumUsers: allUsers.filter(u => u.subscription === 'premium').length,
          basicUsers: allUsers.filter(u => u.subscription === 'free').length,
          activeSubscriptions: allUsers.filter(u => u.subscription !== 'free').length,
          totalQuestions: totalBarQuestions, 
        },
        loading: false,
        hasFetchedStats: true 
      });
    } catch (error: any) {
      console.error("Jurisdictional Error in AdminStore:", error.code, error.message);
      set({ loading: false });
    }
  },

  // 🟢 NEW: Fetches the promo settings from Firestore
  fetchAnnouncements: async () => {
    try {
      const docRef = doc(db, 'settings', 'announcements');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ announcements: docSnap.data() });
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    }
  },

  // 🟢 NEW: Saves updated promo settings to Firestore
  updateAnnouncements: async (data: any) => {
    try {
      const docRef = doc(db, 'settings', 'announcements');
      // Using merge: true ensures we only update what we send, keeping other settings intact
      await setDoc(docRef, data, { merge: true });
      
      // Update local state immediately
      set((state) => ({ 
        announcements: { ...state.announcements, ...data } 
      }));
    } catch (error) {
      console.error("Failed to update announcements:", error);
      throw error;
    }
  },

  clearAdminData: () => set({
    users: [],
    activities: [],
    announcements: null, // 🟢 Wipe announcement memory on logout
    stats: { totalUsers: 0, activeSubscriptions: 0, totalQuestions: 0, premiumUsers: 0, premiumPlusUsers: 0, basicUsers: 0 },
    hasFetchedStats: false,
    hasFetchedActivities: false,
    loading: false
  })
}));