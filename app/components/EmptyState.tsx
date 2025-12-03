import { Button } from "@/components/ui/button";
import { Ban, Edit } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

export function EmptyState({
  title,
  description,
  buttonText,
  href,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center rounded-md border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex items-center justify-center size-20 rounded-full bg-primary/10">
        <Ban className="size-10 text-white" />
      </div>

      <h2 className="mt-8 text-xl font-semibold">{title}</h2>
      <p className="mb-8 mt-4 text-sm text-muted-foreground max-w-xs mx-auto">
        {description}
      </p>

      <Button asChild>
        <Link href={href}>
        <Edit className="size-4"/>
        {buttonText}</Link>
      </Button>
    </div>
  );
}
