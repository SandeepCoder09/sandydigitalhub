import type { Metadata } from "next";
import { Check, X } from "lucide-react";
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
    <div className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            No hidden fees. Choose the best plan that fits your business requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col relative ${plan.popular ? 'border-primary shadow-lg scale-105 z-10' : ''}`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="min-h-10">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-muted-foreground"> / project</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-4 mt-4">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-primary shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground shrink-0" />
                      )}
                      <span className={feature.included ? 'text-foreground' : 'text-muted-foreground line-through'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/contact" className="w-full">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    Choose Plan
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-24 max-w-4xl mx-auto bg-muted rounded-2xl p-8 md:p-12 text-center border">
          <h2 className="text-2xl font-bold mb-4">Need Mobile Apps or Custom Solutions?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            We also provide enterprise-grade Mobile App Development (Android/iOS) and custom software solutions. Get in touch with us for a custom quote tailored to your exact requirements.
          </p>
          <Link href="/contact">
            <Button size="lg">Request Custom Quote</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
