import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card className="max-w-[500px] w-full mx-auto">
        <CardContent className="p-6 flex flex-col w-full items-center">
          <div className="size-16 bg-green-500/10 rounded-full flex justify-center items-center">
            <CheckIcon className="size-8 text-green-500 " />
          </div>
          <h1 className="text-2xl font-semibold mt-4">
            Event Schedule Successfully Created
          </h1>
          <p className="text-center text-sm text-muted-foreground max-w-sm mt-2">
            we sent you a confirmation email with all details and links to your
            call
          </p>
        </CardContent>
        <CardFooter>
          <Link
            className={buttonVariants({
              className: "w-full",
            })}
            href={"/dashboard"}
          >
            Close page
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
