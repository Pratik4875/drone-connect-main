"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { companyDetailsUpdate } from "@/api/user_api";
import { APIError } from "@/types/global";
import LogoUpdate from "./logo-update";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LuShieldCheck, LuShieldBan } from "react-icons/lu";
const Schema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name should not exceed 100 characters" }) // Limiting name to 100 characters
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name should contain only letters and spaces",
    }),

  gst: z
    .string()
    .min(1, { message: "GST Number is required" })
    .max(15, { message: "GST Number must be 15 characters long" }) // Limiting GST number to 15 characters
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/, {
      message: "Invalid GST number format",
    }),

  url: z
    .string()
    .min(1, { message: "Website URL is required" })
    .max(500, { message: "URL should not exceed 500 characters" }) // Limiting URL to 500 characters
    .url({ message: "Invalid URL format" })
    .refine((url) => url.startsWith("http://") || url.startsWith("https://"), {
      message: "URL must start with 'http://' or 'https://'",
    }),
});

const CompanyForm = ({
  gst,
  logo,
  name,
  url,
  status
}: {
  gst: null | string;
  logo: null | string;
  name: null | string;
  url: null | string;
  status: "verified" | "unverified"
}) => {
  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {
      gst: gst ? gst : "",
      name: name ? name : "",
      url: url ? url : "",
    },
  });
  const mutation = useMutation({
    mutationFn: companyDetailsUpdate,
    onMutate: () => {
      const toastId = toast.loading("Updating...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Updation successful!", { id: context.toastId });
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Updation failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });

  function onSubmit(values: z.infer<typeof Schema>) {
    try {
      const initializeFormValues = {
        name: name ? name : "",
        gst: gst ? gst : "",
        url: url ? url : "",
      };
      // Compare current values with initial values
      const isDataChanged =
        JSON.stringify(values) !== JSON.stringify(initializeFormValues);

      if (!isDataChanged) {
        toast.error("No changes made to the form.");
        return;
      }
      mutation.mutate(values);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div className="w-full">
      <Alert
         className={`my-5 
          ${
            status === "verified"
              ? "border-green-500 bg-green-100 text-green-700"
              : "border-red-500 bg-red-100 text-red-700"
          }`}
      >
        {status === "verified" ? (
          <>
            <LuShieldCheck className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-600">
              Account Verified
            </AlertTitle>
            <AlertDescription className="text-green-600">
              You are visible to all.
            </AlertDescription>
          </>
        ) : (
          <>
            <LuShieldBan className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-600">Account Not Verified</AlertTitle>
            <AlertDescription className="text-red-600">
              You will not be visible, and no one can see you.
            </AlertDescription>
          </>
        )}
      </Alert>
      <LogoUpdate src={logo ? logo : ""} fullname={logo ? logo : "N A"} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 max-w-3xl mx-auto py-4 min-h-dvh"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="" {...field} />
                </FormControl>
                <FormDescription>Enter a title for the event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gst"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GST Number</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="" {...field} />
                </FormControl>
                <FormDescription>Enter a title for the event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="" {...field} />
                </FormControl>
                <FormDescription>Enter a title for the event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={mutation.isPending}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CompanyForm;
