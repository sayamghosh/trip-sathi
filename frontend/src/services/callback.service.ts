import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface CallbackRequestPayload {
    tourPlanId: string;
    requesterPhone: string;
    requesterName?: string;
}

export const requestCallback = async (payload: CallbackRequestPayload) => {
    const response = await axios.post(`${API_URL}/api/callbacks`, payload);
    return response.data;
};

export const getGuideCallbacks = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/callbacks/mine`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const callbackService = {
    requestCallback,
    getGuideCallbacks,
};

export default callbackService;