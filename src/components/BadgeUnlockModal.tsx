"use client";

import React, { useEffect, useState, useRef } from "react";
import { useUserBadges } from "@/features/user/hooks";
import { useContinuousTour } from "@/components/ContinuousTourProvider";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Share2, CheckCircle2 } from "lucide-react";
import { UserBadgeResponse } from "@/features/user/schema";

export function BadgeUnlockModal() {
  const { data: userBadges } = useUserBadges();
  const { pauseTour, resumeTour } = useContinuousTour();
  const knownBadgeIdsRef = useRef<Set<string> | null>(null);
  const [unlockedBadge, setUnlockedBadge] = useState<UserBadgeResponse | null>(null);

  useEffect(() => {
    if (!userBadges) return;

    // On initial page load, populate known badge IDs without showing popup
    if (knownBadgeIdsRef.current === null) {
      knownBadgeIdsRef.current = new Set(userBadges.map((b) => b.id));
      return;
    }

    // Find any newly added badge
    const newBadge = userBadges.find((b) => !knownBadgeIdsRef.current?.has(b.id));

    if (newBadge) {
      // Update known badge IDs
      knownBadgeIdsRef.current.add(newBadge.id);
      // Trigger popup modal & pause background tour overlay
      setUnlockedBadge(newBadge);
      pauseTour();
    }
  }, [userBadges, pauseTour]);

  if (!unlockedBadge) return null;

  const handleClose = () => {
    setUnlockedBadge(null);
    resumeTour();
  };

  const handleShareFb = () => {
    const shareUrl = encodeURIComponent("https://multitrack-ui-xi.vercel.app");
    const shareQuote = encodeURIComponent(
      `🏆 I just unlocked the "${unlockedBadge.badgeName}" badge on Multitrack! (+${unlockedBadge.expReward} EXP)`
    );
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareQuote}`,
      "_blank",
      "width=600,height=400"
    );
  };

  return (
    <Dialog open={!!unlockedBadge} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-white border-slate-200 sm:max-w-[420px] p-0 overflow-hidden rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Animated Celebration Hero Banner */}
        <div className="relative h-44 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
          {/* Subtle Background Pattern Particles */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

          {/* Top Badge Tag */}
          <div className="absolute top-4 inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30 shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
            Badge Unlocked!
          </div>

          {/* Large Badge Icon with Pulse Effect */}
          <div className="relative z-10 w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/40 backdrop-blur-md flex items-center justify-center text-4xl shadow-xl mt-4 animate-bounce">
            {unlockedBadge.iconUrl || "🏆"}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 text-center space-y-4">
          <div>
            <span className="inline-block text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full mb-1">
              +{unlockedBadge.expReward} EXP REWARD
            </span>
            <DialogTitle className="text-xl font-black text-slate-900 leading-snug">
              {unlockedBadge.badgeName}
            </DialogTitle>
            <p className="text-slate-500 text-xs mt-1.5">
              Chúc mừng bạn đã xuất sắc mở khóa thành tựu mới này trong lộ trình học tập!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareFb}
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-semibold h-9 px-4"
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Chia sẻ FB
            </Button>

            <Button
              size="sm"
              onClick={handleClose}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 px-6 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Tuyệt vời! 🔥
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
