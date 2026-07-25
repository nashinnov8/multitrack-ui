"use client";

import { useTrackGaps, useTrack } from "../hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { useState } from "react";

export function GapsView({ trackId }: { trackId: string }) {
  const [page, setPage] = useState(0);
  const size = 10;
  
  const { data: track, isLoading: trackLoading } = useTrack(trackId);
  const { data: gapsData, isLoading: gapsLoading, isError } = useTrackGaps(trackId, page, size);

  if (trackLoading || gapsLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl bg-slate-100" />)}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertTitle className="font-semibold">Error</AlertTitle>
        <AlertDescription className="text-xs">Failed to load gaps.</AlertDescription>
      </Alert>
    );
  }

  const logs = gapsData?.content || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Link href={`/tracks/${trackId}`} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Gaps Review</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Review knowledge gaps logged in <span className="font-semibold text-slate-800">{track?.name}</span>
          </p>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">No gaps found!</p>
          <p className="text-slate-400 text-xs mt-1">You haven't flagged any confusion points in your check-ins so far.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map(log => (
            <div key={log.id} className="bg-white p-5 rounded-xl border border-amber-200/80 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-medium text-slate-400">
                  {format(parseISO(log.createdAt), "MMM d, yyyy · h:mm a")}
                </span>
                {log.concept && (
                  <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                    {log.concept.name}
                  </span>
                )}
              </div>
              
              <div className="space-y-2.5">
                <div>
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Gap Found</h4>
                  <p className="text-sm text-slate-800 leading-relaxed">{log.gapsFound}</p>
                </div>
                
                {log.explainSimply && (
                  <div className="pt-2.5 border-t border-slate-100">
                    <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Context / Feynman Explanation</h4>
                    <p className="text-xs text-slate-600 italic">"{log.explainSimply}"</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {(gapsData?.totalPages ?? 0) > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button 
            size="sm"
            variant="outline"
            disabled={page === 0} 
            onClick={() => setPage(p => p - 1)}
            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 text-xs h-8 px-3"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
          </Button>
          <span className="text-xs text-slate-500 font-medium px-2">
            Page {page + 1} of {gapsData?.totalPages}
          </span>
          <Button 
            size="sm"
            variant="outline"
            disabled={gapsData?.isLast} 
            onClick={() => setPage(p => p + 1)}
            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 text-xs h-8 px-3"
          >
            Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
