import { EmptyState } from "@/app/components/EmptyState";
import { SubmitButton } from "@/app/components/SubmitButton";
import { prisma } from "@/app/lib/db";
import { requiredAuthUser } from "@/app/lib/hook";
import { nylas } from "@/app/lib/nylas";
import { CancelMettingNylas } from "@/app/onboarding/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { format, fromUnixTime } from "date-fns";
import { Video } from "lucide-react";

// Type for Nylas event with proper when structure
interface MeetingWhen {
  startTime: number;
  endTime: number;
}

// Type for Nylas conferencing with proper details structure
interface MeetingConferencing {
  details: {
    url: string;
  };
}

async function getData(userId: string) {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      grantId: true,
      grantEmail: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  const data = await nylas.events.list({
    identifier: userData.grantId as string,
    queryParams: {
      calendarId: userData.grantEmail as string,
    },
  });

  return data;
}

export default async function MeetingsPage() {
  const session = await requiredAuthUser();
  const userId = session.user?.id as string;

  const data = await getData(userId);
  console.log(data.data[0]?.when);

  return (
    <>
      {data.data.length < 1 ? (
        <EmptyState
          title="No meetings found for you"
          description="you don't attend any meeting yet "
          buttonText="create a new event"
          href="/dashboard/new"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Bookings ({data.data.length})</CardTitle>
            <CardDescription>
              See all booking which you booked with details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.data.map((meeting) => (
              <form key={meeting.id} action={CancelMettingNylas}>
                <Input name="eventId" type="hidden" value={meeting.id} />
                <div
                  key={meeting.id}
                  className="grid grid-cols-3 justify-between items-center"
                >
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {format(
                        fromUnixTime((meeting.when as MeetingWhen).startTime),
                        "EEE, dd,MMM"
                      )}
                    </p>
                    <p className="text-muted-foreground text-xs pt-1">
                      {format(fromUnixTime((meeting.when as MeetingWhen).startTime), "hh:mm a")}{" "}
                      - {format(fromUnixTime((meeting.when as MeetingWhen).endTime), "hh:mm a")}
                    </p>

                    <div className="flex items-center mt-1">
                      <Video className="size-4 mr-2" />

                      <a
                        href={(meeting.conferencing as MeetingConferencing)?.details.url}
                        target="_blank"
                        className="text-xs text-blue-500 underline underline-offset-2"
                      >
                        Join Meeting
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col items-start">
                    <h2 className="text-sm font-medium">{meeting.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      You and {meeting.participants[0]?.name}
                    </p>
                  </div>

                  <SubmitButton
                    text="Cancel Meeting"
                    variant={"destructive"}
                    className="w-fit ml-auto"
                  />
                </div>

                <Separator className="my-3" />
              </form>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}
