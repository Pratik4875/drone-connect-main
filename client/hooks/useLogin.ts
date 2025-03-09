import { loginSchema, LoginType } from "@/types/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/user_api";
import toast from 'react-hot-toast';
import userStore from "@/store/userStore";
type APIError = {
  response: {
    data: {
      message: string;
    };
  };
};
export const useLogin = () => {
  const { setLoading, login } = userStore();
  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });
  function onSubmit(values: LoginType) {
    mutation.mutate(values);
  }

  const mutation = useMutation({
    mutationFn: loginUser,
    onMutate: () => {
        // Display loading toast
        setLoading(true);
        const toastId = toast.loading('Loading...');
        return { toastId }; // Return the toast ID to access it later
        
      },
      onSuccess: async (data, _variables,context) => {
        toast.success('Login successful!', { id: context.toastId });
        setLoading(false);
        login(data.user);        
      },
      onError: (error:APIError, _variables, context) => {
        // Update the toast to show error
        toast.error(`Login failed: ${error.response.data.message}`, { id: context?.toastId });
        setLoading(false);
      },
  });

  return { form, onSubmit };
};
