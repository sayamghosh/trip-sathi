import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import TourPlan from '../models/tourPlan.model.js';
import User from '../models/user.model.js';

// Get all public tour plans from verified and active guides
export const getAllTourPlans = async (req: Request, res: Response): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || 0;

        // Fetch verified and active guides with active credits or subscription validity
        const activeApprovedGuides = await User.find({
            role: 'guide',
            verificationStatus: 'approved',
            isActive: true,
            $or: [
                { planExpiresAt: { $gt: new Date() } },
                { credits: { $gt: 0 } }
            ]
        }).select('_id');
        
        const guideIds = activeApprovedGuides.map(guide => guide._id);

        const plans = await TourPlan.find({
            isPublic: true,
            guideId: { $in: guideIds }
        })
            .populate('guideId', 'name picture phone address')
            .sort({ createdAt: -1 })
            .limit(limit);

        res.status(200).json(plans);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving tour plans', error: error.message });
    }
};

// Create a new tour plan - sets isPublic to false by default
export const createTourPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const guideId = (req as any).user.id;
        const planData = req.body;

        const newPlan = new TourPlan({
            ...planData,
            guideId,
            isPublic: false // Enforce draft status by default on creation
        });

        await newPlan.save();
        res.status(201).json({ message: 'Tour plan created successfully as draft', tourPlan: newPlan });
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating tour plan', error: error.message });
    }
};

// Retrieve guide's own plans (draft and public)
export const getTourPlansByGuide = async (req: Request, res: Response): Promise<void> => {
    try {
        const guideId = (req as any).user.id;
        const plans = await TourPlan.find({ guideId }).sort({ createdAt: -1 });
        res.status(200).json(plans);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving tour plans', error: error.message });
    }
};

// Get single tour plan details with owner and verification checks
export const getTourPlanById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const plan = await TourPlan.findById(id)
            .populate('guideId', 'name picture phone address role verificationStatus isActive credits planExpiresAt')
            .populate('days.activities.hotelRef');

        if (!plan) {
            res.status(404).json({ message: 'Tour plan not found' });
            return;
        }

        // Determine if requesting user is the owner or an admin
        let isOwnerOrAdmin = false;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            if (token) {
                const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_for_development_only';
                try {
                    const decoded = jwt.verify(token, jwtSecret) as any;
                    if (decoded.id === plan.guideId._id.toString() || decoded.role === 'admin') {
                        isOwnerOrAdmin = true;
                    }
                } catch {
                    // Token verification failed, treat as guest
                }
            }
        }

        const guide = plan.guideId as any;
        const isGuideActiveApproved = guide && guide.role === 'guide' && guide.verificationStatus === 'approved' && guide.isActive !== false;
        
        const hasValidPlan = guide && guide.planExpiresAt ? new Date(guide.planExpiresAt) > new Date() : false;
        const hasCredits = guide && (guide.credits || 0) > 0;
        const isSubscriptionValid = hasValidPlan || hasCredits;

        // Block access if it's draft or the guide is unverified/inactive or has no active subscription/credits, unless it's the owner or admin
        if (!isOwnerOrAdmin && (!plan.isPublic || !isGuideActiveApproved || !isSubscriptionValid)) {
            res.status(403).json({ message: 'Access denied: This tour plan is not available to the public due to inactive subscription' });
            return;
        }

        res.status(200).json(plan);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving tour plan', error: error.message });
    }
};

// Search public tour plans from verified and active guides
export const searchTourPlans = async (req: Request, res: Response): Promise<void> => {
    try {
        const { destination } = req.query;

        // Fetch verified and active guides with active credits or subscription validity
        const activeApprovedGuides = await User.find({
            role: 'guide',
            verificationStatus: 'approved',
            isActive: true,
            $or: [
                { planExpiresAt: { $gt: new Date() } },
                { credits: { $gt: 0 } }
            ]
        }).select('_id');
        
        const guideIds = activeApprovedGuides.map(guide => guide._id);

        let query: any = {
            isPublic: true,
            guideId: { $in: guideIds }
        };
        
        if (destination && typeof destination === 'string' && destination.trim() !== '') {
            const searchRegex = new RegExp(destination.trim(), 'i');
            query.$and = [
                { isPublic: true },
                { guideId: { $in: guideIds } },
                {
                    $or: [
                        { locations: { $regex: searchRegex } },
                        { title: { $regex: searchRegex } },
                        { description: { $regex: searchRegex } }
                    ]
                }
            ];
        }

        const plans = await TourPlan.find(query)
            .populate('guideId', 'name picture phone address')
            .sort({ createdAt: -1 });
            
        res.status(200).json(plans);
    } catch (error: any) {
        res.status(500).json({ message: 'Error searching tour plans', error: error.message });
    }
};

// Update an existing tour plan
export const updateTourPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const guideId = (req as any).user.id;
        const updateData = req.body;

        const plan = await TourPlan.findOne({ _id: id as string, guideId });

        if (!plan) {
            res.status(404).json({ message: 'Tour plan not found or you are not authorized' });
            return;
        }

        const { _id, ...planData } = updateData;

        const updatedPlan = await TourPlan.findByIdAndUpdate(
            id,
            { ...planData, guideId },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: 'Tour plan updated successfully', tourPlan: updatedPlan });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating tour plan', error: error.message });
    }
};

// Publish or unpublish a tour plan (only allowed for verified guides)
export const publishTourPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { isPublic } = req.body;
        const guideId = (req as any).user.id;

        if (typeof isPublic !== 'boolean') {
            res.status(400).json({ message: 'isPublic must be a boolean value' });
            return;
        }

        // Fetch guide profile to check verification status
        const guide = await User.findById(guideId);
        if (!guide || guide.role !== 'guide') {
            res.status(403).json({ message: 'Access denied: Only guides can publish/unpublish packages' });
            return;
        }

        if (guide.verificationStatus !== 'approved') {
            res.status(403).json({ 
                message: 'Access denied: You must be verified by the admin before you can publish packages.',
                verificationStatus: guide.verificationStatus
            });
            return;
        }

        if (!guide.isActive) {
            res.status(403).json({ message: 'Access denied: Your guide account is currently inactive' });
            return;
        }

        const plan = await TourPlan.findOneAndUpdate(
            { _id: id, guideId } as any,
            { isPublic },
            { new: true }
        );

        if (!plan) {
            res.status(404).json({ message: 'Tour plan not found or you are not authorized' });
            return;
        }

        res.status(200).json({
            message: `Tour plan ${isPublic ? 'published' : 'unpublished'} successfully`,
            tourPlan: plan
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating publication status', error: error.message });
    }
};
