import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        picture: string;
        role: string;
        phone?: string;
        address?: string;
    };
}

export const googleLoginAPI = async (idToken: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/api/auth/google`, { idToken });
    return response.data;
};

// Called from the "Become a Tour Guide" onboarding page — always sets role to 'guide'
export const guideLoginAPI = async (idToken: string, phone?: string, address?: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/api/auth/google/guide`, { idToken, phone, address });
    return response.data;
};



const authService = {
    googleLoginAPI,
    guideLoginAPI
};
export default authService;
