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

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (!phone || !address) {
            res.status(400).json({ message: 'Phone and address are required' });
            return;
        }

        const updates: { name?: string; phone: string; address: string; bio?: string; isProfilePublic?: boolean } = {
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
            if (isProfilePublic && existingUser.verificationStatus !== 'approved') {
                res.status(403).json({ message: 'Only verified guides can make their profile public' });
                return;
            }
            updates.isProfilePublic = isProfilePublic;
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
                verificationStatus: user.verificationStatus,
                isActive: user.isActive,
                isProfilePublic: user.isProfilePublic,
                credits: user.credits,
                planExpiresAt: user.planExpiresAt,
                createdAt: (user as any).createdAt,
            },
        });
    } catch (error: any) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Internal server error', details: error?.message });
    }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                picture: user.picture,
                role: user.role,
                phone: user.phone,
                address: user.address,
                bio: user.bio,
                verificationStatus: user.verificationStatus,
                isActive: user.isActive,
                isProfilePublic: user.isProfilePublic,
                credits: user.credits,
                planExpiresAt: user.planExpiresAt,
                createdAt: (user as any).createdAt,
            }
        });
    } catch (error: any) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Internal server error', details: error?.message });
    }
};

// Recharge guide profile (credits / plan subscription)
export const rechargeProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const { credits, days } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const user = await User.findById(userId);
        if (!user || user.role !== 'guide') {
            res.status(404).json({ message: 'Guide not found' });
            return;
        }

        if (typeof credits === 'number' && credits > 0) {
            user.credits = (user.credits || 0) + credits;
        }

        if (typeof days === 'number' && days > 0) {
            const currentExpiration = user.planExpiresAt && new Date(user.planExpiresAt) > new Date() 
                ? new Date(user.planExpiresAt) 
                : new Date();
            currentExpiration.setDate(currentExpiration.getDate() + days);
            user.planExpiresAt = currentExpiration;
        }

        await user.save();

        res.status(200).json({
            message: 'Recharge completed successfully',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                picture: user.picture,
                role: user.role,
                phone: user.phone,
                address: user.address,
                bio: user.bio,
                verificationStatus: user.verificationStatus,
                isActive: user.isActive,
                isProfilePublic: user.isProfilePublic,
                credits: user.credits,
                planExpiresAt: user.planExpiresAt,
                createdAt: (user as any).createdAt,
            }
        });
    } catch (error: any) {
        console.error('Recharge profile error:', error);
        res.status(500).json({ message: 'Internal server error', details: error?.message });
    }
};


