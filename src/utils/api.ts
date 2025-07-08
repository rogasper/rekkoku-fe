"use client";
import { getCookie } from "@/lib/cookies";
import axios, { AxiosInstance } from "axios";
import useUser from "@/store/useUser";

// Get base URL - use different env vars for server vs client
const getBaseURL = () => {
  // Server-side: use internal URL if available, fallback to public URL
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3030";
  }
  // Client-side: use public URL only
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3030";
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // Include cookies for session management
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getCookie("session");
    if (session) {
      config.headers.Authorization = `Bearer ${session}`;
    }
    // Token will be handled via cookies, but we can add additional headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Return only the data
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear auth store
      console.error("Unauthorized access");
      if (typeof window !== "undefined") {
        // Clear Zustand store
        try {
          const { clearAuth } = useUser.getState();
          clearAuth();
        } catch (e) {
          console.error("Failed to clear auth store:", e);
        }
      }
    }
    return Promise.reject(error);
  }
);

// Set auth header function (for manual token management if needed)
export const setAuthHeader = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export default apiClient;
