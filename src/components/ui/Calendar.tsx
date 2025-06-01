import React, { useState } from "react";
import { cn, calculateRentalDays } from "@/lib/utils/utils";

interface CalendarProps {
  className?: string;
  onDateSelect?: (date: Date) => void;
  onDateRangeSelect?: (startDate: Date | null, endDate: Date | null) => void;
  selectedDate?: Date;
  selectedRange?: { startDate: Date | null; endDate: Date | null };
  unavailableDates?: Date[];
  isDateUnavailable?: (date: Date) => boolean;
  mode?: "single" | "range";
}

export const Calendar: React.FC<CalendarProps> = ({
  className,
  onDateSelect,
  onDateRangeSelect,
  selectedDate,
  selectedRange,
  unavailableDates = [],
  isDateUnavailable,
  mode = "single",
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [internalSelectedRange, setInternalSelectedRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isRangeValid = (startDate: Date, endDate: Date): boolean => {
    const currentDateCheck = new Date(startDate);
    while (currentDateCheck <= endDate) {
      if (isDateUnavailable && isDateUnavailable(currentDateCheck)) {
        return false;
      }
      // Check unavailable dates array
      const isInUnavailableArray = unavailableDates.some((unavailableDate) => {
        const unavailable = new Date(unavailableDate);
        unavailable.setHours(0, 0, 0, 0);
        const checkDate = new Date(currentDateCheck);
        checkDate.setHours(0, 0, 0, 0);
        return unavailable.getTime() === checkDate.getTime();
      });

      if (isInUnavailableArray) {
        return false;
      }

      currentDateCheck.setDate(currentDateCheck.getDate() + 1);
    }
    return true;
  };
  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    if (mode === "single") {
      onDateSelect?.(clickedDate);
    } else {
      // Range mode logic
      const currentRange = selectedRange || internalSelectedRange;

      if (
        !currentRange.startDate ||
        (currentRange.startDate && currentRange.endDate)
      ) {
        // Start new selection
        const newRange = { startDate: clickedDate, endDate: null };
        setInternalSelectedRange(newRange);
        onDateRangeSelect?.(newRange.startDate, newRange.endDate);
      } else if (currentRange.startDate && !currentRange.endDate) {
        // Complete the range
        if (clickedDate >= currentRange.startDate) {
          // Check if there are any unavailable dates in the range
          if (isRangeValid(currentRange.startDate, clickedDate)) {
            const newRange = {
              startDate: currentRange.startDate,
              endDate: clickedDate,
            };
            setInternalSelectedRange(newRange);
            onDateRangeSelect?.(newRange.startDate, newRange.endDate);
          } else {
            // Invalid range, start new selection
            const newRange = { startDate: clickedDate, endDate: null };
            setInternalSelectedRange(newRange);
            onDateRangeSelect?.(newRange.startDate, newRange.endDate);
          }
        } else {
          // Clicked date is before start date, start new selection
          const newRange = { startDate: clickedDate, endDate: null };
          setInternalSelectedRange(newRange);
          onDateRangeSelect?.(newRange.startDate, newRange.endDate);
        }
      }
    }
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };
  const isSelected = (day: number) => {
    if (mode === "single") {
      if (!selectedDate) return false;
      return (
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear()
      );
    } else {
      // Range mode
      const range = selectedRange || internalSelectedRange;
      if (!range.startDate) return false;

      // Check if this day is the start date
      if (
        range.startDate.getDate() === day &&
        range.startDate.getMonth() === currentDate.getMonth() &&
        range.startDate.getFullYear() === currentDate.getFullYear()
      ) {
        return true;
      }

      // Check if this day is the end date
      if (
        range.endDate &&
        range.endDate.getDate() === day &&
        range.endDate.getMonth() === currentDate.getMonth() &&
        range.endDate.getFullYear() === currentDate.getFullYear()
      ) {
        return true;
      }

      return false;
    }
  };
  const isInRange = (day: number) => {
    if (mode !== "range") return false;

    const range = selectedRange || internalSelectedRange;
    if (!range.startDate || !range.endDate) return false;

    const dayDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    return dayDate > range.startDate && dayDate < range.endDate;
  };
  const isPastDate = (day: number) => {
    const today = new Date();
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    today.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck < today;
  };

  const isUnavailable = (day: number) => {
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    // Use the provided function if available
    if (isDateUnavailable) {
      return isDateUnavailable(dateToCheck);
    }

    // Fallback to checking unavailable dates array
    return unavailableDates.some((unavailableDate) => {
      const unavailable = new Date(unavailableDate);
      unavailable.setHours(0, 0, 0, 0);
      dateToCheck.setHours(0, 0, 0, 0);
      return unavailable.getTime() === dateToCheck.getTime();
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div
      className={cn(
        "glass rounded-3xl p-6 shadow-2xl border-2 border-primary-200",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth("prev")}
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 flex items-center justify-center transition-all duration-200 active:scale-95"
        >
          <svg
            className="w-5 h-5 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h3 className="text-xl font-bold gradient-text">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>

        <button
          onClick={() => navigateMonth("next")}
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 flex items-center justify-center transition-all duration-200 active:scale-95"
        >
          <svg
            className="w-5 h-5 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {dayNames.map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-sm font-semibold text-secondary-600"
          >
            {day}
          </div>
        ))}
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="h-10" />
        ))}{" "}
        {/* Days of the month */}
        {daysArray.map((day) => {
          const isSelectedDay = isSelected(day);
          const isInRangeDay = isInRange(day);
          const isTodayDay = isToday(day);
          const isPast = isPastDate(day);
          const isUnavailableDay = isUnavailable(day);
          const isDisabled = isPast || isUnavailableDay;

          return (
            <button
              key={day}
              onClick={() => !isDisabled && handleDateClick(day)}
              disabled={isDisabled}
              className={cn(
                "h-10 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95",
                "hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                {
                  // Today's date
                  "bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 font-bold border-2 border-primary-300":
                    isTodayDay &&
                    !isSelectedDay &&
                    !isInRangeDay &&
                    !isDisabled,

                  // Selected date (start/end of range or single date)
                  "btn-gradient text-white shadow-lg":
                    isSelectedDay && !isDisabled,

                  // In range dates
                  "bg-primary-100 text-primary-700 font-medium":
                    isInRangeDay && !isDisabled,

                  // Unavailable dates (disabled with red background)
                  "bg-red-100 text-red-400 cursor-not-allowed hover:bg-red-100 relative":
                    isUnavailableDay,

                  // Past dates (disabled)
                  "text-secondary-300 cursor-not-allowed hover:bg-transparent":
                    isPast && !isUnavailableDay,

                  // Regular dates
                  "text-secondary-700 hover:text-primary-600":
                    !isTodayDay &&
                    !isSelectedDay &&
                    !isInRangeDay &&
                    !isDisabled,
                }
              )}
            >
              {day}
              {isUnavailableDay && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>{" "}
      {/* Footer info and selected dates */}
      <div className="mt-4 pt-4 border-t border-primary-200">
        {mode === "range" && (
          <div className="mb-4">
            {(() => {
              const range = selectedRange || internalSelectedRange;
              if (range.startDate && range.endDate) {
                return (
                  <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-4">
                    <h4 className="text-sm font-semibold text-secondary-800 mb-2">
                      Fechas Seleccionadas
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary-600">
                          Inicio:
                        </span>
                        <span className="text-sm font-medium text-secondary-800">
                          {range.startDate.toLocaleDateString("es-CO", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary-600">Fin:</span>
                        <span className="text-sm font-medium text-secondary-800">
                          {range.endDate.toLocaleDateString("es-CO", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-primary-200">
                        {" "}
                        <span className="text-sm text-secondary-600">
                          Duración:
                        </span>
                        <span className="text-sm font-bold text-primary-600">
                          {calculateRentalDays(range.startDate, range.endDate)}{" "}
                          día(s)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              } else if (range.startDate) {
                return (
                  <div className="bg-gradient-to-r from-accent-50 to-primary-50 rounded-2xl p-4">
                    <h4 className="text-sm font-semibold text-secondary-800 mb-2">
                      Fecha de Inicio Seleccionada
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">
                        Inicio:
                      </span>
                      <span className="text-sm font-medium text-secondary-800">
                        {range.startDate.toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-secondary-500 mt-2">
                      Selecciona la fecha de fin del alquiler
                    </p>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
        <p className="text-xs text-secondary-500 text-center">
          {mode === "range"
            ? "Selecciona las fechas de inicio y fin del alquiler"
            : "Selecciona una fecha"}
        </p>
      </div>
    </div>
  );
};
