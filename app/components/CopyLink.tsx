"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

export function CopyLink({ meetingUrl }: { meetingUrl: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(meetingUrl);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy the link:", error);
    }
  };

  return (
    <DropdownMenuItem onClick={() => handleCopy()}>
      <Link2 className="size-4" />
      Copy
    </DropdownMenuItem>
  );
}
