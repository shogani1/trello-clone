import React from "react";
import { Sidebar } from "../_components/sidebar";



const OrganizationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="pt-12 md:pt-16 px-4 max-w-6-xl 2xl:max-w-screen-xl mx-auto ">
      <div className="flex gap-x-7">
        <div className="w-64 shrink-0 hidden md:block">
          <Sidebar />
        </div>
        {children}
      </div>
    </main>
  );
};

export default OrganizationLayout;
