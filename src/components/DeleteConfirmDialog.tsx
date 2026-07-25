"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

type DeleteConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isPending?: boolean;
};

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action will move this item to deleted items. Your activity history will be preserved.",
  isPending = false,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white border-slate-200 sm:max-w-[400px] p-6">
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-2">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <DialogTitle className="text-base font-bold text-slate-900">{title}</DialogTitle>
          <DialogDescription className="text-slate-500 text-xs leading-relaxed mt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium"
            onClick={() => {
              onConfirm();
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
