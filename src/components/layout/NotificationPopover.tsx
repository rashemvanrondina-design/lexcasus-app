import React, { useState, useRef, useEffect } from 'react';
import { Bell, Sparkles, Calendar, Crown } from 'lucide-react';
import { cn } from '../../lib/utils';

const NotificationPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, title: 'Digest Ready', message: 'G.R. No. 201234 processed.', icon: Sparkles, color: 'text-gold-500' },
    { id: 2, title: 'Class Alert', message: 'Review starts in 1hr.', icon: Calendar, color: 'text-blue-500' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"
      >
        <Bell className={cn("w-5 h-5", isOpen && "text-gold-500")} />
        <span className="absolute top-2 right-2 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-navy-950 border border-gray-200 dark:border-navy-800 shadow-2xl rounded-xl overflow-hidden z-50">
          <div className="p-4 border-b dark:border-navy-800 bg-gray-50/50 dark:bg-navy-900/50">
            <h3 className="text-sm font-bold">Legal Docket</h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 border-b dark:border-navy-900 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5">
                <div className="flex gap-3">
                  <n.icon size={14} className={n.color} />
                  <div>
                    <p className="text-xs font-bold">{n.title}</p>
                    <p className="text-xs text-gray-500">{n.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export default NotificationPopover;