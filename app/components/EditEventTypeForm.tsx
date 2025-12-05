"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/buttonGroup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { eventTypeSchema } from "@/lib/zodSchemas";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Link from "next/link";
import { useActionState, useState } from "react";
import { SubmitButton } from "./SubmitButton";
import { cn } from "@/lib/utils";
import { EditEventType } from "../onboarding/actions";

type VideoCallProviderProps =
  | "Zoom Meeting"
  | "Google Meet"
  | "Microsoft Teams";

interface EditEventTypeFormProps {
  title: string;
  duration: number;
  description: string;
  url: string;
  videoCallSoftware: string;
  id: string;
}

export function EditEventTypeForm({
  title,
  duration,
  description,
  url,
  videoCallSoftware,
  id,
}: EditEventTypeFormProps) {
  const [activePlatform, setActivePlatform] = useState<VideoCallProviderProps>(
    videoCallSoftware as VideoCallProviderProps
  );

  const [lastResult, action] = useActionState(EditEventType, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: eventTypeSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const options = [
    { id: "zoom", label: "Zoom Meeting" },
    { id: "google-meet", label: "Google Meet" },
    { id: "microsoft-teams", label: "Microsoft Teams" },
  ];

  return (
    <div className="w-full h-full flex flex-1 items-center justify-center">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Edit Appoinment</CardTitle>
          <CardDescription>
            Make changes to your event type details below.
          </CardDescription>
        </CardHeader>
        <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
          <Input type="hidden" name="id" value={id} />
          <CardContent className="grid gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label>Title</Label>
              <Input
                name={fields.title.name}
                key={fields.title.key}
                defaultValue={title}
                placeholder="40 minutes meetings"
              />
              <p className="text-red-500 text-sm">{fields.title.errors}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>URL SLUG</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border-r-0 bg-muted text-sm text-muted-foreground">
                  Schedulelife.com/
                </span>
                <Input
                  name={fields.url.name}
                  key={fields.url.key}
                  defaultValue={url}
                  placeholder="example-url-one"
                  className="rounded-l-none"
                />
              </div>
              <p className="text-red-500 text-sm">{fields.url.errors}</p>
            </div>

            <div className="flex flex-col gap-y-2">
              <Label>Description</Label>
              <Textarea
                name={fields.description.name}
                key={fields.description.key}
                defaultValue={description}
                placeholder="lets meet in the meeting..."
              />
              <p className="text-red-500 text-sm">
                {fields.description.errors}
              </p>
            </div>

            <div className="flex flex-col gap-y-2">
              <Label>Duration</Label>
              <Select
                name={fields.duration.name}
                key={fields.duration.key}
                defaultValue={String(duration)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="select duration from here" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Durations</SelectLabel>
                    <SelectItem value="15">15 Mins</SelectItem>
                    <SelectItem value="30">30 Mins</SelectItem>
                    <SelectItem value="45">45 Mins</SelectItem>
                    <SelectItem value="60">1 Hour</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{fields.duration.errors}</p>
            </div>

            <div className="grid gap-y-2">
              <Label>Video call providers</Label>
              <Input
                type="hidden"
                name={fields.videoCallSoftware.name}
                key={fields.videoCallSoftware.key}
                value={activePlatform}
              />

              <ButtonGroup>
                {options.map((option) => (
                  <Button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setActivePlatform(option.label as VideoCallProviderProps);
                    }}
                    variant={
                      activePlatform ===
                      (option.label as VideoCallProviderProps)
                        ? "default"
                        : "outline"
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          </CardContent>
          <CardFooter className="mt-8 flex items-center gap-4">
            <Link
              href={"/dashboard"}
              className={cn(
                buttonVariants({
                  variant: "destructive",
                })
              )}
            >
              Cancel
            </Link>
            <SubmitButton text="Edit Event" className="w-fit" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
