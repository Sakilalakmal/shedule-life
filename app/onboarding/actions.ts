/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  onBoardingSchema,
  onBoardingSchemaValidations,
  settingSchema,
} from "@/lib/zodSchemas";
import { prisma } from "../lib/db";
import { requiredAuthUser } from "../lib/hook";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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

export async function updateAvailability( formData: FormData) {
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
