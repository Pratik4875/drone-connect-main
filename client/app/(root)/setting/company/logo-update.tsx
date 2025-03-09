"use client";
import { companyLogoUpdate } from "@/api/user_api";
import AvatarProfile from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APIError } from "@/types/global";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from '@tanstack/react-query'

const LogoUpdate = ({
  src,
  fullname,
}: {
  src: string | null;
  fullname: string;
}) => {
  const queryClient = useQueryClient()
  const [files, setFiles] = useState<File | null>(null); // Initialize as null
  const [saveButton, setSaveButton] = useState(false);
  const mutation = useMutation({
    mutationFn: companyLogoUpdate,
    onMutate: () => {
      const toastId = toast.loading("Updating...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, _variables, context) => {
      toast.success("Updation successful!", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ['company'] });
      setSaveButton(false);
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Updation failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });

  const handleSaveClick = () => {
    if (files) {
      mutation.mutate({ image: files });
    }
  };

  const getImage = (file: File) => {
    return URL.createObjectURL(file);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = async (event: any) => {
    try {
      const selectedFile = event.target.files[0];
      console.log("Selected File:", selectedFile); // Debugging line

      // Check if the file type is an image but not a GIF
      if (selectedFile) {
        // File type check (exclude GIF)
        if (selectedFile.type.includes("gif")) {
          alert("GIF files are not allowed.");
          setFiles(null);
          setSaveButton(false);
          return;
        }

        // File size check (must be less than 2MB)
        const MAX_SIZE = 2 * 1024 * 1024; // 2MB
        if (selectedFile.size > MAX_SIZE) {
          alert("File size should be less than 2MB.");
          setFiles(null);
          setSaveButton(false);
          return;
        }

        // If passed both checks, update the state
        setFiles(selectedFile);
        setSaveButton(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Debugging if the AvatarProfile gets the correct src */}
      <AvatarProfile
        className="md:size-40 size-32"
        src={
          files
            ? getImage(files)
            : src &&
              `https://res.cloudinary.com/dmuhioahv/image/upload/v1736958453/${src}`
        } // Display file URL if file selected, else fallback to default src
        fallbackClassName="text-3xl"
        fallbackText={fullname}
      />
      <div className="flex flex-row gap-5">
        <Button
          className="px-10 relative"
          variant={"outline"}
          disabled={mutation.isPending}
        >
          Change
          <Input
            id="picture"
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full top-0 left-0"
            accept="image/*"
            onChange={onChange}
          />
        </Button>
        {saveButton && (
          <Button
            className="px-10"
            onClick={handleSaveClick}
            disabled={mutation.isPending}
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );
};

export default LogoUpdate;
