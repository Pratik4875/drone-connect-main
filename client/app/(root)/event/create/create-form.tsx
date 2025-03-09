import React from "react";
import EventForm from "../form";
import { addEvent } from "@/api/user_api";
import { APIError } from "@/types/global";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const CreateEventForm = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addEvent,
    onMutate: () => {
      const toastId = toast.loading("Creatingg...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Created successful!", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["events"] }); // Refetch socials data
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Creation failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });
  return <EventForm image={null} mutation={mutation} description="" eventId="" city="" event_date="" event_end_time="" event_mode="" event_start_time="" pincode="" state="" street_address="" title="" reg_link="" />;
};

export default CreateEventForm;
