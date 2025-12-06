import { SubmitButton } from "@/app/components/SubmitButton";
import { DeleteEventType } from "@/app/onboarding/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default async function DeleteEventTypePage({
  params,
}: {
  params: Promise<{ eventTypeId: string }>;
}) {
  const { eventTypeId } = await params;

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Delete event</CardTitle>
          <CardDescription>
            Are you sure you want to delete this event?
          </CardDescription>
        </CardHeader>
        <CardFooter className="ml-auto flex gap-4 items-center">
          <Link className={buttonVariants()} href={"/dashboard"}>
            Cancel
          </Link>
          <form action={DeleteEventType}>
            <Input type="hidden" name="id" value={eventTypeId} />
            <SubmitButton text="Delete Event" variant={"destructive"} />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
