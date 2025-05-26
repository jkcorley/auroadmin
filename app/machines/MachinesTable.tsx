'use client';

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import MachineEditDialog from "./MachineEditDialog";
import { Badge } from "@/components/ui/badge";

export default function MachinesTable({ machines }: { machines: any[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");

  const filtered = machines.filter((m) => {
    const matchesSearch =
      m.machine_id.toLowerCase().includes(search.toLowerCase()) ||
      (m.participating_laundromats?.name || m.laundromat_id).toLowerCase().includes(search.toLowerCase()) ||
      (m.machine_type || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || (m.current_status || "").toLowerCase() === status;
    const matchesType = type === "all" || (m.machine_type || "").toLowerCase() === type;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string | null | undefined) => {
    if (!status) return <Badge variant="secondary">Unknown</Badge>;
    switch (status.toLowerCase()) {
      case "online":
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "offline":
        return <Badge variant="destructive">Offline</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search machines..."
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="washer">Washer</SelectItem>
            <SelectItem value="dryer">Dryer</SelectItem>
            <SelectItem value="combo">Combo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Machine ID</TableHead>
              <TableHead>Laundromat</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((machine) => (
              <TableRow key={machine.machine_id}>
                <TableCell className="font-medium">{machine.machine_id}</TableCell>
                <TableCell>{machine.participating_laundromats?.name || machine.laundromat_id}</TableCell>
                <TableCell>{machine.machine_type || '-'}</TableCell>
                <TableCell>{getStatusBadge(machine.current_status)}</TableCell>
                <TableCell>
                  <MachineEditDialog machine={machine} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
} 