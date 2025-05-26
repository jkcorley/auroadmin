"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Search, DollarSign, Clock, CheckCircle, XCircle, MapPin } from "lucide-react"
import AddOrderDialog from "./AddOrderDialog"
import { supabase } from "@/lib/supabase"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingActions, setPendingActions] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function loadOrders() {
      try {
        const { data, error } = await supabase
          .from("supply_orders")
          .select("*")
          .order("order_timestamp", { ascending: false })
        if (error) throw error
        setOrders(data || [])
      } catch (error) {
        console.error("Error loading orders:", error)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  const handleApprove = (orderId: string) => {
    setPendingActions((prev) => new Set(prev).add(orderId))
    // Simulate API call
    setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.supply_order_id === orderId ? { ...order, order_status: "Approved" } : order,
        ),
      )
      setPendingActions((prev) => {
        const newSet = new Set(prev)
        newSet.delete(orderId)
        return newSet
      })
    }, 1000)
  }

  const handleDecline = (orderId: string) => {
    setPendingActions((prev) => new Set(prev).add(orderId))
    // Simulate API call
    setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.supply_order_id === orderId ? { ...order, order_status: "Declined" } : order,
        ),
      )
      setPendingActions((prev) => {
        const newSet = new Set(prev)
        newSet.delete(orderId)
        return newSet
      })
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "declined":
        return <Badge variant="destructive">Declined</Badge>
      case "shipped":
        return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading orders...</div>
        </div>
      </div>
    )
  }

  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.order_status?.toLowerCase() === "pending").length
  const approvedOrders = orders.filter((o) => o.order_status?.toLowerCase() === "approved").length
  const totalRevenue = orders.reduce((sum, o) => sum + Number.parseFloat(o.total_order_amount || "0"), 0)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Supply Orders</h2>
        <AddOrderDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Supply Orders Management</CardTitle>
          <CardDescription>Review and approve supply orders from users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search orders..." className="pl-8" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Delivery Address</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.supply_order_id}>
                  <TableCell className="font-medium">{order.supply_order_id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.user_full_name_snapshot}</div>
                      <div className="text-sm text-muted-foreground">ID: {order.user_id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start">
                      <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <div>{order.delivery_address_street}</div>
                        <div className="text-muted-foreground">
                          {order.delivery_address_city}, {order.delivery_address_state} {order.delivery_address_zip}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{order.order_timestamp ? new Date(order.order_timestamp).toLocaleDateString() : ""}</TableCell>
                  <TableCell>{getStatusBadge(order.order_status)}</TableCell>
                  <TableCell>{getPaymentBadge(order.payment_status)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">${order.total_order_amount}</div>
                      <div className="text-xs text-muted-foreground">Subtotal: ${order.subtotal_amount}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {order.order_status?.toLowerCase() === "pending" ? (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(order.supply_order_id)}
                            disabled={pendingActions.has(order.supply_order_id)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {pendingActions.has(order.supply_order_id) ? "..." : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDecline(order.supply_order_id)}
                            disabled={pendingActions.has(order.supply_order_id)}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            {pendingActions.has(order.supply_order_id) ? "..." : "Decline"}
                          </Button>
                        </>
                      ) : (
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
