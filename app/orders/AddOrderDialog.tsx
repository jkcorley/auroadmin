'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AddOrderDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    order_id: '',
    customer_id: '',
    laundromat_id: '',
    driver_id: '',
    order_type: '',
    status: 'Pending',
    pickup_date: '',
    delivery_date: '',
    pickup_address: '',
    delivery_address: '',
    items: '',
    total_amount: '',
    payment_status: 'Pending',
    payment_method: '',
    special_instructions: '',
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
    const { error } = await supabase.from('orders').insert({
      order_id: form.order_id,
      customer_id: form.customer_id,
      laundromat_id: form.laundromat_id,
      driver_id: form.driver_id,
      order_type: form.order_type,
      status: form.status,
      pickup_date: form.pickup_date || null,
      delivery_date: form.delivery_date || null,
      pickup_address: form.pickup_address,
      delivery_address: form.delivery_address,
      items: form.items,
      total_amount: form.total_amount ? parseFloat(form.total_amount) : null,
      payment_status: form.payment_status,
      payment_method: form.payment_method,
      special_instructions: form.special_instructions,
      admin_notes: form.admin_notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setLoading(false);
    if (error) {
      setMessage('Error adding order: ' + error.message);
    } else {
      setMessage('Order added!');
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
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Order</DialogTitle>
          <DialogDescription>Fill out the form to add a new order to Supabase.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <Label>Order ID</Label>
            <Input name="order_id" value={form.order_id} onChange={handleChange} />
          </div>
          <div>
            <Label>Customer ID</Label>
            <Input name="customer_id" value={form.customer_id} onChange={handleChange} />
          </div>
          <div>
            <Label>Laundromat ID</Label>
            <Input name="laundromat_id" value={form.laundromat_id} onChange={handleChange} />
          </div>
          <div>
            <Label>Driver ID</Label>
            <Input name="driver_id" value={form.driver_id} onChange={handleChange} />
          </div>
          <div>
            <Label>Order Type</Label>
            <Select value={form.order_type} onValueChange={(value) => handleSelectChange('order_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Wash & Fold">Wash & Fold</SelectItem>
                <SelectItem value="Dry Cleaning">Dry Cleaning</SelectItem>
                <SelectItem value="Ironing">Ironing</SelectItem>
                <SelectItem value="Express">Express</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
                <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Pickup Date</Label>
            <Input name="pickup_date" type="datetime-local" value={form.pickup_date} onChange={handleChange} />
          </div>
          <div>
            <Label>Delivery Date</Label>
            <Input name="delivery_date" type="datetime-local" value={form.delivery_date} onChange={handleChange} />
          </div>
          <div>
            <Label>Pickup Address</Label>
            <Input name="pickup_address" value={form.pickup_address} onChange={handleChange} />
          </div>
          <div>
            <Label>Delivery Address</Label>
            <Input name="delivery_address" value={form.delivery_address} onChange={handleChange} />
          </div>
          <div>
            <Label>Items</Label>
            <Textarea name="items" value={form.items} onChange={handleChange} />
          </div>
          <div>
            <Label>Total Amount</Label>
            <Input name="total_amount" type="number" step="0.01" value={form.total_amount} onChange={handleChange} />
          </div>
          <div>
            <Label>Payment Status</Label>
            <Select value={form.payment_status} onValueChange={(value) => handleSelectChange('payment_status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Payment Method</Label>
            <Select value={form.payment_method} onValueChange={(value) => handleSelectChange('payment_method', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Debit Card">Debit Card</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="PayPal">PayPal</SelectItem>
                <SelectItem value="Venmo">Venmo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Special Instructions</Label>
            <Textarea name="special_instructions" value={form.special_instructions} onChange={handleChange} />
          </div>
          <div className="col-span-2">
            <Label>Admin Notes</Label>
            <Textarea name="admin_notes" value={form.admin_notes} onChange={handleChange} />
          </div>
        </div>
        {message && <div className="mt-2 text-sm text-center text-red-600">{message}</div>}
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : 'Add Order'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 