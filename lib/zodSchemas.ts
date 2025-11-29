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
