"use client";

import { useActivityLogs } from "../hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MessageSquare, BookOpen, Lightbulb, AlertTriangle, Tag, CheckCircle2 } from "lucide-react";

export function ActivityTimeline({ trackId }: { trackId: string }) {
  const [page, setPage] = useState(0);
  const size = 5;
  const { data, isLoading, isError } = useActivityLogs(trackId, page, size);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg bg-slate-100" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-xs text-red-500 italic py-2">
        Failed to load activity timeline.
      </p>
    );
  }

  const logs = data?.content || [];

  if (logs.length === 0) {
    return (
      <div className="py-8 text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
        <p className="text-slate-400 italic text-xs">No check-ins logged yet.</p>
        <p className="text-slate-400 text-[11px] mt-1">Click "Check-In Now" above to record your first entry!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timeline List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {logs.map((log) => (
          <div key={log.id} className="relative group">
            {/* Timeline Node Icon */}
            <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white ring-2 ring-indigo-100 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            {/* Log Content Card */}
            <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200/70 space-y-2">
              {/* Header: Date + EXP */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  {format(parseISO(log.createdAt), "MMM d, yyyy · h:mm a")}
                </span>
                <span className="text-[10px] font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded-full">
                  +{log.expEarned} EXP
                </span>
              </div>

              {/* Related Concept Badge */}
              {log.concept && (
                <div className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  <Tag className="w-3 h-3 text-indigo-500" />
                  <span>{log.concept.name}</span>
                </div>
              )}

              {/* Note */}
              {log.note && (
                <div className="flex items-start gap-1.5 text-xs text-slate-800">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{log.note}</p>
                </div>
              )}

              {/* What Learned */}
              {log.whatLearned && (
                <div className="flex items-start gap-1.5 text-xs text-slate-700 pt-1 border-t border-slate-200/50">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Learned: </span>
                    <span>{log.whatLearned}</span>
                  </div>
                </div>
              )}

              {/* Explain Simply (Feynman) */}
              {log.explainSimply && (
                <div className="flex items-start gap-1.5 text-xs text-slate-600 italic bg-amber-50/50 p-2 rounded border border-amber-100">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5 not-italic" />
                  <span>"{log.explainSimply}"</span>
                </div>
              )}

              {/* Gaps Found */}
              {log.gapsFound && (
                <div className="flex items-start gap-1.5 text-xs text-amber-800 bg-amber-50/80 p-2 rounded border border-amber-200/60">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Gap: </span>
                    <span>{log.gapsFound}</span>
                  </div>
                </div>
              )}
            </div>
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
            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] h-7 px-2.5"
          >
            <ChevronLeft className="w-3 h-3 mr-0.5" /> Prev
          </Button>
          <span className="text-[11px] text-slate-500 font-medium px-1">
            {page + 1} / {data?.totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={data?.isLast}
            onClick={() => setPage((p) => p + 1)}
            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] h-7 px-2.5"
          >
            Next <ChevronRight className="w-3 h-3 ml-0.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
