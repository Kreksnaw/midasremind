import { createClient } from '@/lib/supabase';
import SettingsClient from './SettingsClient';
import { shopInfo } from '@/app/data/sample';

export default async function SettingsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('shop_settings')
    .select('*')
    .eq('id', 1)
    .single();

  const settings = data
    ? {
        name: data.name ?? shopInfo.name,
        phone: data.phone ?? shopInfo.phone,
        address: data.address ?? shopInfo.address,
        city: data.city ?? shopInfo.city,
        state: data.state ?? shopInfo.state,
        zip: data.zip ?? shopInfo.zip,
        smsSenderName: data.sms_sender_name ?? shopInfo.smsSenderName,
        hours: (data.hours as Record<string, string>) ?? shopInfo.hours,
      }
    : {
        name: shopInfo.name,
        phone: shopInfo.phone,
        address: shopInfo.address,
        city: shopInfo.city,
        state: shopInfo.state,
        zip: shopInfo.zip,
        smsSenderName: shopInfo.smsSenderName,
        hours: shopInfo.hours as Record<string, string>,
      };

  return <SettingsClient initialSettings={settings} />;
}
