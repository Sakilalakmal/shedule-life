import Image from "next/image";
import { AuthModel } from "./AuthModel";
import heroImage from "../../public/hero.jpg";

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center py-12 lg:py-20">
      <div className="text-center">
        <span className="text-sm text-primary font-medium tracking-tight bg-primary/10 px-4 py-2 rounded-full">
          Introduction Schedule Life
        </span>
        <h1 className="text-4xl mt-8 sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-none">
          Super easy <span className="text-blue-600">scheduling</span>{" "}
          <span className="block">with us</span>
        </h1>
        <p className="max-w-xl mx-auto mt-4 lg:text-lg text-muted-foreground">
          Effortless scheduling that saves you time, reduces stress, and keeps
          your day running smoothly and same for your clients.
        </p>

        <div className="mt-8 mb-10">
          <AuthModel />
        </div>
      </div>

      <div className="relative items-center w-full py-12 mx-auto mt-16">
        <Image
          src={heroImage}
          alt="hero section image"
          className="object-cover w-full border rounded-lg shadow-2xl lg:rounded-2xl"
        />
      </div>
    </section>
  );
}
