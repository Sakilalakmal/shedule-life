"use client";

import { Switch } from "@/components/ui/switch";
import { useFormState } from "react-dom";
import { UpdateEventTypeStatusAction } from "../onboarding/actions";
import { useEffect, useTransition, useRef } from "react";
import { toast } from "sonner";

export function EventTypeSwitch({
  initialChecked,
  eventTypeId,
}: {
  initialChecked: boolean;
  eventTypeId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [state, action] = useFormState(UpdateEventTypeStatusAction, undefined);
  const previousState = useRef<typeof state>(undefined);

  useEffect(() => {
    if (state && state !== previousState.current) {
      if (state?.status === "success") {
        toast.success(state.message);
      } else if (state?.status === "error") {
        toast.error(state.message);
      }
      previousState.current = state;
    }
  }, [state]);

  return (
    <Switch
      disabled={isPending}
      checked={initialChecked}
      onCheckedChange={(isChecked) => {
        startTransition(() => {
          action({
            eventTypeId,
            isActive: isChecked,
          });
        });
      }}
    />
  );
}
