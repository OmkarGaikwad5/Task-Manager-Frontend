import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. https://task-manager-ten-omega-69.vercel.app/api
  withCredentials: true // send/receive cookies
});
