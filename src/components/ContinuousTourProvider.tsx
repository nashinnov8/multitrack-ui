"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
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

  // Use ref for driver so notifyEvent always has access to the latest instance
  const driverRef = useRef<Driver | null>(null);
  const stepRef = useRef<number>(-1);

  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);

  // Restore tour state from localStorage on mount
  useEffect(() => {
    try {
      const savedStep = localStorage.getItem("multitrack_continuous_step");
      if (savedStep !== null && savedStep !== undefined) {
        const stepNum = parseInt(savedStep, 10);
        if (stepNum >= 0 && stepNum < 6) {
          stepRef.current = stepNum;
          setActiveStep(stepNum);
          setIsTourActive(true);
        }
      }
    } catch (e) {}
  }, []);

  // Helper: destroy any existing driver overlay immediately
  const destroyCurrentDriver = () => {
    if (driverRef.current) {
      try { driverRef.current.destroy(); } catch (e) {}
      driverRef.current = null;
    }
  };

  const saveStep = (step: number) => {
    destroyCurrentDriver();
    stepRef.current = step;
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

  const startTour = useCallback(() => {
    saveStep(0);
  }, []);

  const stopTour = useCallback(() => {
    destroyCurrentDriver();
    saveStep(-1);
  }, []);

  // Render driver spotlight based on current activeStep and pathname
  useEffect(() => {
    // Always destroy previous driver first
    destroyCurrentDriver();

    if (activeStep < 0 || activeStep >= 6) return;

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

      case 1: // Waiting for track creation — NO overlay shown
        return;

      case 2: // Step 2: Highlight new Track Card on Dashboard
        targetElement = "#tour-track-card";
        title = isVi ? "Bước 2: Mở Trang Chi Tiết 🎴" : "Step 2: Open Track Details 🎴";
        description = isVi
          ? "Tuyệt vời! Lộ trình đã tạo thành công. BẤM VÀO TÊN LỘ TRÌNH để mở trang Chi tiết!"
          : "Awesome! Track created. CLICK THE TRACK NAME to open details!";
        side = "top";
        align = "start";
        break;

      case 3: // Step 3: Inside Track Details -> Add Concept Button
        targetElement = "#tour-add-concept-btn";
        title = isVi ? "Bước 3: Thêm Khái Niệm Bài Học 💡" : "Step 3: Add Concepts 💡";
        description = isVi
          ? "BẤM NÚT '+ THÊM KHÁI NIỆM' ở đây để chia nhỏ lộ trình thành từng chủ đề!"
          : "CLICK '+ ADD CONCEPT' here to break down your track into topics!";
        side = "bottom";
        align = "start";
        break;

      case 4: // Step 4: Inside Track Details -> Check In Now
        targetElement = "#tour-checkin-now-btn";
        title = isVi ? "Bước 4: Điểm Danh Feynman Hàng Ngày 🧠" : "Step 4: Daily Feynman Check-in 🧠";
        description = isVi
          ? "BẤM NÚT 'CHECK-IN NOW' ở đây để giải thích bài học đơn giản, nhận +150 EXP & giữ Streak 🔥!"
          : "CLICK 'CHECK-IN NOW' here to explain your topic simply, earn +150 EXP & protect your Streak 🔥!";
        side = "bottom";
        align = "end";
        break;

      case 5: // Step 5: View Knowledge Gaps
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

    // Wait for DOM to stabilize after navigation/render
    const timer = setTimeout(() => {
      const el = document.querySelector(targetElement);
      if (!el) return;

      const d = driver({
        showProgress: false,
        animate: true,
        allowClose: true,
        doneBtnText: isVi ? "Đã hiểu ✓" : "Got it ✓",
        nextBtnText: isVi ? "Bỏ qua" : "Skip",
        prevBtnText: isVi ? "Đóng" : "Close",
        onDestroyed: () => {
          driverRef.current = null;
        },
        steps: [
          {
            element: targetElement,
            popover: { title, description, side, align },
          },
        ],
      });

      // When user clicks the highlighted element, destroy overlay immediately
      el.addEventListener("click", () => {
        destroyCurrentDriver();
      }, { once: true });

      driverRef.current = d;
      d.drive();
    }, 500);

    return () => clearTimeout(timer);
  }, [activeStep, pathname, isVi]);

  // Event listener — uses refs so it always has the latest driver/step
  const notifyEvent = useCallback((event: TourEvent) => {
    // Always destroy any existing overlay first
    destroyCurrentDriver();

    const current = stepRef.current;

    switch (event) {
      case "OPEN_CREATE_DIALOG":
        if (current === 0) saveStep(1); // hide overlay, wait for user to type
        break;

      case "TRACK_CREATED":
        if (current === 0 || current === 1) saveStep(2); // show Track Card highlight
        break;

      case "ENTERED_TRACK_DETAILS":
        if (current === 2 || current === 1) saveStep(3); // show Add Concept highlight
        break;

      case "OPEN_CONCEPT_DIALOG":
        // hide overlay while user types in concept modal
        break;

      case "CONCEPT_CREATED":
        if (current === 3) saveStep(4); // show Check-In highlight
        break;

      case "OPEN_CHECKIN_DIALOG":
        // hide overlay while user types in check-in modal
        break;

      case "CHECKIN_COMPLETED":
        if (current === 4) saveStep(5); // show Gaps highlight
        break;
    }
  }, []);

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
