import { SubmitButton } from "@/app/components/SubmitButton";
import { prisma } from "@/app/lib/db";
import { requiredAuthUser } from "@/app/lib/hook";
import { times } from "@/app/lib/times";
import { updateAvailability } from "@/app/onboarding/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { notFound } from "next/navigation";

async function getAvailabilityData(userId: string) {
  const data = await prisma.availability.findMany({
    where: {
      userId: userId,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function AvailabilityPage() {
  const session = await requiredAuthUser();

  const availabilityData = await getAvailabilityData(
    session.user?.id as string
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Availability</CardTitle>
        <CardDescription>
          In here you can manage your availability
        </CardDescription>
      </CardHeader>
      <form action={updateAvailability}>
        <CardContent className="flex flex-col gap-y-4">
          {availabilityData.map((data) => (
            <div
              key={data.id}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4"
            >
              <Input type="hidden" name={`id-${data.id}`} value={data.id} />
              <div className="flex items-center gap-x-3">
                <Switch
                  name={`isActive-${data.id}`}
                  defaultChecked={data.isActive}
                />
                <p>{data.day}</p>
              </div>

              <Select defaultValue={data.formTime} name={`fromTime-${data.id}`}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="From" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {times.map((time) => (
                      <SelectItem key={time.id} value={time.time}>
                        {time.time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select defaultValue={data.tillTime} name={`tillTime-${data.id}`}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Till" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {times.map((time) => (
                      <SelectItem key={time.id} value={time.time}>
                        {time.time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>

        <CardFooter>
          <SubmitButton text="update Availability" className="mt-8 w-fit" />
        </CardFooter>
      </form>
    </Card>
  );
}
