'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AddLaundromatDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone_number: '',
    hours_of_operation: '',
    contact_person: '',
    contact_email: '',
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

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.from('participating_laundromats').insert({
      laundromat_id: crypto.randomUUID(),
      name: form.name,
      address: form.address,
      phone_number: form.phone_number,
      hours_of_operation: form.hours_of_operation,
      contact_person: form.contact_person,
      contact_email: form.contact_email,
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
      setMessage('Error adding laundromat: ' + error.message);
    } else {
      setMessage('Laundromat added!');
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
          <Building2 className="mr-2 h-4 w-4" />
          Add Laundromat
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Laundromat</DialogTitle>
          <DialogDescription>Fill out the form to add a new laundromat to Supabase.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <Label>Address</Label>
            <Input name="address" value={form.address} onChange={handleChange} />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input name="phone_number" value={form.phone_number} onChange={handleChange} />
          </div>
          <div>
            <Label>Hours of Operation</Label>
            <Input name="hours_of_operation" value={form.hours_of_operation} onChange={handleChange} />
          </div>
          <div>
            <Label>Contact Person</Label>
            <Input name="contact_person" value={form.contact_person} onChange={handleChange} />
          </div>
          <div>
            <Label>Contact Email</Label>
            <Input name="contact_email" value={form.contact_email} onChange={handleChange} />
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
            {loading ? 'Adding...' : 'Add Laundromat'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 