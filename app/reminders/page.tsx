import { createClient } from '@/lib/supabase';
import RemindersClient from './RemindersClient';
import type { Reminder } from '@/app/data/sample';

export default async function RemindersPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('reminders')
    .select('*')
    .order('due_date', { ascending: true });

  const reminders: Reminder[] = (data ?? []).map((r) => ({
    id: r.id,
    customerId: r.customer_id,
    customerName: r.customer_name,
    serviceType: r.service_type,
    dueDate: r.due_date,
    status: r.status,
    sentAt: r.sent_at ?? undefined,
    phone: r.phone,
  }));

  return <RemindersClient initialReminders={reminders} />;
}
