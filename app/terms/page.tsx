export const metadata = {
  title: "Terms & Conditions – MidasRemind",
};

export default function TermsPage() {
  return (
    <div className="p-4 sm:p-8 max-w-3xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Terms &amp; Conditions</h1>
        <p className="text-slate-500 text-sm mt-1">Last updated: March 25, 2026</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        <Section title="SMS Reminder Program">
          <p>
            By providing your phone number to Midas Sunnyvale, you consent to receive
            automated SMS text messages for vehicle service reminders and promotional
            offers. Participation in this program is voluntary.
          </p>
        </Section>

        <Section title="Message Frequency">
          <p>
            You may receive <strong>up to 4 messages per month</strong> from us. Message
            frequency may vary based on your vehicle service schedule and active promotions.
          </p>
        </Section>

        <Section title="Message &amp; Data Rates">
          <p>
            Message and data rates may apply. These charges are billed by your mobile
            carrier. Midas Sunnyvale is not responsible for any charges incurred through
            your mobile plan.
          </p>
        </Section>

        <Section title="How to Opt Out">
          <p>
            You may cancel SMS messages at any time. To stop receiving messages, reply{" "}
            <strong>STOP</strong> to any text message from us. You will receive a
            one-time confirmation message and no further messages will be sent.
          </p>
          <p className="mt-2">
            To re-enable messages after opting out, reply <strong>START</strong> or
            contact our shop directly.
          </p>
        </Section>

        <Section title="Help">
          <p>
            For help or more information, reply <strong>HELP</strong> to any message or
            contact us directly at the shop.
          </p>
        </Section>

        <Section title="Supported Carriers">
          <p>
            This service is available with most major US carriers. Carrier support may
            vary. We are not liable for delayed or undelivered messages.
          </p>
        </Section>

        <Section title="Changes to These Terms">
          <p>
            We may update these Terms &amp; Conditions at any time. Continued receipt of
            messages after changes are posted constitutes acceptance of the updated terms.
            You may opt out at any time by replying STOP.
          </p>
        </Section>

        <Section title="Contact Us">
          <p>
            Questions about these terms? Reach us at:
          </p>
          <p className="mt-2 font-medium text-slate-700">Midas Sunnyvale</p>
          <p className="text-slate-500">Sunnyvale, CA</p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 sm:px-6 py-5">
      <h2 className="text-sm font-semibold text-slate-800 mb-2">{title}</h2>
      <div className="text-sm text-slate-600 space-y-1 leading-relaxed">{children}</div>
    </div>
  );
}
