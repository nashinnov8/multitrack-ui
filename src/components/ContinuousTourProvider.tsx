"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useLocaleContext } from "@/components/I18nProvider";
import { driver, Driver } from "driver.js";

type TourEvent =
  | "OPEN_CREATE_DIALOG"
  | "TRACK_CREATED"
  | "ENTERED_TRACK_DETAILS"
  | "OPEN_CONCEPT_DIALOG"
  | "CONCEPT_CREATED"
  | "OPEN_CHECKIN_DIALOG"
  | "CHECKIN_COMPLETED";

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

export function ContinuousTourProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale } = useLocaleContext();
  const isVi = locale === "vi";

  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [driverInstance, setDriverInstance] = useState<Driver | null>(null);

  // Restore tour state from localStorage on mount
  useEffect(() => {
    try {
      const savedStep = localStorage.getItem("multitrack_continuous_step");
      if (savedStep !== null && savedStep !== undefined) {
        const stepNum = parseInt(savedStep, 10);
        if (stepNum >= 0 && stepNum < 6) {
          setActiveStep(stepNum);
          setIsTourActive(true);
        }
      }
    } catch (e) {}
  }, []);

  const saveStep = (step: number) => {
    setActiveStep(step);
    try {
      if (step < 0 || step >= 6) {
        localStorage.removeItem("multitrack_continuous_step");
        localStorage.setItem("multitrack_continuous_completed", "true");
        setIsTourActive(false);
      } else {
        localStorage.setItem("multitrack_continuous_step", step.toString());
        setIsTourActive(true);
      }
    } catch (e) {}
  };

  const startTour = () => {
    saveStep(0);
  };

  const stopTour = () => {
    if (driverInstance) {
      driverInstance.destroy();
      setDriverInstance(null);
    }
    saveStep(-1);
  };

  // Render driver spotlight based on current activeStep and pathname
  const renderCurrentStep = useCallback(() => {
    if (activeStep < 0 || activeStep >= 6) {
      if (driverInstance) {
        driverInstance.destroy();
        setDriverInstance(null);
      }
      return;
    }

    let targetElement = "";
    let title = "";
    let description = "";
    let side: "top" | "bottom" | "left" | "right" = "bottom";
    let align: "start" | "center" | "end" = "center";

    switch (activeStep) {
      case 0: // Step 1: Dashboard + Create Track Button
        targetElement = "#tour-create-track-btn";
        title = isVi ? "Bước 1: Bấm Nút Tạo Lộ Trình 📌" : "Step 1: Click Create Track 📌";
        description = isVi
          ? "BẤM VÀO NÚT NÀY để bắt đầu tạo Lộ trình học tập đầu tiên của bạn!"
          : "CLICK THIS BUTTON to start creating your first learning track!";
        side = "bottom";
        align = "end";
        break;

      case 1: // Step 2: Waiting for track creation (Overlay hidden for typing)
        return;

      case 2: // Step 3: Highlight new Track Card on Dashboard
        targetElement = "#tour-track-card";
        title = isVi ? "Bước 2: Mở Trang Chi Tiết 🎴" : "Step 2: Open Track Details 🎴";
        description = isVi
          ? "Tuyệt vời! Lộ trình đã tạo thành công. BẤM VÀO TÊN LỘ TRÌNH để mở trang Chi tiết!"
          : "Awesome! Track created. CLICK THE TRACK NAME to open details!";
        side = "top";
        align = "start";
        break;

      case 3: // Step 4: Inside Track Details -> Add Concept Button
        targetElement = "#tour-add-concept-btn";
        title = isVi ? "Bước 3: Thêm Khái Niệm Bài Học 💡" : "Step 3: Add Concepts 💡";
        description = isVi
          ? "BẤM NÚT '+ THÊM KHÁI NIỆM' ở đây để chia nhỏ lộ trình thành từng chủ đề!"
          : "CLICK '+ ADD CONCEPT' here to break down your track into topics!";
        side = "bottom";
        align = "start";
        break;

      case 4: // Step 5: Inside Track Details -> Check In Now
        targetElement = "#tour-checkin-now-btn";
        title = isVi ? "Bước 4: Điểm Danh Feynman Hàng Ngày 🧠" : "Step 4: Daily Feynman Check-in 🧠";
        description = isVi
          ? "BẤM NÚT 'CHECK-IN NOW' ở đây để giải thích bài học đơn giản, nhận +150 EXP & giữ Streak 🔥!"
          : "CLICK 'CHECK-IN NOW' here to explain your topic simply, earn +150 EXP & protect your Streak 🔥!";
        side = "bottom";
        align = "end";
        break;

      case 5: // Step 6: View Knowledge Gaps
        targetElement = "#tour-gaps-btn";
        title = isVi ? "Bước 5: Xem Lỗ Hổng Kiến Thức (Gaps) 🎯" : "Step 5: View Knowledge Gaps 🎯";
        description = isVi
          ? "Những chỗ giải thích bị vấp sẽ lưu thành Lỗ hổng (Gaps). Bấm vào đây để xem lại và ôn tập lấp đầy!"
          : "Flagged stumbles are saved as Gaps. Click here to review and resolve them!";
        side = "left";
        align = "center";
        break;

      default:
        return;
    }

    // Wait 400ms for DOM elements to stabilize on screen/navigation
    const timer = setTimeout(() => {
      const el = document.querySelector(targetElement);
      if (!el) return;

      const d = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        doneBtnText: isVi ? "Hoàn thành 🎯" : "Done 🎯",
        nextBtnText: isVi ? "Bỏ qua tour" : "Skip tour",
        prevBtnText: isVi ? "Thoát" : "Close",
        onDestroyed: () => {
          setDriverInstance(null);
        },
        steps: [
          {
            element: targetElement,
            popover: {
              title,
              description,
              side,
              align,
            },
          },
        ],
      });

      // Destroy driver overlay immediately when user clicks the highlighted element
      const destroyOnClick = () => {
        d.destroy();
        setDriverInstance(null);
      };
      el.addEventListener("click", destroyOnClick, { once: true });

      d.drive();
      setDriverInstance(d);
    }, 400);

    return () => clearTimeout(timer);
  }, [activeStep, pathname, isVi]);

  useEffect(() => {
    renderCurrentStep();
  }, [renderCurrentStep]);

  // Event listener callback when user completes specific actions
  const notifyEvent = (event: TourEvent) => {
    // Immediately destroy current driver overlay so user has 100% unblocked modal/input access
    if (driverInstance) {
      driverInstance.destroy();
      setDriverInstance(null);
    }

    switch (event) {
      case "OPEN_CREATE_DIALOG":
        // Temporarily hide spotlight while user types in modal
        if (activeStep === 0) saveStep(1);
        break;

      case "TRACK_CREATED":
        // Track created -> advance to Step 2 (Highlight new Track Card)
        saveStep(2);
        break;

      case "ENTERED_TRACK_DETAILS":
        // User entered track details page -> advance to Step 3 (Highlight + Add Concept)
        if (activeStep === 2 || activeStep === 1) saveStep(3);
        break;

      case "OPEN_CONCEPT_DIALOG":
        // User opened concept modal -> temporarily hide spotlight for typing
        break;

      case "CONCEPT_CREATED":
        // Concept created -> advance to Step 4 (Highlight Check-In Now button)
        saveStep(4);
        break;

      case "OPEN_CHECKIN_DIALOG":
        // User opened check-in modal -> temporarily hide spotlight for typing
        break;

      case "CHECKIN_COMPLETED":
        // Check-in completed -> advance to Step 5 (Highlight View Learning Gaps)
        saveStep(5);
        break;
    }
  };

  return (
    <ContinuousTourContext.Provider
      value={{
        activeStep,
        isTourActive,
        startTour,
        stopTour,
        notifyEvent,
      }}
    >
      {children}
    </ContinuousTourContext.Provider>
  );
}
