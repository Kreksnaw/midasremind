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

  if (!accountSid || !authToken || !fromNumber) {
    return { success: false, error: 'Twilio credentials are not configured.' };
  }

  const normalizedTo = normalizePhone(to);

  try {
    const client = twilio(accountSid, authToken);
    await client.messages.create({ body, from: fromNumber, to: normalizedTo });
    return { success: true };
  } catch (err: unknown) {
    const twilioErr = err as { code?: number; message?: string };
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
