"use client";

import React, { useMemo } from "react";
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth } from "date-fns";
import { ActivityHeatmapDayResponse } from "../schema";
import { Calendar, Flame } from "lucide-react";
import { useTranslations } from "next-intl";

interface ContributionHeatmapProps {
  data?: ActivityHeatmapDayResponse[];
  isLoading?: boolean;
}

export function ContributionHeatmap({ data = [], isLoading = false }: ContributionHeatmapProps) {
  const t = useTranslations("profile");

  // Map API response date string ("YYYY-MM-DD") to count
  const countsMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((item) => {
      map.set(item.date, item.count);
    });
    return map;
  }, [data]);

  // Calculate 365 days ending today, aligned to full weeks (Sunday to Saturday)
  const { weeks, monthLabels, totalCheckIns } = useMemo(() => {
    const today = new Date();
    const startDate = subDays(today, 364);

    // Align start to beginning of week (Sunday)
    const gridStart = startOfWeek(startDate, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(today, { weekStartsOn: 0 });

    const allDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

    let total = 0;
    const weekColumns: { date: Date; dateStr: string; count: number }[][] = [];
    let currentWeek: { date: Date; dateStr: string; count: number }[] = [];

    allDays.forEach((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const count = countsMap.get(dateStr) || 0;
      total += count;

      currentWeek.push({ date: day, dateStr, count });

      if (currentWeek.length === 7) {
        weekColumns.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weekColumns.push(currentWeek);
    }

    // Generate Month Labels
    const labels: { name: string; index: number }[] = [];
    let lastMonth = -1;

    weekColumns.forEach((week, weekIndex) => {
      const firstDayOfWeek = week[0].date;
      const month = firstDayOfWeek.getMonth();

      if (month !== lastMonth) {
        labels.push({
          name: format(firstDayOfWeek, "MMM"),
          index: weekIndex,
        });
        lastMonth = month;
      }
    });

    return { weeks: weekColumns, monthLabels: labels, totalCheckIns: total };
  }, [countsMap]);

  // Get color intensity class based on check-in count
  const getColorClass = (count: number) => {
    if (count === 0) return "bg-slate-100/90 border border-slate-200/50";
    if (count === 1) return "bg-indigo-200 border border-indigo-300";
    if (count === 2) return "bg-indigo-400 border border-indigo-500";
    if (count === 3) return "bg-indigo-600 border border-indigo-700";
    return "bg-indigo-800 border border-indigo-900";
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            {t("heatmapTitle")}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("heatmapSubtitle", { count: totalCheckIns })}
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100 text-xs font-semibold text-indigo-700 self-start sm:self-auto">
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-400" />
          {totalCheckIns} {t("checkIns")}
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="min-w-[720px]">
          {/* Month Labels */}
          <div className="flex text-[10px] text-slate-400 font-medium mb-1.5 pl-6 relative h-4">
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="absolute"
                style={{ left: `${m.index * 13 + 24}px` }}
              >
                {m.name}
              </span>
            ))}
          </div>

          {/* Grid: Day Labels + Columns of Weeks */}
          <div className="flex gap-1 items-start">
            {/* Day of Week Labels */}
            <div className="flex flex-col justify-between text-[9px] text-slate-400 font-medium h-[86px] pr-1 pt-[1px]">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Weeks Matrix */}
            <div className="flex gap-[3px] flex-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day) => {
                    const formattedDate = format(day.date, "MMM d, yyyy");
                    const tooltipText = `${day.count} check-in${day.count !== 1 ? "s" : ""} on ${formattedDate}`;

                    return (
                      <div
                        key={day.dateStr}
                        title={tooltipText}
                        className={`w-2.5 h-2.5 rounded-[2px] transition-transform duration-150 hover:scale-125 cursor-pointer relative group ${getColorClass(day.count)}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Legend */}
          <div className="flex items-center justify-between mt-4 text-[11px] text-slate-400 pt-3 border-t border-slate-100">
            <span>365-day Activity Matrix</span>
            <div className="flex items-center gap-1.5">
              <span>{t("heatmapLess")}</span>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-100 border border-slate-200/50" title="0 check-ins" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-indigo-200 border border-indigo-300" title="1 check-in" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-indigo-400 border border-indigo-500" title="2 check-ins" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-indigo-600 border border-indigo-700" title="3 check-ins" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-indigo-800 border border-indigo-900" title="4+ check-ins" />
              <span>{t("heatmapMore")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
