"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLocaleContext } from "@/components/I18nProvider";

// ────────────────────────────────────────────
// Tour Event Types
// ────────────────────────────────────────────
type TourEvent =
  | "OPEN_CREATE_DIALOG"
  | "TRACK_CREATED"
  | "ENTERED_TRACK_DETAILS"
  | "OPEN_CONCEPT_DIALOG"
  | "CONCEPT_CREATED"
  | "OPEN_CHECKIN_DIALOG"
  | "CHECKIN_COMPLETED";

interface TourStepConfig {
  selector: string;
  title: string;
  description: string;
  side: "top" | "bottom" | "left" | "right";
}

interface ContinuousTourContextType {
  activeStep: number;
  isTourActive: boolean;
  startTour: () => void;
  stopTour: () => void;
  notifyEvent: (event: TourEvent) => void;
}

const ContinuousTourContext = createContext<ContinuousTourContextType>({
  activeStep: -1,
  isTourActive: false,
  startTour: () => {},
  stopTour: () => {},
  notifyEvent: () => {},
});

export const useContinuousTour = () => useContext(ContinuousTourContext);

// ────────────────────────────────────────────
// Pure CSS Spotlight Overlay Component
// ────────────────────────────────────────────
function SpotlightOverlay({
  step,
  onDismiss,
}: {
  step: TourStepConfig;
  onDismiss: () => void;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const findElement = () => {
      const el = document.querySelector(step.selector);
      if (el) {
        setRect(el.getBoundingClientRect());
        // Scroll element into view if needed
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return true;
      }
      return false;
    };

    // Try immediately, then retry a few times
    if (!findElement()) {
      const timer = setTimeout(findElement, 300);
      const timer2 = setTimeout(findElement, 600);
      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
      };
    }
  }, [step.selector]);

  // Update position on scroll/resize
  useEffect(() => {
    if (!rect) return;

    const update = () => {
      const el = document.querySelector(step.selector);
      if (el) setRect(el.getBoundingClientRect());
    };

    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [rect, step.selector]);

  if (!rect) return null;

  const PAD = 8;
  const cutout = {
    top: rect.top - PAD,
    left: rect.left - PAD,
    width: rect.width + PAD * 2,
    height: rect.height + PAD * 2,
  };

  // Calculate popover position
  let popoverStyle: React.CSSProperties = {};
  switch (step.side) {
    case "bottom":
      popoverStyle = {
        top: cutout.top + cutout.height + 12,
        left: Math.max(12, Math.min(cutout.left, window.innerWidth - 340)),
      };
      break;
    case "top":
      popoverStyle = {
        bottom: window.innerHeight - cutout.top + 12,
        left: Math.max(12, Math.min(cutout.left, window.innerWidth - 340)),
      };
      break;
    case "left":
      popoverStyle = {
        top: cutout.top,
        right: window.innerWidth - cutout.left + 12,
      };
      break;
    case "right":
      popoverStyle = {
        top: cutout.top,
        left: cutout.left + cutout.width + 12,
      };
      break;
  }

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-auto">
      {/* Dark overlay with cutout hole */}
      <div
        className="fixed rounded-lg pointer-events-none z-[99999]"
        style={{
          top: cutout.top,
          left: cutout.left,
          width: cutout.width,
          height: cutout.height,
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.55)",
        }}
      />

      {/* Clickable overlay area (dismiss on click outside) */}
      <div onClick={onDismiss} className="fixed inset-0 z-[99998] cursor-pointer" />

      {/* Target element click-through zone */}
      <div
        onClick={onDismiss}
        className="fixed z-[100000] cursor-pointer rounded-lg"
        style={{
          top: cutout.top,
          left: cutout.left,
          width: cutout.width,
          height: cutout.height,
        }}
      />

      {/* Popover tooltip */}
      <div
        ref={popoverRef}
        onClick={(e) => e.stopPropagation()}
        className="fixed z-[100001] max-w-80 min-w-64 animate-in fade-in slide-in-from-bottom-1 duration-300"
        style={popoverStyle}
      >
        <div className="bg-white rounded-xl px-5 py-4 shadow-2xl border border-indigo-500/20">
          <h3 className="mb-1.5 text-[15px] font-bold text-slate-900 leading-snug">
            {step.title}
          </h3>
          <p className="mb-3.5 text-[13px] text-slate-500 leading-relaxed">
            {step.description}
          </p>
          <div className="flex justify-end">
            <button
              onClick={onDismiss}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-1.5 text-xs font-semibold cursor-pointer transition-colors"
            >
              Đã hiểu ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// ContinuousTourProvider
// ────────────────────────────────────────────
export function ContinuousTourProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale } = useLocaleContext();
  const isVi = locale === "vi";

  const stepRef = useRef<number>(-1);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  // When a modal is open, spotlight should be hidden but tour stays active
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(true);

  // Restore tour state from localStorage on mount
  useEffect(() => {
    try {
      const savedStep = localStorage.getItem("multitrack_continuous_step");
      if (savedStep !== null) {
        const stepNum = parseInt(savedStep, 10);
        if (stepNum >= 0 && stepNum < 6) {
          stepRef.current = stepNum;
          setActiveStep(stepNum);
          setIsTourActive(true);
          setIsOverlayVisible(true);
        }
      }
    } catch (e) {}
  }, []);

  const saveStep = useCallback((step: number) => {
    stepRef.current = step;
    setActiveStep(step);
    if (step < 0 || step >= 6) {
      try {
        localStorage.removeItem("multitrack_continuous_step");
        localStorage.setItem("multitrack_continuous_completed", "true");
      } catch (e) {}
      setIsTourActive(false);
      setIsOverlayVisible(false);
    } else {
      try {
        localStorage.setItem("multitrack_continuous_step", step.toString());
      } catch (e) {}
      setIsTourActive(true);
      setIsOverlayVisible(true);
    }
  }, []);

  const startTour = useCallback(() => {
    saveStep(0);
  }, [saveStep]);

  const stopTour = useCallback(() => {
    saveStep(-1);
  }, [saveStep]);

  const notifyEvent = useCallback((event: TourEvent) => {
    const current = stepRef.current;
    switch (event) {
      case "OPEN_CREATE_DIALOG":
        // Hide overlay while user types in Create Track modal
        if (current === 0) {
          saveStep(1);
          setIsOverlayVisible(false);
        }
        break;
      case "TRACK_CREATED":
        // Track created -> show Track Card highlight
        saveStep(2);
        break;
      case "ENTERED_TRACK_DETAILS":
        // Entered track details -> show Add Concept highlight
        if (current === 2 || current === 1) saveStep(3);
        break;
      case "OPEN_CONCEPT_DIALOG":
        // Hide overlay while user types in Concept modal
        setIsOverlayVisible(false);
        break;
      case "CONCEPT_CREATED":
        // Concept created -> show Check-In highlight
        saveStep(4);
        break;
      case "OPEN_CHECKIN_DIALOG":
        // Hide overlay while user types in Check-in modal
        setIsOverlayVisible(false);
        break;
      case "CHECKIN_COMPLETED":
        // Check-in done -> show Gaps highlight
        saveStep(5);
        break;
    }
  }, [saveStep]);

  // Build step config
  const getStepConfig = (): TourStepConfig | null => {
    switch (activeStep) {
      case 0:
        return {
          selector: "#tour-create-track-btn",
          title: isVi ? "Bước 1: Bấm Nút Tạo Lộ Trình 📌" : "Step 1: Click Create Track 📌",
          description: isVi
            ? "BẤM VÀO NÚT NÀY để bắt đầu tạo Lộ trình học tập đầu tiên của bạn!"
            : "CLICK THIS BUTTON to start creating your first learning track!",
          side: "bottom",
        };
      case 2:
        return {
          selector: "#tour-track-card",
          title: isVi ? "Bước 2: Mở Trang Chi Tiết 🎴" : "Step 2: Open Track Details 🎴",
          description: isVi
            ? "Tuyệt vời! Lộ trình đã tạo thành công. BẤM VÀO TÊN LỘ TRÌNH để mở trang Chi tiết!"
            : "Awesome! Track created. CLICK THE TRACK NAME to open details!",
          side: "bottom",
        };
      case 3:
        return {
          selector: "#tour-add-concept-btn",
          title: isVi ? "Bước 3: Thêm Khái Niệm Bài Học 💡" : "Step 3: Add Concepts 💡",
          description: isVi
            ? "BẤM NÚT '+ THÊM KHÁI NIỆM' ở đây để chia nhỏ lộ trình thành từng chủ đề!"
            : "CLICK '+ ADD CONCEPT' here to break down your track into topics!",
          side: "bottom",
        };
      case 4:
        return {
          selector: "#tour-checkin-now-btn",
          title: isVi ? "Bước 4: Điểm Danh Feynman 🧠" : "Step 4: Daily Feynman Check-in 🧠",
          description: isVi
            ? "BẤM NÚT 'CHECK-IN NOW' để giải thích bài học đơn giản, nhận +150 EXP & giữ Streak 🔥!"
            : "CLICK 'CHECK-IN NOW' to explain simply, earn +150 EXP & protect your Streak 🔥!",
          side: "bottom",
        };
      case 5:
        return {
          selector: "#tour-gaps-btn",
          title: isVi ? "Bước 5: Xem Lỗ Hổng Kiến Thức 🎯" : "Step 5: View Knowledge Gaps 🎯",
          description: isVi
            ? "Những chỗ bị vấp sẽ lưu thành Lỗ hổng. Bấm vào đây để xem lại và ôn tập!"
            : "Flagged stumbles are saved as Gaps. Click here to review them!",
          side: "left",
        };
      default:
        return null;
    }
  };

  const stepConfig = getStepConfig();
  const shouldShowOverlay = isTourActive && isOverlayVisible && stepConfig !== null;

  const handleDismiss = () => {
    setIsOverlayVisible(false);
  };

  return (
    <ContinuousTourContext.Provider
      value={{ activeStep, isTourActive, startTour, stopTour, notifyEvent }}
    >
      {children}
      {shouldShowOverlay && (
        <SpotlightOverlay step={stepConfig} onDismiss={handleDismiss} />
      )}
    </ContinuousTourContext.Provider>
  );
}
