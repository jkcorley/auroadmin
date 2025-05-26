'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AddDriverDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    driver_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    vehicle_type: '',
    license_number: '',
    license_expiry: '',
    insurance_info: '',
    status: 'Active',
    onboarding_date: '',
    contract_status: '',
    payment_terms: '',
    commission_rate: '',
    average_monthly_earnings: '',
    last_payment_date: '',
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
    const { error } = await supabase.from('drivers').insert({
      driver_id: form.driver_id,
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      vehicle_type: form.vehicle_type,
      license_number: form.license_number,
      license_expiry: form.license_expiry || null,
      insurance_info: form.insurance_info,
      status: form.status,
      onboarding_date: form.onboarding_date || null,
      contract_status: form.contract_status,
      payment_terms: form.payment_terms,
      commission_rate: form.commission_rate ? parseFloat(form.commission_rate) : null,
      average_monthly_earnings: form.average_monthly_earnings ? parseFloat(form.average_monthly_earnings) : null,
      last_payment_date: form.last_payment_date || null,
      admin_notes: form.admin_notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setLoading(false);
    if (error) {
      setMessage('Error adding driver: ' + error.message);
    } else {
      setMessage('Driver added!');
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
          <UserPlus className="mr-2 h-4 w-4" />
          Add Driver
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Driver</DialogTitle>
          <DialogDescription>Fill out the form to add a new driver to Supabase.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <Label>Driver ID</Label>
            <Input name="driver_id" value={form.driver_id} onChange={handleChange} />
          </div>
          <div>
            <Label>First Name</Label>
            <Input name="first_name" value={form.first_name} onChange={handleChange} />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input name="last_name" value={form.last_name} onChange={handleChange} />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input name="phone" type="tel" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <Label>Vehicle Type</Label>
            <Select value={form.vehicle_type} onValueChange={(value) => handleSelectChange('vehicle_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Car">Car</SelectItem>
                <SelectItem value="Van">Van</SelectItem>
                <SelectItem value="Truck">Truck</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>License Number</Label>
            <Input name="license_number" value={form.license_number} onChange={handleChange} />
          </div>
          <div>
            <Label>License Expiry</Label>
            <Input name="license_expiry" type="date" value={form.license_expiry} onChange={handleChange} />
          </div>
          <div>
            <Label>Insurance Info</Label>
            <Input name="insurance_info" value={form.insurance_info} onChange={handleChange} />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
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
            <Label>Avg. Monthly Earnings</Label>
            <Input name="average_monthly_earnings" type="number" step="0.01" value={form.average_monthly_earnings} onChange={handleChange} />
          </div>
          <div>
            <Label>Last Payment Date</Label>
            <Input name="last_payment_date" type="date" value={form.last_payment_date} onChange={handleChange} />
          </div>
          <div className="col-span-2">
            <Label>Admin Notes</Label>
            <Textarea name="admin_notes" value={form.admin_notes} onChange={handleChange} />
          </div>
        </div>
        {message && <div className="mt-2 text-sm text-center text-red-600">{message}</div>}
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : 'Add Driver'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 