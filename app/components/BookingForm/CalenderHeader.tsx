/* eslint-disable @typescript-eslint/no-explicit-any */
import { DOMAttributes } from "react";
import { type CalendarState } from "react-stately";
import { useDateFormatter, type AriaButtonProps } from "react-aria";
import { VisuallyHidden } from "react-aria";
import { CalendarButton } from "./CalendarButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarHeader({
  state,
  calendarProps,
  prevButtonProps,
  nextButtonProps,
  title,
}: {
  state: CalendarState;
  calendarProps: DOMAttributes<HTMLDivElement>;
  prevButtonProps: AriaButtonProps<"button">;
  nextButtonProps: AriaButtonProps<"button">;
  title: string;
}) {
  const monthDateFormatter = useDateFormatter({
    month: "short",
    year: "numeric",
    timeZone: state.timeZone,
  });

  const [monthName, _, year] = monthDateFormatter
    .formatToParts(state.visibleRange.start.toDate(state.timeZone))
    .map((part) => part.value);

  return (
    <div className="flex items-center pb-4">
      <VisuallyHidden>
        <h2>{(calendarProps as any)["aria-label"]}</h2>
      </VisuallyHidden>

      <h2 className="font-semibold flex-1">
        {monthName}{" "}
        <span className="text-muted-foreground text-sm font-medium">
          {year}
        </span>
      </h2>

      <div className="flex items-center gap-2">
        <CalendarButton {...prevButtonProps}>
          <ChevronLeft className="size-4" />
        </CalendarButton>
        <CalendarButton {...nextButtonProps}>
          <ChevronRight className="size-4" />
        </CalendarButton>
      </div>
    </div>
  );
}
