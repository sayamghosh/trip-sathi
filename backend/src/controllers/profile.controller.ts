import type { Request, Response } from 'express';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

// ─── Update guide profile ────────────────────────────────────────────────────
export const updateGuideProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, phone, address, bio } = req.body;

        // The user ID comes from the JWT middleware (set as req.user in middleware)
        const userInReq = (req as any).user;
        const userId = userInReq?.id;
        if (!userId) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        if (!phone || !address) {
            res.status(400).json({ message: 'Phone and address are required' });
            return;
        }

        const updates: { name?: string; phone: string; address: string; bio?: string } = {
            phone,
            address,
        };

        if (typeof name === 'string' && name.trim()) {
            updates.name = name.trim();
        }

        if (typeof bio === 'string') {
            updates.bio = bio.trim();
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updates,
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
                bio: user.bio,
            },
        });
    } catch (error: any) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Internal server error', details: error?.message });
    }
};
