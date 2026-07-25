"use client";

import { useUserProfile, useUserBadges, useAllBadges } from "../hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Flame, Award, Star, User as UserIcon, Shield, CheckCircle2, Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format, parseISO } from "date-fns";

// Level formula: Min EXP for Level N = N * (N - 1) * 50
function getLevelExpRange(level: number) {
  const currentLevelMinExp = level * (level - 1) * 50;
  const nextLevelMinExp = (level + 1) * level * 50;
  return { currentLevelMinExp, nextLevelMinExp };
}

export function ProfileView() {
  const { data: user, isLoading: userLoading, isError: userError } = useUserProfile();
  const { data: userBadges, isLoading: userBadgesLoading } = useUserBadges();
  const { data: allBadges } = useAllBadges();

  if (userLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-44 w-full rounded-xl bg-slate-100" />
        <Skeleton className="h-64 w-full rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (userError || !user) {
    return (
      <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertTitle className="font-semibold">Error</AlertTitle>
        <AlertDescription className="text-xs">Failed to load user profile.</AlertDescription>
      </Alert>
    );
  }

  const { currentLevelMinExp, nextLevelMinExp } = getLevelExpRange(user.level);
  const expInCurrentLevel = user.totalExp - currentLevelMinExp;
  const expNeededForNextLevel = nextLevelMinExp - currentLevelMinExp;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((expInCurrentLevel / expNeededForNextLevel) * 100))
  );

  const earnedBadgeIds = new Set(userBadges?.map((b) => b.badgeId) || []);

  return (
    <div className="space-y-6 fade-up">
      {/* Profile Summary Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0">
            {user.displayName?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{user.displayName}</h1>
              <span className="text-xs text-slate-400 font-medium">@{user.username}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>

            {/* Level Progress Bar */}
            <div className="mt-4 max-w-md">
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-indigo-600 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 fill-indigo-100" /> Level {user.level}
                </span>
                <span className="text-slate-500 text-[11px]">
                  {user.totalExp} / {nextLevelMinExp} EXP ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Badges */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-600" /> Level
            </span>
            <span className="text-lg font-bold text-slate-900 mt-1">{user.level}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Total EXP
            </span>
            <span className="text-lg font-bold text-slate-900 mt-1">{user.totalExp}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-400" /> Global Streak
            </span>
            <span className="text-lg font-bold text-slate-900 mt-1">{user.globalStreak} d</span>
          </div>
        </div>
      </div>

      {/* Achievements / Badges Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" /> Achievements & Badges
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Badges earned through consistent check-ins and streaks
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
            {userBadges?.length || 0} Earned
          </span>
        </div>

        {userBadgesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Show earned badges */}
            {userBadges?.map((ub) => (
              <div
                key={ub.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 shadow-xs"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg shrink-0 shadow-sm">
                  {ub.iconUrl || "🏆"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{ub.badgeName}</h4>
                    <span className="text-[10px] text-indigo-600 font-semibold">+{ub.expReward} EXP</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Earned {format(parseISO(ub.earnedAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            ))}

            {/* Show system badges that are not yet earned (locked) */}
            {allBadges
              ?.filter((b) => !earnedBadgeIds.has(b.id))
              .map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/60 opacity-60"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-lg shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-slate-700 truncate">{badge.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{badge.description || "Locked badge"}</p>
                  </div>
                </div>
              ))}

            {(!userBadges || userBadges.length === 0) && (!allBadges || allBadges.length === 0) && (
              <p className="text-xs text-slate-400 italic py-4 col-span-3 text-center">
                No badges available yet. Keep checking in to earn achievements!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
