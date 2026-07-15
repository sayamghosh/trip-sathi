import axios from 'axios';
import type { TourPlanSummary } from '../types/tourPlan';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export interface GuideChannel {
    id: string;
    name: string;
    picture?: string;
    bio?: string;
    address?: string;
    username: string;
    memberSince: string;
    totalPackages: number;
}

export const getGuideChannel = async (username: string): Promise<GuideChannel | null> => {
    try {
        const response = await axios.get(`${API_URL}/api/profile/guide/${username}`);
        return response.data;
    } catch {
        return null;
    }
};

export const getGuideTourPlans = async (guideId: string): Promise<TourPlanSummary[]> => {
    const response = await axios.get(`${API_URL}/api/tour-plans/guide/${guideId}`);
    return response.data;
};
