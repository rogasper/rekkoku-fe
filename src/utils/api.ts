"use server";
import axios from "axios";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3040/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthHeader = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export default apiClient;
