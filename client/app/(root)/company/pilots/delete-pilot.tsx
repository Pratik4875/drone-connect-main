import React, { memo } from "react";
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
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePilotCompany } from "@/api/user_api"; // Your API function for deletion
import { APIError } from "@/types/global";
import { Trash2 } from "lucide-react";

const DeletePilot = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  // React Query mutation for deleting social
  const mutation: UseMutationResult<void, APIError, string> = useMutation({
    mutationFn: deletePilotCompany,
    onMutate: () => {
      const toastId = toast.loading("Deleting...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Post deleted successfully!", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["company-pilots-list"] }); // Refetch socials data
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
        <button className="flex w-full">
            <Trash2 />
            <span className="ml-2">Delete</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            pilot entry.
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

export default memo(DeletePilot);
