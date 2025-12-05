"use client";

import {
  today,
  getLocalTimeZone,
  parseDate,
  CalendarDate,
} from "@internationalized/date";
import { Calender } from "./Calender";
import { DateValue } from "react-aria";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface RenderCalenderProps {
  availability: {
    day: string;
    isActive: boolean;
  }[];
}

export function RenderCalender({ availability }: RenderCalenderProps) {
  const searchparams = useSearchParams();

  const router = useRouter();

  const [date, setDate] = useState(() => {
    const dateParam = searchparams.get("date");
    return dateParam ? parseDate(dateParam) : today(getLocalTimeZone());
  });

  const handleDateChange = (date: DateValue) => {
    setDate(date as CalendarDate);
    const url = new URL(window.location.href);
    url.searchParams.set("date", date.toString());
    router.push(url.toString());
  };

  const isdateUnavailable = (date: DateValue) => {
    const dayOfWeek = date.toDate(getLocalTimeZone()).getDay(); // 0 (Sunday) to 6 (Saturday)

    const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    return !availability[adjustedIndex]?.isActive;
  };
  return (
    <Calender
      minValue={today(getLocalTimeZone())}
      isDataUnavailable={isdateUnavailable}
      value={date}
      onChange={handleDateChange}
    />
  );
}
