"use client";
import React from "react";
import { useParams } from "next/navigation";
import UpdateEventForm from "./update-form";

const Page = () => {
    const { id } = useParams<{ id: string }>(); // Correct TypeScript typing
  
  return <UpdateEventForm id={id}/>;
};

export default Page;
