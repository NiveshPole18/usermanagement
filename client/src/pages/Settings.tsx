"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { DeleteAccountModal } from "../components/DeleteAccountModal"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"

const Settings = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { deleteAccount } = useAuth()
  const navigate = useNavigate()

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount()
      navigate("/login")
    } catch (error) {
      console.error("Failed to delete account:", error)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Manage your application preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Settings content will go here</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Danger Zone</h3>
        <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-red-400">Delete Account</h4>
              <p className="text-sm text-slate-400">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  )
}

export default Settings 