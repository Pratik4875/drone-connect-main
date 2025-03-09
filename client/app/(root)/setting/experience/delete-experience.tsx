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
import { deletePilotExperience } from "@/api/user_api"; // Your API function for deletion
import { APIError } from "@/types/global";
import { Button } from "@/components/ui/button";

type DeleteExperienceProps = { id: string };
const DeleteExperience= ({ id }: DeleteExperienceProps) => {
  const queryClient = useQueryClient();

  // React Query mutation for deleting social
  const mutation: UseMutationResult<void, APIError, string> = useMutation({
    mutationFn: deletePilotExperience,
    onMutate: () => {
      const toastId = toast.loading("Deleting...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Experience deleted successfully!", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["experience"] }); // Refetch socials data
    },
    onError: (error: APIError, _variables, context) => {
      toast.error(`Deletion failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });

  // Handle the delete action
  const handleDelete = () => {
    mutation.mutate(id); // Trigger the mutation with the platform as input
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
        <MdDeleteOutline className="w-4 h-4" /> Delete
        </Button>
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

export default DeleteExperience;
