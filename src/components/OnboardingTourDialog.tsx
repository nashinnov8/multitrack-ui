"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, Target, Brain, Flame, ChevronRight, ChevronLeft, Check } from "lucide-react";

interface OnboardingTourDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingTourDialog({ open, onOpenChange }: OnboardingTourDialogProps) {
  const t = useTranslations("tour");
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Rocket,
      color: "from-indigo-500 to-purple-600",
      title: t("step1Title"),
      desc: t("step1Desc"),
      badge: "Multitrack Overview",
    },
    {
      icon: Target,
      color: "from-blue-500 to-indigo-600",
      title: t("step2Title"),
      desc: t("step2Desc"),
      badge: "Goal Setting",
    },
    {
      icon: Brain,
      color: "from-purple-500 to-pink-600",
      title: t("step3Title"),
      desc: t("step3Desc"),
      badge: "Feynman Method",
    },
    {
      icon: Flame,
      color: "from-amber-500 to-orange-600",
      title: t("step4Title"),
      desc: t("step4Desc"),
      badge: "Habit Gamification",
    },
  ];

  const stepCount = steps.length;
  const isLastStep = currentStep === stepCount - 1;

  const handleFinish = () => {
    try {
      localStorage.setItem("multitrack_tour_completed", "true");
    } catch (e) {}
    onOpenChange(false);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (isLastStep) {
      handleFinish();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const current = steps[currentStep];
  const StepIcon = current.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-slate-200 sm:max-w-[480px] p-0 overflow-hidden rounded-2xl shadow-xl">
        {/* Header Hero Banner */}
        <div className={`relative h-44 bg-gradient-to-br ${current.color} flex items-center justify-center p-6 text-white transition-all duration-300`}>
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
          
          {/* Top Step Counter Badge */}
          <div className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30">
            {t("stepCounter", { current: currentStep + 1, total: stepCount })}
          </div>

          {/* Skip Button */}
          <button
            onClick={handleFinish}
            className="absolute top-4 right-4 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 px-2.5 py-1 rounded-full transition-colors"
          >
            {t("skip")}
          </button>

          {/* Central Icon Illustration */}
          <div className="relative z-10 w-20 h-20 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center shadow-lg animate-pulse">
            <StepIcon className="w-10 h-10 text-white drop-shadow-md" />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-slate-900 leading-snug">
              {current.title}
            </DialogTitle>
          </DialogHeader>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            {current.desc}
          </p>

          {/* Progress Indicators & Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {/* Step Dots */}
            <div className="flex items-center space-x-1.5">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentStep ? "w-6 bg-indigo-600" : "w-2 bg-slate-200 hover:bg-slate-300"
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next / Back / Finish Buttons */}
            <div className="flex items-center space-x-2">
              {currentStep > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBack}
                  className="h-8 px-3 border-slate-200 text-slate-700 hover:bg-slate-50 text-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> {t("back")}
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleNext}
                className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition-all"
              >
                {isLastStep ? (
                  <>
                    {t("getStarted")} <Check className="w-3.5 h-3.5 ml-1" />
                  </>
                ) : (
                  <>
                    {t("next")} <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
