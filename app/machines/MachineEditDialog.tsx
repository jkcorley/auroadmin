"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function MachineEditDialog({ machine }: { machine: any }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ ...machine })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage(null)
    const { error } = await supabase
      .from("machines")
      .update({
        machine_type: form.machine_type,
        status: form.status,
        last_maintenance: form.last_maintenance,
        usage_percentage: form.usage_percentage,
        onboarding_date: form.onboarding_date,
        contract_status: form.contract_status,
        payment_terms: form.payment_terms,
        commission_rate: form.commission_rate,
        average_monthly_revenue: form.average_monthly_revenue,
        last_revenue_update: form.last_revenue_update,
        admin_notes: form.admin_notes,
        created_at: form.created_at,
        updated_at: new Date().toISOString(),
      })
      .eq("machine_id", form.machine_id)
    setLoading(false)
    if (error) {
      setMessage("Error saving: " + error.message)
    } else {
      setMessage("Saved!")
      setTimeout(() => {
        setOpen(false)
        window.location.reload()
      }, 800)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Machine - {form.machine_id}</DialogTitle>
          <DialogDescription>Edit all fields and save to update Supabase.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <Label>Machine ID</Label>
            <Input name="machine_id" value={form.machine_id} disabled />
          </div>
          <div>
            <Label>Laundromat ID</Label>
            <Input name="laundromat_id" value={form.laundromat_id} disabled />
          </div>
          <div>
            <Label>Type</Label>
            <Input name="machine_type" value={form.machine_type || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Status</Label>
            <Input name="status" value={form.status || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Last Maintenance</Label>
            <Input name="last_maintenance" value={form.last_maintenance || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Usage %</Label>
            <Input name="usage_percentage" value={form.usage_percentage || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Onboarding Date</Label>
            <Input name="onboarding_date" value={form.onboarding_date || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Contract Status</Label>
            <Input name="contract_status" value={form.contract_status || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Payment Terms</Label>
            <Input name="payment_terms" value={form.payment_terms || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Commission Rate</Label>
            <Input name="commission_rate" value={form.commission_rate || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Avg Monthly Revenue</Label>
            <Input name="average_monthly_revenue" value={form.average_monthly_revenue || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Last Revenue Update</Label>
            <Input name="last_revenue_update" value={form.last_revenue_update || ""} onChange={handleChange} />
          </div>
          <div className="col-span-2">
            <Label>Admin Notes</Label>
            <Textarea name="admin_notes" value={form.admin_notes || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Created At</Label>
            <Input name="created_at" value={form.created_at || ""} disabled />
          </div>
          <div>
            <Label>Updated At</Label>
            <Input name="updated_at" value={form.updated_at || ""} disabled />
          </div>
        </div>
        {message && <div className="mt-2 text-sm text-center text-red-600">{message}</div>}
        <div className="flex justify-end mt-4">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 