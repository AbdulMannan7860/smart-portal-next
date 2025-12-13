"use client";

import {
  BookOpen,
  Calendar,
  CheckSquare,
  Clock,
  FileText,
  LogOut,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React from "react";
import { sampleData } from "../../MockData/Data";
import Link from "next/link";

const Sidebar = ({
  currentPage,
  setCurrentPage,
  onLogout,
  isSidebarOpen,
  setIsSidebarOpen,
  profile,
}) => {
  const menuItems = [
    { id: "/teacher/dashboard", label: "Dashboard", icon: Calendar },
    { id: "/teacher/schedule", label: "Class Schedule", icon: Clock },
    { id: "/teacher/courses", label: "Course Outline", icon: BookOpen },
    // { id: "/teacher/lectures", label: "Lecture Material", icon: Upload },
    { id: "/teacher/assignments", label: "Assignments", icon: FileText },
    { id: "/teacher/attendance", label: "Attendance", icon: CheckSquare },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-8 left-0 h-screen bg-linear-to-b from-gray-50 to-gray-100 border-r-2 border-gray-200 shadow-xl z-50 flex flex-col transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "w-64" : "w-0 lg:w-16"}
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        {/* Logo Section */}
        <div className="pt-4 pb-3 px-3 border-b-2 border-gray-300 flex items-center justify-between bg-white">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 pl-2">
              <div className="relative">
                <img
                  src="https://emaan.edu.pk/logo.jpeg"
                  alt="Logo"
                  className="w-12 h-12 rounded-full border-2 border-red-800 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm leading-tight">
                  EMAAN INSTITUTE
                </h2>
                <p className="text-xs text-gray-600">Management & Sciences</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <img
                src="https://emaan.edu.pk/logo.jpeg"
                alt="Logo"
                className="w-10 h-10 rounded-full border-2 border-red-800 shadow-md"
              />
            </div>
          )}

          {/* Toggle Button - Hidden on Mobile */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:block absolute -right-3 top-6 bg-red-800 text-white p-1.5 rounded-full shadow-lg hover:bg-red-900 transition-all hover:scale-110"
          >
            {isSidebarOpen ? (
              <ChevronLeft size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link href={item.id} key={index}>
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center ${
                    isSidebarOpen ? "justify-start px-4" : "justify-center"
                  } gap-3 py-3 rounded-lg transition-all ${
                    currentPage === item.id
                      ? "bg-linear-to-r from-red-800 to-red-700 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-gray-200 hover:shadow-md"
                  }`}
                >
                  <Icon size={20} />
                  {isSidebarOpen && (
                    <span className="font-medium text-sm whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </button>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        {isSidebarOpen && (
          <div className="px-3 py-3 border-t-2 border-gray-300 bg-white">
            <div className="flex items-center gap-3 px-2 py-2 bg-linear-to-r from-red-50 to-orange-50 rounded-lg">
              <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center text-white font-bold">
                {profile.fullName
                  .split(" ")
                  .map((word) => word.length > 3 && word.charAt(0))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {profile.fullName}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-600 truncate">Teacher</p>
                  <p className="text-xs text-gray-600 truncate">
                    {profile.jobStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="p-3 border-t-2 mb-10 border-gray-300 bg-white">
          <button
            onClick={onLogout}
            className={`w-full flex items-center ${
              isSidebarOpen ? "justify-start px-4" : "justify-center"
            } gap-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all hover:shadow-md font-medium`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
