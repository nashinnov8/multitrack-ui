"use client";

import { useTrack, useDeleteTrack } from "../hooks";
import { useMilestones, useUpdateMilestone, useDeleteMilestone } from "@/features/milestones/hooks";
import { useConcepts, useUpdateConcept, useDeleteConcept } from "@/features/concepts/hooks";
import { ConceptStatus } from "@/features/concepts/schema";
import { CreateMilestoneDialog } from "@/features/milestones/components/CreateMilestoneDialog";
import { CreateConceptDialog } from "@/features/concepts/components/CreateConceptDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { ActivityTimeline } from "./ActivityTimeline";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, Circle, ArrowLeft, Trash2, BookOpen, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { useContinuousTour } from "@/components/ContinuousTourProvider";
import { CheckInDialog } from "./CheckInDialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function TrackDetailView({ trackId }: { trackId: string }) {
  const router = useRouter();
  const { notifyEvent } = useContinuousTour();
  const { data: track, isLoading: trackLoading, isError: trackError } = useTrack(trackId);
  const { mutate: deleteTrack, isPending: isDeletingTrack } = useDeleteTrack();

  useEffect(() => {
    notifyEvent("ENTERED_TRACK_DETAILS");
  }, []);
  
  // Milestones hooks
  const { data: milestonesData, isLoading: milestonesLoading } = useMilestones(trackId);
  const { mutate: updateMilestone } = useUpdateMilestone(trackId);
  const { mutate: deleteMilestone } = useDeleteMilestone(trackId);

  // Concepts hooks
  const { data: conceptsData, isLoading: conceptsLoading } = useConcepts(trackId);
  const { mutate: updateConcept } = useUpdateConcept(trackId);
  const { mutate: deleteConcept } = useDeleteConcept(trackId);
  
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [showDeleteTrackConfirm, setShowDeleteTrackConfirm] = useState(false);

  const handleConfirmDeleteTrack = () => {
    deleteTrack(trackId, {
      onSuccess: () => router.push("/"),
    });
  };

  if (trackLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-xl bg-slate-100" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-xl bg-slate-100" />
          <Skeleton className="h-64 w-full rounded-xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (trackError || !track) {
    return (
      <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertTitle className="font-semibold">Error</AlertTitle>
        <AlertDescription className="text-xs">Failed to load track details.</AlertDescription>
      </Alert>
    );
  }

  const milestones = milestonesData || [];
  const concepts = conceptsData || [];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link href="/" className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
        </Link>
      </div>

      {/* Header Info Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{track.name}</h1>
            <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">{track.description || "No description provided."}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button id="tour-checkin-now-btn" onClick={() => setIsCheckInOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs h-9 px-4 shadow-sm">
              Check-In Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteTrackConfirm(true)}
              className="border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs h-9 px-2.5"
              title="Delete Track"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-700">
            <span>🔥 Current Streak:</span>
            <span className="font-bold text-slate-900">{track.currentStreak}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-700">
            <span>⭐ Best Streak:</span>
            <span className="font-bold text-slate-900">{track.longestStreak}</span>
          </div>
          <Link id="tour-gaps-btn" href={`/tracks/${track.id}/gaps`} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline ml-auto">
            View Learning Gaps &rarr;
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milestones Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Milestones</h2>
              <p className="text-xs text-slate-400">Key achievements for this track</p>
            </div>
            <CreateMilestoneDialog trackId={track.id} />
          </div>
          
          {milestonesLoading ? (
            <div className="space-y-2.5">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full bg-slate-100 rounded-lg" />)}
            </div>
          ) : milestones.length === 0 ? (
            <div className="py-8 text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
              <p className="text-slate-400 italic text-xs">No milestones created yet.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {milestones.map((milestone) => (
                <li key={milestone.id} className="flex items-start justify-between p-3 bg-slate-50/50 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100 group">
                  <div className="flex items-start space-x-3 min-w-0 flex-1 pr-2">
                    <button 
                      onClick={() => updateMilestone({
                        milestoneId: milestone.id,
                        data: {
                          name: milestone.name,
                          description: milestone.description || "",
                          isCompleted: !milestone.isCompleted
                        }
                      })}
                      className="mt-0.5 text-slate-400 hover:text-indigo-600 focus:outline-none transition-colors"
                    >
                      {milestone.isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${milestone.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {milestone.name}
                      </p>
                      {milestone.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{milestone.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMilestone(milestone.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-600 p-1 transition-all"
                    title="Delete Milestone"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Concepts Section */}
        <div id="tour-concepts-section" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Concepts</h2>
              <p className="text-xs text-slate-400">Core topics & knowledge items</p>
            </div>
            <div id="tour-add-concept-btn">
              <CreateConceptDialog trackId={track.id} />
            </div>
          </div>
          
          {conceptsLoading ? (
            <div className="space-y-2.5">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full bg-slate-100 rounded-lg" />)}
            </div>
          ) : concepts.length === 0 ? (
            <div className="py-8 text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
              <p className="text-slate-400 italic text-xs">No concepts added yet.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {concepts.map((concept) => (
                <li key={concept.id} className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100 group">
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1 pr-2">
                    <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="text-sm font-medium text-slate-900 truncate">
                      {concept.name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <select
                      value={concept.status}
                      onChange={(e) => updateConcept({
                        conceptId: concept.id,
                        data: {
                          name: concept.name,
                          status: e.target.value as ConceptStatus,
                        }
                      })}
                      className="text-[11px] font-medium bg-white border border-slate-200 rounded px-2 py-0.5 text-slate-700 cursor-pointer focus:outline-none focus:border-indigo-500"
                    >
                      <option value="NOT_UNDERSTOOD">Not Understood ❌</option>
                      <option value="EXPLAINED_WITH_GAPS">Gaps ⚠️</option>
                      <option value="MASTERED">Mastered ✅</option>
                    </select>

                    <button
                      onClick={() => deleteConcept(concept.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-600 p-1 transition-all"
                      title="Delete Concept"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent Activity Timeline Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" /> Recent Activity Timeline
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              History of daily check-ins, notes, and Feynman technique logs
            </p>
          </div>
        </div>

        <ActivityTimeline trackId={track.id} />
      </div>

      <CheckInDialog 
        trackId={track.id}
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
      />

      <DeleteConfirmDialog
        isOpen={showDeleteTrackConfirm}
        onClose={() => setShowDeleteTrackConfirm(false)}
        onConfirm={handleConfirmDeleteTrack}
        title="Delete Track?"
        description={`Are you sure you want to delete track "${track.name}"? Your activity history and EXP will be safely preserved.`}
        isPending={isDeletingTrack}
      />
    </div>
  );
}
