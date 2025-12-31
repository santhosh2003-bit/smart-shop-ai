
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Search } from 'lucide-react';

// Fix for default marker icon in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
    lat: number;
    lng: number;
}

interface LocationPickerProps {
    value?: Location;
    onChange: (loc: Location) => void;
    label?: string;
}

const LocationMarker = ({ position, setPosition }: { position: Location | null, setPosition: (l: Location) => void }) => {
    useMapEvents({
        click(e) {
            setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });

    return position ? <Marker position={[position.lat, position.lng]} /> : null;
};

const MapUpdater = ({ center }: { center: Location }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([center.lat, center.lng], map.getZoom());
    }, [center, map]);
    return null;
};

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, label = 'Select Location' }) => {
    const [position, setPosition] = useState<Location | null>(value || null);
    const [isOpen, setIsOpen] = useState(false);

    // Default to Charlotte NC or user IP loc if we wanted, but static default is safe
    const defaultCenter = { lat: 35.2271, lng: -80.8431 };

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery) return;
        setIsSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                setPosition({ lat, lng });
            }
        } catch (e) {
            console.error("Search failed", e);
        } finally {
            setIsSearching(false);
        }
    };

    const handleConfirm = () => {
        if (position) {
            onChange(position);
            setIsOpen(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(true)}>
                    <MapPin className="w-4 h-4 mr-2" />
                    {position ? 'Change Location' : label}
                </Button>
                {/* {position && (
                    <span className="text-sm text-muted-foreground">
                        {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                    </span>
                )} */}
                {position?.lat != null && position?.lng != null && (
                    <span className="text-sm text-muted-foreground">
                        {Number(position.lat).toFixed(4)}, {Number(position.lng).toFixed(4)}
                    </span>
                )}

            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl h-[600px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Pick Location</DialogTitle>
                    </DialogHeader>

                    <div className="flex gap-2 mb-4">
                        <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Search place..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button onClick={handleSearch} disabled={isSearching}>
                            {isSearching ? <span className="animate-pulse">...</span> : <Search className="w-4 h-4" />}
                        </Button>
                    </div>

                    <div className="flex-1 rounded-md overflow-hidden border border-border relative">
                        <MapContainer
                            center={position ? [position.lat, position.lng] : [defaultCenter.lat, defaultCenter.lng]}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />
                            <LocationMarker position={position} setPosition={setPosition} />
                            {position && <MapUpdater center={position} />}
                        </MapContainer>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button onClick={handleConfirm} disabled={!position}>Confirm Location</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LocationPicker;
