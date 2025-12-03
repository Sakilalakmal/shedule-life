import { notFound } from "next/navigation";
import { prisma } from "../lib/db";
import { requiredAuthUser } from "../lib/hook";
import { EmptyState } from "../components/EmptyState";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, Link2, Pen, Settings, Trash, User2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ButtonGroup } from "@/components/ui/buttonGroup";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { url } from "inspector";

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
        <>
          <div className="flex items-center justify-between px-2">
            <div className="hidden sm:grid gap-y-1">
              <h1 className="text-3xl font-bold">Event types</h1>
              <p className="text-muted-foreground">
                create and manage your event types below
              </p>
            </div>
            <Link href={"/dashboard/new"} className={buttonVariants()}>
              Create a new event
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.eventTypes.map((event) => (
              <div
                className="overflow-hidden shadow rounded-lg border relative"
                key={event.id}
              >
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"outline"} size={"icon"}>
                        <Settings className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Event Settings</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link href={`/${data.userName}/${event.url}`}>
                            <ExternalLink className="size-4" />
                            Preview
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link2 className="size-4" />
                          Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pen className="size-4" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash className="size-4 text-red-500" />
                        <span className="text-red-500">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Link href={"/"} className="flex items-center p-4">
                  <div className="flex shrink-0">
                    <User2 className="size-8" />
                  </div>

                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {event.duration} minutes Meeting
                      </dt>
                      <dd className="text-lg font-medium">{event.title}</dd>
                    </dl>
                  </div>
                </Link>
                <div className=" px-5 py-3 justify-between items-center flex">
                  <Switch />

                  <Button>Edit Event</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
