"use client";
import { addPost } from "@/api/user_api";
import { APIError } from "@/types/global";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import BlogForm from "../form";
import { useForm } from "react-hook-form";

const CreatePostForm = () => {
  const queryClient = useQueryClient();
  const { reset } = useForm();
  const mutation = useMutation({
    mutationFn: addPost,
    onMutate: () => {
      const toastId = toast.loading("Creatingg...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Created successful!", { id: context.toastId });
      reset({
        image: null,
        description: "",
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Refetch socials data
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Creation failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });

  return (
    <BlogForm mutation={mutation} description="" image={null} postId={""}/>
  );
};

export default CreatePostForm;
