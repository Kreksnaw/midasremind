'use client';

import { useState, useTransition, useCallback } from 'react';
import { Send, Clock, CheckCircle, Eye, Bell, Plus, X } from 'lucide-react';
import { sendReminder, sendAllPendingReminders, createReminder } from '@/lib/actions';
import type { Reminder } from '@/app/data/sample';
import Toast, { type ToastMessage } from '@/components/Toast';

type StatusFilter = 'all' | 'pending' | 'sent' | 'opened';

const SERVICE_TYPES = [
  'Oil Change',
  'Brake Service',
  'Tire Rotation',
  'Transmission Flush',
  'Coolant Flush',
  'Air Filter',
  'Spark Plugs',
  'Battery Check',
  'Wheel Alignment',
  'General Inspection',
];

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, class: 'bg-amber-100 text-amber-700' },
  sent: { label: 'Sent', icon: CheckCircle, class: 'bg-blue-100 text-blue-700' },
  opened: { label: 'Opened', icon: Eye, class: 'bg-green-100 text-green-700' },
};

const inputCls = "mt-1 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white";
const labelCls = "text-xs font-medium text-slate-500 uppercase tracking-wide";

type CustomerOption = { id: string; name: string; phone: string };

function CreateReminderModal({
  customers,
  onClose,
  onAdd,
}: {
  customers: CustomerOption[];
  onClose: () => void;
  onAdd: (r: Reminder) => void;
}) {
  const [form, setForm] = useState({
    customerId: '',
    customerName: '',
    phone: '',
    serviceType: SERVICE_TYPES[0],
    dueDate: '',
  });
  const [isPending, startTransition] = useTransition();

  function handleCustomerChange(id: string) {
    const customer = customers.find((c) => c.id === id);
    setForm((f) => ({
      ...f,
      customerId: id,
      customerName: customer?.name ?? '',
      phone: customer?.phone ?? '',
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const newReminder = await createReminder({
        customerId: form.customerId,
        customerName: form.customerName,
        phone: form.phone,
        serviceType: form.serviceType,
        dueDate: form.dueDate,
      });
      onAdd(newReminder);
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full flex-1 sm:flex-none sm:max-w-lg sm:rounded-2xl sm:max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f2744] px-5 py-4 flex items-center justify-between sm:rounded-t-2xl shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-white">Create Reminder</h2>
            <p className="text-blue-300 text-xs mt-0.5">Schedule a service reminder for a customer</p>
          </div>
          <button onClick={onClose} className="text-blue-300 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Customer */}
            <div>
              <label className={labelCls}>Customer</label>
              <select
                required
                className={inputCls}
                value={form.customerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
              >
                <option value="">Select a customer…</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Auto-filled read-only fields */}
            {form.customerId && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Customer Name</label>
                  <input
                    readOnly
                    className={`${inputCls} bg-slate-50 text-slate-500 cursor-default`}
                    value={form.customerName}
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input
                    readOnly
                    className={`${inputCls} bg-slate-50 text-slate-500 cursor-default`}
                    value={form.phone}
                  />
                </div>
              </div>
            )}

            {/* Service Type */}
            <div>
              <label className={labelCls}>Service Type</label>
              <select
                required
                className={inputCls}
                value={form.serviceType}
                onChange={(e) => setForm((f) => ({ ...f, serviceType: e.target.value }))}
              >
                {SERVICE_TYPES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className={labelCls}>Due Date</label>
              <input
                required
                type="date"
                className={inputCls}
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              />
            </div>

            <div className="flex gap-3 pt-1 pb-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-3 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-[#0f2744] text-white rounded-lg py-3 text-sm font-medium hover:bg-[#1a3a60] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Plus size={15} />
                {isPending ? 'Saving…' : 'Create Reminder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RemindersClient({
  initialReminders,
  customers,
}: {
  initialReminders: Reminder[];
  customers: CustomerOption[];
}) {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const filtered = filter === 'all' ? reminders : reminders.filter(r => r.status === filter);

  const counts = {
    all: reminders.length,
    pending: reminders.filter(r => r.status === 'pending').length,
    sent: reminders.filter(r => r.status === 'sent').length,
    opened: reminders.filter(r => r.status === 'opened').length,
  };

  const today = new Date().toISOString().split('T')[0];
  const dismissToast = useCallback(() => setToast(null), []);

  function handleSendNow(id: string) {
    startTransition(async () => {
      const result = await sendReminder(id);
      if (result.success) {
        setReminders(prev =>
          prev.map(r => r.id === id ? { ...r, status: 'sent', sentAt: today } : r)
        );
        setToast({ type: 'success', title: 'SMS sent successfully' });
      } else {
        setToast({ type: 'error', title: 'Failed to send SMS', detail: result.error });
      }
    });
  }

  function handleSendAllPending() {
    startTransition(async () => {
      const result = await sendAllPendingReminders();
      if (result.sent > 0) {
        setReminders(prev =>
          prev.map(r => r.status === 'pending' ? { ...r, status: 'sent' as const, sentAt: today } : r)
        );
      }
      if (result.failed === 0) {
        setToast({ type: 'success', title: `${result.sent} SMS${result.sent === 1 ? '' : 's'} sent successfully` });
      } else if (result.sent === 0) {
        setToast({ type: 'error', title: `Failed to send ${result.failed} SMS${result.failed === 1 ? '' : 's'}`, detail: result.errors[0] });
      } else {
        setToast({ type: 'error', title: `${result.sent} sent, ${result.failed} failed`, detail: result.errors[0] });
      }
    });
  }

  return (
    <div className="p-4 sm:p-8">
      {toast && <Toast toast={toast} onClose={dismissToast} />}
      {showModal && (
        <CreateReminderModal
          customers={customers}
          onClose={() => setShowModal(false)}
          onAdd={(r) => setReminders(prev => [r, ...prev])}
        />
      )}

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Reminders</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track and send service reminders to your customers.</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm bg-white"
          >
            <Plus size={15} />
            Create Reminder
          </button>
          <button
            onClick={handleSendAllPending}
            disabled={isPending || counts.pending === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#0f2744] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1a3a60] transition-colors shadow-sm disabled:opacity-60"
          >
            <Bell size={15} />
            Send All Pending
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
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

                {/* Date — top-right */}
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

              {/* Bottom row */}
              {r.status === 'pending' ? (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleSendNow(r.id)}
                    disabled={isPending}
                    className="flex items-center justify-center gap-1.5 w-full sm:w-auto bg-[#0f2744] text-white px-4 py-3 sm:py-2.5 rounded-lg text-sm sm:text-xs font-semibold hover:bg-[#1a3a60] transition-colors disabled:opacity-60"
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
