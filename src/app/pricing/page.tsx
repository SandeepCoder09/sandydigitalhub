import type { Metadata } from "next";
import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | Sandy Digital Hub",
  description: "Affordable and transparent pricing plans for website development, mobile apps, and digital services.",
};

const plans = [
  {
    name: "Starter Website",
    description: "Perfect for personal portfolios and small local businesses.",
    price: "₹4,999",
    popular: false,
    features: [
      { name: "Single Page Application", included: true },
      { name: "Mobile Responsive Design", included: true },
      { name: "Contact Form", included: true },
      { name: "Basic SEO", included: true },
      { name: "Admin Dashboard", included: false },
      { name: "E-Commerce Features", included: false },
    ]
  },
  {
    name: "Business Website",
    description: "Ideal for growing businesses needing multiple pages and CMS.",
    price: "₹14,999",
    popular: true,
    features: [
      { name: "Up to 5 Pages", included: true },
      { name: "Mobile Responsive Design", included: true },
      { name: "Contact Form & Lead Capture", included: true },
      { name: "Advanced SEO", included: true },
      { name: "Admin Dashboard (CMS)", included: true },
      { name: "E-Commerce Features", included: false },
    ]
  },
  {
    name: "E-Commerce Website",
    description: "Complete online store setup to sell products globally.",
    price: "₹24,999",
    popular: false,
    features: [
      { name: "Unlimited Products", included: true },
      { name: "Payment Gateway Integration", included: true },
      { name: "Order Management System", included: true },
      { name: "Advanced SEO", included: true },
      { name: "Admin Dashboard (CMS)", included: true },
      { name: "Customer Login/Profiles", included: true },
    ]
  }
];

export default function PricingPage() {
  return (
    <div className="py-8 sm:py-24 bg-white min-h-screen">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-16 space-y-2 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#7C3AED] text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" /> Affordable Rates
          </div>
          <h1 className="text-2xl sm:text-5xl font-black tracking-tight text-gray-900 leading-tight">
            Simple, Transparent <span className="text-[#7C3AED]">Pricing</span>
          </h1>
          <p className="text-xs sm:text-xl text-gray-600">
            No hidden fees. Choose the best plan that fits your business requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-8 max-w-6xl mx-auto items-stretch pt-2 sm:pt-4">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`flex flex-col relative bg-white transition-all rounded-2xl sm:rounded-3xl overflow-visible ${
                plan.popular 
                  ? 'border-2 border-[#7C3AED] shadow-xl sm:shadow-2xl shadow-purple-500/10 md:-translate-y-2 z-10' 
                  : 'border border-gray-200 shadow-xs sm:shadow-md hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-30">
                  <span className="bg-[#7C3AED] text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-wider py-1 px-3 sm:py-1.5 sm:px-4 rounded-full shadow-md shadow-purple-500/30 whitespace-nowrap">
                    🔥 Most Popular
                  </span>
                </div>
              )}
              <CardHeader className={`p-4 sm:p-6 ${plan.popular ? "pt-6 sm:pt-8" : ""}`}>
                <CardTitle className="text-lg sm:text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600 leading-snug">{plan.description}</CardDescription>
                <div className="mt-2 sm:mt-4">
                  <span className="text-2xl sm:text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-xs sm:text-sm text-gray-500"> / project</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-4 sm:p-6 pt-0 sm:pt-0">
                <ul className="space-y-2 sm:space-y-4 mt-2 sm:mt-4">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      {feature.included ? (
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-[#7C3AED] shrink-0" />
                      ) : (
                        <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-800 font-medium' : 'text-gray-400 line-through'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-4 sm:p-6 pt-0 sm:pt-0">
                <Link href="/contact" className="w-full">
                  <Button 
                    className={`w-full h-10 sm:h-12 font-bold rounded-xl sm:rounded-2xl text-xs sm:text-base transition-all ${
                      plan.popular 
                        ? 'bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white shadow-md sm:shadow-lg shadow-purple-500/20' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Choose Plan
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-10 sm:mt-24 max-w-4xl mx-auto bg-gray-50 rounded-2xl sm:rounded-3xl p-5 sm:p-12 text-center border border-gray-200 shadow-xs sm:shadow-sm space-y-2.5 sm:space-y-4">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Need Mobile Apps or Custom Solutions?</h2>
          <p className="text-xs sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We also provide enterprise-grade Mobile App Development (Android/iOS) and custom software solutions. Get in touch with us for a custom quote tailored to your exact requirements.
          </p>
          <div className="pt-2">
            <Link href="/contact">
              <Button size="lg" className="bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white font-bold h-10 sm:h-12 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-xs sm:text-base shadow-md shadow-purple-500/20">
                Request Custom Quote
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
