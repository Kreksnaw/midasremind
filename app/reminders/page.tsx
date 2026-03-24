'use client';

import { useState } from 'react';
import { Send, Clock, CheckCircle, Eye, Bell, Filter } from 'lucide-react';
import { reminders as initialReminders, type Reminder } from '@/app/data/sample';

type StatusFilter = 'all' | 'pending' | 'sent' | 'opened';

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    class: 'bg-amber-100 text-amber-700',
  },
  sent: {
    label: 'Sent',
    icon: CheckCircle,
    class: 'bg-blue-100 text-blue-700',
  },
  opened: {
    label: 'Opened',
    icon: Eye,
    class: 'bg-green-100 text-green-700',
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [filter, setFilter] = useState<StatusFilter>('all');

  const filtered = filter === 'all' ? reminders : reminders.filter(r => r.status === filter);

  const counts = {
    all: reminders.length,
    pending: reminders.filter(r => r.status === 'pending').length,
    sent: reminders.filter(r => r.status === 'sent').length,
    opened: reminders.filter(r => r.status === 'opened').length,
  };

  function handleSendNow(id: string) {
    setReminders(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, status: 'sent', sentAt: new Date().toISOString().split('T')[0] }
          : r
      )
    );
  }

  return (
    <div className="p-4 sm:p-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Reminders</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track and send service reminders to your customers.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-[#0f2744] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1a3a60] transition-colors shadow-sm w-full sm:w-auto">
          <Bell size={15} />
          Send All Pending
        </button>
      </div>

      {/* Filter Tabs — horizontally scrollable on mobile */}
      <div className="flex gap-2 mb-5 sm:mb-6 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {(['all', 'pending', 'sent', 'opened'] as StatusFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors border whitespace-nowrap shrink-0 ${
              filter === f
                ? 'bg-[#0f2744] text-white border-[#0f2744]'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              filter === f ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filtered.map((r) => {
          const cfg = statusConfig[r.status];
          const StatusIcon = cfg.icon;
          const due = new Date(r.dueDate);
          const now = new Date();
          const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          const isOverdue = daysUntil < 0;

          return (
            <div key={r.id} className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 sm:px-6 py-4">
              {/* Top row: icon + name + badge */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${cfg.class}`}>
                  <StatusIcon size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-800">{r.customerName}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.class}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5 truncate">{r.serviceType}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{r.phone}</p>
                </div>

                {/* Date — top-right on all sizes */}
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-400 mb-0.5">Due</p>
                  <p className={`text-sm font-semibold ${isOverdue && r.status === 'pending' ? 'text-red-600' : 'text-slate-700'}`}>
                    {due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  {r.sentAt && (
                    <p className="text-xs text-slate-400 mt-0.5 whitespace-nowrap">
                      Sent {new Date(r.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom row: action button (always full-width on mobile) */}
              {r.status === 'pending' ? (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleSendNow(r.id)}
                    className="flex items-center justify-center gap-1.5 w-full sm:w-auto bg-[#0f2744] text-white px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#1a3a60] transition-colors"
                  >
                    <Send size={13} />
                    Send Now
                  </button>
                </div>
              ) : (
                <div className="mt-2">
                  <p className="text-xs text-slate-400 italic pl-12 sm:pl-0">
                    {r.status === 'opened' ? 'Viewed by customer' : 'Delivered'}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <Bell size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No {filter === 'all' ? '' : filter} reminders found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
