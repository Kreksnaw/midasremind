'use client';

import { useState } from 'react';
import { Plus, Tag, Send, X, Megaphone, CheckCircle, Clock } from 'lucide-react';
import { promotions as initialPromos, type Promotion } from '@/app/data/sample';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function CreatePromoModal({ onClose, onAdd }: { onClose: () => void; onAdd: (p: Promotion) => void }) {
  const [form, setForm] = useState({
    title: '',
    discountType: 'amount',
    discountValue: '',
    expirationDate: '',
    message: '',
  });

  const discount = form.discountType === 'amount'
    ? (form.discountValue ? `$${form.discountValue} off` : '')
    : (form.discountValue ? `${form.discountValue}% off` : '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const promo: Promotion = {
      id: `p${Date.now()}`,
      title: form.title,
      discount,
      expirationDate: form.expirationDate,
      message: form.message,
      sentCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      status: new Date(form.expirationDate) >= new Date() ? 'active' : 'expired',
    };
    onAdd(promo);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-[#0f2744] px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Create Promotion</h2>
            <p className="text-blue-300 text-xs mt-0.5">Set up a new coupon campaign</p>
          </div>
          <button onClick={onClose} className="text-blue-300 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Promotion Title</label>
            <input
              required
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Spring Oil Change Special"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Discount</label>
            <div className="flex mt-1 gap-2">
              <select
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={form.discountType}
                onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))}
              >
                <option value="amount">$ Amount off</option>
                <option value="percent">% Percent off</option>
                <option value="free">Free service</option>
              </select>
              {form.discountType !== 'free' && (
                <input
                  required
                  type="number"
                  min="1"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.discountValue}
                  onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))}
                  placeholder={form.discountType === 'amount' ? '10' : '15'}
                />
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Expiration Date</label>
            <input
              required
              type="date"
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.expirationDate}
              onChange={e => setForm(f => ({ ...f, expirationDate: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">SMS Message Text</label>
            <textarea
              required
              rows={4}
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Write the text message customers will receive…"
            />
            <p className="text-xs text-slate-400 mt-1">{form.message.length}/160 characters</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-[#0f2744] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#1a3a60] transition-colors flex items-center justify-center gap-2">
              <Plus size={15} />
              Create Promotion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PromotionsPage() {
  const [promos, setPromos] = useState<Promotion[]>(initialPromos);
  const [showModal, setShowModal] = useState(false);

  const active = promos.filter(p => p.status === 'active');
  const expired = promos.filter(p => p.status === 'expired');

  return (
    <div className="p-8">
      {showModal && (
        <CreatePromoModal
          onClose={() => setShowModal(false)}
          onAdd={(p) => setPromos(prev => [p, ...prev])}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Promotions</h1>
          <p className="text-slate-500 text-sm mt-1">Create and send coupon campaigns to your customers.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#0f2744] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a3a60] transition-colors shadow-sm"
        >
          <Plus size={16} />
          Create Promotion
        </button>
      </div>

      {/* Active Promotions */}
      {active.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-green-600" />
            <h2 className="font-semibold text-slate-700">Active Campaigns</h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{active.length}</span>
          </div>
          <div className="space-y-3">
            {active.map(p => (
              <PromoCard key={p.id} promo={p} />
            ))}
          </div>
        </section>
      )}

      {/* Expired Promotions */}
      {expired.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-slate-400" />
            <h2 className="font-semibold text-slate-700">Past Campaigns</h2>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">{expired.length}</span>
          </div>
          <div className="space-y-3">
            {expired.map(p => (
              <PromoCard key={p.id} promo={p} dimmed />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function PromoCard({ promo, dimmed }: { promo: Promotion; dimmed?: boolean }) {
  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden ${dimmed ? 'border-slate-200 opacity-70' : 'border-slate-200'}`}>
      <div className="px-6 py-5 flex items-start gap-5">
        {/* Icon */}
        <div className={`rounded-xl p-3 shrink-0 ${dimmed ? 'bg-slate-100' : 'bg-[#e8a020]/10'}`}>
          <Tag size={20} className={dimmed ? 'text-slate-400' : 'text-[#e8a020]'} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-semibold text-slate-800">{promo.title}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{promo.discount}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${
              promo.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
            }`}>
              {promo.status === 'active' ? 'Active' : 'Expired'}
            </span>
          </div>

          <div className="mt-3 bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wide">Message Preview</p>
            <p className="text-sm text-slate-700 italic">"{promo.message}"</p>
          </div>

          <div className="flex items-center gap-6 mt-4 flex-wrap">
            <div>
              <p className="text-xs text-slate-400">Sent to</p>
              <p className="text-sm font-semibold text-slate-700">{promo.sentCount} customers</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Created</p>
              <p className="text-sm font-semibold text-slate-700">{formatDate(promo.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Expires</p>
              <p className={`text-sm font-semibold ${promo.status === 'expired' ? 'text-red-500' : 'text-slate-700'}`}>
                {formatDate(promo.expirationDate)}
              </p>
            </div>

            {promo.status === 'active' && (
              <button className="ml-auto flex items-center gap-1.5 bg-[#0f2744] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#1a3a60] transition-colors">
                <Send size={12} />
                Send Campaign
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
