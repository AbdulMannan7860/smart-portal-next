"use client";

import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../Components/Teacher Components/Sidebar";
import Marquee from "../Components/Common/Marquee";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import GetContext from "@/Context/GetContext/GetContext";
import { useProfileStore } from "@/app/store/profileStore";

const TeacherLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(pathname);
  const [profile, setProfile] = useState(null);

  const context = useContext(GetContext);
  const { getDataFromApi } = context;

  const getProfile = async () => {
    const res = await getDataFromApi("/api/auth/teacher-profile");
    useProfileStore.getState().setProfile(res?.data);
    setProfile(res?.data);
  };

  useEffect(() => {
    getProfile();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("teacherToken");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Marquee />

      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden fixed top-10 left-0 right-0 bg-white border-b border-gray-200 z-[100000] px-4 py-3 flex items-center justify-between shadow-md">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="font-bold text-gray-800 text-lg">Teacher Portal</h1>
        <div className="w-10"></div>
      </div>

      {/* Sidebar */}
      <Sidebar
        profile={profile}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <main
        className={`min-h-screen transition-all duration-300 pt-10 lg:pt-6
        ${isSidebarOpen ? "ml-56" : "lg:ml-6"}
        `}
      >
        <div className="p-4 lg:p-6 max-w-full">{children}</div>
      </main>
    </div>
  );
};

export default TeacherLayout;
