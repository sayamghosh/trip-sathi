import type { Request, Response } from 'express';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

// ─── Update guide profile (phone + address) ──────────────────────────────────
export const updateGuideProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phone, address } = req.body;

        // The user ID comes from the JWT middleware (set as req.user in middleware)
        const userId = (req as any).userId;
        if (!userId) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        if (!phone || !address) {
            res.status(400).json({ message: 'Phone and address are required' });
            return;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { phone, address },
            { returnDocument: 'after' }
        );

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({
            message: 'Profile updated successfully',
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
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Internal server error', details: error?.message });
    }
};
