/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DatetimePicker } from "@/components/ui/datetime-picker";
import { LocationHelper } from "@/utils/LocationHelper";
import { useMutation } from "@tanstack/react-query";
import { createBooking } from "@/api/user_api";
import toast from "react-hot-toast";
import { APIError } from "@/types/global";

const createSchema = z.object({
  title: z.string().min(1).max(100),
  event_date: z
    .date({
      required_error: "A event date is required.",
    })
    .nullable(),
  event_start_time: z.date().nullable(), // Allow null for event_start_time
  event_end_time: z.date().nullable(), // Allow null for event_end_time
  state: z.string({
    required_error: "Please select a state.",
  }),
  street_address: z.string({
    required_error: "Please enter street address of event",
  }),
  city: z.string({
    required_error: "Please select a city.",
  }),
  pincode: z.string({
    required_error: "Please select a pincode.",
  }),
});

const PilotBookingForm = () => {
  const { cities, fetchCities, fetchPincodes, pincodes, states } =
    LocationHelper();

  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    // mode: "all",
    defaultValues: {
      city: "",
      state: "",
      street_address: "",
      pincode: "",
      event_date: null,
      event_end_time: null,
      event_start_time: null,
      title: "",
    },
  });

  const combineDateAndTime = async (
    eventDate: Date,
    startTime: Date | undefined
  ): Promise<Date | null> => {
    if (!startTime) return null;

    // Create a new Date instance to avoid modifying the original eventDate
    const combinedDate = new Date(eventDate);

    // Extract the time parts (hours, minutes, etc.) from the startTime
    const hours = startTime.getHours();
    const minutes = startTime.getMinutes();

    // Set the time for the new date instance
    combinedDate.setHours(hours);
    combinedDate.setMinutes(minutes);
    combinedDate.setSeconds(0);

    return combinedDate;
  };
  const mutation = useMutation({
    mutationFn: createBooking,
    onMutate: () => {
      const toastId = toast.loading("Adding...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Successfully added!", { id: context.toastId });
      form.reset();
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Add to failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });
  async function onSubmit(values: z.infer<typeof createSchema>) {
    const start_time = await combineDateAndTime(
      values.event_date!,
      values.event_start_time!
    );
    const end_time = await combineDateAndTime(
      values.event_date!,
      values.event_end_time!
    );

    const data: Record<string, any> = {
      title: values.title,
      date: values.event_date,
      street_address: values.street_address,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
      start_time: start_time,
      end_time: end_time,
    };
    console.log(data);

    mutation.mutate(data);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 w-full mx-auto py-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Example" type="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="event_date"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Date of event</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        " pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value &&
                      !isNaN(new Date(field.value).getTime()) ? (
                        format(new Date(field.value), "PPP") // Ensure field.value is a valid Date
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
                    selected={field.value ? field.value : undefined}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Pick the event date.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex md:flex-row flex-col gap-5">
          <FormField
            control={form.control}
            name="event_start_time"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <DatetimePicker
                    {...field}
                    format={[["hours", "minutes", "am/pm"]]}
                    value={field.value ?? undefined} // Ensure the value is either Date or undefined, not Date | null
                  />
                </FormControl>
                <FormDescription>
                  Set the event&apos;s start time.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="event_end_time"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <DatetimePicker
                    {...field}
                    format={[["hours", "minutes", "am/pm"]]}
                    value={field.value ?? undefined} // Ensure the value is either Date or undefined, not Date | null
                  />
                </FormControl>
                <FormDescription>
                  Set the event&apos;s end time.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="street_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="" {...field} />
              </FormControl>
              <FormDescription>
                Enter your event street address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col md:flex-row w-full gap-5">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>State</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {field.value
                          ? states.find(
                              (state: { state: string; code: string }) =>
                                state.state === field.value
                            )?.state
                          : "Select your state"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search state..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No state found.</CommandEmpty>
                        <CommandGroup>
                          {states.map(
                            (state: { state: string; code: string }) => (
                              <CommandItem
                                value={state.state}
                                key={state.code}
                                onSelect={() => {
                                  form.setValue("state", state.state);
                                  fetchCities(state.state); // Fetch cities for selected state
                                  form.setValue("city", ""); // Reset district field
                                  form.setValue("pincode", ""); // Reset district field
                                }}
                              >
                                {state.state}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    state.state === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            )
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>City</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {field.value
                          ? cities.find((city) => city === field.value) ||
                            "Select your city"
                          : "Select your city"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search city..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No city found.</CommandEmpty>
                        <CommandGroup>
                          {cities.map((city) => (
                            <CommandItem
                              value={city}
                              key={city}
                              onSelect={() => {
                                form.setValue("city", city);
                                if (form.getValues("state") !== "") {
                                  fetchPincodes(form.getValues("state")!, city); // Fetch pincodes for selected city
                                  form.setValue("pincode", ""); // Reset pincode field
                                }
                              }}
                            >
                              {city}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  city === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Pincode</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {field.value
                          ? pincodes.find(
                              (pincode) => pincode === field.value
                            ) || "Select your pincode"
                          : "Select your pincode"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search pincode..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No pincode found.</CommandEmpty>
                        <CommandGroup>
                          {pincodes.map((pincode) => (
                            <CommandItem
                              value={pincode}
                              key={pincode}
                              onSelect={() => {
                                form.setValue("pincode", pincode);
                              }}
                            >
                              {pincode}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  pincode === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default PilotBookingForm;
