import React from "react";
import AuthContext from "./AuthContext";
import { toast } from "react-toastify";
import { useAuthStore } from "../../app/store/authStore";

const AuthState = ({ children }) => {
  const login = async (reg_no, hashed_password, isTrue) => {
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          code: reg_no,
          password: hashed_password,
          isTrue,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        toast.error(json?.error || "Login failed");
        return { success: false, error: json?.error || "Login failed" };
      }

      if (json.tempToken) {
        useAuthStore.getState().setTempToken(json.tempToken);
      }

      toast.success(json?.message || json?.success || "Login successful");

      return json;
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Something went wrong. Please try again.");
      return { success: false, error: "An error occurred during login." };
    }
  };
  return (
    <AuthContext.Provider
      value={{
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
