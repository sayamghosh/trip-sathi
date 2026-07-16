import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export const subscribeToNewsletter = async (email: string) => {
    const response = await axios.post(`${API_URL}/api/newsletter`, { email });
    return response.data;
};

const newsletterService = {
    subscribeToNewsletter,
};

export default newsletterService;
