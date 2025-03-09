import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { APIError } from "@/types/global";
import { addPilotExperience } from "@/api/user_api";
import { useState } from "react";
import ExperienceForm from "./form";
const AddExperience = () => {
  const [open, setOpen] = useState(false); // State to control dialog open/close

  const queryClient = useQueryClient(); // Access React Query's query client

  const mutation = useMutation({
    mutationFn: addPilotExperience,
    onMutate: () => {
      const toastId = toast.loading("Adding...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Successfully added!", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["experience"] }); // Invalidate the 'socials' query to refetch data
      setOpen(false); // Close the dialog
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Add to failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add New Experience</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Experience</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <ExperienceForm
          details=""
          end_date=""
          start_date=""
          mutation={mutation}
          loading={mutation.isPending}
          _id=""
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddExperience;
