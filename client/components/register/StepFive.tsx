import React from "react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "../ui/password-input";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
const StepFive = ({
  onNext,
  loading,
}: {
  onNext: () => void;
  loading: boolean;
}) => {
  const { control } = useFormContext();

  return (
    <>
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormControl>
              <PasswordInput id="password" required {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <FormControl>
              <PasswordInput id="confirmPassword" required {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="button"
        className="w-full"
        onClick={onNext}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" /> Submitingggg{" "}
          </>
        ) : (
          "Submit"
        )}
      </Button>
    </>
  );
};

export default StepFive;
