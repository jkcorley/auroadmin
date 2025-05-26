"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@supabase/supabase-js"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function AnalyticsPage() {
  const [machineStats, setMachineStats] = useState<any>(null)
  const [revenueStats, setRevenueStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch machine status distribution
        const { data: machines } = await supabase
          .from('machines')
          .select('current_status')

        const statusCounts = machines?.reduce((acc: any, machine) => {
          acc[machine.current_status] = (acc[machine.current_status] || 0) + 1
          return acc
        }, {})

        const machineData = Object.entries(statusCounts || {}).map(([status, count]) => ({
          name: status,
          value: count,
        }))

        // Fetch revenue data
        const { data: revenueData } = await supabase
          .from('machines')
          .select('average_monthly_revenue, machine_type')
          .not('average_monthly_revenue', 'is', null)

        const revenueByType = revenueData?.reduce((acc: any, machine) => {
          acc[machine.machine_type] = (acc[machine.machine_type] || 0) + (machine.average_monthly_revenue || 0)
          return acc
        }, {})

        const revenueChartData = Object.entries(revenueByType || {}).map(([type, revenue]) => ({
          name: type,
          revenue: Number(revenue),
        }))

        setMachineStats(machineData)
        setRevenueStats(revenueChartData)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="machines">Machines</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Machines</h3>
              <p className="text-2xl font-bold">{machineStats?.reduce((acc: number, curr: any) => acc + curr.value, 0)}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-bold">
                ${revenueStats?.reduce((acc: number, curr: any) => acc + curr.revenue, 0).toFixed(2)}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Available Machines</h3>
              <p className="text-2xl font-bold">
                {machineStats?.find((stat: any) => stat.name === 'Available')?.value || 0}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500">In Use Machines</h3>
              <p className="text-2xl font-bold">
                {machineStats?.find((stat: any) => stat.name === 'In Use')?.value || 0}
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="machines" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Machine Status Distribution</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={machineStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {machineStats?.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Revenue by Machine Type</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
