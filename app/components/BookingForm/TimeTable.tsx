/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/app/lib/db";
import { nylas } from "@/app/lib/nylas";
import {
  addMinutes,
  format,
  fromUnixTime,
  isAfter,
  parse,
} from "date-fns";
import Link from "next/link";
import { GetFreeBusyResponse, NylasResponse } from "nylas";

// TODO understand this

interface TimeTableProps {
  selectedDate: string;
  username: string;
}

function calculateAvailableTimeSlots(
  date: string,
  dbAvailability: {
    fromTime: string | undefined;
    tillTime: string | undefined;
  },
  nylasData: NylasResponse<GetFreeBusyResponse[]>,
  duration: number
) {
  console.log("=== DEBUGGING TIME SLOTS ===");
  const now = new Date();
  const selectedDate = new Date(date);
  const isToday = format(selectedDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");

  console.log("1. INPUT DATA:");
  console.log("   - Date:", date);
  console.log("   - From time:", dbAvailability.fromTime);
  console.log("   - Till time:", dbAvailability.tillTime);
  console.log("   - Duration (minutes):", duration);
  console.log("   - Is today:", isToday);
  console.log("   - Current time:", format(now, "HH:mm"));

  if (!dbAvailability.fromTime || !dbAvailability.tillTime) {
    console.log("ERROR: Missing time data!");
    return [];
  }

  const availableFrom = parse(
    `${date} ${dbAvailability.fromTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  const availableTill = parse(
    `${date} ${dbAvailability.tillTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );

  console.log("2. PARSED TIMES:");
  console.log("   - Available from:", format(availableFrom, "yyyy-MM-dd HH:mm"));
  console.log("   - Available till:", format(availableTill, "yyyy-MM-dd HH:mm"));

  const busySlots = nylasData.data[0] && 'timeSlots' in nylasData.data[0] 
    ? nylasData.data[0].timeSlots.map((slot: any) => ({
        start: fromUnixTime(slot.startTime),
        end: fromUnixTime(slot.endTime),
      }))
    : [];

  console.log("3. BUSY SLOTS:");
  console.log("   - Count:", busySlots.length);
  busySlots.forEach((slot, i) => {
    console.log(`   - Busy ${i + 1}: ${format(slot.start, "HH:mm")} - ${format(slot.end, "HH:mm")}`);
  });

  console.log("4. GENERATING ALL SLOTS:");
  const allSlots = [];
  let currentSlot = availableFrom;
  let slotCount = 0;
  
  // Simplified loop - generate slots until we can't fit another duration
  while (addMinutes(currentSlot, duration).getTime() <= availableTill.getTime()) {
    allSlots.push(currentSlot);
    console.log(`   - Slot ${slotCount + 1}: ${format(currentSlot, "HH:mm")} - ${format(addMinutes(currentSlot, duration), "HH:mm")}`);
    currentSlot = addMinutes(currentSlot, duration);
    slotCount++;
    
    // Safety check to prevent infinite loops
    if (slotCount > 50) {
      console.log("   - BREAKING: Too many slots generated (safety check)");
      break;
    }
  }

  console.log("5. ALL GENERATED SLOTS:");
  console.log("   - Total count:", allSlots.length);
  console.log("   - Slots:", allSlots.map((slot) => format(slot, "HH:mm")).join(", "));

  console.log("6. FILTERING SLOTS:");
  const freeSlots = allSlots.filter((slot, index) => {
    const slotEnd = addMinutes(slot, duration);
    const slotTimeString = format(slot, "HH:mm");

    console.log(`   - Checking slot ${index + 1}: ${slotTimeString}`);

    // Only filter by current time if it's today
    const isFutureSlot = isToday ? isAfter(slot, now) : true;
    console.log(`     * Is future slot: ${isFutureSlot} (isToday: ${isToday})`);
    
    if (isToday && !isFutureSlot) {
      console.log(`     * REJECTED: Past time (current: ${format(now, "HH:mm")})`);
      return false;
    }

    const isNotBusy = !busySlots.some((busy: { start: any; end: any }) => {
      const hasOverlap = slot < busy.end && slotEnd > busy.start;
      if (hasOverlap) {
        console.log(`     * CONFLICT with busy slot: ${format(busy.start, "HH:mm")} - ${format(busy.end, "HH:mm")}`);
      }
      return hasOverlap;
    });
    
    console.log(`     * Is not busy: ${isNotBusy}`);

    const isAccepted = isFutureSlot && isNotBusy;
    console.log(`     * RESULT: ${isAccepted ? "ACCEPTED" : "REJECTED"}`);
    
    return isAccepted;
  });

  console.log("7. FINAL RESULT:");
  console.log("   - Free slots count:", freeSlots.length);
  console.log("   - Free slots:", freeSlots.map((slot) => format(slot, "HH:mm")).join(", "));
  console.log("=== END DEBUGGING ===");

  return freeSlots.map((slot) => format(slot, "HH:mm"));
}

async function getData(username: string, selectedDate: Date) {
  const currentDay = format(selectedDate, "EEEE");

  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const data = await prisma.availability.findFirst({
    where: {
      day: currentDay as Prisma.EnumDayFilter,
      User: {
        userName: username,
      },
    },
    select: {
      formTime: true,
      tillTime: true,
      id: true,
      User: {
        select: {
          grantEmail: true,
          grantId: true,
        },
      },
    },
  });

  let nylasCalendarData: NylasResponse<GetFreeBusyResponse[]>;

  if (data?.User?.grantId && data?.User?.grantEmail) {
    nylasCalendarData = await nylas.calendars.getFreeBusy({
      identifier: data.User.grantId as string,
      requestBody: {
        startTime: Math.floor(startOfDay.getTime() / 1000),
        endTime: Math.floor(endOfDay.getTime() / 1000),
        emails: [data.User.grantEmail as string],
      },
    });
  } else {
    // Create a mock response when no Nylas integration
    nylasCalendarData = {
      data: [
        {
          email: "mock@example.com",
          object: "free_busy" as const,
          timeSlots: [],
        },
      ],
      requestId: "mock",
    } as NylasResponse<GetFreeBusyResponse[]>;
  }

  return {
    data,
    nylasCalendarData,
  };
}

export async function TimeTable({ selectedDate, username }: TimeTableProps) {
  const { data, nylasCalendarData } = await getData(
    username,
    new Date(selectedDate)
  );

  if (!data) {
    return (
      <div>
        <p className="text-base font-semibold">
          {format(new Date(selectedDate), "PPPP")}
        </p>
        <div className="mt-3">
          <p>No availability configured for this day</p>
        </div>
      </div>
    );
  }

  const formattedDate = format(new Date(selectedDate), "yyyy-MM-dd");
  const dbAvailability = {
    fromTime: data.formTime,
    tillTime: data.tillTime,
  };

  const availableTimeSlots = calculateAvailableTimeSlots(
    formattedDate,
    dbAvailability,
    nylasCalendarData,
    30 // assuming a fixed duration of 30 minutes for simplicity
  );

  return (
    <div>
      <p className="text-base font-semibold">{format(selectedDate, "PPPP")}</p>
      <div className="mt-3 max-h-[300px] overflow-y-auto">
        {availableTimeSlots.length > 0 ? (
          availableTimeSlots.map((slot, index) => (
            <Link
              key={index}
              href="/"
              className="block p-2 mb-2 border rounded hover:bg-primary/10"
            >
              {slot}
            </Link>
          ))
        ) : (
          <p>No time slots available for this date</p>
        )}
      </div>
    </div>
  );
}
