import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import logo from "@/public/life.png";
import { signIn } from "@/auth";
import { GithubAuthSubmitButton, GoogleAuthSubmitButton } from "./SubmitButton";

export function AuthModel() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Try For Free</Button>
      </DialogTrigger>
      <DialogContent className="sm:mx-w-[360px] md:max-w-[360px]">
        <DialogHeader className="flex flex-row justify-center items-center">
          <Image src={logo} alt="logo" className="size-20" />
          <h4 className="text-3xl font-semibold">
            Schedule <span className="text-green-500">Life</span>
          </h4>
        </DialogHeader>
        <div className="flex flex-col mt-5 gap-4">
          <form
            action={async () => {
              "use server";

              await signIn("google");
            }}
            className="w-full"
          >
            <GoogleAuthSubmitButton />
          </form>
          <form
            action={async () => {
              "use server";

              await signIn("github");
            }}
            className="w-full"
          >
            <GithubAuthSubmitButton />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
