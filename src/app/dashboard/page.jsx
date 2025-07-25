"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  Activity,
  TrendingUp,
  Settings,
  LogOut,
  Stethoscope,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  History,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [sessions, setSessions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      window.location.href = "/auth/login"
      return
    }

    // Load user data
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Load sessions from localStorage
      const savedSessions = localStorage.getItem(`sessions_${parsedUser.id}`)
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions))
      }
    }

    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    window.location.href = "/"
  }

  const getSessionStatus = (session) => {
    if (session.completed) return "completed"
    if (session.feedback) return "feedback-given"
    return "in-progress"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "feedback-given":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "feedback-given":
        return <Clock className="h-4 w-4" />
      case "in-progress":
        return <Activity className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">Please log in to access your dashboard.</p>
            <Link href="/auth/login">
              <Button>Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Health Assistant
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.firstName}!</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Welcome to Your Health Dashboard</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Track your health journey, view past analyses, and get personalized insights.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Total Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{sessions.length}</div>
                <p className="text-sm text-gray-600 mt-1">Health analyses completed</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Successful Treatments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{sessions.filter((s) => s.completed).length}</div>
                <p className="text-sm text-gray-600 mt-1">Remedies that helped</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Member Since
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-purple-600">{new Date(user.createdAt).toLocaleDateString()}</div>
                <p className="text-sm text-gray-600 mt-1">Account created</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>Start a new health analysis or manage your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/">
                  <Button className="w-full h-16 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                    <Plus className="h-5 w-5 mr-2" />
                    New Symptom Analysis
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full h-16 text-lg border-2 hover:bg-gray-50 transition-all duration-300 bg-transparent"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Account Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <History className="h-6 w-6 text-blue-600" />
                Recent Health Sessions
              </CardTitle>
              <CardDescription>Your latest symptom analyses and treatments</CardDescription>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Activity className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">No Sessions Yet</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Start your first health analysis to see your session history here.
                  </p>
                  <Link href="/">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Start First Analysis
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.slice(0, 5).map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {getStatusIcon(getSessionStatus(session))}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {session.symptoms?.join(", ") || "Symptom Analysis"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(session.date).toLocaleDateString()} at{" "}
                            {new Date(session.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(getSessionStatus(session))} border font-medium`}>
                        {getSessionStatus(session).replace("-", " ")}
                      </Badge>
                    </div>
                  ))}
                  {sessions.length > 5 && (
                    <div className="text-center pt-4">
                      <Button variant="outline">View All Sessions</Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Tips */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Stethoscope className="h-6 w-6 text-green-600" />
                Daily Health Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="border-green-200 bg-green-50">
                <AlertTriangle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Stay Hydrated:</strong> Drink at least 8 glasses of water daily to maintain optimal health and
                  help your body function properly.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
