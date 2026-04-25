import type { Request, Response } from 'express';
import CallbackRequest from '../models/callbackRequest.model.js';
import TourPlan from '../models/tourPlan.model.js';
import User from '../models/user.model.js';
// Create a callback request for a tour plan
export const createCallbackRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tourPlanId } = req.body;
        const authUserId = (req as any)?.user?.id;

        if (!authUserId) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        if (!tourPlanId) {
            res.status(400).json({ message: 'tourPlanId is required' });
            return;
        }

        const [plan, user] = await Promise.all([
            TourPlan.findById(tourPlanId).populate('guideId', 'email name phone address'),
            User.findById(authUserId),
        ]);

        if (!plan) { res.status(404).json({ message: 'Tour plan not found' }); return; }
        if (!user) { res.status(404).json({ message: 'User not found' }); return; }

        const guide = plan.guideId as any;
        const callbackPayload = {
            tourPlanId,
            guideId: guide._id,
            userId: user._id,
            requesterName: user.name,
            requesterEmail: user.email,
        };

        const callback = await CallbackRequest.create(callbackPayload);

        res.status(201).json({
            message: 'Callback request submitted',
            callback,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                picture: user.picture,
                role: user.role,
                phone: user.phone,
                address: user.address,
            },
        });
    } catch (error: any) {
        console.error('Create callback error', error);
        res.status(500).json({ message: 'Error creating callback request', error: error.message });
    }
};

// Guide: list callback requests for their tours
export const getGuideCallbacks = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user;
        const query = user.role === 'admin' ? {} : { guideId: user.id };
        const callbacks = await CallbackRequest.find(query)
            .sort({ createdAt: -1 })
            .populate('tourPlanId', 'title locations')
            .lean();

        res.status(200).json(callbacks);
    } catch (error: any) {
        console.error('Get callbacks error', error);
        res.status(500).json({ message: 'Error fetching callback requests', error: error.message });
    }
};


export const markCallbackAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: 'Callback id is required' });
            return;
        }

        const callback = await CallbackRequest.findOneAndUpdate(
            { _id: id },
            { isRead: true },
            { new: true }
        ).populate('tourPlanId', 'title locations');

        if (!callback) {
            res.status(404).json({ message: 'Callback not found' });
            return;
        }

        res.status(200).json({ message: 'Callback marked as read', callback });
    } catch (error: any) {
        console.error('Mark callback as read error', error);
        res.status(500).json({ message: 'Error updating callback status', error: error.message });
    }
};

export const updateCallbackStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user;
        const { id } = req.params;
        const { status } = req.body;

        if (!id) {
            res.status(400).json({ message: 'Callback id is required' });
            return;
        }

        if (!['pending', 'positive', 'negative'].includes(status)) {
            res.status(400).json({ message: 'Invalid status value' });
            return;
        }

        const query = { _id: id };

        const callback = await CallbackRequest.findOneAndUpdate(
            query,
            { status, isRead: true },
            { new: true }
        ).populate('tourPlanId', 'title locations');

        if (!callback) {
            res.status(404).json({ message: 'Callback not found' });
            return;
        }

        res.status(200).json({ message: 'Callback status updated', callback });
    } catch (error: any) {
        console.error('Update callback status error', error);
        res.status(500).json({ message: 'Error updating callback status', error: error.message });
    }
};