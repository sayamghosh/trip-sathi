import type { Request, Response } from 'express';
import CallbackRequest from '../models/callbackRequest.model.js';
import TourPlan from '../models/tourPlan.model.js';
import User from '../models/user.model.js';
import { sendEmail } from '../utils/email.js';

// Create a callback request for a tour plan
export const createCallbackRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tourPlanId, requesterPhone, requesterName } = req.body;

        if (!tourPlanId || !requesterPhone) {
            res.status(400).json({ message: 'tourPlanId and requesterPhone are required' });
            return;
        }

        const plan = await TourPlan.findById(tourPlanId).populate('guideId', 'email name phone address');
        if (!plan) { res.status(404).json({ message: 'Tour plan not found' }); return; }

        const guide = plan.guideId as any;
        const callback = await CallbackRequest.create({
            tourPlanId,
            guideId: guide._id,
            requesterPhone,
            requesterName,
            userId: (req as any)?.user?.id || undefined,
        });

        // Notify guide via email if email exists
        if (guide?.email) {
            const subject = `New callback request for ${plan.title}`;
            const body = `Hello ${guide.name || 'Guide'},\n\nYou have a new callback request.\nPlan: ${plan.title}\nRequester phone: ${requesterPhone}${requesterName ? `\nRequester name: ${requesterName}` : ''}\n\nLogin to your dashboard to respond.`;
            sendEmail(guide.email, subject, body).catch((err) => {
                console.error('Email send failed', err);
            });
        }

        res.status(201).json({ message: 'Callback request submitted', callback });
    } catch (error: any) {
        console.error('Create callback error', error);
        res.status(500).json({ message: 'Error creating callback request', error: error.message });
    }
};

// Guide: list callback requests for their tours
export const getGuideCallbacks = async (req: Request, res: Response): Promise<void> => {
    try {
        const guideId = (req as any).user.id;
        const callbacks = await CallbackRequest.find({ guideId })
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
        const guideId = (req as any).user.id;
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: 'Callback id is required' });
            return;
        }

        const callback = await CallbackRequest.findOneAndUpdate(
            { _id: id, guideId },
            { status: 'contacted' },
            { new: true }
        ).populate('tourPlanId', 'title locations');

        if (!callback) {
            res.status(404).json({ message: 'Callback not found' });
            return;
        }

        res.status(200).json({ message: 'Callback marked as contacted', callback });
    } catch (error: any) {
        console.error('Mark callback as read error', error);
        res.status(500).json({ message: 'Error updating callback status', error: error.message });
    }
};