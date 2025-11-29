import Image from "next/image";
import Link from "next/link";
import logo from "@/public/life.png";
import { Button } from "@/components/ui/button";
import { AuthModel } from "./AuthModel";

export function Navbar() {
  return (
    <div className="flex py-5 items-center justify-between">
      <Link href={"/"} className="flex items-center gap-4">
        <Image src={logo} alt="logo image" className="size-10" />

        <h4 className="text-3xl font-semibold">
          Schedule <span className="text-green-500">life</span>
        </h4>
      </Link>

      <AuthModel/>
    </div>
  );
}
