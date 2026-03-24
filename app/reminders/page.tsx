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
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reminders</h1>
          <p className="text-slate-500 text-sm mt-1">Track and send service reminders to your customers.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0f2744] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a3a60] transition-colors shadow-sm">
          <Bell size={16} />
          Send All Pending
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'sent', 'opened'] as StatusFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              filter === f
                ? 'bg-[#0f2744] text-white border-[#0f2744]'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Filter size={13} />
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
            <div
              key={r.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-4 flex items-center gap-5"
            >
              {/* Status dot */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${cfg.class}`}>
                <StatusIcon size={16} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-800">{r.customerName}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.class}`}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{r.serviceType} · {r.phone}</p>
              </div>

              {/* Dates */}
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-400 mb-0.5">Due date</p>
                <p className={`text-sm font-semibold ${isOverdue && r.status === 'pending' ? 'text-red-600' : 'text-slate-700'}`}>
                  {formatDate(r.dueDate)}
                </p>
                {r.sentAt && (
                  <p className="text-xs text-slate-400 mt-0.5">Sent {formatDate(r.sentAt)}</p>
                )}
              </div>

              {/* Action */}
              <div className="shrink-0 ml-2">
                {r.status === 'pending' ? (
                  <button
                    onClick={() => handleSendNow(r.id)}
                    className="flex items-center gap-1.5 bg-[#0f2744] text-white px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-[#1a3a60] transition-colors"
                  >
                    <Send size={13} />
                    Send Now
                  </button>
                ) : (
                  <span className="text-xs text-slate-300 italic">
                    {r.status === 'opened' ? 'Viewed by customer' : 'Delivered'}
                  </span>
                )}
              </div>
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
