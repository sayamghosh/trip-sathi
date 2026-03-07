import axios from 'axios';
import type { TourPlanDetailed, TourPlanSummary } from '../types/tourPlan';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export const createTourPlan = async (data: any): Promise<any> => {
    const response = await axios.post(`${API_URL}/api/tour-plans`, data, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const getAllTourPlans = async (limit?: number): Promise<TourPlanSummary[]> => {
    const url = `${API_URL}/api/tour-plans/public${limit ? `?limit=${limit}` : ''}`;
    const response = await axios.get(url);
    return response.data;
};

export const getTourPlansByGuide = async (): Promise<TourPlanSummary[]> => {
    const response = await axios.get(`${API_URL}/api/tour-plans`, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const getTourPlanById = async (id: string): Promise<TourPlanDetailed> => {
    const response = await axios.get(`${API_URL}/api/tour-plans/${id}`);
    return response.data;
};

export const updateTourPlan = async (id: string, data: any): Promise<any> => {
    const response = await axios.put(`${API_URL}/api/tour-plans/${id}`, data, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const uploadImage = async (formData: FormData): Promise<{ url: string }> => {
    const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const searchTourPlans = async (destination: string): Promise<TourPlanSummary[]> => {
    const response = await axios.get(`${API_URL}/api/tour-plans/search?destination=${encodeURIComponent(destination)}`);
    return response.data;
};

const tourPlanService = {
    createTourPlan,
    getTourPlansByGuide,
    getTourPlanById,
    updateTourPlan,
    uploadImage,
    searchTourPlans
};

export default tourPlanService;
