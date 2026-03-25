import twilio from 'twilio';

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+${digits}`;
}

export async function sendSMS(to: string, body: string): Promise<{ success: boolean; error?: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  console.log('[Twilio] sendSMS called');
  console.log('[Twilio] TWILIO_ACCOUNT_SID:', accountSid ? `${accountSid.slice(0, 6)}...` : 'MISSING');
  console.log('[Twilio] TWILIO_AUTH_TOKEN:', authToken ? '***set***' : 'MISSING');
  console.log('[Twilio] TWILIO_PHONE_NUMBER:', fromNumber ?? 'MISSING');

  if (!accountSid || !authToken || !fromNumber) {
    console.error('[Twilio] ERROR: Missing credentials — cannot send SMS');
    return { success: false, error: 'Twilio credentials are not configured.' };
  }

  const normalizedTo = normalizePhone(to);
  console.log('[Twilio] Sending SMS to:', normalizedTo, '| from:', fromNumber);
  console.log('[Twilio] Message body:', body);

  try {
    const client = twilio(accountSid, authToken);
    const msg = await client.messages.create({ body, from: fromNumber, to: normalizedTo });
    console.log('[Twilio] SUCCESS — SID:', msg.sid, '| status:', msg.status);
    return { success: true };
  } catch (err: unknown) {
    const twilioErr = err as { code?: number; message?: string; status?: number };
    console.error('[Twilio] ERROR — code:', twilioErr.code, '| status:', twilioErr.status, '| message:', twilioErr.message);
    // Error 21608: unverified number on trial account
    if (twilioErr.code === 21608) {
      return {
        success: false,
        error: `${normalizedTo} is not a verified number. On the Twilio trial plan, you can only send SMS to numbers verified in your Twilio console (twilio.com/console/phone-numbers/verified).`,
      };
    }
    return { success: false, error: twilioErr.message ?? 'Failed to send SMS.' };
  }
}
