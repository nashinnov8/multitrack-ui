"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginRequest, loginRequestSchema } from "../schema";
import { useLogin } from "../hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { mutate: login, isPending, isError, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginRequest) => {
    login(data, {
      onSuccess: () => {
        window.location.href = "/";
      },
    });
  };

  return (
    <div className="w-full space-y-5">
      <div className="flex justify-end">
        <LanguageSwitcher />
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t("loginTitle")}</h1>
        <p className="text-xs text-slate-500">{t("loginSubtitle")}</p>
      </div>

      {isError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          {/* @ts-ignore */}
          {error?.response?.data?.message || "Invalid email or password"}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-slate-700">{t("email")}</Label>
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-700">{t("password")}</Label>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
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
          {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Loading...</> : t("loginButton")}
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500">
        {t("noAccount")}{" "}
        <Link href="/signup" className="text-indigo-600 font-semibold hover:underline">
          {t("signupButton")}
        </Link>
      </p>
    </div>
  );
}
