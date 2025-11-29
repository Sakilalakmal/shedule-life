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

export default function OnboardingPage() {
  const [lastResult, action] = useActionState(OnBoardingAction, undefined);


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
        <form>
          <CardContent className="flex flex-col gap-y-5">
            <div className="grid gap-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Sakila lakmal" />
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
                />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button className="w-full">Submit</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
