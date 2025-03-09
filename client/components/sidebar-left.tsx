import React from "react";
import Nav from "./nav";

const LeftSidebar = () => {
  return (
    <div className="hidden lg:col-span-2 lg:block xl:col-span-2 border-r-[1px] border-slate-200 pr-2 py-10 relative">
      <Nav />
    </div>
  );
};

export default LeftSidebar;
