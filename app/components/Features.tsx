import { Bell, Calendar, Link } from "lucide-react";

const features = [
  {
    name: "Easy Scheduling",
    description: "Quickly set up meetings with just a few clicks.",
    icon: Calendar,
  },
  {
    name: "Customizable Links",
    description: "Create branded scheduling links to share with clients.",
    icon: Link,
  },
  {
    name: "Automated Reminders",
    description: "Reduce no-shows with automatic email and SMS reminders.",
    icon: Bell,
  },
];

export function Features() {
  return (
    <div className="py-24">
      <div className="max-w-2xl mx-auto lg:text-center">
        <p className="font-semibold leading-7 text-primary">
          Scheduleing faster
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Schedule your meetings in minutes
        </h1>
        <p className="mt-8 text-base leading-snug text-muted-foreground">
          Share clean, branded scheduling links that make booking with you easy,
          professional, and instantly clear,Let our smart scheduling engine
          handle the heavy lifting, so every meeting finds the perfect time
          without back-and-forth messages
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <div className="grid max-w-xl gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-16">
              <div className="text-base font-medium leading-7">
                <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon />
                </div>
                {feature.name}
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-snug">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
