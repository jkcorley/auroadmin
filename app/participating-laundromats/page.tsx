import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, MapPin, Phone, Clock, Search, ExternalLink } from "lucide-react"
import { getCachedCSV } from "@/lib/csv-loader"

async function getParticipatingLaundromats() {
  try {
    const laundromats = (await getCachedCSV("participating_laundromats" as const)) as any[]
    return laundromats.map((laundromat, index) => ({
      ...laundromat,
      totalMachines: Math.floor(Math.random() * 15) + 8,
      activeMachines: Math.floor(Math.random() * 12) + 6,
      revenue: Math.floor(Math.random() * 10000) + 5000,
    }))
  } catch (error) {
    console.error("Error loading participating laundromats:", error)
    return []
  }
}

async function getAllMachines() {
  try {
    return await getCachedCSV("machines");
  } catch (error) {
    console.error("Error loading machines:", error);
    return [];
  }
}

export default async function ParticipatingLaundromatsPage() {
  const laundromats = await getParticipatingLaundromats()
  const machines = await getAllMachines()

  const totalLocations = laundromats.length
  const avgRating = laundromats.length > 0
    ? laundromats.reduce((sum, l) => sum + Number.parseFloat(l.rating || "0"), 0) / laundromats.length
    : 0.0
  const totalMachines = laundromats.reduce((sum, l) => sum + l.totalMachines, 0)
  const activeMachines = laundromats.reduce((sum, l) => sum + l.activeMachines, 0)

  // Group by borough
  const boroughCounts = laundromats.reduce(
    (acc: Record<string, number>, l) => {
      const borough = l.borough || "Unknown"
      acc[borough] = (acc[borough] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Helper to count active machines for a laundromat
  function countActiveMachines(laundromat_id: string) {
    return machines.filter(
      (m) => m.laundromat_id === laundromat_id && (m.status?.toLowerCase() === "active")
    ).length;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Participating Laundromats</h2>
        <Button>
          <Building2 className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLocations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)} ⭐</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMachines}</div>
            <p className="text-xs text-muted-foreground">{activeMachines} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Borough</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.entries(boroughCounts).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {Object.entries(boroughCounts).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[1] || 0} locations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Participating Laundromat Locations</CardTitle>
          <CardDescription>All registered participating laundromat locations in NYC</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search participating laundromats..." className="pl-8" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by borough" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Boroughs</SelectItem>
                {Object.keys(boroughCounts).map((borough) => (
                  <SelectItem key={borough} value={borough.toLowerCase()}>
                    {borough}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="machines">Machine Count</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Neighborhood</TableHead>
                <TableHead>Borough</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Active Machines</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {laundromats.map((laundromat) => (
                <TableRow key={laundromat.laundromat_id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{laundromat.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {laundromat.address}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{laundromat.neighborhood}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{laundromat.borough || "Unknown"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="font-medium">{laundromat.rating}</span>
                      <span className="ml-1">⭐</span>
                      <span className="text-sm text-muted-foreground ml-1">({laundromat.total_user_ratings})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{countActiveMachines(laundromat.laundromat_id)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {laundromat.phone && (
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {laundromat.phone}
                        </div>
                      )}
                      {laundromat.hours_of_operation && (
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span className="truncate">{laundromat.hours_of_operation.slice(0, 20)}...</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                      {laundromat.google_maps_url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={laundromat.google_maps_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
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