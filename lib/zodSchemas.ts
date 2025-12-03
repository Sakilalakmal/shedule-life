import { conformZodMessage } from "@conform-to/zod";
import { unique } from "next/dist/build/utils";
import { z } from "zod";

export const onBoardingSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
});

export function onBoardingSchemaValidations(options?: {
  isUsernameUnique: () => Promise<boolean>;
}) {
  return z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .pipe(
        z.string().superRefine((_, ctx) => {
          if (typeof options?.isUsernameUnique !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });

            return;
          }

          return options.isUsernameUnique().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message: "Username is already taken",
              });
            }
          });
        })
      ),
    fullName: z.string().min(1, "Full name is required"),
  });
}

export const settingSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  profileImage: z.string(),
});

export const eventTypeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  duration: z
    .number()
    .min(15, "Duration is required")
    .max(60, "Maximum duration is  one hour"),
  description: z.string().optional(),
  url: z.string().min(1, "URL is required"),
  videoCallSoftware: z.string().min(1, "Video call software is required"),
});
