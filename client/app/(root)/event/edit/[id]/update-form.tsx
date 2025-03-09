"use client";
import { updateEvent, getUserEvent } from "@/api/user_api";
import { APIError } from "@/types/global";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import EventForm from "../../form";

const UpdateEventForm = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userEvent", id], // Unique query key for caching
    queryFn: () => getUserEvent(id), // Fetch function
    staleTime: 300000, // Cache time of 5 minutes
    enabled: !!id, // Fetch only if ID is provided
  });

  const mutation = useMutation({
    mutationFn: updateEvent,
    onMutate: () => {
      const toastId = toast.loading("Updating...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Updation successful!", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["events"] }); // Refetch socials data
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Updation failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  console.log(data?.event);

  const CLOUDINARY_BASE_URL =
    "https://res.cloudinary.com/dmuhioahv/image/upload/c_pad,ar_4:3,w_1600,h_1195,b_auto/v1736958453/";
  return isLoading ? (
    <Loader2 className="mx-auto mt-10" />
  ) : (
    <EventForm
      mutation={mutation}
      image={CLOUDINARY_BASE_URL + data?.event?.image}
      title={data.event.name}
      description={data.event.desc}
      eventId={data.event._id}
      event_date={data.event.start_ts}
      event_start_time={data.event.start_ts}
      event_end_time={data.event.end_ts}
      event_mode={data.event.mode}
      street_address={data.event.street_addr}
      reg_link={data.event.reg_link}
      state={data.event.state}
      city={data.event.city}
      pincode={data.event.pincode}
    />
  );
};

export default UpdateEventForm;
