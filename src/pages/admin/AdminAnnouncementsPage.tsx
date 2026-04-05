import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Save, Plus, Trash2, Megaphone, Power, Loader2, AlertCircle, Rocket } from 'lucide-react';
import { cn } from '../../lib/utils';

const AdminAnnouncementsPage: React.FC = () => {
  const { announcements, fetchAnnouncements, updateAnnouncements } = useAdminStore();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State - Promo
  const [isActive, setIsActive] = useState(true);
  const [title, setTitle] = useState('Upgrade to Premium+');
  const [priceOld, setPriceOld] = useState(599);
  const [priceNew, setPriceNew] = useState(499);
  const [features, setFeatures] = useState<string[]>([
    "Unlimited Legal Chat AI Queries",
    "Unlimited Case Digests",
    "Unlimited Bar Exam Practice AI"
  ]);

  // Form State - Roadmap (What's Coming)
  const [roadmapItems, setRoadmapItems] = useState([
    { title: 'Smart Highlighting', desc: 'Highlight specific words and phrases directly inside the codal provisions.', icon: 'Highlighter' },
    { title: 'Full Study Downloads', desc: 'Download entire provisions and compiled notes for offline review.', icon: 'Download' },
    { title: '1-on-1 AI Audio Coach', desc: 'Call your AI coach for real-time recitation, Q&A, and Bar simulation.', icon: 'PhoneCall' }
  ]);

  // Available icons for the dropdown
  const availableIcons = ['Highlighter', 'Download', 'PhoneCall', 'Sparkles', 'BookOpen', 'Brain', 'MessageSquare', 'Target', 'Zap'];

  useEffect(() => {
    const loadSettings = async () => {
      await fetchAnnouncements();
      setLoading(false);
    };
    loadSettings();
  }, [fetchAnnouncements]);

  // Sync state when data is loaded
  useEffect(() => {
    if (announcements) {
      setIsActive(announcements.isActive !== false); 
      if (announcements.promo) {
        setTitle(announcements.promo.title || 'Upgrade to Premium+');
        setPriceOld(announcements.promo.priceOld || 599);
        setPriceNew(announcements.promo.priceNew || 499);
        setFeatures(announcements.promo.features || []);
      }
      if (announcements.roadmap && announcements.roadmap.items) {
        setRoadmapItems(announcements.roadmap.items);
      }
    }
  }, [announcements]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAnnouncements({
        isActive,
        promo: {
          title,
          priceOld: Number(priceOld),
          priceNew: Number(priceNew),
          features
        },
        roadmap: {
          items: roadmapItems
        }
      });
      alert("Success! The live app has been updated instantly. 🚀");
    } catch (error) {
      alert("Error saving settings. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-gold-500" /> Live Promo Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Control the pop-up modal shown to users upon login.</p>
        </div>
        
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 px-6">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Publishing...' : 'Publish to Live App'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gold-500" /></div>
      ) : (
        <div className="space-y-8">
          
          {/* Kill Switch */}
          <div className={cn(
            "p-5 rounded-2xl border flex items-center justify-between gap-4 transition-colors",
            isActive ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200" : "bg-red-50 dark:bg-red-500/10 border-red-200"
          )}>
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", isActive ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600")}><Power className="w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Master Toggle Switch</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{isActive ? "The modal is ON." : "The modal is OFF."}</p>
              </div>
            </div>
            <button onClick={() => setIsActive(!isActive)} className={cn("px-6 py-3 rounded-xl font-bold", isActive ? "bg-red-500 text-white" : "bg-emerald-500 text-white")}>
              {isActive ? "Turn OFF" : "Turn ON"}
            </button>
          </div>

          <div className={cn("transition-opacity duration-300 space-y-8", !isActive && "opacity-50 pointer-events-none")}>
            
            {/* 🟢 PROMO SETTINGS */}
            <div className="card p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-navy-800 pb-4 mb-4">
                <Megaphone className="w-5 h-5 text-gold-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Promo View (For Free Users)</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headline Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Old Price</label><input type="number" value={priceOld} onChange={(e) => setPriceOld(Number(e.target.value))} className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Price</label><input type="number" value={priceNew} onChange={(e) => setPriceNew(Number(e.target.value))} className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 font-bold text-gold-600" /></div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Features</label><button onClick={() => setFeatures([...features, ''])} className="text-gold-500 text-sm font-bold flex items-center gap-1"><Plus className="w-4 h-4"/> Add Feature</button></div>
                {features.map((feat, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={feat} onChange={(e) => { const f = [...features]; f[i] = e.target.value; setFeatures(f); }} className="flex-1 bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-2" />
                    <button onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5"/></button>
                  </div>
                ))}
              </div>
            </div>

            {/* 🟢 ROADMAP SETTINGS */}
            <div className="card p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-navy-800 pb-4 mb-4">
                <Rocket className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Roadmap View (For Premium+ Users)</h2>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upcoming Features</label>
                  <button onClick={() => setRoadmapItems([...roadmapItems, {title: 'New Feature', desc: '', icon: 'Sparkles'}])} className="text-blue-500 text-sm font-bold flex items-center gap-1"><Plus className="w-4 h-4"/> Add Item</button>
                </div>
                
                {roadmapItems.map((item, i) => (
                  <div key={i} className="p-4 border border-gray-200 dark:border-navy-700 rounded-xl space-y-4 relative bg-gray-50/50 dark:bg-navy-900/50">
                    <button onClick={() => setRoadmapItems(roadmapItems.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Feature Name</label>
                        <input type="text" value={item.title} onChange={(e) => { const r = [...roadmapItems]; r[i].title = e.target.value; setRoadmapItems(r); }} className="w-full bg-white dark:bg-navy-950 border border-gray-200 dark:border-navy-700 rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Icon</label>
                        <select value={item.icon} onChange={(e) => { const r = [...roadmapItems]; r[i].icon = e.target.value; setRoadmapItems(r); }} className="w-full bg-white dark:bg-navy-950 border border-gray-200 dark:border-navy-700 rounded-lg px-3 py-2 text-sm">
                          {availableIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                      <input type="text" value={item.desc} onChange={(e) => { const r = [...roadmapItems]; r[i].desc = e.target.value; setRoadmapItems(r); }} className="w-full bg-white dark:bg-navy-950 border border-gray-200 dark:border-navy-700 rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncementsPage;