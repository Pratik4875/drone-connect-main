import React from "react";

export const MainContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="lg:col-span-2 max-w-4xl  py-10">{children}</div>;
};
