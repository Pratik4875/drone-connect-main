"use client";
import { updatePost, getUserPost } from "@/api/user_api";
import { APIError } from "@/types/global";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import BlogForm from "../../form";
import { Loader2 } from "lucide-react";

const UpdatePostForm = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["userPost", id], // Unique query key for caching
    queryFn: () => getUserPost(id), // Fetch function
    staleTime: 300000, // Cache time of 5 minutes
    enabled: !!id, // Fetch only if ID is provided
  });

  const mutation = useMutation({
    mutationFn: updatePost,
    onMutate: () => {
      const toastId = toast.loading("Updating...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Updation successful!", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Refetch socials data

    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Updation failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });
  const CLOUDINARY_BASE_URL =
    "https://res.cloudinary.com/dcv9bhbly/image/upload/c_pad,ar_4:3,w_1600,h_1195,b_auto/v1736958453/";
  return isLoading ? (
    <Loader2 className="mx-auto mt-10" />
  ) : (
    <BlogForm
      mutation={mutation}
      image={CLOUDINARY_BASE_URL + data?.post.image}
      description={data?.post?.description}
      postId={data?.post._id}
    />
  );
};

export default UpdatePostForm;
