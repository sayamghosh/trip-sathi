import type { Request, Response } from 'express';
import CallbackRequest from '../models/callbackRequest.model.js';
import TourPlan from '../models/tourPlan.model.js';
import User from '../models/user.model.js';
import { sendEmail } from '../utils/email.js';

// Create a callback request for a tour plan
export const createCallbackRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tourPlanId, requesterPhone, requesterName } = req.body;
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

        const trimmedPhoneFromBody = typeof requesterPhone === 'string' ? requesterPhone.trim() : '';
        const trimmedNameFromBody = typeof requesterName === 'string' ? requesterName.trim() : '';

        const finalPhone = trimmedPhoneFromBody || user.phone || '';
        const finalName = trimmedNameFromBody || user.name || undefined;

        if (!finalPhone) {
            res.status(400).json({ message: 'A phone number is required to request a callback.' });
            return;
        }

        const guide = plan.guideId as any;
        const callbackPayload: Record<string, unknown> = {
            tourPlanId,
            guideId: guide._id,
            requesterPhone: finalPhone,
            userId: user._id,
        };

        if (finalName) {
            callbackPayload.requesterName = finalName;
        }

        const callback = await CallbackRequest.create(callbackPayload);

        const shouldUpdatePhone = trimmedPhoneFromBody && trimmedPhoneFromBody !== user.phone;
        const shouldUpdateName = trimmedNameFromBody && trimmedNameFromBody !== user.name;
        if (shouldUpdatePhone || shouldUpdateName) {
            if (shouldUpdatePhone) user.phone = trimmedPhoneFromBody;
            if (shouldUpdateName) user.name = trimmedNameFromBody;
            await user.save();
        }

        if (guide?.email) {
            const subject = `New callback request for ${plan.title}`;
            const body = `Hello ${guide.name || 'Guide'},\n\nYou have a new callback request.\nPlan: ${plan.title}\nRequester phone: ${finalPhone}${finalName ? `\nRequester name: ${finalName}` : ''}\n\nLogin to your dashboard to respond.`;
            sendEmail(guide.email, subject, body).catch((err) => {
                console.error('Email send failed', err);
            });
        }

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