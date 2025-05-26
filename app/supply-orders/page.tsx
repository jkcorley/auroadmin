"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

export default function SupplyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from("supply_orders")
        .select("*")
        .order("order_timestamp", { ascending: false })
      if (error) {
        setOrders([])
      } else {
        setOrders(data || [])
      }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  if (loading) {
    return <div className="p-4">Loading supply orders...</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Supply Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Supply Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.supply_order_id}>
                  <TableCell>{order.supply_order_id}</TableCell>
                  <TableCell>{order.user_full_name_snapshot}</TableCell>
                  <TableCell><Badge>{order.order_status}</Badge></TableCell>
                  <TableCell>{order.order_timestamp ? new Date(order.order_timestamp).toLocaleDateString() : ""}</TableCell>
                  <TableCell>${order.total_order_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 