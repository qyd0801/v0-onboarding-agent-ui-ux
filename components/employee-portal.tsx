"use client"

import { useState } from "react"
import { LoginForm } from "./employee-auth/login-form"
import { EmployeeDashboard } from "./employee-dashboard"

interface EmployeePortalProps {
  onRoleChange: (role: "admin" | "employee" | null) => void
}

export function EmployeePortal({ onRoleChange }: EmployeePortalProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const handleLogin = (userData: any) => {
    setCurrentUser(userData)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
  }

  if (isLoggedIn && currentUser) {
    return <EmployeeDashboard user={currentUser} onLogout={handleLogout} />
  }

  return <LoginForm onLogin={handleLogin} onAdminAccess={() => onRoleChange("admin")} />
}
