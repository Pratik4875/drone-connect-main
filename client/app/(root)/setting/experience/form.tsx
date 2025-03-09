"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export type ExperienceFormData = z.infer<typeof certificateFormSchema> & {
  experienceId?: string;
}& {
  _id?: string;
};


// Define the schema
const certificateFormSchema = z.object({
  start_date: z
    .preprocess((val) => (typeof val === "string" && val.trim() === "" ? undefined : val), z.date({
      required_error: "Experience date is required.",
      invalid_type_error: "Experience date must be a valid date.",
    })),
  end_date: z
    .union([
      z.date({
        invalid_type_error: "Experience date must be a valid date.",
      }),
      z.literal(null),
    ])
    .or(
      z.string().transform((val) => (val === "" ? null : new Date(val)))
    )
    .nullable(),
  details: z.string().nonempty("Experience details is required."),
});


const ExperienceForm = ({
  start_date,
  end_date,
  details,
  mutation,
  loading,
  _id,
}: {
  start_date: string;
  end_date: string;
  details: string;
  _id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: any;
  loading: boolean;
}) => {
  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: {
      start_date:start_date!=="" ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : null,
      details: details,
    },
  });

  const onSubmit = (data: ExperienceFormData) => {
    if (_id && _id !== "") {
      mutation.mutate({ ...data, experience_id: _id });
    } else {
      mutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Start date */}
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        !isNaN(new Date(field.value).getTime()) ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick your start date</span>
                        )
                      ) : (
                        <span>Pick your start date</span>
                      )}

                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* End Date */}
        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date (leave blank if current)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        !isNaN(new Date(field.value).getTime()) ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick your end date</span>
                        )
                      ) : (
                        <span>Pick your end date</span>
                      )}

                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value!}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Description */}
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience Details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Experience Details"
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          Save changes
        </Button>
      </form>
    </Form>
  );
};

export default ExperienceForm;
