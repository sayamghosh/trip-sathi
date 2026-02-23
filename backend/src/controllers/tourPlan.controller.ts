import type { Request, Response } from 'express';
import TourPlan from '../models/tourPlan.model.js';

export const createTourPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const guideId = (req as any).user.id;
        const planData = req.body;

        const newPlan = new TourPlan({
            ...planData,
            guideId
        });

        await newPlan.save();
        res.status(201).json({ message: 'Tour plan created successfully', tourPlan: newPlan });
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating tour plan', error: error.message });
    }
};

export const getTourPlansByGuide = async (req: Request, res: Response): Promise<void> => {
    try {
        const guideId = (req as any).user.id;
        const plans = await TourPlan.find({ guideId }).sort({ createdAt: -1 });
        res.status(200).json(plans);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving tour plans', error: error.message });
    }
};

export const getTourPlanById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const plan = await TourPlan.findById(id).populate('days.activities.hotelRef');
        if (!plan) {
            res.status(404).json({ message: 'Tour plan not found' });
            return;
        }
        res.status(200).json(plan);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving tour plan', error: error.message });
    }
};
