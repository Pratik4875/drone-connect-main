import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MdDeleteOutline } from "react-icons/md";
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePilotSocials } from "@/api/user_api"; // Your API function for deletion
import { APIError } from "@/types/global";

type DeleteSocialProps = { platform: string };
const DeleteSocials = ({ platform }: DeleteSocialProps) => {
  const queryClient = useQueryClient();

  // React Query mutation for deleting social
  const mutation: UseMutationResult<void, APIError, string> = useMutation({
    mutationFn: deletePilotSocials,
    onMutate: () => {
      const toastId = toast.loading("Updating...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Social deleted successfully!", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["socials"] }); // Refetch socials data
    },
    onError: (error: APIError, _variables, context) => {
      toast.error(`Deletion failed: ${error?.response?.data?.message}`, {
        id: context?.toastId,
      });
    },
  });

  // Handle the delete action
  const handleDelete = () => {
    mutation.mutate(platform); // Trigger the mutation with the platform as input
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button type="button">
          <MdDeleteOutline className="text-xl text-red-500" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            social platform entry.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSocials;
