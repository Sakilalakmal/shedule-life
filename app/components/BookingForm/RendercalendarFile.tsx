"use client";

import { today, getLocalTimeZone } from "@internationalized/date";
import { Calender } from "./Calender";

export function RenderCalender() {
  return <Calender minValue={today(getLocalTimeZone())} />;
}
