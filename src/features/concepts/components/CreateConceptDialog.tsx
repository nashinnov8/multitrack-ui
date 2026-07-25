"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConceptRequest, conceptRequestSchema, ConceptStatus } from "../schema";
import { useCreateConcept } from "../hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";

export function CreateConceptDialog({ trackId }: { trackId: string }) {
  const [open, setOpen] = useState(false);
  const { mutate: createConcept, isPending } = useCreateConcept(trackId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConceptRequest>({
    resolver: zodResolver(conceptRequestSchema),
    defaultValues: { name: "", status: "NOT_UNDERSTOOD" },
  });

  const onSubmit = (data: ConceptRequest) => {
    createConcept(data, {
      onSuccess: () => { setOpen(false); reset(); },
    });
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="sm"
        variant="outline"
        className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 text-xs h-8"
      >
        <Plus className="w-3.5 h-3.5 mr-1" />
        Add Concept
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-slate-200 sm:max-w-[420px] p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">Add Concept</DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Add a key concept or topic you need to master.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Concept Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Closure, Dependency Injection"
                className="bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 text-sm placeholder:text-slate-400"
                {...register("name")}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs font-semibold text-slate-700">Initial Status</Label>
              <select
                id="status"
                className="w-full h-9 rounded-md bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-sm px-3 text-slate-800"
                {...register("status")}
              >
                <option value="NOT_UNDERSTOOD">Not Understood ❌</option>
                <option value="EXPLAINED_WITH_GAPS">Explained with Gaps ⚠️</option>
                <option value="MASTERED">Mastered ✅</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs"
                onClick={() => { setOpen(false); reset(); }}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                {isPending
                  ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Saving...</>
                  : "Add Concept"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
