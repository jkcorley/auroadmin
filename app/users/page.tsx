"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, ChevronDown, ChevronRight, Mail, Phone, MapPin, Calendar } from "lucide-react"
import AddUserDialog from "./AddUserDialog"
import { supabase } from "@/lib/supabase"
import React from "react"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase.from("users").select("*").order("user_id")
        if (error) throw error
        setUsers(data || [])
      } catch (error) {
        console.error("Error loading users from Supabase:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const toggleUserExpansion = (userId: string) => {
    const newExpanded = new Set(expandedUsers)
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId)
    } else {
      newExpanded.add(userId)
    }
    setExpandedUsers(newExpanded)
  }

  const getStatusBadge = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading users...</div>
        </div>
      </div>
    )
  }

  const activeUsers = users.filter((u) => (u.account_status || u.status) === "Active").length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <AddUserDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage user accounts and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-8" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="User role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]" />
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.slice(0, 20).map((user) => {
                const isExpanded = expandedUsers.has(user.user_id)
                return (
                  <React.Fragment key={user.user_id}>
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toggleUserExpansion(user.user_id)}>
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.full_name || `${user.first_name || ""} ${user.last_name || ""}`}</div>
                          <div className="text-sm text-muted-foreground">ID: {user.user_id}</div>
                          <div className="text-sm text-muted-foreground">Role: {user.user_role || user.role}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone_number || user.phone}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {user.default_pickup_address_street || user.address}
                          </div>
                          {(user.default_pickup_address_city || user.default_pickup_address_state || user.default_pickup_address_zip) && (
                            <div className="text-muted-foreground text-xs">
                              {[user.default_pickup_address_city, user.default_pickup_address_state, user.default_pickup_address_zip].filter(Boolean).join(", ")}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.account_status || user.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {user.last_login_timestamp || user.last_login ? (
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(user.last_login_timestamp || user.last_login).toLocaleDateString()}
                            </div>
                          ) : (
                            "Never"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            Message
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {/* Expanded row for future details if needed */}
                  </React.Fragment>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
