"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { Edit, Trash2, Search, UserPlus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../services/api"
import type { User } from "../types"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Pagination } from "../components/Pagination"
import { UserModal } from "../components/UserModal"
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal"
import { Badge } from "../components/ui/badge"

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const fetchUsers = async (page = 1, search = "") => {
    setLoading(true)
    try {
      const response = await api.get("/api/users", {
        params: { page, limit: 10, search },
      })
      setUsers(response.data.users)
      setTotalPages(response.data.totalPages)
      setCurrentPage(response.data.currentPage)
    } catch (error) {
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(currentPage, searchTerm)
  }, [currentPage])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers(1, searchTerm)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleCreateUser = () => {
    setSelectedUser(null)
    setIsCreating(true)
    setIsModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsCreating(false)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      await api.delete(`/api/users/${selectedUser._id}`)
      toast.success("User deleted successfully")
      fetchUsers(currentPage, searchTerm)
    } catch (error) {
      toast.error("Failed to delete user")
    } finally {
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
    }
  }

  const handleSaveUser = async (userData: Partial<User>) => {
    try {
      if (isCreating) {
        await api.post("/api/users", userData)
        toast.success("User created successfully")
      } else if (selectedUser) {
        await api.put(`/api/users/${selectedUser._id}`, userData)
        toast.success("User updated successfully")
      }
      fetchUsers(currentPage, searchTerm)
      setIsModalOpen(false)
    } catch (error) {
      toast.error(isCreating ? "Failed to create user" : "Failed to update user")
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <motion.div
          className="flex justify-between items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold">User Management</h1>
          <Button
            onClick={handleCreateUser}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                />
                <Button type="submit" variant="outline" className="transition-all duration-300 hover:bg-blue-50">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>

              {loading ? (
                <div className="text-center py-8">
                  <motion.div
                    className="inline-block"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <svg
                      className="w-8 h-8 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </motion.div>
                  <p className="mt-2 text-gray-500">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <UserPlus className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No users found</p>
                  <Button onClick={handleCreateUser} variant="link" className="mt-2 text-blue-600">
                    Add your first user
                  </Button>
                </motion.div>
              ) : (
                <>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {users.map((user, index) => (
                            <motion.tr
                              key={user._id}
                              variants={item}
                              initial="hidden"
                              animate="show"
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ delay: index * 0.05 }}
                              className="bg-white hover:bg-gray-50 transition-colors"
                            >
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {user.role || "User"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`${
                                    user.isActive
                                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                                      : "bg-red-100 text-red-800 hover:bg-red-200"
                                  } transition-colors`}
                                >
                                  {user.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditUser(user)}
                                    className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteClick(user)}
                                    className="hover:bg-red-50 hover:text-red-600 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
          user={selectedUser}
          isCreating={isCreating}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteUser}
          title="Delete User"
          description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        />
      </motion.div>
    </motion.div>
  )
}

export default UserManagement

