"use server";

import { onBoardingSchema } from "@/lib/zodSchemas";
import { prisma } from "../lib/db";
import { requiredAuthUser } from "../lib/hook";
import { parseWithZod } from "@conform-to/zod";

export async function OnBoardingAction(prevState: any, formData: FormData) {
  const user = await requiredAuthUser();

  const submission = parseWithZod(formData, {
    schema: onBoardingSchema,
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

  return data;
}
