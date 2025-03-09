import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SocialForm from "./form";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { APIError } from "@/types/global";
import { updatePilotSocials } from "@/api/user_api";
import { SocialInput, SocialResponse } from "@/types/socials";
import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
const UpdateSocials = ({
  platform,
  url,
}: {
  platform: string;
  url: string;
}) => {
  const [open, setOpen] = useState(false); // State to control dialog open/close

  const queryClient = useQueryClient(); // Access React Query's query client

  const mutation: UseMutationResult<
    SocialResponse, // Response type
    APIError, // Error type
    SocialInput, // Variables/input type
    { toastId: string } // Context type
  > = useMutation({
    mutationFn: updatePilotSocials,
    onMutate: () => {
      const toastId = toast.loading("Updating...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Successfully updated!", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["socials"] }); // Invalidate the 'socials' query to refetch data
      setOpen(false); // Close the dialog
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Failed to update: ${error?.response?.data?.message}`, {
        id: context?.toastId,
      });
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button">
          <FiEdit3 className="text-xl" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Social</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <SocialForm
          platform={platform}
          url={url}
          mutation={mutation}
          loading={mutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSocials;
