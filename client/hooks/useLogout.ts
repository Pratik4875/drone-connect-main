"use client";

import { logoutUser } from "@/api/user_api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useLogout = (logout: () => void) => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: logoutUser,
    onMutate: () => {
      const toastId = toast.loading("Logging out...");
      return { toastId };
    },
    onSuccess: async (_data, _variables, context) => {
      router.replace("/login");
      toast.success("Logout Successfully!", { id: context?.toastId });
      logout();
    },
    onError: (error, _variables, context) => {
      toast.error(`Logout failed: ${error.message}`, { id: context?.toastId });
    },
  });

  const handleLogout = () => {
    mutation.mutate();
  };

  return { handleLogout };
};
