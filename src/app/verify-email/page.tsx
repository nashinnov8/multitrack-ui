"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useVerifyEmail } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2, Zap } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { mutate: verify, isPending, isSuccess, isError, error } = useVerifyEmail();
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (token && !attempted) {
      setAttempted(true);
      verify(token);
    }
  }, [token, attempted, verify]);

  if (!token) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-slate-900">Missing Token</h2>
        <p className="text-xs text-slate-500">
          No verification token was provided in the URL.
        </p>
        <Link href="/login">
          <Button variant="outline" size="sm" className="w-full text-xs mt-2 border-slate-200">
            Return to Log In
          </Button>
        </Link>
      </div>
    );
  }

  if (isPending || !attempted) {
    return (
      <div className="text-center space-y-4 py-6">
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">Activating your account...</h2>
        <p className="text-xs text-slate-500">Please wait a moment while we verify your email.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-slate-900">Verification Failed</h2>
        <p className="text-xs text-slate-500">
          {/* @ts-ignore */}
          {error?.response?.data?.message || "Invalid or expired verification token."}
        </p>
        <Link href="/login">
          <Button variant="outline" size="sm" className="w-full text-xs mt-2 border-slate-200">
            Back to Log In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4 py-4">
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Account Activated! 🎉</h2>
        <p className="text-xs text-slate-500 mt-1">
          Your email has been verified successfully. You can now log in.
        </p>
      </div>
      <Link href="/login">
        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs mt-2">
          Proceed to Log In →
        </Button>
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm fade-up">
        <div className="flex flex-col items-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm mb-2.5">
            <Zap className="w-5 h-5 fill-current text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">Multitrack</span>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm">
          <Suspense fallback={<div className="text-center text-xs text-slate-400 py-6">Loading...</div>}>
            <VerifyEmailContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
