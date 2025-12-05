import { RenderCalender } from "@/app/components/BookingForm/RendercalendarFile";
import { TimeTable } from "@/app/components/BookingForm/TimeTable";
import { prisma } from "@/app/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar1Icon, Clock1, VideoIcon } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getData(eventUrl: string, username: string) {
  const data = await prisma.eventType.findFirst({
    where: {
      url: eventUrl,
      User: {
        userName: username,
      },
      active: true,
    },
    select: {
      id: true,
      description: true,
      title: true,
      duration: true,
      videoCallSoftware: true,
      User: {
        select: {
          id: true,
          name: true,
          image: true,
          availability: {
            select: {
              day: true,
              isActive: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

type Params = { username: string; eventUrl: string };

export default async function BookingFormPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<{ date?: string }>;
}) {
  const { username, eventUrl } = await params;
  const resolvedSearchParams = await searchParams;
  const data = await getData(eventUrl, username);

  // Let the client component handle date parsing to avoid hydration mismatch
  const selectedDateParam = resolvedSearchParams?.date;

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card className="max-w-[1000px] w-full mx-auto p-4">
        <CardContent className="p-5 flex flex-col gap-8  md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-x-6 md:items-stretch">
          {/* Booking form content goes here */}

          <div>
            <Image
              src={data.User.image as string}
              alt="profile image of user"
              width={40}
              height={40}
              className="size-10"
            />
            <p className="text-sm font-medium text-muted-foreground mt-2">
              {data.User.name}
            </p>
            <h1 className="text-xl font-semibold mt-2">{data.title}</h1>
            <p className="text-sm font-medium text-muted-foreground">
              {data.description}
            </p>

            <div className="mt-5 flex flex-col gap-y-3">
              <p className="flex items-center">
                <Calendar1Icon className="size-4 mr-2" />
                <span className="text-sm font-medium text-muted-foreground">
                  {selectedDateParam
                    ? new Date(selectedDateParam).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </span>
              </p>

              <p className="flex items-center">
                <Clock1 className="size-4 mr-2" />
                <span className="text-sm font-medium text-muted-foreground">
                  {data.duration} minutes
                </span>
              </p>

              <p className="flex items-center">
                <VideoIcon className="size-4 mr-2" />
                <span className="text-sm font-medium text-muted-foreground">
                  {data.videoCallSoftware}
                </span>
              </p>
            </div>
          </div>

          <Separator
            orientation="vertical"
            className="hidden md:block h-full w-px bg-border"
          />

          <div className="md:h-full">
            <RenderCalender availability={data.User.availability} />
          </div>

          <Separator
            orientation="vertical"
            className="hidden md:block h-full w-px bg-border"
          />
          <div className="md:h-full">
            <TimeTable
              selectedDate={selectedDateParam ?? new Date().toISOString()}
              username={username}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
