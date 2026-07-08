"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get('plan') || 'Custom Service';
  const price = searchParams.get('price') || '4999';

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const res = await initializeRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load");
        setIsLoading(false);
        return;
      }

      // Create Order on Server
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseInt(price), receipt: `rcpt_${Date.now()}` })
      });
      const order = await orderRes.json();

      if (order.error) {
        alert("Could not create order");
        setIsLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key_id',
        amount: order.amount,
        currency: order.currency,
        name: "Sandy Digital Hub",
        description: `Payment for ${plan}`,
        order_id: order.id,
        handler: async function (response: any) {
          // Verify Payment on Server
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: { plan, price }
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            setSuccess(true);
          } else {
            alert(verifyData.error || "Payment verification failed");
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#ff7a00",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto text-center py-8 border-primary/20 shadow-xl">
        <CardContent className="pt-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-8">
            Thank you for choosing Sandy Digital Hub. We will contact you shortly to begin the project.
          </p>
          <Button onClick={() => router.push('/dashboard')} className="w-full">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Complete Checkout</CardTitle>
        <CardDescription>Review your order and securely complete the payment.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-foreground">Service Plan</span>
            <span className="text-foreground">{plan}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t mt-4">
            <span className="font-bold text-lg text-foreground">Total</span>
            <span className="font-bold text-lg text-foreground">₹{price}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          By proceeding, you agree to our Terms of Service and Privacy Policy. Payments are securely processed via Razorpay.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handlePayment} disabled={isLoading} className="w-full h-12 text-lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ₹${price}`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
      <Suspense fallback={<div className="flex items-center gap-2"><Loader2 className="animate-spin w-5 h-5"/> Loading checkout...</div>}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
