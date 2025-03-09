/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CloudUpload, Paperclip } from "lucide-react";
import ImagePreview from "@/components/image-preview";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

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
    .trim()
    .refine(
      (value) => /^[a-zA-Z0-9\s,.!?'-]+$/i.test(value),
      "The description can only contain letters, numbers, spaces, and basic punctuation."
    ),
});

const updateSchema = createSchema.extend({
  image: z.any().optional(), // Image is optional in update mode
});
const BlogForm = ({
  mutation,
  description,
  image,
  postId,
}: {
  mutation: any;
  description: string;
  image: string | null;
  postId: string;
}) => {
  const dropZoneConfig = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };
  const isUpdating = Boolean(image); // Check if it's an update operation

  const formSchema = isUpdating ? updateSchema : createSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      description: description,
      image: image ? null : undefined, // Keep image undefined only if creating
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data: Record<string, any> = {
      image: (values.image && values.image[0]) || null, // Handle both create & update
      description: values.description,
    };

    if (postId) {
      data.postId = postId; // Only add postId if it's not an empty string
      mutation.mutate(data);
    } else {
      mutation.mutate(data, {
        onSuccess: () => {
          form.setValue("description", "");
          form.setValue("image", null);
        },
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-4 min-h-dvh"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} rows={5} />
              </FormControl>
              <FormDescription>You can add your description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default BlogForm;
