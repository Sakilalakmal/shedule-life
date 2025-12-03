"use client";

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
import { SubmitButton } from "./SubmitButton";
import { useActionState, useState } from "react";
import { SettingsUpdateAction } from "../onboarding/actions";
import { useForm } from "@conform-to/react";
import { settingSchema } from "@/lib/zodSchemas";
import { parseWithZod } from "@conform-to/zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { UploadDropzone } from "../lib/uploadthing";
import { toast } from "sonner";

interface SettingsFormProps {
  fullName?: string;
  email?: string;
  profileImage?: string;
}

export function SettingsForm({
  fullName,
  email,
  profileImage,
}: SettingsFormProps) {
  const [lastResult, action] = useActionState(SettingsUpdateAction, undefined);

  const [currentProfileImage, setCurrentProfileImage] = useState(profileImage);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: settingSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDeleteImage = () => {
    setCurrentProfileImage("");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage Your Account settings</CardDescription>
      </CardHeader>

      <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
        <CardContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label>Full Name</Label>
            <Input
              placeholder="sakila lakmal"
              defaultValue={fullName}
              name={fields.fullName.name}
              key={fields.fullName.key}
            />
            <p className="text-red-500 text-sm">{fields.fullName.errors}</p>
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Email</Label>
            <Input
              placeholder="example@example.com"
              defaultValue={email}
              disabled
            />
          </div>

          <div className="grid gapy-2">
            <Label>Profile Image</Label>
            <Input
              type="hidden"
              name={fields.profileImage.name}
              key={fields.profileImage.key}
              value={currentProfileImage}
            />
            {currentProfileImage ? (
              <div className="relative size-16 m-4">
                <Image
                  src={currentProfileImage}
                  alt="profile image"
                  width={64}
                  height={64}
                  className="size-16 rounded-lg mt-4"
                />
                <Button
                  className="absolute -top-1 -right-3"
                  variant={"destructive"}
                  onClick={handleDeleteImage}
                  type="button"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint={"imageUploader"}
                onClientUploadComplete={(res) => {
                  setCurrentProfileImage(res[0].ufsUrl);
                  toast.success("Profile image uploaded successfully!");
                }}
                onUploadError={(error) => {
                  console.log("error while uploading error", error);
                  toast.error(`Failed to upload image: ${error.message}`);
                }}
              />
            )}
            <p className="text-red-500 text-sm">{fields.profileImage.errors}</p>
          </div>
        </CardContent>
        <CardFooter className="mt-4">
          <SubmitButton text="Save Changes" className="mt-4 w-fit" />
        </CardFooter>
      </form>
    </Card>
  );
}
