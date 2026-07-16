import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export interface ContactMessagePayload {
    email: string;
    message: string;
}

export const submitContactMessage = async (payload: ContactMessagePayload) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/api/contact`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data;
};

const contactService = {
    submitContactMessage,
};

export default contactService;
