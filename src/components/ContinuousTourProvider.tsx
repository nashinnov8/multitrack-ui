"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useLocaleContext } from "@/components/I18nProvider";
import { driver, Driver } from "driver.js";

type TourEvent =
  | "OPEN_CREATE_DIALOG"
  | "TRACK_CREATED"
  | "ENTERED_TRACK_DETAILS"
  | "CONCEPT_CREATED"
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
    }
    saveStep(-1);
  };

  // Render driver spotlight based on current activeStep and pathname
  const renderCurrentStep = useCallback(() => {
    if (activeStep < 0 || activeStep >= 6) {
      if (driverInstance) driverInstance.destroy();
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
          ? "Hãy bắt đầu bằng cách BẤM VÀO NÚT NÀY để tạo Lộ trình học tập đầu tiên của bạn!"
          : "Start by CLICKING THIS BUTTON to create your first learning track!";
        side = "bottom";
        align = "end";
        break;

      case 1: // Step 2: Inside Create Track Dialog
        targetElement = "#tour-modal-submit-btn";
        title = isVi ? "Bước 2: Điền Tên & Bấm Tạo ✍️" : "Step 2: Enter Name & Submit ✍️";
        description = isVi
          ? "Nhập tên mục tiêu (VD: IELTS 8.0, System Design) và BẤM NÚT 'TẠO TRACK' ở đây!"
          : "Enter a goal title (e.g. IELTS 8.0) and CLICK 'CREATE TRACK' here!";
        side = "top";
        align = "end";
        break;

      case 2: // Step 3: Highlight new Track Card on Dashboard
        targetElement = "#tour-track-card";
        title = isVi ? "Bước 3: Mở Trang Chi Tiết 🎴" : "Step 3: Open Track Details 🎴";
        description = isVi
          ? "Tuyệt vời! Bạn vừa tạo Lộ trình thành công. BẤM VÀO TÊN LỘ TRÌNH để mở trang Chi tiết!"
          : "Awesome! Track created. CLICK THE TRACK NAME to open details!";
        side = "top";
        align = "start";
        break;

      case 3: // Step 4: Inside Track Details -> Add Concept / Milestone
        targetElement = "#tour-add-concept-btn";
        title = isVi ? "Bước 4: Thêm Khái Niệm Bài Học 💡" : "Step 4: Add Concepts 💡";
        description = isVi
          ? "BẤM NÚT '+ THÊM KHÁI NIỆM' ở đây để chia nhỏ bài học của bạn!"
          : "CLICK '+ ADD CONCEPT' here to break down your track into specific topics!";
        side = "bottom";
        align = "start";
        break;

      case 4: // Step 5: Inside Track Details -> Check In Now
        targetElement = "#tour-checkin-now-btn";
        title = isVi ? "Bước 5: Điểm Danh Feynman Hàng Ngày 🧠" : "Step 5: Daily Feynman Check-in 🧠";
        description = isVi
          ? "BẤM NÚT 'CHECK-IN NOW' ở đây để giải thích bài học đơn giản, nhận +150 EXP & giữ Streak 🔥!"
          : "CLICK 'CHECK-IN NOW' here to explain your topic simply, earn +150 EXP & protect your Streak 🔥!";
        side = "bottom";
        align = "end";
        break;

      case 5: // Step 6: View Knowledge Gaps
        targetElement = "#tour-gaps-btn";
        title = isVi ? "Bước 6: Xem Lỗ Hổng Kiến Thức (Gaps) 🎯" : "Step 6: View Knowledge Gaps 🎯";
        description = isVi
          ? "Những chỗ bị vấp sẽ lưu thành Lỗ hổng (Gaps). Bấm vào đây để xem lại và ôn tập lấp đầy!"
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
        doneBtnText: isVi ? "Hoàn thành Tour 🎯" : "Finish Tour 🎯",
        nextBtnText: isVi ? "Bỏ qua tour" : "Skip tour",
        prevBtnText: isVi ? "Thoát" : "Close",
        onDestroyed: () => {},
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
    switch (event) {
      case "OPEN_CREATE_DIALOG":
        if (activeStep === 0) saveStep(1);
        break;

      case "TRACK_CREATED":
        if (activeStep === 1 || activeStep === 0) saveStep(2);
        break;

      case "ENTERED_TRACK_DETAILS":
        if (activeStep === 2) saveStep(3);
        break;

      case "CONCEPT_CREATED":
        if (activeStep === 3) saveStep(4);
        break;

      case "CHECKIN_COMPLETED":
        if (activeStep === 4) saveStep(5);
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
