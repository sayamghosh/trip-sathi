import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const updateGuideProfileAPI = async (
    token: string,
    phone: string,
    address: string
): Promise<{ message: string }> => {
    const response = await axios.patch(
        `${API_URL}/api/profile/guide`,
        { phone, address },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};
