"use client";

import { useState } from "react";
import { TrackResponse } from "../schema";
import { useDeleteTrack } from "../hooks";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { isStale } from "@/lib/utils";
import { Clock, CheckCircle2, ChevronRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";

type TrackCardProps = {
  track: TrackResponse;
  onCheckIn: (trackId: string) => void;
};

export function TrackCard({ track, onCheckIn }: TrackCardProps) {
  const stale = isStale(track.lastActivityAt);
  const hasStreak = track.currentStreak > 0;
  const { mutate: deleteTrack, isPending: isDeleting } = useDeleteTrack();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    deleteTrack(track.id, {
      onSuccess: () => setShowDeleteConfirm(false),
    });
  };

  return (
    <>
      <div className={`group relative flex flex-col rounded-xl overflow-hidden p-4 bg-white border transition-all duration-200 hover:shadow-md ${
        stale ? "border-amber-200/80 hover:border-amber-300" : "border-slate-200/80 hover:border-slate-300"
      }`}>
        {/* Top indicator bar */}
        <div className={`absolute inset-x-0 top-0 h-1 rounded-t-xl ${
          stale ? "bg-amber-400" : "bg-indigo-600"
        }`} />

        {/* Header */}
        <div className="flex justify-between items-start mb-2 pt-0.5">
          <Link href={`/tracks/${track.id}`} className="group/link flex-1 min-w-0 mr-2">
            <h3 className="font-semibold text-sm text-slate-900 leading-snug line-clamp-1 group-hover/link:text-indigo-600 transition-colors">
              {track.name}
            </h3>
            <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-2 leading-normal">
              {track.description || "No description provided."}
            </p>
          </Link>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
              stale ? "badge-stale" : "badge-active"
            }`}>
              {stale ? "Stale" : "Active"}
            </span>
            <button
              onClick={handleDeleteClick}
              className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-600 p-0.5 transition-all"
              title="Delete Track"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 my-2.5 py-1.5 px-2.5 bg-slate-50 rounded-lg border border-slate-100">
          {/* Streak */}
          <div className="flex items-center gap-1.5">
            <span className={`text-sm ${hasStreak ? "flame-icon" : ""}`}>
              {hasStreak ? "🔥" : "💤"}
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-none">{track.currentStreak}</p>
              <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">streak</p>
            </div>
          </div>

          <div className="w-px h-5 bg-slate-200" />

          {/* Best streak */}
          <div>
            <p className="text-xs font-semibold text-slate-700 leading-none">{track.longestStreak}</p>
            <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">best</p>
          </div>
        </div>

        {/* Last active */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-3">
          <Clock className="w-3 h-3 shrink-0" />
          <span>
            {track.lastActivityAt
              ? formatDistanceToNow(parseISO(track.lastActivityAt), { addSuffix: true })
              : "Never active"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5 mt-auto pt-2 border-t border-slate-100">
          <Button
            size="sm"
            className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-[11px] h-7 px-2 border border-indigo-200/60 shadow-none transition-all"
            onClick={() => onCheckIn(track.id)}
          >
            <CheckCircle2 className="w-3 h-3 mr-1 text-indigo-600" />
            Check In
          </Button>
          <Link href={`/tracks/${track.id}`}>
            <Button size="sm" variant="ghost" className="h-7 px-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100">
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Track?"
        description={`Are you sure you want to delete track "${track.name}"? Your activity history and EXP will be safely preserved.`}
        isPending={isDeleting}
      />
    </>
  );
}
