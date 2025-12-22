import React, { useState, useEffect } from 'react';
import { Save, Upload, Image, Store, MapPin, Clock, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import StoreLayout from '@/components/store/StoreLayout';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';

const StoreSettings: React.FC = () => {
  const { user } = useAuth();
  const { getStoresByOwner, addStore, updateStore } = useStore();

  const userStores = user ? getStoresByOwner(user.id) : [];
  const existingStore = userStores[0];

  const [logoPreview, setLogoPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    deliveryTime: '',
    distance: '',
    description: '',
    phone: '',
    email: '',
    isOpen: true,
  });

  useEffect(() => {
    if (existingStore) {
      setFormData({
        name: existingStore.name,
        address: existingStore.address,
        deliveryTime: existingStore.deliveryTime,
        distance: existingStore.distance,
        description: existingStore.description || '',
        phone: existingStore.phone || '',
        email: existingStore.email || '',
        isOpen: existingStore.isOpen,
      });
      setLogoPreview(existingStore.logo);
    }
  }, [existingStore]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    if (existingStore) {
      updateStore(existingStore.id, {
        name: formData.name,
        address: formData.address,
        deliveryTime: formData.deliveryTime,
        distance: formData.distance,
        description: formData.description,
        phone: formData.phone,
        email: formData.email,
        isOpen: formData.isOpen,
        logo: logoPreview || existingStore.logo,
      });
      toast.success('Store updated successfully');
    } else {
      addStore({
        name: formData.name,
        logo: logoPreview || 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=100',
        distance: formData.distance,
        deliveryTime: formData.deliveryTime,
        address: formData.address,
        isOpen: formData.isOpen,
        status: 'pending',
        ownerId: user.id,
        description: formData.description,
        phone: formData.phone,
        email: formData.email,
      });
      toast.success('Store registered! Awaiting admin approval.');
    }
  };

  const getStatusBadge = () => {
    if (!existingStore) return null;
    switch (existingStore.status) {
      case 'approved':
        return <Badge className="bg-primary/10 text-primary">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">Pending Approval</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  return (
    <StoreLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">
            {existingStore ? 'Store Settings' : 'Register Your Store'}
          </h1>
          <p className="text-muted-foreground">
            {existingStore
              ? 'Manage your store information and settings'
              : 'Fill in the details below to register your store'}
          </p>
        </div>

        {existingStore && (
          <Alert className={
            existingStore.status === 'approved'
              ? 'border-primary/50 bg-primary/10'
              : existingStore.status === 'pending'
              ? 'border-yellow-500/50 bg-yellow-500/10'
              : 'border-destructive/50 bg-destructive/10'
          }>
            <Store className="w-4 h-4" />
            <AlertTitle className="flex items-center gap-2">
              Store Status {getStatusBadge()}
            </AlertTitle>
            <AlertDescription>
              {existingStore.status === 'approved' && 'Your store is live and customers can see your products.'}
              {existingStore.status === 'pending' && 'Your store is being reviewed by our team. This usually takes 24-48 hours.'}
              {existingStore.status === 'rejected' && 'Your store registration was not approved. Please contact support for more information.'}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Basic information about your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label>Store Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-secondary/50">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Store Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Label
                      htmlFor="logo-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Logo
                    </Label>
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended: 200x200px, JPG or PNG
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Store Name *</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                    placeholder="Your Store Name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="pl-10"
                    placeholder="123 Main Street, City"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryTime">Delivery Time *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                      className="pl-10"
                      placeholder="10-15 min"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance from Center *</Label>
                  <Input
                    id="distance"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    placeholder="1.5 km"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      placeholder="store@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell customers about your store..."
                  rows={4}
                />
              </div>

              {existingStore && existingStore.status === 'approved' && (
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                  <Switch
                    id="isOpen"
                    checked={formData.isOpen}
                    onCheckedChange={(checked) => setFormData({ ...formData, isOpen: checked })}
                  />
                  <div>
                    <Label htmlFor="isOpen" className="cursor-pointer">Store Open Status</Label>
                    <p className="text-sm text-muted-foreground">
                      {formData.isOpen ? 'Your store is currently open for orders' : 'Your store is currently closed'}
                    </p>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {existingStore ? 'Save Changes' : 'Register Store'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </StoreLayout>
  );
};

export default StoreSettings;
