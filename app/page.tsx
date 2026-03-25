import {
  Users,
  Bell,
  CalendarClock,
  Send,
  Eye,
  Tag,
  UserPlus,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { activityFeed } from '@/app/data/sample';

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  dark,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
  dark?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-3.5 sm:p-5 flex items-start gap-3 sm:gap-4 shadow-sm ${dark ? 'bg-[#0f2744] border-[#1a3a60]' : 'bg-white border-slate-200'}`}>
      <div className={`rounded-lg p-2 sm:p-2.5 shrink-0 ${dark ? 'bg-white/10' : 'bg-slate-100'}`}>
        <Icon size={18} className={dark ? 'text-[#e8a020]' : 'text-slate-600'} />
      </div>
      <div className="min-w-0">
        <p className={`text-xl sm:text-2xl font-bold leading-tight ${dark ? 'text-white' : 'text-slate-800'}`}>{value}</p>
        <p className={`text-xs sm:text-sm font-medium mt-0.5 ${dark ? 'text-blue-300' : 'text-slate-500'}`}>{label}</p>
        {sub && <p className={`text-xs mt-0.5 hidden sm:block ${dark ? 'text-blue-400' : 'text-slate-400'}`}>{sub}</p>}
      </div>
    </div>
  );
}

const activityIcons: Record<string, React.ElementType> = {
  send: Send,
  eye: Eye,
  tag: Tag,
  'user-plus': UserPlus,
};

const activityColors: Record<string, string> = {
  reminder_sent: 'bg-blue-100 text-blue-700',
  reminder_opened: 'bg-green-100 text-green-700',
  promo_sent: 'bg-amber-100 text-amber-700',
  customer_added: 'bg-purple-100 text-purple-700',
};

export default async function DashboardPage() {
  const supabase = createClient();

  const [{ count: customerCount }, { data: reminders }, { data: shopSettings }] = await Promise.all([
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('reminders').select('id, customer_name, service_type, due_date, status, sent_at').order('due_date', { ascending: true }),
    supabase.from('shop_settings').select('name').eq('id', 1).single(),
  ]);

  const reminderList = reminders ?? [];
  const sentThisMonth = reminderList.filter((r) => r.status === 'sent' || r.status === 'opened').length;
  const upcomingDue = reminderList.filter((r) => r.status === 'pending').length;
  const shopName = shopSettings?.name ?? 'Midas Sunnyvale';

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back — here&apos;s what&apos;s happening at {shopName}.</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard label="Total Customers" value={customerCount ?? 0} icon={Users} sub="In your database" />
        <StatCard label="Reminders Sent" value={sentThisMonth} icon={Bell} sub="This month" dark />
        <StatCard label="Upcoming Due" value={upcomingDue} icon={CalendarClock} sub="Pending reminders" />
        <StatCard label="Open Rate" value="63%" icon={TrendingUp} sub="Last 30 days" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Upcoming Reminders */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Upcoming Reminders</h2>
            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              {upcomingDue} pending
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {reminderList
              .filter((r) => r.status === 'pending')
              .slice(0, 5)
              .map((r) => {
                const due = new Date(r.due_date);
                const now = new Date();
                const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const isOverdue = daysUntil < 0;
                const isSoon = daysUntil <= 14;

                return (
                  <div key={r.id} className="px-4 sm:px-6 py-3.5 flex items-center gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{r.customer_name}</p>
                      <p className="text-xs text-slate-500 truncate">{r.service_type}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-400 mb-0.5">Due</p>
                      <p className={`text-sm font-semibold ${isOverdue ? 'text-red-600' : isSoon ? 'text-amber-600' : 'text-slate-700'}`}>
                        {due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    {(isOverdue || isSoon) && (
                      <AlertCircle size={15} className={`shrink-0 ${isOverdue ? 'text-red-400' : 'text-amber-400'}`} />
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Recent Activity</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {activityFeed.map((item) => {
              const Icon = activityIcons[item.icon] ?? Bell;
              const colorClass = activityColors[item.type] ?? 'bg-slate-100 text-slate-600';
              return (
                <div key={item.id} className="px-4 sm:px-5 py-3.5 flex items-start gap-3">
                  <div className={`rounded-full p-1.5 mt-0.5 shrink-0 ${colorClass}`}>
                    <Icon size={12} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-700 leading-snug">{item.message}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
