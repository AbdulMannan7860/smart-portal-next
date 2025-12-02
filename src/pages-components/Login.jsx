"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Marquee from "@/Components/Common/Marquee";
import AuthContext from "@/Context/AuthContext/AuthContext";

const Login = () => {
  const authContext = useContext(AuthContext);
  const { login } = authContext;

  const router = useRouter();

  const [formData, setFormData] = useState({
    reg_no: "",
    hashed_password: "",
    isTrue: false,
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { reg_no, hashed_password, isTrue } = formData;
      if (!reg_no || !hashed_password) {
        toast.warning("Please fill in all fields");
      }
      const response = await login(reg_no, hashed_password, isTrue);
      
      if (response?.data?.Reg_No) {
        localStorage.setItem("student", JSON.stringify(response?.data));
        router.push("/student/student-dashboard");
      } else if (response?.data?.code) {
        localStorage.setItem("Teacher", JSON.stringify(response?.data));
        router.push("/teacher/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center overflow-hidden relative">
      <Marquee />
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop className="w-full h-full object-cover">
          <source src="/assets/loginHD.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-[22%] md:max-w-[22%] p-4">
        <form
          onSubmit={onSubmit}
          className="bg-[rgba(116,116,116,0.8)] border border-white rounded-lg p-6 sm:p-8"
        >
          <div className="mb-4">
            <label
              htmlFor="reg_no"
              className="block text-white font-medium mb-1"
            >
              Enter Registration No
            </label>
            <input
              type="text"
              id="reg_no"
              name="reg_no"
              onChange={onChange}
              value={formData.reg_no}
              placeholder="XXX-X/XX-00/00"
              className="w-full rounded-md px-3 py-2 border bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="hashed_password"
              className="block text-white font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="hashed_password"
              name="hashed_password"
              onChange={onChange}
              value={formData.password}
              placeholder="Enter password"
              className="w-full rounded-md px-3 py-2 border bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="mb-4">
            <Link href="/register" className="text-white font-medium">
              Not Registered?
            </Link>
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="exampleCheck1"
              name="isTrue"
              onChange={(e) =>
                setFormData({ ...formData, isTrue: e.target.checked })
              }
              checked={formData.isTrue}
              className="form-checkbox text-blue-600"
            />
            <label htmlFor="exampleCheck1" className="ml-2 text-white">
              Remember me?
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>

    // <StudentLayout>
    // </StudentLayout>
  );
};

export default Login;
