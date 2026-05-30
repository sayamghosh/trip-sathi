import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import TourPlan from '../models/tourPlan.model.js';

// Super Admin login
export const superAdminLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        // Find the super admin
        const user = await User.findOne({ email });
        if (!user || user.role !== 'admin') {
            res.status(401).json({ message: 'Invalid credentials or access denied' });
            return;
        }

        // Verify password
        if (!user.password) {
            res.status(401).json({ message: 'Password is not set for this account' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Check if active
        if (!user.isActive) {
            res.status(403).json({ message: 'This administrator account is deactivated' });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_for_development_only';
        const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '7d' });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                picture: user.picture,
                role: user.role,
                isAuthorized: user.isAuthorized,
                isActive: user.isActive,
            }
        });
    } catch (error: any) {
        console.error('Super Admin login error:', error);
        res.status(500).json({ message: 'Internal server error', details: error?.message });
    }
};

// Get current admin profile
export const getSuperAdminProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const adminId = (req as any).user.id;
        const user = await User.findById(adminId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'Admin profile not found' });
            return;
        }
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving profile', error: error.message });
    }
};

// List all agents (guides) with pagination, search, and filtering
export const listAgents = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const isAuthorizedStr = req.query.isAuthorized as string;
        const isActiveStr = req.query.isActive as string;

        const query: any = { role: 'guide' };

        // Search query (matches name or email)
        if (search && search.trim() !== '') {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { name: { $regex: searchRegex } },
                { email: { $regex: searchRegex } }
            ];
        }

        // Filter by authorization status
        if (isAuthorizedStr === 'true' || isAuthorizedStr === 'false') {
            query.isAuthorized = isAuthorizedStr === 'true';
        }

        // Filter by active status
        if (isActiveStr === 'true' || isActiveStr === 'false') {
            query.isActive = isActiveStr === 'true';
        }

        const skip = (page - 1) * limit;

        const agents = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);
        const pages = Math.ceil(total / limit);

        res.status(200).json({
            agents,
            total,
            page,
            pages
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error listing agents', error: error.message });
    }
};

// Get single agent details
export const getAgentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as any;
        const agent = await User.findOne({ _id: id, role: 'guide' }).select('-password');
        if (!agent) {
            res.status(404).json({ message: 'Agent not found' });
            return;
        }
        res.status(200).json(agent);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving agent details', error: error.message });
    }
};

// Authorize or deauthorize agent
export const authorizeAgent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as any;
        const { isAuthorized } = req.body;

        if (typeof isAuthorized !== 'boolean') {
            res.status(400).json({ message: 'isAuthorized must be a boolean value' });
            return;
        }

        const agent = await User.findOneAndUpdate(
            { _id: id, role: 'guide' },
            { isAuthorized },
            { new: true }
        ).select('-password');

        if (!agent) {
            res.status(404).json({ message: 'Agent not found' });
            return;
        }

        res.status(200).json({ message: `Agent authorization status updated to ${isAuthorized}`, agent });
    } catch (error: any) {
        res.status(500).json({ message: 'Error authorizing agent', error: error.message });
    }
};

// Activate or deactivate agent
export const toggleAgentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as any;
        const { isActive } = req.body;

        if (typeof isActive !== 'boolean') {
            res.status(400).json({ message: 'isActive must be a boolean value' });
            return;
        }

        const agent = await User.findOneAndUpdate(
            { _id: id, role: 'guide' },
            { isActive },
            { new: true }
        ).select('-password');

        if (!agent) {
            res.status(404).json({ message: 'Agent not found' });
            return;
        }

        res.status(200).json({ message: `Agent account status set to ${isActive ? 'Active' : 'Inactive'}`, agent });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating agent account status', error: error.message });
    }
};

// Get agent metrics
export const getAgentMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as any;
        const agentExists = await User.exists({ _id: id, role: 'guide' });
        if (!agentExists) {
            res.status(404).json({ message: 'Agent not found' });
            return;
        }

        const totalPackages = await TourPlan.countDocuments({ guideId: id });
        const activePackages = await TourPlan.countDocuments({ guideId: id, isPublic: true });

        res.status(200).json({
            totalPackages,
            activePackages,
            totalBookings: 0,
            revenue: 0
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving agent metrics', error: error.message });
    }
};

// List all packages by guide (public and private)
export const getAgentPackages = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as any;
        const agentExists = await User.exists({ _id: id, role: 'guide' });
        if (!agentExists) {
            res.status(404).json({ message: 'Agent not found' });
            return;
        }

        const packages = await TourPlan.find({ guideId: id }).sort({ createdAt: -1 });
        res.status(200).json(packages);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving agent packages', error: error.message });
    }
};
