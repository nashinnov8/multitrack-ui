"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityLogRequest, activityLogRequestSchema } from "../schema";
import { useLogActivity } from "../hooks";
import { useConcepts } from "@/features/concepts/hooks";
import { useEvaluateFeynman } from "@/features/ai/hooks";
import { FeynmanEvaluationResponse } from "@/features/ai/schema";
import { useContinuousTour } from "@/components/ContinuousTourProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, BookOpen, Lightbulb, AlertTriangle, MessageSquare, CheckCircle2, Tag, Bot, Sparkles, Plus } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

type CheckInDialogProps = {
  trackId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

export function CheckInDialog({ trackId, isOpen, onClose }: CheckInDialogProps) {
  const t = useTranslations("modals.checkIn");
  const locale = useLocale();
  const { notifyEvent } = useContinuousTour();
  const { mutate: logActivity, isPending } = useLogActivity(trackId || "");
  const { data: concepts } = useConcepts(trackId || "");
  const { mutate: evaluateFeynman, isPending: isAiEvaluating } = useEvaluateFeynman();

  const [formError, setFormError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<FeynmanEvaluationResponse | null>(null);

  const { register, handleSubmit, reset, watch, setValue } = useForm<ActivityLogRequest>({
    resolver: zodResolver(activityLogRequestSchema),
    defaultValues: { note: "", whatLearned: "", explainSimply: "", gapsFound: "", conceptId: undefined },
  });

  const watchExplain = watch("explainSimply");
  const watchNote = watch("note");
  const watchLearned = watch("whatLearned");
  const watchConceptId = watch("conceptId");

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      reset();
      setFormError(null);
      setAiResult(null);
    } else {
      notifyEvent("OPEN_CHECKIN_DIALOG");
    }
  };

  const handleAiEvaluate = () => {
    const selectedConcept = concepts?.find((c) => c.id === watchConceptId);
    evaluateFeynman(
      {
        conceptName: selectedConcept?.name,
        explainSimply: watchExplain,
        whatLearned: watchLearned,
        note: watchNote,
        lang: locale,
      },
      {
        onSuccess: (data) => {
          setAiResult(data);
        },
      }
    );
  };

  const onSubmit = (data: ActivityLogRequest) => {
    if (!trackId) return;

    // Validation Check: At least ONE field must be filled
    const hasContent =
      (data.note && data.note.trim().length > 0) ||
      (data.whatLearned && data.whatLearned.trim().length > 0) ||
      (data.explainSimply && data.explainSimply.trim().length > 0) ||
      (data.gapsFound && data.gapsFound.trim().length > 0);

    if (!hasContent) {
      setFormError(t("atLeastOneField"));
      return;
    }

    setFormError(null);

    logActivity(data, {
      onSuccess: () => {
        onClose();
        reset();
        setFormError(null);
        setAiResult(null);
        notifyEvent("CHECKIN_COMPLETED");
      },
      onError: (err: any) => {
        setFormError(err?.message || "Failed to submit check-in");
      },
    });
  };

  const fields = [
    {
      id: "note",
      label: t("noteLabel"),
      placeholder: t("notePlaceholder"),
      icon: MessageSquare,
    },
    {
      id: "whatLearned",
      label: t("learnedLabel"),
      placeholder: t("learnedPlaceholder"),
      icon: BookOpen,
    },
    {
      id: "explainSimply",
      label: t("feynmanLabel"),
      placeholder: t("feynmanPlaceholder"),
      icon: Lightbulb,
    },
    {
      id: "gapsFound",
      label: t("gapsLabel"),
      placeholder: t("gapsPlaceholder"),
      icon: AlertTriangle,
    },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-white border-slate-200 sm:max-w-[520px] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900">{t("title")}</DialogTitle>
          </div>
          <DialogDescription className="text-slate-500 text-xs">
            {t("desc")}
          </DialogDescription>
        </DialogHeader>

        {formError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Related Concept Selector */}
          {concepts && concepts.length > 0 && (
            <div className="space-y-1.5">
              <Label htmlFor="conceptId" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {t("conceptLabel")}
              </Label>
              <select
                id="conceptId"
                className="w-full h-9 rounded-md bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-sm px-3 text-slate-800"
                {...register("conceptId")}
              >
                <option value="">{t("conceptNone")}</option>
                {concepts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor={field.id} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    {field.label}
                  </Label>

                  {/* AI Evaluate Button */}
                  {field.id === "explainSimply" && (
                    <button
                      type="button"
                      disabled={isAiEvaluating || !watchExplain || watchExplain.trim().length === 0}
                      onClick={handleAiEvaluate}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {isAiEvaluating ? (
                        <><Loader2 className="w-3 h-3 animate-spin text-indigo-600" /> {t("aiEvaluating")}</>
                      ) : (
                        <><Bot className="w-3.5 h-3.5 text-indigo-600" /> {t("aiEvaluateBtn")}</>
                      )}
                    </button>
                  )}
                </div>

                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  rows={2}
                  className="bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 text-sm placeholder:text-slate-400 resize-none"
                  {...register(field.id as any)}
                />

                {field.id === "explainSimply" && (
                  <p className="text-[11px] text-indigo-600 font-medium mt-0.5">
                    {t("feynmanHint")}
                  </p>
                )}

                {/* AI Tutor Assessment Result Card */}
                {field.id === "explainSimply" && aiResult && (
                  <div className="mt-2.5 p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-white border border-indigo-100 shadow-xs space-y-2 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3 text-indigo-600 animate-spin" />
                        {t("aiScoreRating", { score: aiResult.score })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {aiResult.feedback}
                    </p>

                    {aiResult.jargonWarning && (
                      <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                        ⚠️ {aiResult.jargonWarning}
                      </div>
                    )}

                    {aiResult.suggestedGap && (
                      <div className="flex items-center justify-between gap-2 text-[11px] text-indigo-900 bg-indigo-100/40 p-2 rounded-lg border border-indigo-200/50">
                        <span className="min-w-0 truncate">💡 <strong>Gợi ý Lỗ hổng:</strong> {aiResult.suggestedGap}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setValue("gapsFound", aiResult.suggestedGap)}
                          className="h-6 text-[10px] font-bold text-indigo-700 hover:bg-indigo-200/60 px-2 shrink-0"
                        >
                          <Plus className="w-3 h-3 mr-0.5" /> {t("addToGaps")}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs"
              onClick={() => handleOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" size="sm" disabled={isPending || !trackId} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
              {isPending
                ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />{t("submitting")}</>
                : t("submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
