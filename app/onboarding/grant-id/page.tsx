import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar1 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OnBoardingGrandRoute() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>You are almost there!</CardTitle>
          <CardDescription>
            We now connect your account to calendar...
          </CardDescription>
          <Image
            src={
              "https://media.tenor.com/lCKwsD2OW1kAAAAi/happy-cat-happy-happy-cat.gif"
            }
            alt="happy image"
            width={400}
            height={400}
          />
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href={"/api/auth"}>
              <Calendar1 className="size-4" />
              Connect with Calender
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
