import React from "react";
import GetContext from "./GetContext";
import { toast } from "react-toastify";
import useTempToken from "@/app/hooks/useTempToken";

const GetState = ({ children }) => {
  const host = process.env.MASTER_DB_API_URL;
  const token = useTempToken();
  const getDataFromApi = async (endpoint) => {
    try {
      const url = endpoint.startsWith("/api")
        ? endpoint
        : `${host}/${endpoint}`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const json = await response.json();

      // if (response.status === 401) {
      //   toast.error(json?.error || "Unauthorized");
      //   window.location.href = "/";
      //   return { success: false, error: json?.error || "Unauthorized" };
      // }

      if (!response.ok) {
        toast.error(json?.error || "Error fetching data");
        return { success: false, error: json?.error || "Error fetching data" };
      }

      toast.success(
        json?.message || json?.success || "Data fetched successfully"
      );

      return json;
    } catch (error) {
      console.error("Error during getDataFromApi:", error);
      toast.error("Something went wrong. Please try again.");
      return {
        success: false,
        error: "An error occurred during getDataFromApi.",
      };
    }
  };

  const getAwardCourses = async (param) => {
    try {
      const response = await fetch(`${host}/students/${param}/courses-award`, {
        method: "GET",
      });

      const json = await response.json();

      if (!response.ok) {
        toast.error(json?.error || "Get Award Courses failed");
        return {
          success: false,
          error: json?.error || "Get Award Courses failed",
        };
      }

      toast.success(
        json?.message ||
          json?.success ||
          "Data fetched for Award Courses successfully"
      );

      return json;
    } catch (error) {
      console.error("Error during getAwardCourses:", error);
      toast.error("Something went wrong. Please try again.");
      return {
        success: false,
        error: "An error occurred during getAwardCourses.",
      };
    }
  };
  return (
    <GetContext.Provider
      value={{
        getDataFromApi,
        getAwardCourses,
      }}
    >
      {children}
    </GetContext.Provider>
  );
};

export default GetState;
