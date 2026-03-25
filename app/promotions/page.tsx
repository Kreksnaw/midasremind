import { createClient } from '@/lib/supabase';
import PromotionsClient from './PromotionsClient';
import type { Promotion } from '@/app/data/sample';

function mapDiscount(type: string, value: string | null): string {
  if (type === 'free') return value ? `Free ${value}` : 'Free service';
  if (type === 'amount') return value ? `$${value} off` : '';
  if (type === 'percent') return value ? `${value}% off` : '';
  return value ?? '';
}

export default async function PromotionsPage() {
  const supabase = createClient();
  const [{ data: promoData }, { count: customerCount }] = await Promise.all([
    supabase.from('promotions').select('*').order('created_at', { ascending: false }),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
  ]);

  const promos: Promotion[] = (promoData ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    discount: mapDiscount(p.discount_type, p.discount_value),
    expirationDate: p.expiration_date,
    message: p.message,
    sentCount: p.customers_sent,
    createdAt: (p.created_at as string).split('T')[0],
    status: p.status,
  }));

  return <PromotionsClient initialPromos={promos} totalCustomers={customerCount ?? 0} />;
}
