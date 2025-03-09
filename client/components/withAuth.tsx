"use client";

import userStore from "@/store/userStore";
import { useRouter } from "next/navigation";
import React from "react";
import Loader from "./loader";
import toast from "react-hot-toast";

const withAuth = (
  WrappedComponent: React.ComponentType,
  requiredRoles: string[] // Changing from [string] to string[] for better flexibility
) => {
  // eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
  return (props: any) => {
    const { user, isAuthenticated, loading } = userStore(); // Get user info and loading state from the store
    const router = useRouter();

    React.useEffect(() => {
      if (!loading) {
        if (isAuthenticated) {
          if (!requiredRoles.includes(user.user_type!)) {
            router.replace("/unauthorized"); // Ensure immediate redirection
          }
        } else {
          toast("Please Login to continue");
          router.replace("/login");
        }
      }
    }, [loading, isAuthenticated, user, requiredRoles, router]);

    // Show a loading spinner or fallback UI until the user data is loaded
    if (loading) {
      return <div>Loading...</div>;
    }

    // If authenticated and has the required role, render the WrappedComponent
    return isAuthenticated && requiredRoles.includes(user.user_type!) ? (
      <WrappedComponent {...props} />
    ) : (
      <Loader />
    ); // Do not render anything if not redirected yet (edge case)
  };
};

export default withAuth;
