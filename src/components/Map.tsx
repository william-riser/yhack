import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getBuildingData } from '../services/lightboxApi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define marker icon for Leaflet
const customIcon = new L.Icon({
    iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
    iconSize: [38, 38],
    iconAnchor: [22, 38],
    popupAnchor: [-3, -76],
});

const Map: React.FC = () => {
    const [buildings, setBuildings] = useState<any[]>([]);

    // Explicitly define Boston coordinates as a tuple [latitude, longitude]
    const bostonCoordinates: [number, number] = [42.3601, -71.0589];

    useEffect(() => {
        const fetchBuildings = async () => {
            const data = await getBuildingData(42.3601, -71.0589); // Boston coordinates
            if (data) {
                setBuildings(data);
            }
        };
        fetchBuildings();
    }, []);

    return (
        <MapContainer center={bostonCoordinates} zoom={13} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            {buildings.map((building, idx) => (
                <Marker
                    key={idx}
                    position={[building.latitude, building.longitude]} // Ensure building.latitude and longitude are valid coordinates
                    icon={customIcon} // Use custom marker icon
                >
                    <Popup>
                        <div>
                            <h2>{building.name}</h2>
                            <p>Height: {building.height}m</p>
                            <p>Year Built: {building.year_built}</p>
                            <p>Energy Efficiency: {building.energy_efficiency_rating}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
