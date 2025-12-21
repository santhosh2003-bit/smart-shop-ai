import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { stores as initialStores } from '@/data/mockData';
import { Store } from '@/types';
import { toast } from 'sonner';

const AdminStores: React.FC = () => {
  const [storesList, setStoresList] = useState<Store[]>(initialStores);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', deliveryTime: '', distance: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStore: Store = {
      id: Date.now().toString(),
      name: formData.name,
      logo: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=100',
      rating: 4.5,
      reviewCount: 0,
      distance: formData.distance,
      deliveryTime: formData.deliveryTime,
      address: formData.address,
      isOpen: true,
    };
    setStoresList((prev) => [newStore, ...prev]);
    toast.success('Store registered successfully');
    setIsDialogOpen(false);
    setFormData({ name: '', address: '', deliveryTime: '', distance: '' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Stores</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Register Store</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Register New Store</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Store Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
                <div><Label>Address</Label><Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Delivery Time</Label><Input placeholder="10-15 min" value={formData.deliveryTime} onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})} required /></div>
                  <div><Label>Distance</Label><Input placeholder="1.2 km" value={formData.distance} onChange={(e) => setFormData({...formData, distance: e.target.value})} required /></div>
                </div>
                <Button type="submit" className="w-full">Register Store</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Card><CardContent className="p-4"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search stores..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div></CardContent></Card>
        <Card><CardHeader><CardTitle>All Stores ({storesList.length})</CardTitle></CardHeader><CardContent>
          <Table><TableHeader><TableRow><TableHead>Store</TableHead><TableHead>Address</TableHead><TableHead>Rating</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>{storesList.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((store) => (
              <TableRow key={store.id}><TableCell><div className="flex items-center gap-3"><img src={store.logo} alt={store.name} className="w-10 h-10 rounded-lg object-cover" /><span className="font-medium">{store.name}</span></div></TableCell><TableCell><div className="flex items-center gap-1 text-muted-foreground"><MapPin className="w-4 h-4" />{store.address}</div></TableCell><TableCell><div className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{store.rating}</div></TableCell><TableCell><Badge variant={store.isOpen ? 'default' : 'secondary'}>{store.isOpen ? 'Open' : 'Closed'}</Badge></TableCell><TableCell><div className="flex gap-2"><Button variant="ghost" size="icon"><Edit2 className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setStoresList(prev => prev.filter(s => s.id !== store.id)); toast.success('Store deleted'); }}><Trash2 className="w-4 h-4" /></Button></div></TableCell></TableRow>
            ))}</TableBody></Table>
        </CardContent></Card>
      </div>
    </AdminLayout>
  );
};

export default AdminStores;
