'use server';

import { createClient } from './supabase';
import { revalidatePath } from 'next/cache';
import type { Customer, Reminder, Promotion } from '@/app/data/sample';

// ── Type helpers ────────────────────────────────────────────────────────────

type DbCustomer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle_year: number;
  vehicle_make: string;
  vehicle_model: string;
  last_service_date: string;
  last_service_type: string;
  next_service_due: string;
  mileage: number;
};

type DbReminder = {
  id: string;
  customer_id: string;
  customer_name: string;
  service_type: string;
  due_date: string;
  status: 'pending' | 'sent' | 'opened';
  sent_at: string | null;
  phone: string;
};

type DbPromotion = {
  id: string;
  title: string;
  discount_type: string;
  discount_value: string | null;
  expiration_date: string;
  message: string;
  customers_sent: number;
  status: 'active' | 'expired';
  created_at: string;
};

type DbShopSettings = {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  sms_sender_name: string;
  hours: Record<string, string>;
};

function mapCustomer(db: DbCustomer): Customer {
  return {
    id: db.id,
    name: db.name,
    phone: db.phone,
    email: db.email,
    vehicle: { year: db.vehicle_year, make: db.vehicle_make, model: db.vehicle_model },
    lastServiceDate: db.last_service_date,
    lastServiceType: db.last_service_type,
    nextServiceDue: db.next_service_due,
    mileage: db.mileage,
  };
}

function mapReminder(db: DbReminder): Reminder {
  return {
    id: db.id,
    customerId: db.customer_id,
    customerName: db.customer_name,
    serviceType: db.service_type,
    dueDate: db.due_date,
    status: db.status,
    sentAt: db.sent_at ?? undefined,
    phone: db.phone,
  };
}

function mapDiscount(type: string, value: string | null): string {
  if (type === 'free') return value ? `Free ${value}` : 'Free service';
  if (type === 'amount') return value ? `$${value} off` : '';
  if (type === 'percent') return value ? `${value}% off` : '';
  return value ?? '';
}

function mapPromotion(db: DbPromotion): Promotion {
  return {
    id: db.id,
    title: db.title,
    discount: mapDiscount(db.discount_type, db.discount_value),
    expirationDate: db.expiration_date,
    message: db.message,
    sentCount: db.customers_sent,
    createdAt: db.created_at.split('T')[0],
    status: db.status,
  };
}

// ── Customers ────────────────────────────────────────────────────────────────

export async function getCustomers(): Promise<Customer[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as DbCustomer[]).map(mapCustomer);
}

export async function addCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('customers')
    .insert({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      vehicle_year: customer.vehicle.year,
      vehicle_make: customer.vehicle.make,
      vehicle_model: customer.vehicle.model,
      last_service_date: customer.lastServiceDate,
      last_service_type: customer.lastServiceType,
      next_service_due: customer.nextServiceDue,
      mileage: customer.mileage,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath('/customers');
  return mapCustomer(data as DbCustomer);
}

// ── Reminders ────────────────────────────────────────────────────────────────

export async function getReminders(): Promise<Reminder[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .order('due_date', { ascending: true });
  if (error) throw new Error(error.message);
  return (data as DbReminder[]).map(mapReminder);
}

export async function sendReminder(id: string): Promise<void> {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase
    .from('reminders')
    .update({ status: 'sent', sent_at: today })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/reminders');
}

export async function sendAllPendingReminders(): Promise<void> {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase
    .from('reminders')
    .update({ status: 'sent', sent_at: today })
    .eq('status', 'pending');
  if (error) throw new Error(error.message);
  revalidatePath('/reminders');
}

// ── Promotions ───────────────────────────────────────────────────────────────

export async function getPromotions(): Promise<Promotion[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as DbPromotion[]).map(mapPromotion);
}

export async function createPromotion(promo: {
  title: string;
  discountType: string;
  discountValue: string;
  expirationDate: string;
  message: string;
}): Promise<Promotion> {
  const supabase = createClient();
  const status = new Date(promo.expirationDate) >= new Date() ? 'active' : 'expired';
  const { data, error } = await supabase
    .from('promotions')
    .insert({
      title: promo.title,
      discount_type: promo.discountType,
      discount_value: promo.discountValue || null,
      expiration_date: promo.expirationDate,
      message: promo.message,
      customers_sent: 0,
      status,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath('/promotions');
  return mapPromotion(data as DbPromotion);
}

export async function sendCampaign(id: string, customerCount: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('promotions')
    .update({ customers_sent: customerCount })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/promotions');
}

// ── Shop Settings ─────────────────────────────────────────────────────────────

export async function getShopSettings() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('shop_settings')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) return null;
  return data as DbShopSettings;
}

export async function saveShopSettings(settings: {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  smsSenderName: string;
  hours: Record<string, string>;
}): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('shop_settings')
    .upsert({
      id: 1,
      name: settings.name,
      phone: settings.phone,
      address: settings.address,
      city: settings.city,
      state: settings.state,
      zip: settings.zip,
      sms_sender_name: settings.smsSenderName,
      hours: settings.hours,
    });
  if (error) throw new Error(error.message);
  revalidatePath('/settings');
}
