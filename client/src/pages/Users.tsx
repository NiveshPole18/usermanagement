"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { UserModal } from "../components/UserModal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Search, Edit2, UserPlus } from "lucide-react"
import type { User } from "../types"
import api from "../services/api"
import { toast } from "react-hot-toast"

const Users = () => {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async (pageNum = page) => {
    setIsLoading(true)
    try {
      const response = await api.get(`/users?page=${pageNum}`)
      setUsers(response.data.data)
      setTotalPages(response.data.total_pages)
      setPage(pageNum)
    } catch (error) {
      toast.error("Failed to fetch users")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveUser = async (userData: Partial<User>) => {
    try {
      if (isCreating) {
        await api.post("/api/users", userData)
      } else {
        await api.put(`/api/users/${selectedUser?.id}`, userData)
      }
      fetchUsers()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Failed to save user:", error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.delete(`/users/${userId}`)
      toast.success("User deleted successfully")
      fetchUsers()
    } catch (error) {
      toast.error("Failed to delete user")
      console.error(error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <Button 
          onClick={() => {
            setIsCreating(true)
            setSelectedUser(null)
            setIsModalOpen(true)
          }}
          className="bg-sky-500 hover:bg-sky-600"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card className="bg-slate-900/50 border-white/[0.08]">
        <CardHeader>
          <CardTitle className="text-white">User Management</CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-400"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px] bg-white/[0.04] border-white/[0.08] text-white">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/[0.08]">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-white/[0.08] overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/[0.02]">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.08]">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 text-white">{user.name}</td>
                    <td className="py-3 px-4 text-slate-300">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-sky-500/10 text-sky-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsCreating(false)
                          setIsModalOpen(true)
                        }}
                        className="text-slate-300 hover:text-white hover:bg-white/[0.04]"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-slate-400">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fetchUsers(page - 1)}
                disabled={page === 1 || isLoading}
                className="border-white/[0.08] text-slate-300"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => fetchUsers(page + 1)}
                disabled={page === totalPages || isLoading}
                className="border-white/[0.08] text-slate-300"
              >
                Next
              </Button>
            </div>
          </div>
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </CardContent>
      </Card>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        isCreating={isCreating}
      />
    </div>
  )
}

export default Users 