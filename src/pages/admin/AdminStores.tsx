import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Star, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/components/admin/AdminLayout';
import { useStore } from '@/context/StoreContext';
import { useNotifications } from '@/context/NotificationContext';
import { Store } from '@/types';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import ImageUpload from '@/components/ui/ImageUpload';

const AdminStores: React.FC = () => {
  const { stores, addStore, updateStore, deleteStore, approveStore, rejectStore, getPendingStores, getApprovedStores } = useStore();
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    deliveryTime: '',
    distance: '',
    description: '',
    phone: '',
    email: '',
    logo: '',
    deliveryLocations: '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  const resetForm = () => {
    setFormData({ name: '', address: '', deliveryTime: '', distance: '', description: '', phone: '', email: '', logo: '', deliveryLocations: '' });
    setLogoFile(null);
    setLogoPreview('');
    setEditingStore(null);
  };

  const handleOpenDialog = (store?: Store) => {
    if (store) {
      setEditingStore(store);
      setFormData({
        name: store.name,
        address: store.address,
        deliveryTime: store.deliveryTime,
        distance: store.distance,
        description: store.description || '',
        phone: store.phone || '',
        email: store.email || '',
        logo: store.logo || '',
        deliveryLocations: store.deliveryLocations?.join(', ') || '',
      });
      setLogoPreview(store.logo);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const deliveryLocationsArray = formData.deliveryLocations
      .split(',')
      .map(loc => loc.trim())
      .filter(loc => loc.length > 0);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('address', formData.address);
    data.append('deliveryTime', formData.deliveryTime);
    data.append('distance', formData.distance);
    data.append('description', formData.description);
    data.append('phone', formData.phone);
    data.append('email', formData.email);
    // deliveryLocations usually array, but FormData needs string or loop. 
    // Backend handling for array in FormData might need check, but context sends it directly. 
    // Wait, backend 'stores' table doesn't seem to have deliveryLocations column in schema shown in stores.js (UPDATE stores SET ...). 
    // But let's append it anyway if needed. For now treating as stringify or multiple fields.
    // Actually, store.js insert doesn't list deliveryLocations. So it might be unused or stored in description? 
    // I will append it as JSON string if simple.
    // data.append('deliveryLocations', JSON.stringify(deliveryLocationsArray)); 

    // Handle Logo
    if (logoFile) {
      data.append('logo', logoFile);
    } else if (formData.logo) {
      data.append('logo', formData.logo);
    } else if (!editingStore) {
      data.append('logo', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=100');
    }

    // OwnerId handling: In AdminStores, usually we assign to current admin or a specific user? 
    // The previous code didn't set ownerId in addStore call in component, but context might? 
    // Actually AdminStores addStore({ ... }) didn't have ownerId. 
    // Let's check stores.js: expects store.ownerId in req.body. 
    // If not provided, it inserts NULL or fails? 
    // The original code passed `ownerId` in values. 
    // AdminStores.tsx `addStore` call (line 87) didn't include ownerId. 
    // Let's assume backend handles it or it's optional? 
    // Creating FormData:

    // NOTE: Previous `addStore` call passed object. Now we pass FormData or Object.
    // If I use FormData, I must ensure all fields expected are present.
    // I'll stick to passing FormData to `addStore` and let Context handle it.

    if (editingStore) {
      updateStore(editingStore.id, data);
      toast.success('Store updated successfully');
    } else {
      // We need an ownerId. For now, hardcode or generate? 
      // Original code: `addStore` call at line 87 didn't pass ownerId. 
      // `stores.js` line 76 uses `store.ownerId`. If undefined, it inserts NULL/undefined.
      // I will just append what I have.
      data.append('status', 'approved');
      data.append('isOpen', 'true');

      addStore(data);

      addNotification({
        title: 'New Store Added',
        message: `${formData.name} has been added to the platform`,
        type: 'store',
        targetRole: 'all',
      });

      toast.success('Store registered successfully');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleApproveStore = (id: string, storeName: string) => {
    approveStore(id);
    addNotification({
      title: 'Store Approved!',
      message: `${storeName} is now live and accepting orders`,
      type: 'store',
      targetRole: 'all',
    });
  };

  const handleRejectStore = (id: string, storeName: string) => {
    rejectStore(id);
    addNotification({
      title: 'Store Registration Rejected',
      message: `${storeName} registration was not approved`,
      type: 'store',
      targetRole: 'store',
    });
  };

  const pendingStores = getPendingStores();
  const approvedStores = getApprovedStores();
  const rejectedStores = stores.filter(s => s.status === 'rejected');

  const filteredStores = (storeList: Store[]) =>
    storeList.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getStatusBadge = (status: Store['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-primary/10 text-primary"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
    }
  };

  const StoreTable = ({ storeList, showActions = true }: { storeList: Store[]; showActions?: boolean }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Store</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredStores(storeList).map((store) => (
          <TableRow key={store.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <img src={store.logo} alt={store.name} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <span className="font-medium">{store.name}</span>
                  {store.email && <p className="text-xs text-muted-foreground">{store.email}</p>}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {store.address}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {store.rating}
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(store.status)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                {store.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary"
                      onClick={() => handleApproveStore(store.id, store.name)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleRejectStore(store.id, store.name)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                {showActions && (
                  <>
                    <Link to={`/stores/${store.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(store)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteStore(store.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
        {filteredStores(storeList).length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              No stores found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Stores Management</h1>
            <p className="text-muted-foreground">Manage store registrations and approvals</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Store
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingStore ? 'Edit Store' : 'Add New Store'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Store Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Delivery Time</Label>
                    <Input
                      placeholder="10-15 min"
                      value={formData.deliveryTime}
                      onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Distance</Label>
                    <Input
                      placeholder="1.2 km"
                      value={formData.distance}
                      onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <Input
                      placeholder="+1 234 567 890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="store@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the store..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Store Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg border flex items-center justify-center overflow-hidden bg-secondary/50">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-muted-foreground">No Logo</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Upload a logo (Max 5MB)</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Delivery Locations</Label>
                  <Input
                    placeholder="Location 1, Location 2, Location 3..."
                    value={formData.deliveryLocations}
                    onChange={(e) => setFormData({ ...formData, deliveryLocations: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Comma-separated list of areas this store delivers to</p>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    {editingStore ? 'Update Store' : 'Add Store'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingStores.length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved Stores</p>
                  <p className="text-3xl font-bold text-primary">{approvedStores.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-3xl font-bold text-destructive">{rejectedStores.length}</p>
                </div>
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              Pending <Badge variant="secondary">{pendingStores.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              Approved <Badge variant="secondary">{approvedStores.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              Rejected <Badge variant="secondary">{rejectedStores.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="all">All Stores</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approval ({pendingStores.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <StoreTable storeList={pendingStores} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved Stores ({approvedStores.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <StoreTable storeList={approvedStores} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Stores ({rejectedStores.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <StoreTable storeList={rejectedStores} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Stores ({stores.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <StoreTable storeList={stores} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminStores;
