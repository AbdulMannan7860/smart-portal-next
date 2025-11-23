import React from "react";
import PostContext from "./PostContext";
import { toast } from "react-toastify";
import useTempToken from "@/app/hooks/useTempToken";

const PostState = ({ children }) => {
  const host = process.env.MASTER_DB_API_URL;
  const token = useTempToken();

  const postDataToApi = async (endpoint, formData) => {
    try {
      // If endpoint starts with /api, use it directly, otherwise prepend host
      const url = endpoint.startsWith("/api")
        ? endpoint
        : `${host}/${endpoint}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        toast.error("Server error: Invalid response format");
        return {
          success: false,
          error: "Server error: Invalid response format",
        };
      }

      const json = await response.json();

      if (!response.ok) {
        toast.error(json?.error || "Error: Failed");
        return { success: false, error: json?.error || "Error: Failed" };
      }

      toast.success(json?.message || json?.success || "Data post successful");

      return json;
    } catch (error) {
      console.error("Error during postDataToApi:", error);
      toast.error("Something went wrong. Please try again.");
      return {
        success: false,
        error: "An error occurred during postDataToApi.",
      };
    }
  };

  const postFormDataToApi = async (endpoint, formData, token) => {
    try {
      // Determine URL
      const url = endpoint.startsWith("/api")
        ? endpoint
        : `${host}/${endpoint}`;

      const response = await fetch(url, {
        method: "POST",
        body: formData, // pass FormData directly
        credentials: "include", // include cookies if needed
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          // DO NOT set Content-Type manually for FormData
        },
      });

      // Check response content type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        toast.error("Server error: Invalid response format");
        return {
          success: false,
          error: "Server error: Invalid response format",
        };
      }

      const json = await response.json();

      if (!response.ok) {
        toast.error(json?.error || "Error: Failed");
        return { success: false, error: json?.error || "Error: Failed" };
      }

      toast.success(json?.message || json?.success || "Data post successful");

      return json;
    } catch (error) {
      console.error("Error during postDataToApi:", error);
      toast.error("Something went wrong. Please try again.");
      return {
        success: false,
        error: "An error occurred during postDataToApi.",
      };
    }
  };

  return (
    <PostContext.Provider
      value={{
        postDataToApi,
        postFormDataToApi,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export default PostState;
