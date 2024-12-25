import FetchAllData from "@/components/custom/FetchAllData";
import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div className="container mx-auto my-32">
      <FetchAllData />
      {children}
    </div>
  );
};

export default MainLayout;
