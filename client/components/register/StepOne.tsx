import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { Loader2 } from "lucide-react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
const StepOne = ({
  onNext,
  loading,
}: {
  onNext: () => void;
  loading: boolean;
}) => {
  const { control } = useFormContext();
  return (
    <div className="space-y-4">
      {/* <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Verify your email</h2>
        <p className="text-balance text-sm text-muted-foreground">
          We sent a verification code to your email. Please enter it below.
        </p>
      </div> */}
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormControl>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...field}
              />
            </FormControl>
            <FormDescription>Enter your valid mail.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" className="w-full" onClick={onNext} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="animate-spin" /> Submitingggg{" "}
          </>
        ) : (
          "Submit"
        )}
      </Button>
    </div>
  );
};

export default StepOne;
