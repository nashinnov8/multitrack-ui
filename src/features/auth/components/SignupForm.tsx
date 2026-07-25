"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterRequest, registerRequestSchema } from "../schema";
import { useRegister } from "../hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AlertCircle, Loader2, MailCheck, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function SignupForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const { mutate: registerUser, isPending, isError, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerRequestSchema),
    defaultValues: { email: "", password: "", username: "", displayName: "" },
  });

  const onSubmit = (data: RegisterRequest) => {
    setSubmittedEmail(data.email);
    registerUser(data, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
    });
  };

  if (isSubmitted) {
    return (
      <div className="w-full text-center space-y-4 py-2">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <MailCheck className="w-6 h-6" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Check your email</h2>
          <p className="text-slate-500 text-xs mt-1">
            We've sent a verification link to <span className="font-semibold text-slate-700">{submittedEmail}</span>.
          </p>
          <p className="text-slate-400 text-[11px] mt-2">
            Please click the link in the email to activate your account.
          </p>
        </div>
        <Link href="/login">
          <Button variant="outline" size="sm" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 text-xs mt-2">
            Proceed to Log In →
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create an account</h1>
        <p className="text-xs text-slate-500">Start tracking your goals today</p>
      </div>

      {isError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          {/* @ts-ignore */}
          {error?.response?.data?.message || "Registration failed. Please try again."}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-xs font-semibold text-slate-700">Username</Label>
            <Input
              id="username"
              placeholder="johndoe"
              className="bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 text-sm placeholder:text-slate-400"
              {...register("username")}
            />
            {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="displayName" className="text-xs font-semibold text-slate-700">Display Name</Label>
            <Input
              id="displayName"
              placeholder="John Doe"
              className="bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 text-sm placeholder:text-slate-400"
              {...register("displayName")}
            />
            {errors.displayName && <p className="text-xs text-red-500">{errors.displayName.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 text-sm placeholder:text-slate-400"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold text-slate-700">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Min. 6 characters"
            className="bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 text-sm placeholder:text-slate-400"
            {...register("password")}
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition-all"
          disabled={isPending}
        >
          {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</> : "Create account"}
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
