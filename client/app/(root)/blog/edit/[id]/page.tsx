"use client";
import React from "react";
import UpdatePostForm from "./update-form";
import { useParams } from "next/navigation";

const Page = () => {
    const { id } = useParams<{ id: string }>(); // Correct TypeScript typing
  
  return <UpdatePostForm id={id}/>;
};

export default Page;
