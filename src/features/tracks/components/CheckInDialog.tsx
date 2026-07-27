"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityLogRequest, activityLogRequestSchema } from "../schema";
import { useLogActivity } from "../hooks";
import { useConcepts } from "@/features/concepts/hooks";
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
import { Loader2, BookOpen, Lightbulb, AlertTriangle, MessageSquare, CheckCircle2, Tag } from "lucide-react";

type CheckInDialogProps = {
  trackId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

const fields = [
  {
    id: "note",
    label: "General Notes",
    placeholder: "What did you work on today?",
    icon: MessageSquare,
  },
  {
    id: "whatLearned",
    label: "What did you learn?",
    placeholder: "Key concepts, ideas, or skills picked up...",
    icon: BookOpen,
  },
  {
    id: "explainSimply",
    label: "Explain Simply",
    placeholder: 'Explain it like you\'re teaching someone else — "Feynman technique"',
    icon: Lightbulb,
  },
  {
    id: "gapsFound",
    label: "Gaps Found",
    placeholder: "What are you still confused about? What needs more study?",
    icon: AlertTriangle,
  },
] as const;

export function CheckInDialog({ trackId, isOpen, onClose }: CheckInDialogProps) {
  const { notifyEvent } = useContinuousTour();
  const { mutate: logActivity, isPending } = useLogActivity(trackId || "");
  const { data: concepts } = useConcepts(trackId || "");

  const { register, handleSubmit, reset } = useForm<ActivityLogRequest>({
    resolver: zodResolver(activityLogRequestSchema),
    defaultValues: { note: "", whatLearned: "", explainSimply: "", gapsFound: "", conceptId: undefined },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) { onClose(); reset(); }
    else { notifyEvent("OPEN_CHECKIN_DIALOG"); }
  };

  const onSubmit = (data: ActivityLogRequest) => {
    if (!trackId) return;
    logActivity(data, {
      onSuccess: () => {
        onClose();
        reset();
        notifyEvent("CHECKIN_COMPLETED");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-white border-slate-200 sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900">Daily Check-In</DialogTitle>
          </div>
          <DialogDescription className="text-slate-500 text-xs">
            Record today's progress to keep your streak active. Every entry counts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Related Concept Selector */}
          {concepts && concepts.length > 0 && (
            <div className="space-y-1.5">
              <Label htmlFor="conceptId" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Related Concept (Optional)
              </Label>
              <select
                id="conceptId"
                className="w-full h-9 rounded-md bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-sm px-3 text-slate-800"
                {...register("conceptId")}
              >
                <option value="">-- None --</option>
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
                <Label htmlFor={field.id} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  {field.label}
                </Label>
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  rows={2}
                  className="bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 text-sm placeholder:text-slate-400 resize-none"
                  {...register(field.id)}
                />
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
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isPending || !trackId} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
              {isPending
                ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Submitting...</>
                : "Submit Check-In"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
