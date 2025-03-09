"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { UseMutationResult } from "@tanstack/react-query";
// import { APIError } from "@/types/global";
// import { SocialResponse } from "@/types/socials";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

export type CertificationFormData = z.infer<typeof certificateFormSchema>;

// Define the schema
const certificateFormSchema = z.object({
  name: z
    .string()
    .min(3, "Certificate name must be at least 3 characters.")
    .max(50, "Certificate name must not exceed 50 characters.")
    .nonempty("Certificate name is required."),
  url: z
    .string()
    .url("Please enter a valid URL.")
    .nonempty("Certification URL is required."),
  expiry_date: z
    .date({
      required_error: "A certificate expiry date is required.",
    })
    .refine((date) => date >= new Date(), {
      message: "Expiry date cannot be in the past.",
    }),
});

const CertificationForm = ({
  name,
  url,
  expiry_date,
  mutation,
  loading,
  _id,
}: {
  name: string;
  url: string;
  expiry_date: string;
  _id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: any;
  loading: boolean;
}) => {
  const form = useForm<CertificationFormData>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: {
      name: name,
      url: url,
      expiry_date: new Date(expiry_date),
    },
  });

  const onSubmit = (data: CertificationFormData) => {
    if (_id && _id !== "") {
      mutation.mutate({ ...data, certificateId: _id });
    } else {
      mutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Certificate name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certificate Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter certificate name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Expiry date */}
        <FormField
          control={form.control}
          name="expiry_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Certificate Expiry Date</FormLabel>
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
                          <span>Pick a date</span>
                        )
                      ) : (
                        <span>Pick a date</span>
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
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Certification URL */}
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certification Link</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/certificate"
                  {...field}
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

export default CertificationForm;
