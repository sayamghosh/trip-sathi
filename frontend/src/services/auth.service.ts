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
    };
}

export const googleLoginAPI = async (idToken: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/api/auth/google`, { idToken });
    return response.data;
};
