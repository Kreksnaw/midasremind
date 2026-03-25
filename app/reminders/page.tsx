import { createClient } from '@/lib/supabase';
import RemindersClient from './RemindersClient';
import type { Reminder } from '@/app/data/sample';

export default async function RemindersPage() {
  const supabase = createClient();
  const [{ data: remindersData }, { data: customersData }] = await Promise.all([
    supabase.from('reminders').select('*').order('due_date', { ascending: true }),
    supabase.from('customers').select('id, name, phone').order('name', { ascending: true }),
  ]);

  const reminders: Reminder[] = (remindersData ?? []).map((r) => ({
    id: r.id,
    customerId: r.customer_id,
    customerName: r.customer_name,
    serviceType: r.service_type,
    dueDate: r.due_date,
    status: r.status,
    sentAt: r.sent_at ?? undefined,
    phone: r.phone,
  }));

  const customers: { id: string; name: string; phone: string }[] = customersData ?? [];

  return <RemindersClient initialReminders={reminders} customers={customers} />;
}
