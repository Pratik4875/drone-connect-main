"use client";
import withAuth from "@/components/withAuth";
import React from "react";
import CreatePostForm from "./create-form";

const Page = () => {

  return (
    <CreatePostForm />
  );
};

export default withAuth(Page, ["p"]);
