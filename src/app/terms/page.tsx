import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Sandy Digital Hub",
  description: "Terms and conditions for using Sandy Digital Hub services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Terms &amp; Conditions</h1>
        <p className="text-white/50 mb-10 text-sm">Last updated: July 15, 2026</p>

        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the services provided by Sandy Digital Hub ("we", "us", or "our"),
              you accept and agree to be bound by these Terms and Conditions. If you do not agree
              to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Services</h2>
            <p>
              Sandy Digital Hub provides digital services including but not limited to website development,
              mobile app development, graphic design, PAN card services, digital marketing, SEO optimization,
              resume building, and other digital solutions. The specific scope, deliverables, and timeline
              for each service will be communicated at the time of order.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Payment Terms</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>All prices listed on our platform are in Indian Rupees (₹) and are inclusive of applicable GST (18%).</li>
              <li>Payment can be made via online payment (Razorpay) or pay at shop.</li>
              <li>For online payments, the transaction is processed securely through Razorpay payment gateway.</li>
              <li>Orders are confirmed only after successful payment or confirmation of pay-at-shop arrangement.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Order Cancellation</h2>
            <p>
              You may request cancellation of an order before the service work has commenced.
              Once work has started, cancellation requests will be reviewed on a case-by-case basis.
              Please contact us at <span className="text-[#2563EB]">info@sandydigitalhub.com</span> for
              cancellation requests.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Intellectual Property</h2>
            <p>
              Upon full payment, all deliverables created specifically for your project will be transferred
              to you. However, we retain the right to use the work in our portfolio unless agreed otherwise.
              Any third-party assets (fonts, stock images, plugins) are subject to their respective licenses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. User Accounts</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must provide accurate and complete information during registration.</li>
              <li>You are responsible for all activities that occur under your account.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Limitation of Liability</h2>
            <p>
              Sandy Digital Hub shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages resulting from your use of our services. Our total liability shall not
              exceed the amount paid by you for the specific service in question.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India.
              Any disputes arising from these terms shall be subject to the exclusive jurisdiction
              of the courts in Fatehpur, Uttar Pradesh, India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting on this page. Your continued use of our services after
              any changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms &amp; Conditions, please contact us at{" "}
              <Link href="/contact" className="text-[#2563EB] hover:underline">our contact page</Link> or
              email us at <span className="text-[#2563EB]">info@sandydigitalhub.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
