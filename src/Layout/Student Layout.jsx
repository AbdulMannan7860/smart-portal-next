'use client'

import React, { useState } from 'react'
import Marquee from '../Components/Common/Marquee'
import Sidebar from '../Components/Student Components/Sidebar'

const StudentLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Marquee />
      <div className="flex flex-1">
        <button
          className="md:hidden fixed top-12 right-4 z-50 p-2 bg-primary text-white rounded-md"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? 'Close' : 'Menu'}
        </button>

        <div className="hidden md:block w-1/5 bg-secondary fixed top-[35px] bottom-0 left-0 overflow-y-hidden">
          <Sidebar />
        </div>

        <div
          className={`fixed inset-y-0 left-0 w-3/4 bg-secondary z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden transition-transform duration-300 ease-in-out`}
          style={{ marginTop: '40px' }}
        >
          <Sidebar />
        </div>

        <div className={`flex-1 p-6 md:ml-[10%] ${isSidebarOpen ? 'ml-3/4' : 'ml-0'} transition-all duration-300 ease-in-out overflow-y-auto`}>
         {children}
        </div>
      </div>
    </div>
  )
}

export default StudentLayout
