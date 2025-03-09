import React from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Loader2 } from "lucide-react";

const StepTwo = ({
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
        name="otp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>One-Time Password</FormLabel>
            <FormControl>
              <InputOTP maxLength={6} {...field}>
                <InputOTPGroup className="flex-1">
                  <InputOTPSlot index={0} className="w-full" />
                  <InputOTPSlot index={1} className="w-full" />
                  <InputOTPSlot index={2} className="w-full" />
                  <InputOTPSlot index={3} className="w-full" />
                  <InputOTPSlot index={4} className="w-full" />
                  <InputOTPSlot index={5} className="w-full" />
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormDescription>
              Please enter the one-time password sent to your mail.
            </FormDescription>
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
            <Loader2 className="animate-spin" /> Verifyingg{" "}
          </>
        ) : (
          "Verify"
        )}
      </Button>
    </>
  );
};

export default StepTwo;
