"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrackCreateRequest, trackCreateRequestSchema } from "../schema";
import { useCreateTrack } from "../hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function CreateTrackDialog() {
  const t = useTranslations("dashboard");
  const [open, setOpen] = useState(false);
  const { mutate: createTrack, isPending } = useCreateTrack();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TrackCreateRequest>({
    resolver: zodResolver(trackCreateRequestSchema),
    defaultValues: { name: "", description: "", isPublic: false },
  });

  const onSubmit = (data: TrackCreateRequest) => {
    createTrack(data, {
      onSuccess: () => { setOpen(false); reset(); },
    });
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition-all"
      >
        <Plus className="w-4 h-4 mr-1.5" />
        {t("createTrack")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-slate-200 sm:max-w-[440px] p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Create New Track</DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Define a goal or skill you want to track consistently.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Track Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Master React, Read 50 Books"
                className="bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 text-sm placeholder:text-slate-400"
                {...register("name")}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-slate-700">Description</Label>
              <Textarea
                id="description"
                placeholder="What do you want to achieve?"
                rows={3}
                className="bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 text-sm placeholder:text-slate-400 resize-none"
                {...register("description")}
              />
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="isPublic"
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                {...register("isPublic")}
              />
              <Label htmlFor="isPublic" className="font-normal text-xs text-slate-600 cursor-pointer">
                Make this track public
              </Label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
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
                  : "Create Track"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
