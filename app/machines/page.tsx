import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Edit, Wrench, ChevronLeft, ChevronRight } from "lucide-react"
import { getMachinesPaginated } from "@/lib/database"
import MachineEditDialog from "./MachineEditDialog"
import MachinesTable from "./MachinesTable"
import AddMachineDialog from "./AddMachineDialog"

const PAGE_SIZE = 50

export default async function MachinesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Properly handle searchParams in Next.js 13+
  const pageParam = await Promise.resolve(searchParams?.page)
  const page = typeof pageParam === 'string' ? Number(pageParam) : 1
  const offset = (page - 1) * PAGE_SIZE
  
  const { machines, total } = await getMachinesPaginated(offset, PAGE_SIZE)
  
  // Debug log
  console.log('Machines data:', JSON.stringify(machines, null, 2))

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "online":
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "offline":
        return <Badge variant="destructive">Offline</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const availableCount = machines.filter((m) => m.current_status && m.current_status.toLowerCase() === "available").length;
  const inUseCount = machines.filter((m) => m.current_status && m.current_status.toLowerCase() === "in use").length;
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Machines</h2>
        <AddMachineDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inUseCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Machines Table in Card */}
      <Card>
        <CardHeader>
          <CardTitle>Machines List</CardTitle>
          <CardDescription>Manage and monitor all machines across locations</CardDescription>
        </CardHeader>
        <CardContent>
          <MachinesTable machines={machines} />
        </CardContent>
      </Card>
    </div>
  )
}
