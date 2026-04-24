import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export interface CallbackRequestPayload {
    tourPlanId: string;
}

export interface CallbackResponse {
    message: string;
    callback: GuideCallbackItem;
    user?: {
        id: string;
        email: string;
        name: string;
        picture: string;
        role: string;
        phone?: string;
        address?: string;
    };
}

export interface GuideCallbackItem {
    _id: string;
    requesterName?: string;
    requesterPhone?: string;
    status?: 'pending' | 'contacted' | string;
    createdAt?: string;
}

export const requestCallback = async (payload: CallbackRequestPayload): Promise<CallbackResponse> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('AUTH_REQUIRED');
    }
    const response = await axios.post(`${API_URL}/api/callbacks`, payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getGuideCallbacks = async (): Promise<GuideCallbackItem[]> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/callbacks/mine`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const markCallbackAsRead = async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${API_URL}/api/callbacks/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const callbackService = {
    requestCallback,
    getGuideCallbacks,
    markCallbackAsRead,
};

export default callbackService;