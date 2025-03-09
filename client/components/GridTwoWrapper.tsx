import React from "react";

export const GridTwoWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="lg:col-span-9 xl:col-span-9">
      <div className="lg:grid lg:grid-cols-3 lg:gap-4">{children}</div>
    </main>
  );
};
