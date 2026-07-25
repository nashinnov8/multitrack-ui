"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordRequest, forgotPasswordSchema } from "../schema";
import { useForgotPassword } from "../hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { CheckCircle2, Loader2, Mail } from "lucide-react";

export function ForgotPasswordForm() {
  const { mutate: forgotPassword, isPending, isSuccess } = useForgotPassword();

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotPasswordRequest) => {
    forgotPassword(data);
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 py-2">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Check your inbox</h2>
          <p className="text-slate-500 text-xs mt-1">
            We've sent a password reset link to your email address.
          </p>
        </div>
        <Link href="/login">
          <Button variant="outline" size="sm" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 text-xs mt-2">
            ← Back to log in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset password</h1>
        <p className="text-xs text-slate-500">Enter your email to receive a reset link</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-9 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 text-sm placeholder:text-slate-400"
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition-all"
          disabled={isPending}
        >
          {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending link...</> : "Send Reset Link"}
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Remember your password?{" "}
        <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
