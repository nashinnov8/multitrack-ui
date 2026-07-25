"use client";

import { useTracks } from "../hooks";
import { TrackCard } from "./TrackCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Target } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { CheckInDialog } from "./CheckInDialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";

export function TrackList() {
  const [page, setPage] = useState(0);
  const size = 12;
  const { data, isLoading, isError, error } = useTracks(page, size);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-52 w-full rounded-xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertTitle className="font-semibold">Failed to load tracks</AlertTitle>
        <AlertDescription className="text-red-700 text-xs mt-1">
          {/* @ts-ignore */}
          {error?.message || "Something went wrong. Please try again."}
        </AlertDescription>
      </Alert>
    );
  }

  const tracks = data?.content || [];

  if (tracks.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Target className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">No tracks found</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Start tracking your goals and skills by creating your first track above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks.map((track, i) => (
          <div key={track.id} className={`fade-up fade-up-delay-${Math.min(i + 1, 3)}`}>
            <TrackCard
              track={track}
              onCheckIn={(id) => setSelectedTrackId(id)}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {(data?.totalPages ?? 0) > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 text-xs h-8 px-3"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
          </Button>
          <span className="text-xs text-slate-500 font-medium px-2">
            Page {page + 1} of {data?.totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={data?.isLast}
            onClick={() => setPage((p) => p + 1)}
            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 text-xs h-8 px-3"
          >
            Next <ChevronRightIcon className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      )}

      <CheckInDialog
        trackId={selectedTrackId}
        isOpen={!!selectedTrackId}
        onClose={() => setSelectedTrackId(null)}
      />
    </div>
  );
}
