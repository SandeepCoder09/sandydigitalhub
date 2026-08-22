"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to process password reset request.");
      }

      setStatus("success");
      setMessage(data.message || "If an account exists with this email, you will receive a password reset link shortly.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left Side - Image/Branding */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden bg-black">
        <Image 
          src="/auth-bg.png" 
          alt="Digital Background" 
          fill 
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="relative z-10">
          <Link href="/">
            <Image src="/logo-footer.png" alt="Sandy Digital Hub" width={200} height={60} className="w-auto h-16 object-contain" />
          </Link>
        </div>

        <div className="relative z-10 max-w-xl">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Regain access to your account.
          </h2>
          <p className="text-lg text-white/70">
            Forgot your password? Don't worry, we'll help you get back into your account safely and securely.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="md:hidden flex justify-center mb-10">
            <Link href="/">
              <Image src="/logo.png" alt="Sandy Digital Hub" width={180} height={60} className="w-auto h-16 object-contain" />
            </Link>
          </div>

          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
            <p className="text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <CardContent className="p-0">
            {status === "success" ? (
              <div className="text-center space-y-6">
                <div className="p-4 bg-green-500/10 text-green-400 rounded-lg text-sm border border-green-500/20">
                  {message}
                </div>
                <Link href="/login" className="w-full block">
                  <Button className="w-full h-12 shadow-lg shadow-primary/25">
                    Return to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {status === "error" && (
                    <div className="p-3 text-sm text-white bg-destructive/90 rounded-lg">
                      {message}
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80">Email address</FormLabel>
                        <FormControl>
                          <Input placeholder="rahulsharma@example.com" type="email" className="h-12 bg-white/5 border-white/10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full h-12 text-base mt-8 shadow-lg shadow-primary/25" disabled={status === "loading"}>
                    {status === "loading" ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </Form>
            )}
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Sign in
              </Link>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
