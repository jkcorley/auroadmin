'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    product_name: '',
    price: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.from('laundry_products').insert({ ...form, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    setLoading(false);
    if (error) {
      setMessage('Error adding product: ' + error.message);
    } else {
      setMessage('Product added!');
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
          <Package className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Fill out the form to add a new laundry product to Supabase.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <Label>Product Name</Label>
            <Input name="product_name" value={form.product_name} onChange={handleChange} />
          </div>
          <div>
            <Label>Price</Label>
            <Input name="price" value={form.price} onChange={handleChange} />
          </div>
          <div className="col-span-2">
            <Label>Description</Label>
            <Input name="description" value={form.description} onChange={handleChange} />
          </div>
        </div>
        {message && <div className="mt-2 text-sm text-center text-red-600">{message}</div>}
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 