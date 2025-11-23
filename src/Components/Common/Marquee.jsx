import React from "react";

const Marquee = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-100">
      <div className="bg-red-900 text-white py-2 px-4">
        <marquee behavior="scroll" direction="left"  className="text-sm text-center animate-pulse">
          Welcome To Emaan Institute Learning Management System: Monday-Sunday
          9am-6pm
        </marquee>
      </div>
    </div>
  );
};

export default Marquee;
