export const metadata = {
  title: "Privacy Policy – MidasRemind",
};

export default function PrivacyPage() {
  return (
    <div className="p-4 sm:p-8 max-w-3xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mt-1">Last updated: March 25, 2026</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        <Section title="Information We Collect">
          <p>
            We collect the following information from customers to provide vehicle service reminders:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Full name</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>Vehicle information (make, model, year, mileage)</li>
            <li>Service history and upcoming service due dates</li>
          </ul>
          <p className="mt-2">
            This information is collected directly from customers at our shop or through
            opt-in forms, and is used solely to send service reminders and relevant
            promotional offers from Midas Sunnyvale.
          </p>
        </Section>

        <Section title="How We Use Your Information">
          <p>We use your information to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Send SMS and email reminders about upcoming or overdue vehicle services</li>
            <li>Notify you of promotions and special offers from our shop</li>
            <li>Maintain accurate service records for your vehicle</li>
            <li>Respond to your inquiries and customer service requests</li>
          </ul>
        </Section>

        <Section title="Data Sharing">
          <p>
            We do <strong>not</strong> sell, rent, or share your personal information with
            third parties for marketing purposes. Your data may be shared only in the
            following limited circumstances:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              With service providers (such as SMS delivery platforms) strictly to fulfill
              the communications described above
            </li>
            <li>As required by law or valid legal process</li>
          </ul>
        </Section>

        <Section title="Data Retention">
          <p>
            We retain your information for as long as you are an active customer or until
            you request removal. You may request deletion of your data at any time by
            contacting us at the shop or replying STOP to any SMS message.
          </p>
        </Section>

        <Section title="Security">
          <p>
            We take reasonable technical and organizational measures to protect your
            personal information from unauthorized access, loss, or misuse. However, no
            method of transmission over the internet or electronic storage is 100% secure.
          </p>
        </Section>

        <Section title="Contact Us">
          <p>
            If you have questions about this Privacy Policy or wish to update or delete
            your information, please contact us:
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
