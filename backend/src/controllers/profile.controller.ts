import type { Request, Response } from 'express';
import User from '../models/user.model.js';
import TourPlan from '../models/tourPlan.model.js';

const USERNAME_REGEX = /^[a-z0-9_]{3,30}$/;
// The channel page lives at /guide/:username in the Next.js app, alongside
// the guide's own static dashboard routes (/guide/dashboard, /guide/tour-plans) -
// a guide claiming either word as their username would make those pages
// unreachable, so they're blocked here.
const RESERVED_USERNAMES = new Set(['dashboard', 'tour-plans']);

// ─── Update guide profile ────────────────────────────────────────────────────
export const updateGuideProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, phone, address, bio, username } = req.body;

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

        if (typeof username === 'string' && username.trim()) {
            const normalized = username.trim().toLowerCase();
            if (!USERNAME_REGEX.test(normalized)) {
                res.status(400).json({ message: 'Username must be 3-30 characters, lowercase letters, numbers, or underscores only.' });
                return;
            }
            if (RESERVED_USERNAMES.has(normalized)) {
                res.status(400).json({ message: 'That username is reserved. Please choose another.' });
                return;
            }
            const existing = await User.findOne({ username: normalized, _id: { $ne: userId } });
            if (existing) {
                res.status(409).json({ message: 'That username is already taken.' });
                return;
            }
            updates.username = normalized;
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
                username: updatedUser.username,
                isAuthorized: updatedUser.isAuthorized,
                isActive: updatedUser.isActive,
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

// ─── Public guide channel page (by username) ─────────────────────────────────
// A channel page goes live automatically the moment an authorized, active
// guide sets a username - no separate "make public" step to forget about.
export const getGuideChannelByUsername = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username } = req.params as any;

        const guide = await User.findOne({
            username: username?.toLowerCase(),
            role: 'guide',
            isAuthorized: true,
            isActive: true,
        }).select('name picture bio address username createdAt');

        if (!guide) {
            res.status(404).json({ message: 'Guide channel not found' });
            return;
        }

        const totalPackages = await TourPlan.countDocuments({ guideId: guide._id, isPublic: true });

        res.status(200).json({
            id: guide._id,
            name: guide.name,
            picture: guide.picture,
            bio: guide.bio,
            address: guide.address,
            username: guide.username,
            memberSince: (guide as any).createdAt,
            totalPackages,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving guide channel', error: error.message });
    }
};
