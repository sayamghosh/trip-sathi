import type { Request, Response } from 'express';
import TourPlan from '../models/tourPlan.model.js';

export const getAllTourPlans = async (req: Request, res: Response): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || 0;
        const plans = await TourPlan.find()
            .populate('guideId', 'name profileImage')
            .sort({ createdAt: -1 })
            .limit(limit);
        res.status(200).json(plans);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving tour plans', error: error.message });
    }
};

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
        const plan = await TourPlan.findById(id)
            .populate('guideId', 'name profileImage')
            .populate('days.activities.hotelRef');
        if (!plan) {
            res.status(404).json({ message: 'Tour plan not found' });
            return;
        }
        res.status(200).json(plan);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving tour plan', error: error.message });
    }
};

export const updateTourPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const guideId = (req as any).user.id;
        const updateData = req.body;

        const plan = await TourPlan.findOne({ _id: id as string, guideId });

        if (!plan) {
            res.status(404).json({ message: 'Tour plan not found or you are not authorized' });
            return;
        }

        const { _id, ...planData } = updateData;

        const updatedPlan = await TourPlan.findByIdAndUpdate(
            id,
            { ...planData, guideId },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: 'Tour plan updated successfully', tourPlan: updatedPlan });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating tour plan', error: error.message });
    }
};
