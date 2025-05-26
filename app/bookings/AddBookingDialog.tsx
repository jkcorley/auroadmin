'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AddBookingDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    user_id: '',
    laundromat_id: '',
    service_name: '',
    booking_date: '',
    estimated_cost: '',
    current_booking_status: '',
    admin_notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.from('bookings').insert({ ...form, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    setLoading(false);
    if (error) {
      setMessage('Error adding booking: ' + error.message);
    } else {
      setMessage('Booking added!');
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
          <Calendar className="mr-2 h-4 w-4" />
          Add Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Booking</DialogTitle>
          <DialogDescription>Fill out the form to add a new booking to Supabase.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <Label>User ID</Label>
            <Input name="user_id" value={form.user_id} onChange={handleChange} />
          </div>
          <div>
            <Label>Laundromat ID</Label>
            <Input name="laundromat_id" value={form.laundromat_id} onChange={handleChange} />
          </div>
          <div>
            <Label>Service Name</Label>
            <Input name="service_name" value={form.service_name} onChange={handleChange} />
          </div>
          <div>
            <Label>Booking Date</Label>
            <Input name="booking_date" value={form.booking_date} onChange={handleChange} />
          </div>
          <div>
            <Label>Estimated Cost</Label>
            <Input name="estimated_cost" value={form.estimated_cost} onChange={handleChange} />
          </div>
          <div>
            <Label>Status</Label>
            <Input name="current_booking_status" value={form.current_booking_status} onChange={handleChange} />
          </div>
          <div className="col-span-2">
            <Label>Admin Notes</Label>
            <Input name="admin_notes" value={form.admin_notes} onChange={handleChange} />
          </div>
        </div>
        {message && <div className="mt-2 text-sm text-center text-red-600">{message}</div>}
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : 'Add Booking'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 