import type { Request, Response } from 'express';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

// ─── Update guide profile ────────────────────────────────────────────────────
export const updateGuideProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, phone, address, bio, isProfilePublic } = req.body;

        // The user ID comes from the JWT middleware (set as req.user in middleware)
        const userInReq = (req as any).user;
        const userId = userInReq?.id;
        if (!userId) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (!phone || !address) {
            res.status(400).json({ message: 'Phone and address are required' });
            return;
        }

        const updates: any = {
            phone,
            address,
        };

        if (typeof name === 'string' && name.trim()) {
            updates.name = name.trim();
        }

        if (typeof bio === 'string') {
            updates.bio = bio.trim();
        }

        if (typeof isProfilePublic === 'boolean') {
            if (isProfilePublic && !user.isAuthorized) {
                res.status(403).json({ message: 'Only authorized guides can make their profile public.' });
                return;
            }
            updates.isProfilePublic = isProfilePublic;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            { returnDocument: 'after' }
        );

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                email: updatedUser.email,
                name: updatedUser.name,
                picture: updatedUser.picture,
                role: updatedUser.role,
                phone: updatedUser.phone,
                address: updatedUser.address,
                bio: updatedUser.bio,
                isAuthorized: updatedUser.isAuthorized,
                isActive: updatedUser.isActive,
                isProfilePublic: updatedUser.isProfilePublic,
            },
        });
    } catch (error: any) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Internal server error', details: error?.message });
    }
};

// ─── Get current guide/traveller profile ──────────────────────────────────────
export const getProfileMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving profile', error: error.message });
    }
};
