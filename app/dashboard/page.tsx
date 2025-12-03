import { notFound } from "next/navigation";
import { prisma } from "../lib/db";
import { requiredAuthUser } from "../lib/hook";
import { EmptyState } from "../components/EmptyState";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      userName: true,
      eventTypes: {
        select: {
          id: true,
          active: true,
          title: true,
          url: true,
          duration: true,
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function DashBoardPage() {
  const session = await requiredAuthUser();

  const data = await getData(session.user?.id as string);

  return (
    <>
      {data.eventTypes.length === 0 ? (
        <EmptyState
          title="You did not have any event yet"
          description="you can create event types by clicking below button"
          buttonText="create event types"
          href="/dashboard/new"
        />
      ) : (
        <p>hey we have data</p>
      )}
    </>
  );
}
