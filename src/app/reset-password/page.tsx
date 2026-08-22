"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setStatus("error");
      setMessage("Reset token is missing from the link. Please request a new password reset link.");
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setStatus("success");
      setMessage(data.message || "Password reset successfully!");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="md:hidden flex justify-center mb-10">
        <Link href="/">
          <Image src="/logo.png" alt="Sandy Digital Hub" width={180} height={60} className="w-auto h-16 object-contain" />
        </Link>
      </div>

      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold mb-2">Create New Password</h1>
        <p className="text-muted-foreground">
          Enter a strong new password for your account.
        </p>
      </div>

      <CardContent className="p-0">
        {status === "success" ? (
          <div className="text-center space-y-6">
            <div className="p-4 bg-green-500/10 text-green-400 rounded-lg text-sm border border-green-500/20 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{message}</span>
            </div>
            <Link href="/login" className="w-full block">
              <Button className="w-full h-12 shadow-lg shadow-primary/25">
                Proceed to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {status === "error" && (
              <div className="p-3 text-sm text-white bg-destructive/90 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground/80 block mb-2">New Password</label>
              <Input
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-white/5 border-white/10"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground/80 block mb-2">Confirm New Password</label>
              <Input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 bg-white/5 border-white/10"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base mt-8 shadow-lg shadow-primary/25"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Set New Password"
              )}
            </Button>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Sign in
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
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
            Secure Your Account.
          </h2>
          <p className="text-lg text-white/70">
            Set up a fresh, secure password to protect your services, partner workspace, and account history.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-primary" />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
