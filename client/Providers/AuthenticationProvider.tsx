"use client";
import { CheckUserLogin } from "@/api/user_api";
import Loader from "@/components/loader";
import userStore from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setLoading, login } = userStore();

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["user"],
    queryFn: CheckUserLogin,
    retry: false,
  });
  // Set loading state based on isLoading
  // Safely update loading state
  useEffect(() => {    
    setLoading(isLoading);    
  }, [isLoading, setLoading]);

  // Safely update login state
  useEffect(() => {
    if (isSuccess) {
      login(data.user);
    }
  }, [isSuccess, data, login]);
  return (
    <>
      {isLoading ? (
        <>
          <Loader />
        </>
      ) : (
        children
      )}
    </>
  );
};
