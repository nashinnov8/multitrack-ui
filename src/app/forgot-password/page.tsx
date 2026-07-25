import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { Zap } from "lucide-react";

export default function ForgotPasswordPage() {
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
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
