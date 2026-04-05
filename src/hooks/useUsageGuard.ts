import { useAuthStore } from '../store/authStore';
import { PLAN_LIMITS } from '../types';

// Define the keys that match our limits
export type UsageFeature = keyof typeof PLAN_LIMITS.free;

export const useUsageGuard = () => {
  const { user } = useAuthStore();

  const checkAccess = (feature: UsageFeature): boolean => {
    if (!user) return false;
    
    // 🟢 Master Admin Bypass: The firm's partners have no limits
    if (user.role === 'admin' || user.email === 'rashemvanrondina@gmail.com') {
      return true;
    }

    const limits = PLAN_LIMITS[user.subscription];
    const usage = user.usage;

    // Failsafe: If limits or ledger don't exist yet, deny access to prevent crashes
    if (!limits || !usage) return false;

    // 🟢 Evaluate the specific feature limit
    switch (feature) {
      case 'chatDaily':
        if (limits.chatDaily === Infinity) return true;
        return (usage.dailyChatCount || 0) < limits.chatDaily;
        
      case 'aiDeconstruction':
        if (limits.aiDeconstruction === Infinity) return true;
        return (usage.aiDeconstructionCount || 0) < limits.aiDeconstruction;
        
      case 'casesDaily':
        if (limits.casesDaily === Infinity && limits.casesMonthly === Infinity) return true;
        return (usage.dailyCaseCount || 0) < limits.casesDaily && (usage.monthlyCaseCount || 0) < limits.casesMonthly;
        
      case 'practiceDaily':
        if (limits.practiceDaily === Infinity) return true;
        return (usage.dailyPracticeCount || 0) < limits.practiceDaily;
        
      default:
        return true; 
    }
  };

  return { checkAccess };
};