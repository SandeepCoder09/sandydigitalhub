import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Sandy Digital Hub",
  description: "Privacy policy for Sandy Digital Hub - how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-white/50 mb-10 text-sm">Last updated: July 15, 2026</p>

        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              Sandy Digital Hub ("we", "us", or "our") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-white/90 mb-2">Personal Information</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Name, email address, and mobile number (during account registration)</li>
              <li>Billing and payment information (processed securely via Razorpay)</li>
              <li>Communication data (when you contact us via forms or email)</li>
            </ul>
            <h3 className="text-lg font-medium text-white/90 mb-2">Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Browser type and version</li>
              <li>IP address and general location</li>
              <li>Pages visited, time spent, and navigation patterns</li>
              <li>Device information and operating system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide, maintain, and improve our services</li>
              <li>To process your orders and payments</li>
              <li>To communicate with you about your orders and services</li>
              <li>To send promotional emails (you can opt out at any time)</li>
              <li>To detect and prevent fraud or unauthorized access</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information.
              Passwords are encrypted using bcrypt hashing. Payment information is processed securely
              through Razorpay and we do not store your card details on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Cookies</h2>
            <p>
              We use cookies and similar technologies to maintain your session, remember your preferences,
              and analyze usage patterns. You can manage cookie preferences through your browser settings.
              Essential cookies required for authentication cannot be disabled while using our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Third-Party Services</h2>
            <p>We may share your information with the following third-party service providers:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong className="text-white">Razorpay</strong> — for payment processing</li>
              <li><strong className="text-white">MongoDB Atlas</strong> — for secure data storage</li>
              <li><strong className="text-white">Vercel</strong> — for hosting and deployment</li>
            </ul>
            <p className="mt-2">
              These providers have their own privacy policies and we encourage you to review them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Your Rights</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Access and review your personal information through your dashboard</li>
              <li>Update or correct your personal data at any time</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of promotional communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active or as needed to provide
              services. Order data is retained for a minimum of 8 years as required by Indian tax laws.
              You may request account deletion by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Children&apos;s Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly
              collect personal information from children. If we discover that we have inadvertently
              collected data from a minor, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise your rights, please
              contact us at{" "}
              <Link href="/contact" className="text-[#FF7A00] hover:underline">our contact page</Link> or
              email us at <span className="text-[#FF7A00]">info@sandydigitalhub.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
