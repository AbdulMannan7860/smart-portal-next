import React from "react";
import { sampleData } from "../Data/sample";
import { Menu } from "lucide-react";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <header className="bg-gradient-to-r from-red-900 to-red-800 text-white shadow-lg">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-white hover:bg-red-700 p-2 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-sm font-semibold">
                Welcome To Emaan Institute Learning Management System
              </h1>
              <p className="text-xs text-red-100">
                Monday - Sunday 9:00 AM - 5:00 PM
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <img
                src={sampleData.teacher.photo}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {sampleData.teacher.name}
                </p>
                <p className="text-xs text-red-100">Teacher</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
