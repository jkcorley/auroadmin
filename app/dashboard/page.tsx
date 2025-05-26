import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Truck, Calendar, Package, Wrench, AlertTriangle, CheckCircle } from "lucide-react"
import { getDashboardStats } from "@/lib/database"

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      title: "Total Laundromats",
      value: stats.totalLaundromats,
      description: "Active locations",
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Participating Laundromats",
      value: stats.participatingLaundromats,
      description: "Active partners",
      icon: Building2,
      color: "text-cyan-600",
    },
    {
      title: "Total Machines",
      value: stats.totalMachines,
      description: `${stats.brokenMachines} broken`,
      icon: Wrench,
      color: "text-green-600",
      badge:
        stats.brokenMachines > 0 ? { text: `${stats.brokenMachines} broken`, variant: "destructive" as const } : null,
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "Registered customers",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Active Drivers",
      value: stats.activeDrivers,
      description: `${stats.totalDrivers} total drivers`,
      icon: Truck,
      color: "text-orange-600",
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings,
      description: `${stats.totalBookings} total bookings`,
      icon: Calendar,
      color: "text-yellow-600",
      badge: stats.pendingBookings > 0 ? { text: "Needs attention", variant: "secondary" as const } : null,
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      description: `${stats.totalOrders} total orders`,
      icon: Package,
      color: "text-red-600",
      badge: stats.pendingOrders > 0 ? { text: "Needs approval", variant: "secondary" as const } : null,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            System Online
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{card.description}</p>
                {card.badge && (
                  <Badge variant={card.badge.variant} className="text-xs">
                    {card.badge.text}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">New booking created</p>
                <p className="text-sm text-muted-foreground">BOOK_00001 - Standard Washer Slot</p>
              </div>
              <div className="text-sm text-muted-foreground">2m ago</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Driver status updated</p>
                <p className="text-sm text-muted-foreground">Driver Alpha Test - Now Available</p>
              </div>
              <div className="text-sm text-muted-foreground">5m ago</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Supply order pending</p>
                <p className="text-sm text-muted-foreground">SORD_00002 - Awaiting approval</p>
              </div>
              <div className="text-sm text-muted-foreground">12m ago</div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current platform health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">API Status</span>
              <Badge variant="outline" className="text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Operational
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <Badge variant="outline" className="text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Payment System</span>
              <Badge variant="outline" className="text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Notifications</span>
              <Badge variant="outline" className="text-yellow-600">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {stats.pendingOrders + stats.pendingBookings} pending
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
