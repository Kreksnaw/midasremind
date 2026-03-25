import { createClient } from '@/lib/supabase';
import CustomersClient from './CustomersClient';
import type { Customer } from '@/app/data/sample';

export default async function CustomersPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  const customers: Customer[] = (data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email,
    vehicle: { year: c.vehicle_year, make: c.vehicle_make, model: c.vehicle_model },
    lastServiceDate: c.last_service_date,
    lastServiceType: c.last_service_type,
    nextServiceDue: c.next_service_due,
    mileage: c.mileage,
  }));

  return <CustomersClient initialCustomers={customers} />;
}
