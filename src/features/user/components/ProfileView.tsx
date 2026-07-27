"use client";

import { useUserProfile, useUserBadges, useAllBadges } from "../hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Flame, Award, Star, User as UserIcon, Shield, CheckCircle2, Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format, parseISO } from "date-fns";
import { useTranslations } from "next-intl";

// Level formula: Min EXP for Level N = N * (N - 1) * 50
function getLevelExpRange(level: number) {
  const currentLevelMinExp = level * (level - 1) * 50;
  const nextLevelMinExp = (level + 1) * level * 50;
  return { currentLevelMinExp, nextLevelMinExp };
}

export function ProfileView() {
  const t = useTranslations("profile");
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900">{user.displayName}</h1>
                  <span className="text-xs text-slate-400 font-medium">@{user.username}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
              </div>

              {/* Social Share Streak Button */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const shareUrl = encodeURIComponent("https://multitrack-ui-xi.vercel.app");
                    const shareQuote = encodeURIComponent(`🔥 I am on a ${user.globalStreak}-day learning streak on Multitrack! Master skills with the Feynman Technique.`);
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareQuote}`, "_blank", "width=600,height=400");
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors"
                  title="Share to Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  {t("shareFb")}
                </button>

                <button
                  onClick={() => {
                    const text = encodeURIComponent(`🔥 I am on a ${user.globalStreak}-day learning streak on Multitrack! Master skills with the Feynman Technique.\n\nhttps://multitrack-ui-xi.vercel.app`);
                    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "width=600,height=400");
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white font-medium text-xs shadow-xs transition-colors"
                  title="Share to X / Twitter"
                >
                  <span className="font-extrabold text-[11px]">𝕏</span>
                  {t("shareX")}
                </button>
              </div>
            </div>

            {/* Level Progress Bar */}
            <div className="mt-4 max-w-md">
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-indigo-600 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 fill-indigo-100" /> {t("level")} {user.level}
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
              <Shield className="w-3.5 h-3.5 text-indigo-600" /> {t("level")}
            </span>
            <span className="text-lg font-bold text-slate-900 mt-1">{user.level}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> {t("totalExp")}
            </span>
            <span className="text-lg font-bold text-slate-900 mt-1">{user.totalExp}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-400" /> {t("globalStreak")}
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
              <Award className="w-4 h-4 text-indigo-600" /> {t("achievements")}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t("achievementsSubtitle")}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
            {userBadges?.length || 0} {t("earned")}
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
                className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 shadow-xs hover:border-indigo-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
                  {ub.iconUrl || "🏆"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{ub.badgeName}</h4>
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-100/80 px-1.5 py-0.5 rounded">
                      +{ub.expReward} EXP
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {t("earned")} {format(parseISO(ub.earnedAt), "MMM d, yyyy")}
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
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 opacity-65 hover:opacity-90 transition-opacity relative group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-200/80 text-slate-500 flex items-center justify-center text-xl shrink-0 relative overflow-hidden">
                    <span className="grayscale opacity-50">{badge.iconUrl || "🏆"}</span>
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-white drop-shadow-sm" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-semibold text-slate-800 truncate">{badge.name}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">+{badge.expReward} EXP</span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{badge.description || "Locked badge"}</p>
                  </div>
                </div>
              ))}

            {(!userBadges || userBadges.length === 0) && (!allBadges || allBadges.length === 0) && (
              <p className="text-xs text-slate-400 italic py-4 col-span-3 text-center">
                {t("noBadges")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
