"use client";

import { useLocale, useCalendar, CalendarProps, DateValue } from "react-aria";
import { useCalendarState } from "react-stately";
import { createCalendar } from "@internationalized/date";
import { CalendarHeader } from "./CalenderHeader";
import { CalendarGrid } from "./CalendarGrid";

export function Calender(
  props: CalendarProps<DateValue> & {
    isDataUnavailable?: (date: DateValue) => boolean;
  }
) {
  const { locale } = useLocale();
  const state = useCalendarState({
    ...props,
    visibleDuration: { months: 1 },
    locale,
    createCalendar,
  });

  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
    props,
    state
  );

  return (
    <div {...calendarProps} className="inline-block">
      <CalendarHeader
        calendarProps={calendarProps}
        state={state}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
        title={title}
      />

      <div className="flex gap-8">
        <CalendarGrid
          state={state}
          isDataUnavailable={props.isDataUnavailable}
        />
      </div>
    </div>
  );
}
