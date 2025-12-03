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
