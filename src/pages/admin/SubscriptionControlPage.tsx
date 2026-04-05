import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import type { User, SubscriptionPlan } from '../../types';
import { cn, getInitials } from '../../lib/utils';
import {
  CreditCard,
  Crown,
  Shield,
  Search,
  CheckCircle2,
  Loader2,
  Diamond
} from 'lucide-react';

const SubscriptionControlPage: React.FC = () => {
  // 🟢 1. Connect to our Live Registry
  const { users, loading, fetchAdminStats, updateUserSubscription } = useAdminStore();
  const [search, setSearch] = useState('');

  // 🟢 2. Fetch the latest user data on mount
  useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);

  const filteredUsers = users.filter(u =>
    search === '' || 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // 🟢 3. Action handler for plan changes (The Writ of Execution)
  const handleChangePlan = async (userId: string, newPlan: SubscriptionPlan) => {
    await updateUserSubscription(userId, newPlan);
  };

  // 🟢 4. Financial Calculations based on LIVE users (Dynamic to the new tiers)
  const freeCount = users.filter(u => u.subscription === 'free').length;
  const premiumCount = users.filter(u => u.subscription === 'premium').length;
  const premiumPlusCount = users.filter(u => u.subscription === 'premium_plus').length;
  const estimatedRevenue = (premiumCount * 199) + (premiumPlusCount * 599);

  if (loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-gold-500 mb-4" />
        <p className="text-gray-500 italic">Accessing User Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Subscription Control</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Managing {users.length} registered attorneys in LexCasus
        </p>
      </div>

      {/* Revenue Overview (4 Columns for the new tiers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 bg-gradient-to-r from-navy-700 to-navy-800 border-none shadow-lg shadow-navy-900/20">
          <Shield className="w-8 h-8 text-white/30 mb-2" />
          <p className="text-2xl font-bold text-white">{freeCount}</p>
          <p className="text-sm text-navy-300">Free Active (₱0/mo)</p>
        </div>
        <div className="card p-5 bg-gradient-to-r from-gold-500 to-gold-600 border-none shadow-lg shadow-gold-500/20">
          <Crown className="w-8 h-8 text-navy-900/30 mb-2" />
          <p className="text-2xl font-bold text-navy-900">{premiumCount}</p>
          <p className="text-sm text-navy-900/70">Premium (₱199/mo)</p>
        </div>
        <div className="card p-5 bg-gradient-to-r from-purple-500 to-purple-600 border-none shadow-lg shadow-purple-500/20">
          <Diamond className="w-8 h-8 text-white/30 mb-2" />
          <p className="text-2xl font-bold text-white">{premiumPlusCount}</p>
          <p className="text-sm text-purple-200">Premium+ (₱599/mo)</p>
        </div>
        <div className="card p-5 border-emerald-500/20">
          <CreditCard className="w-8 h-8 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">₱{estimatedRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Est. Monthly Revenue</p>
        </div>
      </div>

      {/* Plan Features Reference */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5 opacity-80 border-navy-100 dark:border-navy-800">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-navy-600 dark:text-navy-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Free Tier</h3>
          </div>
          <ul className="space-y-1.5">
            {['10 Chats / day', '5 Bar Practice / day', '5 Cases / day'].map(f => (
              <li key={f} className="text-xs flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <CheckCircle2 size={12} className="text-emerald-500" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5 border-gold-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-5 h-5 text-gold-500" />
            <h3 className="font-semibold text-gold-600">Premium Tier</h3>
          </div>
          <ul className="space-y-1.5">
            {['Unlimited Chat', '20 Bar Practice / day', '50 Cases / day'].map(f => (
              <li key={f} className="text-xs flex items-center gap-2 text-gold-600">
                <CheckCircle2 size={12} /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5 border-purple-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Diamond className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-purple-600">Premium+ Tier</h3>
          </div>
          <ul className="space-y-1.5">
            {['Unlimited Chat', 'Unlimited Practice', 'Unlimited Cases'].map(f => (
              <li key={f} className="text-xs flex items-center gap-2 text-purple-600">
                <CheckCircle2 size={12} /> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* User Management List */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="section-title">Modify User Tiers</h3>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <p className="text-center py-10 text-gray-500 italic">No attorneys found matching the search.</p>
          ) : (
            filteredUsers.map(user => (
              <div key={user.id} className="p-4 rounded-xl border border-gray-100 dark:border-navy-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-gold-500/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-navy-100 dark:bg-navy-800 rounded-full flex items-center justify-center font-bold text-navy-600 dark:text-gold-400">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Atty. {user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(['free', 'premium', 'premium_plus'] as const).map(plan => (
                    <button
                      key={plan}
                      disabled={loading}
                      onClick={() => handleChangePlan(user.id, plan)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all',
                        user.subscription === plan
                          ? plan === 'premium_plus'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                            : plan === 'premium'
                              ? 'bg-gold-500 text-navy-900 shadow-lg shadow-gold-500/30'
                              : 'bg-navy-800 text-white dark:bg-navy-600'
                          : 'bg-gray-100 dark:bg-navy-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-navy-700'
                      )}
                    >
                      {plan.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionControlPage;