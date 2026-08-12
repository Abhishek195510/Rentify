import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const MapView = ({ listings, center, onMarkerClick }) => {
    return (
        <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-inner border border-gray-100 mb-8">
            <MapContainer center={center || [20.5937, 78.9629]} zoom={center ? 13 : 5} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {listings.map((listing) => {
                    const coords = listing.location?.coordinates;
                    if (!coords || coords.length !== 2) return null;
                    
                    return (
                        <Marker 
                            key={listing._id} 
                            position={[coords[1], coords[0]]}
                        >
                            <Popup>
                                <div className="p-2 min-w-[150px]">
                                    <img src={listing.image1} alt={listing.title} className="w-full h-24 object-cover rounded-md mb-2" />
                                    <h3 className="font-bold text-sm leading-tight mb-1">{listing.title}</h3>
                                    <p className="text-red-500 font-bold mb-1">₹{listing.rent}/month</p>
                                    <button 
                                        className="w-full bg-black text-white text-[10px] py-1.5 rounded-md hover:bg-gray-800 transition-colors uppercase font-bold"
                                        onClick={() => onMarkerClick(listing._id)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapView;
