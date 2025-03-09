/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
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
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  CloudUpload,
  Paperclip,
} from "lucide-react";
import ImagePreview from "@/components/image-preview";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationHelper } from "@/utils/LocationHelper";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

type Event = z.infer<typeof createSchema>;

const createSchema = z.object({
  image: z
    .any()
    .refine((files) => files?.length > 0, "Image is required")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "Max image size is 5MB."
    )
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png, and .webp formats are supported."
    ),
  description: z
    .string()
    .min(10, "The description must be at least 10 characters long.")
    .max(1000, "The description must not exceed 1000 characters.")
    .trim(),
  title: z.string().min(1, "Title is required"),
  event_date: z
    .date({
      required_error: "A event date is required.",
    })
    .nullable(),
  event_start_time: z.date().nullable(), // Allow null for event_start_time
  event_end_time: z.date().nullable(), // Allow null for event_end_time
  mode: z.string().min(1, "Mode is required"),
  state: z
    .string({
      required_error: "Please select a state.",
    })
    .optional(),
  street_address: z
    .string({
      required_error: "Please enter street address of event",
    })
    .optional(),
  city: z
    .string({
      required_error: "Please select a city.",
    })
    .optional(),
  pincode: z
    .string({
      required_error: "Please select a pincode.",
    })
    .optional(),
  reg_link: z.string().url(),
});
const eventSchemaCheck = (data: Event, ctx: z.RefinementCtx) => {
  if (data.mode == "nv") {
    if (!data.state) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["state"],
        message: "Please select a state.",
      });
    }
    if (!data.city) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["city"],
        message: "Please select a city.",
      });
    }
    if (!data.street_address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["street_address"],
        message: "Please enter the street address of the event.",
      });
    }
    if (!data.pincode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pincode"],
        message: "Please select a pincode.",
      });
    }
  }
};

const eventSchema = createSchema.superRefine(eventSchemaCheck);

const updateSchema = createSchema
  .extend({
    image: z.any().optional(), // Image is optional in update mode
  })
  .superRefine(eventSchemaCheck);

const EventForm = ({
  image,
  eventId,
  description,
  mutation,
  city,
  state,
  street_address,
  title,
  event_mode,
  pincode,
  event_date,
  event_end_time,
  event_start_time,
  reg_link,
}: {
  mutation: any;
  description: string;
  image: string | null;
  eventId: string;
  city: string;
  state: string;
  street_address: string;
  title: string;
  event_mode: string;
  pincode: string;
  event_date: string;
  event_end_time: string;
  event_start_time: string;
  reg_link: string;
}) => {
  const isUpdating = Boolean(image); // Check if it's an update operation
  const formSchema = isUpdating ? updateSchema : eventSchema;
  const { cities, fetchCities, fetchPincodes, pincodes, states } =
    LocationHelper();
  const dropZoneConfig = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // mode: "all",
    defaultValues: {
      image: image ? null : undefined,
      description: description,
      city: city,
      state: state,
      street_address: street_address,
      title: title,
      mode: event_mode,
      pincode: pincode.toString(),
      event_date: new Date(event_date),
      event_end_time: event_end_time ? new Date(event_end_time) : null,
      event_start_time: event_start_time ? new Date(event_start_time) : null,
      reg_link: reg_link,
    },
  });

  useEffect(() => {
    if (state !== "") {
      fetchCities(state);
    }
    if (state !== "" && city !== "") {
      fetchCities(state);
      fetchPincodes(state, city);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, city]);

  const mode = form.watch("mode"); // Watching mode value
  const isOffline = mode === "nv";
  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   try {
  //     console.log(values);
  //   } catch (error) {
  //     console.error("Form submission error", error);
  //     toast.error("Failed to submit the form. Please try again.");
  //   }
  // }
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
  

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const start_time = await combineDateAndTime(
      values.event_date!,
      values.event_start_time!
    );
    const end_time = await combineDateAndTime(values.event_date!, values.event_end_time!);
    
    const data: Record<string, any> = {
      image: (values.image && values.image[0]) || null, // Handle both create & update
      desc: values.description,
      name: values.title,
      mode: values.mode,
      reg_link: values.reg_link,
    };
    if (start_time && end_time) {
      data.start_ts = start_time;
      data.end_ts = end_time;
    }
    
    if (values.mode === "nv") {
      data.street_addr = values.street_address;
      data.city = values.city;
      data.state = values.state;
      data.pincode = values.pincode;
    }
    if (eventId) {
      data.eventId = eventId; // Only add postId if it's not an empty string
      mutation.mutate(data);
    } else {
      mutation.mutate(data, {
        onSuccess: () => {
          form.setValue("description", "");
          form.setValue("image", null);
          form.setValue("mode", "");
          form.setValue("reg_link", "");
          form.setValue("city", "");
          form.setValue("event_date", null);
          form.setValue("event_end_time", null);
          form.setValue("event_start_time", null);
          form.setValue("title", "");
          form.setValue("pincode", "");
          form.setValue("street_address", "");
          form.setValue("state", "");
        },
      });
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 max-w-3xl mx-auto py-4 min-h-dvh"
      >
        {form.getValues("image") && form.getValues("image").length > 0 ? (
          <ImagePreview files={form.getValues("image")} />
        ) : (
          <ImagePreview files={image!} />
        )}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select File</FormLabel>
              <FormControl>
                <FileUploader
                  value={field.value}
                  onValueChange={field.onChange}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput
                    id="fileInput"
                    className="outline-dashed outline-1 outline-slate-500"
                    // {...field}
                  >
                    <div className="flex items-center justify-center flex-col p-8 w-full ">
                      <CloudUpload className="text-gray-500 w-10 h-10" />
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>
                        &nbsp; or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF
                      </p>
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {field?.value &&
                      field?.value.length > 0 &&
                      field?.value?.map((file: any, i: number) => (
                        <FileUploaderItem key={i} index={i}>
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span>{file?.name}</span>
                        </FileUploaderItem>
                      ))}
                  </FileUploaderContent>
                </FileUploader>
              </FormControl>
              <FormDescription>Select a file to upload.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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
          name="reg_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Register Link</FormLabel>
              <FormControl>
                <Input placeholder="www.example.com" {...field} />
              </FormControl>
              <FormDescription>
                Enter a register link for the event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="event_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} rows={5} />
              </FormControl>
              <FormDescription>Add a brief event description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Mode</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your mode of event" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="v">Online</SelectItem>
                  <SelectItem value="nv">Offline</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage email addresses in your{" "}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {isOffline && (
          <>
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
                                      fetchPincodes(
                                        form.getValues("state")!,
                                        city
                                      ); // Fetch pincodes for selected city
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
          </>
        )}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default EventForm;
