import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requiredAuthUser() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return session;
}
