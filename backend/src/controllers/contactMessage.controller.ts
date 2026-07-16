import type { Request, Response } from 'express';
import ContactMessage from '../models/contactMessage.model.js';

// Public (guest or logged-in) - submit a contact message
export const createContactMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, message } = req.body;
        const authUser = (req as any).user;

        if (!email || !message) {
            res.status(400).json({ message: 'email and message are required' });
            return;
        }

        const contactMessage = await ContactMessage.create({
            email,
            message,
            userId: authUser?.id,
        });

        res.status(201).json({ message: 'Message submitted', contactMessage });
    } catch (error: any) {
        console.error('Create contact message error', error);
        res.status(500).json({ message: 'Error submitting message', error: error.message });
    }
};

// Admin - list contact messages, paginated, optional status filter
export const getContactMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const status = req.query.status as string;

        const query: Record<string, unknown> = {};
        if (status === 'new' || status === 'resolved') {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const [messages, total, unresolvedCount] = await Promise.all([
            ContactMessage.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            ContactMessage.countDocuments(query),
            ContactMessage.countDocuments({ status: 'new' }),
        ]);

        res.status(200).json({
            messages,
            total,
            page,
            pages: Math.max(1, Math.ceil(total / limit)),
            unresolvedCount,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error listing contact messages', error: error.message });
    }
};

// Admin - mark a message resolved/new
export const updateContactMessageStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['new', 'resolved'].includes(status)) {
            res.status(400).json({ message: 'Invalid status value' });
            return;
        }

        const contactMessage = await ContactMessage.findByIdAndUpdate(id, { status }, { new: true });
        if (!contactMessage) {
            res.status(404).json({ message: 'Contact message not found' });
            return;
        }

        res.status(200).json({ message: 'Status updated', contactMessage });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating contact message status', error: error.message });
    }
};
