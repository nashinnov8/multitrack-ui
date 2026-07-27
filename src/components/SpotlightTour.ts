"use client";

import { driver } from "driver.js";

export function startSpotlightTour(locale: "en" | "vi" = "vi") {
  const isVi = locale === "vi";

  // Build steps array dynamically checking which elements exist on current page
  const steps = [];

  // Step 1: Create track button (Dashboard)
  if (document.querySelector("#tour-create-track-btn")) {
    steps.push({
      element: "#tour-create-track-btn",
      popover: {
        title: isVi ? "Bước 1: Tạo Lộ Trình Đầu Tiên 📌" : "Step 1: Create First Track 📌",
        description: isVi
          ? "Bấm nút '+ Tạo lộ trình mới' ở đây để khởi tạo mục tiêu học tập đầu tiên của bạn (Ví dụ: IELTS 8.0, System Design)!"
          : "Click '+ Create Track' here to start tracking your first learning goal (e.g. IELTS 8.0, System Design)!",
        side: "bottom" as const,
        align: "end" as const,
      },
    });
  }

  // Step 2: Track Card
  if (document.querySelector("#tour-track-card")) {
    steps.push({
      element: "#tour-track-card",
      popover: {
        title: isVi ? "Bước 2: Quản Lý Thẻ Track 🎴" : "Step 2: Manage Track Card 🎴",
        description: isVi
          ? "Mỗi lộ trình hiển thị thẻ riêng. Bấm vào tên Lộ trình để xem danh sách Cột mốc (Milestones) & Khái niệm (Concepts)!"
          : "Each goal displays its own card. Click the track name to view Milestones & Concepts!",
        side: "top" as const,
        align: "start" as const,
      },
    });
  }

  // Step 3: Check-in button
  if (document.querySelector("#tour-checkin-btn")) {
    steps.push({
      element: "#tour-checkin-btn",
      popover: {
        title: isVi ? "Bước 3: Điểm Danh Feynman Hàng Ngày 🧠" : "Step 3: Daily Feynman Check-in 🧠",
        description: isVi
          ? "Bấm nút 'Check In' mỗi ngày để giải thích bài học thật đơn giản như dạy đứa trẻ 12 tuổi, nhận +150 EXP & giữ Streak 🔥!"
          : "Click 'Check In' daily to explain topics simply as if teaching a child, earn +150 EXP & protect your Streak 🔥!",
        side: "top" as const,
        align: "center" as const,
      },
    });
  }

  // Step 4: Concepts section (if on Track details page)
  if (document.querySelector("#tour-concepts-section")) {
    steps.push({
      element: "#tour-concepts-section",
      popover: {
        title: isVi ? "Bước 4: Thêm Khái Niệm Bài Học 💡" : "Step 4: Add Concepts 💡",
        description: isVi
          ? "Chia nhỏ bài học thành các Khái niệm (Concepts) cụ thể để điểm danh và thực hành Kỹ thuật Feynman!"
          : "Break down your track into specific Concepts to perform Feynman check-ins!",
        side: "top" as const,
        align: "start" as const,
      },
    });
  }

  // Step 5: Gaps button (if on Track details page)
  if (document.querySelector("#tour-gaps-btn")) {
    steps.push({
      element: "#tour-gaps-btn",
      popover: {
        title: isVi ? "Bước 5: Xem Lỗ Hổng Kiến Thức (Gaps) 🎯" : "Step 5: View Knowledge Gaps 🎯",
        description: isVi
          ? "Những chỗ giải thích bị vấp sẽ được lưu thành Lỗ hổng (Gaps). Bấm vào đây để xem lại và ôn tập lấp đầy!"
          : "Flagged stumbles are saved as Knowledge Gaps. Click here to review and resolve them!",
        side: "left" as const,
        align: "center" as const,
      },
    });
  }

  if (steps.length === 0) return;

  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    doneBtnText: isVi ? "Hoàn thành 🎯" : "Done 🎯",
    nextBtnText: isVi ? "Tiếp theo →" : "Next →",
    prevBtnText: isVi ? "← Quay lại" : "← Back",
    onDestroyed: () => {
      try {
        localStorage.setItem("multitrack_spotlight_completed", "true");
      } catch (e) {}
    },
    steps,
  });

  driverObj.drive();
}
