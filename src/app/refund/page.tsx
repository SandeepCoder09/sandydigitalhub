import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Sandy Digital Hub",
  description: "Refund and cancellation policy for Sandy Digital Hub services.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Refund &amp; Cancellation Policy</h1>
        <p className="text-white/50 mb-10 text-sm">Last updated: July 15, 2026</p>

        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Overview</h2>
            <p>
              At Sandy Digital Hub, we strive to deliver high-quality digital services. We understand
              that sometimes things may not work out as planned. This policy outlines the conditions
              under which refunds and cancellations are processed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Cancellation Policy</h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-green-400 font-bold text-lg">✓</span>
                <div>
                  <p className="text-white font-medium">Before work begins</p>
                  <p className="text-sm text-white/60">Full refund within 5-7 business days.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold text-lg">⚠</span>
                <div>
                  <p className="text-white font-medium">Work in progress (less than 50% complete)</p>
                  <p className="text-sm text-white/60">50% refund after deducting costs for work already completed.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-bold text-lg">✕</span>
                <div>
                  <p className="text-white font-medium">Work more than 50% complete or delivered</p>
                  <p className="text-sm text-white/60">No refund applicable. Revisions may be offered as per service terms.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Refund Eligibility</h2>
            <p className="mb-3">Refunds are applicable in the following scenarios:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Duplicate payment made for the same service</li>
              <li>Service not delivered within the agreed timeline (and no mutual extension agreed)</li>
              <li>Service quality significantly differs from what was promised and described</li>
              <li>Technical failure in payment resulting in charge without order confirmation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Non-Refundable Services</h2>
            <p className="mb-3">The following services are non-refundable once delivered:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>PAN Card application and processing services</li>
              <li>Income Tax Return (ITR) filing services</li>
              <li>Government document processing services</li>
              <li>Domain name registration</li>
              <li>Third-party software license purchases</li>
              <li>Any service that has been fully completed and delivered</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. How to Request a Refund</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Email us at <span className="text-[#FF4500]">info@sandydigitalhub.com</span> with your order ID and reason for refund</li>
              <li>Our team will review your request within 2 business days</li>
              <li>If approved, the refund will be processed to your original payment method</li>
              <li>Refund processing takes 5-7 business days after approval</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Refund for Pay at Shop Orders</h2>
            <p>
              For orders placed with "Pay at Shop" method, refunds (if applicable) will be processed
              in cash at our shop location, or via bank transfer as mutually agreed upon.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Disputes</h2>
            <p>
              If you are not satisfied with our refund decision, you may escalate the matter by writing
              to us at <span className="text-[#FF4500]">info@sandydigitalhub.com</span>. We aim to resolve
              all disputes amicably within 15 business days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Contact</h2>
            <p>
              For any refund or cancellation queries, reach out to us at{" "}
              <Link href="/contact" className="text-[#FF4500] hover:underline">our contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
