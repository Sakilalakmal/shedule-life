/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  eventTypeSchema,
  onBoardingSchemaValidations,
  settingSchema,
} from "@/lib/zodSchemas";
import { prisma } from "../lib/db";
import { requiredAuthUser } from "../lib/hook";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nylas } from "../lib/nylas";

export async function OnBoardingAction(prevState: any, formData: FormData) {
  const user = await requiredAuthUser();

  const submission = await parseWithZod(formData, {
    schema: onBoardingSchemaValidations({
      async isUsernameUnique() {
        const existingUsername = await prisma.user.findUnique({
          where: {
            userName: formData.get("username") as string,
          },
        });

        return !existingUsername;
      },
    }),

    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { fullName, username } = submission.value;

  const data = await prisma.user.update({
    where: {
      id: user.user?.id,
    },
    data: {
      userName: username,
      name: fullName,
      availability: {
        createMany: {
          data: [
            {
              day: "Monday",
              formTime: "09:00",
              tillTime: "17:00",
            },
            {
              day: "Tuesday",
              formTime: "09:00",
              tillTime: "17:00",
            },
            {
              day: "Wednesday",
              formTime: "09:00",
              tillTime: "17:00",
            },
            {
              day: "Thursday",
              formTime: "09:00",
              tillTime: "17:00",
            },
            {
              day: "Friday",
              formTime: "09:00",
              tillTime: "17:00",
            },
            {
              day: "Saturday",
              formTime: "09:00",
              tillTime: "17:00",
            },
            {
              day: "Sunday",
              formTime: "09:00",
              tillTime: "17:00",
            },
          ],
        },
      },
    },
  });

  return redirect("/onboarding/grant-id");
}

export async function SettingsUpdateAction(prevState: any, formData: FormData) {
  const session = await requiredAuthUser();

  const submission = parseWithZod(formData, {
    schema: settingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const user = await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      name: submission.value.fullName,
      image: submission.value.profileImage,
    },
  });

  return redirect("/dashboard");
}

export async function updateAvailability(formData: FormData) {
  const session = await requiredAuthUser();

  const rawData = Object.fromEntries(formData.entries());

  const availabilityData = Object.keys(rawData)
    .filter((key) => key.startsWith("id-"))
    .map((key) => {
      const id = key.replace("id-", "");

      return {
        id,
        isActive: rawData[`isActive-${id}`] === "on" ? true : false,
        fromTime: rawData[`fromTime-${id}`] as string,
        tillTime: rawData[`tillTime-${id}`] as string,
      };
    });

  try {
    await prisma.$transaction(
      availabilityData.map((item) =>
        prisma.availability.update({
          where: {
            id: item.id,
          },
          data: {
            isActive: item.isActive,
            formTime: item.fromTime,
            tillTime: item.tillTime,
          },
        })
      )
    );

    revalidatePath("/dashboard/availability");
  } catch (error) {
    console.error("Failed to update availability:", error);
  }
}

export async function createEventType(prevState: any, formData: FormData) {
  const session = await requiredAuthUser();

  const submission = parseWithZod(formData, {
    schema: eventTypeSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.eventType.create({
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      videoCallSoftware: submission.value.videoCallSoftware,
      userId: session.user?.id as string,
      description: submission.value.description || "",
    },
  });

  return redirect("/dashboard");
}

export async function attendToMeeting(formData: FormData) {
  const getUserData = await prisma.user.findUnique({
    where: {
      userName: formData.get("username") as string,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  });

  if (!getUserData) {
    throw new Error("User not found");
  }

  const eventTypeData = await prisma.eventType.findUnique({
    where: {
      id: formData.get("eventTypeId") as string,
    },
    select: {
      title: true,
      description: true,
    },
  });

  const fromTime = formData.get("fromTime") as string;
  const eventDate = formData.get("eventDate") as string;
  const meetingLength = Number(formData.get("meetingLength"));
  const provider = formData.get("provider") as string;

  const startDateTime = new Date(`${eventDate}T${fromTime}:00`);
  const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);

  await nylas.events.create({
    identifier: getUserData.grantId as string,
    requestBody: {
      title: eventTypeData?.title,
      description: eventTypeData?.description,
      when: {
        startTime: Math.floor(startDateTime.getTime() / 1000),
        endTime: Math.floor(endDateTime.getTime() / 1000),
      },
      conferencing: {
        autocreate: {},
        provider: provider as any,
      },
      participants: [
        {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          status: "yes",
        },
      ],
    },
    queryParams: {
      calendarId: getUserData.grantEmail as string,
      notifyParticipants: true,
    },
  });

  return redirect("/success");
}

export async function CancelMettingNylas(formData: FormData) {
  const session = await requiredAuthUser();

  const userData = await prisma.user.findUnique({
    where: {
      id: session.user?.id,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  const nylasData = await nylas.events.destroy({
    eventId: formData.get("eventId") as string,
    identifier: userData.grantId as string,
    queryParams: {
      calendarId: userData.grantEmail as string,
      notifyParticipants: true,
    },
  });

  revalidatePath("/dashboard/meetings");
}

export async function EditEventType(prevState: any, formData: FormData) {
  const session = await requiredAuthUser();

  const submission = parseWithZod(formData, {
    schema: eventTypeSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const updatedData = await prisma.eventType.update({
    where: {
      id: formData.get("id") as string,
      userId: session.user?.id as string,
    },
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      videoCallSoftware: submission.value.videoCallSoftware,
      description: submission.value.description || "",
    },
  });

  return redirect("/dashboard");
}

export async function UpdateEventTypeStatusAction(
  prevState: any,
  {
    eventTypeId,
    isActive,
  }: {
    eventTypeId: string;
    isActive: boolean;
  }
) {
  try {
    const session = await requiredAuthUser();

    const data = await prisma.eventType.update({
      where: {
        id: eventTypeId,
        userId: session.user?.id,
      },
      data: {
        active: isActive,
      },
    });

    revalidatePath("/dashboard");

    return {
      status: "success",
      message: "Event type status updated",
    };
  } catch (error) {
    console.error("Error updating event type status:", error);
    return {
      status: "error",
      message: "Failed to update event type status",
    };
  }
}

export async function DeleteEventType(formData: FormData) {
  const session = await requiredAuthUser();

  const data = await prisma.eventType.delete({
    where: {
      id: formData.get("id") as string,
      userId: session.user?.id,
    },
  });

  return redirect("/dashboard");
}
