import axios from 'axios';

const API_KEY = import.meta.env.VITE_LIGHTBOX_API_KEY;
const API_URL = 'https://dev.lightboxre.com/api';

export const getBuildingData = async (latitude: number, longitude: number) => {
    try {
        const response = await axios.get(`${API_URL}/buildings`, {
            params: {
                lat: latitude,
                lon: longitude,
            },
            headers: {
                Authorization: API_KEY,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching building data:', error);
        return null;
    }
};
