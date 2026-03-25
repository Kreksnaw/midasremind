'use client';

import { useState, useTransition } from 'react';
import { Save, Store, Phone, MapPin, Clock, MessageSquare, Check } from 'lucide-react';
import { saveShopSettings } from '@/lib/actions';

type ShopInfo = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  smsSenderName: string;
  hours: Record<string, string>;
};

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="bg-slate-100 rounded-lg p-1.5">
          <Icon size={16} className="text-slate-600" />
        </div>
        <h2 className="font-semibold text-slate-800">{title}</h2>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800";

export default function SettingsClient({ initialSettings }: { initialSettings: ShopInfo }) {
  const [shop, setShop] = useState<ShopInfo>(initialSettings);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await saveShopSettings(shop);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  function updateHours(day: string, value: string) {
    setShop(s => ({ ...s, hours: { ...s.hours, [day]: value } }));
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your shop&apos;s information and preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
        {/* Shop Info */}
        <SectionCard title="Shop Information" icon={Store}>
          <div className="space-y-4">
            <Field label="Shop Name">
              <input
                className={inputClass}
                value={shop.name}
                onChange={e => setShop(s => ({ ...s, name: e.target.value }))}
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Phone Number">
                <input
                  className={inputClass}
                  value={shop.phone}
                  onChange={e => setShop(s => ({ ...s, phone: e.target.value }))}
                />
              </Field>
              <Field label="SMS Sender Name">
                <input
                  className={inputClass}
                  value={shop.smsSenderName}
                  onChange={e => setShop(s => ({ ...s, smsSenderName: e.target.value }))}
                  maxLength={11}
                />
              </Field>
            </div>
          </div>
        </SectionCard>

        {/* Address */}
        <SectionCard title="Location" icon={MapPin}>
          <div className="space-y-4">
            <Field label="Street Address">
              <input
                className={inputClass}
                value={shop.address}
                onChange={e => setShop(s => ({ ...s, address: e.target.value }))}
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="City">
                <input
                  className={inputClass}
                  value={shop.city}
                  onChange={e => setShop(s => ({ ...s, city: e.target.value }))}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="State">
                  <input
                    className={inputClass}
                    value={shop.state}
                    onChange={e => setShop(s => ({ ...s, state: e.target.value }))}
                    maxLength={2}
                  />
                </Field>
                <Field label="ZIP">
                  <input
                    className={inputClass}
                    value={shop.zip}
                    onChange={e => setShop(s => ({ ...s, zip: e.target.value }))}
                  />
                </Field>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Business Hours */}
        <SectionCard title="Business Hours" icon={Clock}>
          <div className="space-y-2.5">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 font-medium w-20 sm:w-24 capitalize shrink-0">{day}</span>
                <input
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 min-w-0"
                  value={shop.hours[day] ?? ''}
                  onChange={e => updateHours(day, e.target.value)}
                  placeholder="e.g. 8:00 AM – 5:00 PM"
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* SMS Settings */}
        <SectionCard title="SMS Reminders" icon={MessageSquare}>
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Reminders will be sent from <span className="font-semibold text-slate-700">{shop.smsSenderName}</span> using your shop phone number. Customers can reply STOP to opt out.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Default Reminder Message Preview</p>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                &ldquo;Hi [Customer Name], your [Service Type] is due soon at {shop.name}. Call us at {shop.phone} to schedule. Reply STOP to opt out.&rdquo;
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Save Button */}
        <div className="flex justify-stretch sm:justify-end">
          <button
            type="submit"
            disabled={isPending}
            className={`flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm disabled:opacity-60 ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-[#0f2744] text-white hover:bg-[#1a3a60]'
            }`}
          >
            {saved ? (
              <>
                <Check size={16} />
                Saved!
              </>
            ) : (
              <>
                <Save size={16} />
                {isPending ? 'Saving…' : 'Save Settings'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
