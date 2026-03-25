'use client';

import { useState, useTransition } from 'react';
import { UserPlus, Upload, X, Car, Search } from 'lucide-react';
import { addCustomer } from '@/lib/actions';
import type { Customer } from '@/app/data/sample';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

const inputCls = "mt-1 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const labelCls = "text-xs font-medium text-slate-500 uppercase tracking-wide";

function AddCustomerModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: Customer) => void }) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    year: '', make: '', model: '',
    lastServiceDate: '', lastServiceType: '', nextServiceDue: '', mileage: '',
  });
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const newCustomer = await addCustomer({
        name: form.name,
        phone: form.phone,
        email: form.email,
        vehicle: { year: parseInt(form.year), make: form.make, model: form.model },
        lastServiceDate: form.lastServiceDate,
        lastServiceType: form.lastServiceType,
        nextServiceDue: form.nextServiceDue,
        mileage: parseInt(form.mileage) || 0,
      });
      onAdd(newCustomer);
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
            <h2 className="text-base sm:text-lg font-semibold text-white">Add New Customer</h2>
            <p className="text-blue-300 text-xs mt-0.5">Fill in the customer details below</p>
          </div>
          <button onClick={onClose} className="text-blue-300 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className={labelCls}>Full Name</label>
              <input required className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. John Smith" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Phone</label>
                <input required className={inputCls} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(408) 555-0000" />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" className={inputCls} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="name@email.com" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Vehicle</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <input required className="border border-slate-200 rounded-lg px-2.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="Year" />
                <input required className="border border-slate-200 rounded-lg px-2.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.make} onChange={e => setForm(f => ({ ...f, make: e.target.value }))} placeholder="Make" />
                <input required className="border border-slate-200 rounded-lg px-2.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} placeholder="Model" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Last Service Date</label>
                <input type="date" required className={inputCls} value={form.lastServiceDate} onChange={e => setForm(f => ({ ...f, lastServiceDate: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Next Service Due</label>
                <input type="date" required className={inputCls} value={form.nextServiceDue} onChange={e => setForm(f => ({ ...f, nextServiceDue: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Last Service Type</label>
                <input required className={inputCls} value={form.lastServiceType} onChange={e => setForm(f => ({ ...f, lastServiceType: e.target.value }))} placeholder="e.g. Oil Change" />
              </div>
              <div>
                <label className={labelCls}>Mileage</label>
                <input type="number" className={inputCls} value={form.mileage} onChange={e => setForm(f => ({ ...f, mileage: e.target.value }))} placeholder="e.g. 45000" />
              </div>
            </div>

            <div className="flex gap-3 pt-1 pb-1">
              <button type="button" onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-3 text-sm font-medium hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isPending} className="flex-1 bg-[#0f2744] text-white rounded-lg py-3 text-sm font-medium hover:bg-[#1a3a60] transition-colors disabled:opacity-60">
                {isPending ? 'Saving…' : 'Add Customer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.vehicle.make.toLowerCase().includes(search.toLowerCase()) ||
    c.vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="p-4 sm:p-8">
      {showModal && (
        <AddCustomerModal
          onClose={() => setShowModal(false)}
          onAdd={(c) => setCustomers(prev => [c, ...prev])}
        />
      )}

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Customers</h1>
          <p className="text-slate-500 text-sm mt-0.5">{customers.length} customers in your database</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button className="flex items-center gap-2 border border-slate-200 text-slate-600 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors bg-white shadow-sm">
            <Upload size={15} />
            <span className="hidden sm:inline">Upload CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#0f2744] text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a3a60] transition-colors shadow-sm"
          >
            <UserPlus size={15} />
            <span className="hidden sm:inline">Add Customer</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 sm:mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full sm:max-w-sm pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          placeholder="Search by name, vehicle, or phone…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Mobile card list (< sm) */}
      <div className="sm:hidden space-y-3">
        {filtered.map((c) => {
          const nextDue = new Date(c.nextServiceDue);
          const now = new Date();
          const daysUntil = Math.ceil((nextDue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          const isOverdue = daysUntil < 0;
          const isSoon = daysUntil <= 21;
          return (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-4">
              {/* Name row */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-[#0f2744] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {c.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{c.name}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <Car size={11} className="shrink-0" />
                    <span className="truncate">{c.vehicle.year} {c.vehicle.make} {c.vehicle.model}</span>
                  </div>
                </div>
              </div>
              {/* Details grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <p className="text-slate-400 font-medium">Phone</p>
                  <p className="text-slate-700">{c.phone}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Last Service</p>
                  <p className="text-slate-700">{formatDate(c.lastServiceDate)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 font-medium">Service Type</p>
                  <p className="text-slate-700">{c.lastServiceType}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 font-medium mb-1">Next Service Due</p>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isOverdue ? 'bg-red-100 text-red-700' : isSoon ? 'bg-amber-100 text-amber-700' : 'bg-green-50 text-green-700'
                  }`}>
                    {formatDate(c.nextServiceDue)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center text-slate-400 text-sm">
            No customers match your search.
          </div>
        )}
      </div>

      {/* Desktop table (≥ sm) */}
      <div className="hidden sm:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Vehicle</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Service</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Service Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Next Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => {
                const nextDue = new Date(c.nextServiceDue);
                const now = new Date();
                const daysUntil = Math.ceil((nextDue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const isOverdue = daysUntil < 0;
                const isSoon = daysUntil <= 21;
                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#0f2744] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-slate-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{c.phone}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{c.email}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Car size={13} className="text-slate-400 shrink-0" />
                        <span>{c.vehicle.year} {c.vehicle.make} {c.vehicle.model}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{formatDate(c.lastServiceDate)}</td>
                    <td className="px-5 py-3.5 text-slate-600">{c.lastServiceType}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        isOverdue ? 'bg-red-100 text-red-700' : isSoon ? 'bg-amber-100 text-amber-700' : 'bg-green-50 text-green-700'
                      }`}>
                        {formatDate(c.nextServiceDue)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm">
                    No customers match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
