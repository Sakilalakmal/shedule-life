import { SettingsForm } from "@/app/components/SettingsForm";
import { prisma } from "@/app/lib/db";
import { requiredAuthUser } from "@/app/lib/hook";
import { notFound } from "next/navigation";

async function getUserData(userId: string) {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      image: true,
    },
  });

  if (!userData) {
    return notFound();
  }

  return userData;
}

export default async function SettingPage() {
  const session = await requiredAuthUser();

  const data = await getUserData(session.user?.id as string);

  return (
    <SettingsForm
      email={data.email}
      fullName={data.name as string}
      profileImage={data.image as string}
    />
  );
}
