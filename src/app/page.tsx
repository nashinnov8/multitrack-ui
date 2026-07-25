"use client";

import { useEffect, useState } from "react";
import { tokenStorage } from "@/lib/token";
import { LandingView } from "@/features/landing/components/LandingView";
import { TrackList } from "@/features/tracks/components/TrackList";
import { CreateTrackDialog } from "@/features/tracks/components/CreateTrackDialog";
import { Layers, Loader2 } from "lucide-react";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAuthenticated(tokenStorage.hasToken());
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingView />;
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      {/* Dashboard Header */}
      <div className="fade-up flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-200/60 pb-4">
        <div>
          <div className="flex items-center space-x-1.5 mb-1">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Goal Tracker</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Dashboard</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Monitor learning tracks, keep streaks active, and log daily check-ins.
          </p>
        </div>
        <div className="fade-up fade-up-delay-1 shrink-0">
          <CreateTrackDialog />
        </div>
      </div>

      {/* Track Grid */}
      <div className="fade-up fade-up-delay-2">
        <TrackList />
      </div>
    </div>
  );
}
