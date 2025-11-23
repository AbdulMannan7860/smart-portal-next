"use client";
import AuthState from "@/Context/AuthContext/AuthState";
import GetState from "@/Context/GetContext/GetState";
import PostState from "@/Context/PostContext/PostState";
import React from "react";
import { ToastContainer } from "react-toastify";

const AppLayout = ({ children }) => {
  return (
    <AuthState>
      <GetState>
        <PostState>
          {children}
          <ToastContainer />
        </PostState>
      </GetState>
    </AuthState>
  );
};

export default AppLayout;
