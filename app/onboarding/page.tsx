"use client";

import { Button } from "@/components/ui/button";
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
import { useActionState } from "react";
import { OnBoardingAction } from "./actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { onBoardingSchema } from "@/lib/zodSchemas";
import { SubmitButton } from "../components/SubmitButton";

export default function OnboardingPage() {
  const [lastResult, action] = useActionState(OnBoardingAction, undefined);

  const [form, fields] = useForm({
    lastResult: lastResult && "status" in lastResult ? lastResult : undefined,
    onValidate({ formData }: { formData: FormData }) {
      return parseWithZod(formData, {
        schema: onBoardingSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>
            Welcome to schedule <span className="text-green-500">Life</span>
          </CardTitle>
          <CardDescription>
            Please provide following information to setup your profile
          </CardDescription>
        </CardHeader>
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          <CardContent className="flex flex-col gap-y-5">
            <div className="grid gap-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="Sakila lakmal"
                name={fields.fullName.name}
                defaultValue={fields.fullName.initialValue}
                key={fields.fullName.key}
              />
              <p className="text-red-500 text-sm">{fields.fullName.errors}</p>
            </div>
            <div className="grid gap-y-2">
              <Label>Username</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground">
                  Schedulelife.com
                </span>
                <Input
                  placeholder="example-user-1"
                  className="rounded-l-none"
                  name={fields.username.name}
                  defaultValue={fields.username.initialValue}
                  key={fields.username.key}
                />
                <p className="text-red-500 text-sm">{fields.username.errors}</p>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <SubmitButton text="Submit" className="mt-4" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
