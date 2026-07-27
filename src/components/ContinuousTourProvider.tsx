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
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        pointerEvents: "auto",
      }}
    >
      {/* Dark overlay with cutout hole using box-shadow */}
      <div
        style={{
          position: "fixed",
          top: cutout.top,
          left: cutout.left,
          width: cutout.width,
          height: cutout.height,
          borderRadius: 8,
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.55)",
          zIndex: 99999,
          pointerEvents: "none",
        }}
      />

      {/* Clickable overlay areas (dismiss on click outside target) */}
      <div
        onClick={onDismiss}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99998,
          cursor: "pointer",
        }}
      />

      {/* Make the target element clickable through the overlay */}
      <div
        onClick={onDismiss}
        style={{
          position: "fixed",
          top: cutout.top,
          left: cutout.left,
          width: cutout.width,
          height: cutout.height,
          zIndex: 100000,
          cursor: "pointer",
          borderRadius: 8,
        }}
      />

      {/* Popover tooltip */}
      <div
        ref={popoverRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          ...popoverStyle,
          zIndex: 100001,
          maxWidth: 320,
          minWidth: 260,
          animation: "tour-fade-in 0.25s ease-out",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: "16px 20px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
          }}
        >
          <h3
            style={{
              margin: "0 0 6px 0",
              fontSize: 15,
              fontWeight: 700,
              color: "#1e293b",
              lineHeight: 1.3,
            }}
          >
            {step.title}
          </h3>
          <p
            style={{
              margin: "0 0 14px 0",
              fontSize: 13,
              color: "#64748b",
              lineHeight: 1.5,
            }}
          >
            {step.description}
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={onDismiss}
              style={{
                background: "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "6px 16px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#4338ca")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#4f46e5")}
            >
              Đã hiểu ✓
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tour-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
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
