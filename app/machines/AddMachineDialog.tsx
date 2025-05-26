'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { WashingMachine } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AddMachineDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    machine_id: '',
    laundromat_id: '',
    machine_type: '',
    current_status: 'Available',
    last_maintenance: '',
    usage_percentage: '',
    onboarding_date: '',
    contract_status: '',
    payment_terms: '',
    commission_rate: '',
    average_monthly_revenue: '',
    last_revenue_update: '',
    admin_notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.from('machines').insert({
      machine_id: form.machine_id,
      laundromat_id: form.laundromat_id,
      machine_type: form.machine_type,
      current_status: form.current_status,
      last_maintenance: form.last_maintenance || null,
      usage_percentage: form.usage_percentage ? parseFloat(form.usage_percentage) : null,
      onboarding_date: form.onboarding_date || null,
      contract_status: form.contract_status,
      payment_terms: form.payment_terms,
      commission_rate: form.commission_rate ? parseFloat(form.commission_rate) : null,
      average_monthly_revenue: form.average_monthly_revenue ? parseFloat(form.average_monthly_revenue) : null,
      last_revenue_update: form.last_revenue_update || null,
      admin_notes: form.admin_notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setLoading(false);
    if (error) {
      setMessage('Error adding machine: ' + error.message);
    } else {
      setMessage('Machine added!');
      setTimeout(() => {
        setOpen(false);
        window.location.reload();
      }, 800);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="ml-2">
          <WashingMachine className="mr-2 h-4 w-4" />
          Add Machine
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Machine</DialogTitle>
          <DialogDescription>Fill out the form to add a new machine to Supabase.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <Label>Machine ID</Label>
            <Input name="machine_id" value={form.machine_id} onChange={handleChange} />
          </div>
          <div>
            <Label>Laundromat ID</Label>
            <Input name="laundromat_id" value={form.laundromat_id} onChange={handleChange} />
          </div>
          <div>
            <Label>Machine Type</Label>
            <Select value={form.machine_type} onValueChange={(value) => handleSelectChange('machine_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Washer">Washer</SelectItem>
                <SelectItem value="Dryer">Dryer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Current Status</Label>
            <Select value={form.current_status} onValueChange={(value) => handleSelectChange('current_status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="In Use">In Use</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Out of Order">Out of Order</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Last Maintenance</Label>
            <Input name="last_maintenance" type="date" value={form.last_maintenance} onChange={handleChange} />
          </div>
          <div>
            <Label>Usage Percentage</Label>
            <Input name="usage_percentage" type="number" step="0.01" value={form.usage_percentage} onChange={handleChange} />
          </div>
          <div>
            <Label>Onboarding Date</Label>
            <Input name="onboarding_date" type="date" value={form.onboarding_date} onChange={handleChange} />
          </div>
          <div>
            <Label>Contract Status</Label>
            <Input name="contract_status" value={form.contract_status} onChange={handleChange} />
          </div>
          <div>
            <Label>Payment Terms</Label>
            <Input name="payment_terms" value={form.payment_terms} onChange={handleChange} />
          </div>
          <div>
            <Label>Commission Rate (%)</Label>
            <Input name="commission_rate" type="number" step="0.01" value={form.commission_rate} onChange={handleChange} />
          </div>
          <div>
            <Label>Avg. Monthly Revenue</Label>
            <Input name="average_monthly_revenue" type="number" step="0.01" value={form.average_monthly_revenue} onChange={handleChange} />
          </div>
          <div>
            <Label>Last Revenue Update</Label>
            <Input name="last_revenue_update" type="date" value={form.last_revenue_update} onChange={handleChange} />
          </div>
          <div className="col-span-2">
            <Label>Admin Notes</Label>
            <Textarea name="admin_notes" value={form.admin_notes} onChange={handleChange} />
          </div>
        </div>
        {message && <div className="mt-2 text-sm text-center text-red-600">{message}</div>}
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : 'Add Machine'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 