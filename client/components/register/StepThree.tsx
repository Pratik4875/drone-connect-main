import React from "react";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
const StepThree = ({
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
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="full-name">Full Name</FormLabel>
            <FormControl>
              <Input
                id="full-name"
                type="text"
                placeholder="Joe Doe"
                required
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="user_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="user-type">User Type</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              required
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="c">Customer</SelectItem>
                <SelectItem value="p">Pilot</SelectItem>
                <SelectItem value="o">Organisation</SelectItem>
              </SelectContent>
            </Select>
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
          "Next"
        )}
      </Button>
    </>
  );
};

export default StepThree;
