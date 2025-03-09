import React from "react";

export const GridOneWrapper = ({ children }: { children: React.ReactNode }) => {
  return <main className="lg:col-span-9 xl:col-span-9 h-full">{children}</main>;
};
