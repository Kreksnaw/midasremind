'use client';

import { useState, useTransition } from 'react';
import { Plus, Tag, Send, X, CheckCircle, Clock } from 'lucide-react';
import { createPromotion, sendCampaign } from '@/lib/actions';
import type { Promotion } from '@/app/data/sample';

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
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const promo = await createPromotion({
        title: form.title,
        discountType: form.discountType,
        discountValue: form.discountValue,
        expirationDate: form.expirationDate,
        message: form.message,
      });
      onAdd(promo);
      onClose();
    });
  }

  const promoInputCls = "mt-1 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const promoLabelCls = "text-xs font-medium text-slate-500 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg sm:mx-4 sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Sticky header */}
        <div className="bg-[#0f2744] px-5 py-4 flex items-center justify-between rounded-t-2xl shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-white">Create Promotion</h2>
            <p className="text-blue-300 text-xs mt-0.5">Set up a new coupon campaign</p>
          </div>
          <button onClick={onClose} className="text-blue-300 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className={promoLabelCls}>Promotion Title</label>
              <input
                required
                className={promoInputCls}
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Spring Oil Change Special"
              />
            </div>

            <div>
              <label className={promoLabelCls}>Discount</label>
              <div className="flex mt-1 gap-2">
                <select
                  className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.discountValue}
                    onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))}
                    placeholder={form.discountType === 'amount' ? '10' : '15'}
                  />
                )}
              </div>
            </div>

            <div>
              <label className={promoLabelCls}>Expiration Date</label>
              <input
                required
                type="date"
                className={promoInputCls}
                value={form.expirationDate}
                onChange={e => setForm(f => ({ ...f, expirationDate: e.target.value }))}
              />
            </div>

            <div>
              <label className={promoLabelCls}>SMS Message Text</label>
              <textarea
                required
                rows={4}
                className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Write the text message customers will receive…"
              />
              <p className="text-xs text-slate-400 mt-1">{form.message.length}/160 characters</p>
            </div>

            <div className="flex gap-3 pt-1 pb-1">
              <button type="button" onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-3 text-sm font-medium hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isPending} className="flex-1 bg-[#0f2744] text-white rounded-lg py-3 text-sm font-medium hover:bg-[#1a3a60] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                <Plus size={15} />
                {isPending ? 'Saving…' : 'Create Promotion'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function PromoCard({ promo, dimmed, onSend }: { promo: Promotion; dimmed?: boolean; onSend?: () => void }) {
  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden ${dimmed ? 'border-slate-200 opacity-70' : 'border-slate-200'}`}>
      <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-start gap-3 sm:gap-5">
        {/* Icon */}
        <div className={`rounded-xl p-2.5 sm:p-3 shrink-0 mt-0.5 ${dimmed ? 'bg-slate-100' : 'bg-[#e8a020]/10'}`}>
          <Tag size={18} className={dimmed ? 'text-slate-400' : 'text-[#e8a020]'} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title + badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-800 leading-snug">{promo.title}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{promo.discount}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${
              promo.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
            }`}>
              {promo.status === 'active' ? 'Active' : 'Expired'}
            </span>
          </div>

          {/* Message preview */}
          <div className="mt-3 bg-slate-50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wide">Message Preview</p>
            <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">&ldquo;{promo.message}&rdquo;</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 sm:flex sm:items-center sm:gap-6 gap-3 mt-4">
            <div>
              <p className="text-xs text-slate-400">Sent to</p>
              <p className="text-sm font-semibold text-slate-700">{promo.sentCount}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Created</p>
              <p className="text-sm font-semibold text-slate-700">
                {new Date(promo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Expires</p>
              <p className={`text-sm font-semibold ${promo.status === 'expired' ? 'text-red-500' : 'text-slate-700'}`}>
                {new Date(promo.expirationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Send button */}
          {promo.status === 'active' && (
            <div className="mt-3 pt-3 border-t border-slate-100 sm:border-0 sm:mt-0 sm:pt-0">
              <button
                onClick={onSend}
                className="flex items-center justify-center sm:justify-start gap-1.5 bg-[#0f2744] text-white px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#1a3a60] transition-colors w-full sm:w-auto sm:ml-auto"
              >
                <Send size={12} />
                Send Campaign
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PromotionsClient({ initialPromos, totalCustomers }: { initialPromos: Promotion[]; totalCustomers: number }) {
  const [promos, setPromos] = useState<Promotion[]>(initialPromos);
  const [showModal, setShowModal] = useState(false);
  const [, startTransition] = useTransition();

  const active = promos.filter(p => p.status === 'active');
  const expired = promos.filter(p => p.status === 'expired');

  function handleSendCampaign(id: string) {
    setPromos(prev =>
      prev.map(p => p.id === id ? { ...p, sentCount: totalCustomers } : p)
    );
    startTransition(async () => {
      await sendCampaign(id, totalCustomers);
    });
  }

  return (
    <div className="p-4 sm:p-8">
      {showModal && (
        <CreatePromoModal
          onClose={() => setShowModal(false)}
          onAdd={(p) => setPromos(prev => [p, ...prev])}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Promotions</h1>
          <p className="text-slate-500 text-sm mt-0.5">Create and send coupon campaigns to your customers.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-[#0f2744] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1a3a60] transition-colors shadow-sm w-full sm:w-auto"
        >
          <Plus size={15} />
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
              <PromoCard key={p.id} promo={p} onSend={() => handleSendCampaign(p.id)} />
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
