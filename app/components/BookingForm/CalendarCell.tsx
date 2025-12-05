import { cn } from "@/lib/utils";
import {
  CalendarDate,
  getLocalTimeZone,
  isSameMonth,
  isToday,
} from "@internationalized/date";
import { useRef } from "react";
import { mergeProps, useCalendarCell, useFocusRing } from "react-aria";
import { CalendarState } from "react-stately";

export function CalendarCell({
  state,
  date,
  currentMonth,
}: {
  state: CalendarState;
  date: CalendarDate;
  currentMonth?: CalendarDate;
}) {
  let ref = useRef(null);

  let {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate,
  } = useCalendarCell({ date }, state, ref);

  const { focusProps, isFocusVisible } = useFocusRing();

  const isTodayDate = isToday(date, getLocalTimeZone());

  const isOutofMonth = !isSameMonth(currentMonth!, date);

  return (
    <td
      {...cellProps}
      className={`py-0.5 px-0.5 relative ${isFocusVisible ? "z-10" : "z-0"}`}
    >
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutofMonth}
        className={cn(
          "size-10 sm:size-12 outline-none group rounded-md flex items-center justify-center text-sm font-semibold transition-colors hover:bg-primary/10 hover:cursor-pointer",
          isSelected &&
            "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600",
          isDisabled && "opacity-50 cursor-not-allowed",
          isUnavailable && "text-gray-400 line-through",
          isOutsideVisibleRange && "text-gray-300"
        )}
      >
        {formattedDate}
        {isTodayDate && (
          <div
            className={cn(
              "absolute bottom-3 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500",
              isSelected && "bg-white"
            )}
          ></div>
        )}
      </div>
    </td>
  );
}
