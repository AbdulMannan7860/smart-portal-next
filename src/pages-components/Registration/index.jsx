'use client'

import React, { useContext, useState } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';
import Marquee from '../../Components/Common/Marquee';
import { toast } from 'react-toastify';
import PostContext from '../../Context/PostContext/PostContext';

function Registration() {
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [email, setEmail] = useState('');
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const context = useContext(PostContext);
  const { postDataToApi } = context;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Password and confirm password do not match');
      return;
    }

    const formData = {
      name: fullName,
      mail: email,
      regNo: regNo,
      password: password,
      role: 'Student'
    }

    const data = await postDataToApi('/api/auth/student-register', formData);
    console.log(data);

  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Marquee />
      {/* <header className="bg-[#6D0303] text-white p-4 mt-12 text-center text-xl font-bold">
        Student Registration Portal
      </header> */}
      <div className="flex-1 flex items-center justify-center p-4 mt-10">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Register for Your Courses</h1>
          <p className="text-center text-gray-600 mb-6">
            Welcome to the student registration portal. Please fill out the form below to register.
            Ensure all information is accurate to avoid any issues.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-6">
              <a href="#" className="mx-2 p-3 bg-[#6D0303] rounded-full text-white hover:bg-[#6D0303]"><FaFacebook /></a>
              <a href="#" className="mx-2 p-3 bg-[#6D0303] rounded-full text-white hover:bg-[#6D0303]"><FaTwitter /></a>
              <a href="#" className="mx-2 p-3 bg-[#6D0303] rounded-full text-white hover:bg-[#6D0303]"><FaLinkedin /></a>
            </div>
            <div className="form-group">
              <label htmlFor="fullName" className="block text-gray-700 font-medium mb-1">Full Name:</label>
              <input
                type="text"
                id="fullName"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter Full Name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fatherName" className="block text-gray-700 font-medium mb-1">Father Name:</label>
              <input
                type="text"
                id="fatherName"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="Enter Father Name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email:</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@emaan.edu.pk"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="regNo" className="block text-gray-700 font-medium mb-1">Registration Number:</label>
              <input
                type="text"
                id="regNo"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="XXX-X/XX-XX/XX"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password:</label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#6D0303] text-white py-2 px-4 rounded-md cursor-pointer hover:bg-[#6d0303cd] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Already registered? <Link href="/login" className="text-[#6D0303] hover:underline">Login here</Link>
          </p>
        </div>
      </div>
      <footer className="bg-[#6D0303] text-white p-4 text-center">
        &copy; {new Date().getFullYear()} Student Portal. All rights reserved.
      </footer>
    </div>
  );
}

export default Registration;
