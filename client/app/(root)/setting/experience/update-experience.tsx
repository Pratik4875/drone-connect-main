import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { APIError } from "@/types/global";
import { updatePilotExperience } from "@/api/user_api";
import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import ExperienceForm from "./form";
const UpdateExperience = ({
  start_date,
  end_date,
  details,
  _id,
}: {
  start_date: string;
  end_date: string;
  details: string;
  _id: string;
}) => {
  const [open, setOpen] = useState(false); // State to control dialog open/close

  const queryClient = useQueryClient(); // Access React Query's query client

  const mutation = useMutation({
    mutationFn: updatePilotExperience,
    onMutate: () => {
      const toastId = toast.loading("Updating...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Successfully updated!", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["experience"] }); // Invalidate the 'certifications' query to refetch data
      setOpen(false); // Close the dialog
    },
    onError: (error: APIError, _variables, context) => {
      toast.error(`Failed to update: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FiEdit3 className="w-4 h-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Certificate</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <ExperienceForm
          _id={_id!}
          details={details}
          end_date={end_date}
          start_date={start_date}
          loading={mutation.isPending}
          mutation={mutation}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateExperience;
