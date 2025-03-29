"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { toast } from "react-hot-toast"

interface User {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  deleteAccount: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      fetchUser()
    }
  }, [])

  const fetchUser = async () => {
    try {
      // For reqres.in, we'll use a static user since the API doesn't provide a /me endpoint
      const response = await api.get("/users/2") // Using user 2 as an example
      const userData = {
        id: response.data.data.id,
        email: response.data.data.email,
        name: `${response.data.data.first_name} ${response.data.data.last_name}`,
        role: "user",
        isActive: true
      }
      setUser(userData)
    } catch (error) {
      console.error("Error fetching user:", error)
      localStorage.removeItem("token")
      navigate("/login")
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      
      const { token } = response.data
      localStorage.setItem("token", token)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      
      await fetchUser() // This will set the user data
      navigate("/")
      toast.success("Login successful!")
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed")
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      await api.post("/api/auth/register", { name, email, password })
      toast.success("Registration successful! Please login.")
      navigate("/login")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed")
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    delete api.defaults.headers.common["Authorization"]
    navigate("/login")
    toast.success("Logged out successfully")
  }

  const deleteAccount = async () => {
    try {
      // Make API call to delete account
      await fetch("/api/users/me", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      // Clear local auth state
      setUser(null)
      // Remove any stored tokens or session data
      localStorage.removeItem("user")
      
      return true
    } catch (error) {
      console.error("Failed to delete account:", error)
      throw error
    }
  }

  const value = {
    user,
    login,
    logout,
    register,
    deleteAccount,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

