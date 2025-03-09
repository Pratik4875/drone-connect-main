"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import toast from "react-hot-toast";
import { getUserBookingTitles, assignPilot } from "@/api/user_api"; // Use the correct API function
import { Loader } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APIError } from "@/types/global";

const FormSchema = z.object({
  request_id: z.string({
    required_error: "Please select a booking.",
  }),
});

const SelectRequest = ({
  pilot_id,
  company_id,
}: {
  pilot_id: string | null;
  company_id: string | null;
}) => {
  // Fetch all bookings
  const {
    data: bookings,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["bookings"], // Updated key
    queryFn: getUserBookingTitles, // Fetch pending bookings
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 2, // Retry twice on failure
  });
  const queryClient = useQueryClient(); // Access React Query's query client

  const mutation = useMutation({
    mutationFn: assignPilot,
    onMutate: () => {
      const toastId = toast.loading("Adding...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Successfully added!", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["bookings"] }); // Invalidate the 'socials' query to refetch data
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Add to failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  if (isError) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const new_data: {
      booking_id: string;
      pilot_id?: string;
      company_id?: string;
    } = {
      booking_id: data.request_id,
    };

    if (pilot_id) {
      new_data.pilot_id = pilot_id;
    }
    if (company_id) {
      new_data.company_id = company_id;
    }

    mutation.mutate(new_data);
  }

  return isLoading ? (
    <div className="flex justify-center items-center h-20">
      <Loader className="animate-spin" />
    </div>
  ) : bookings?.length === 0 ? (
    <p className="text-gray-500">No bookings found.</p>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="request_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bookings</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a booking" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bookings?.map(
                    ({ _id, title }: { _id: string; title: string }) => (
                      <SelectItem key={_id} value={_id}>
                        {title}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Manage your bookings in the{" "}
                <Link href="/dashboard">dashboard</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default SelectRequest;
