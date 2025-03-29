import axios from "axios"
import { toast } from "react-hot-toast"

const api = axios.create({
  baseURL: "https://reqres.in/api",
  headers: {
    "Content-Type": "application/json"
  }
})

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
      toast.error("Session expired. Please login again.")
    }
    return Promise.reject(error)
  }
)

export default api

