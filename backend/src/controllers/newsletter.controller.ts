import type { Request, Response } from 'express';
import NewsletterSubscriber from '../models/newsletter.model.js';
import { isValidEmailFormat, isDisposableEmail } from '../utils/disposableEmailDomains.js';

const ALREADY_SUBSCRIBED_MESSAGE = "You're already on our list! We'll email you as soon as a new deal drops.";

// Public - subscribe an email to the newsletter
export const subscribeNewsletter = async (req: Request, res: Response): Promise<void> => {
    try {
        const emailRaw = req.body?.email;

        if (!emailRaw || typeof emailRaw !== 'string') {
            res.status(400).json({ message: 'Email is required' });
            return;
        }

        const email = emailRaw.trim().toLowerCase();

        if (!isValidEmailFormat(email)) {
            res.status(400).json({ message: 'Please enter a valid email address' });
            return;
        }

        if (isDisposableEmail(email)) {
            res.status(400).json({ message: 'Please use a permanent email address, not a temporary one' });
            return;
        }

        const existing = await NewsletterSubscriber.findOne({ email });

        if (existing) {
            if (existing.status === 'subscribed') {
                res.status(409).json({ message: ALREADY_SUBSCRIBED_MESSAGE });
                return;
            }

            existing.status = 'subscribed';
            await existing.save();
            res.status(200).json({ message: 'Subscribed! Welcome back.', subscriber: existing });
            return;
        }

        const subscriber = await NewsletterSubscriber.create({ email });
        res.status(201).json({ message: "You're subscribed! Watch your inbox for fresh deals.", subscriber });
    } catch (error: any) {
        if (error.code === 11000) {
            res.status(409).json({ message: ALREADY_SUBSCRIBED_MESSAGE });
            return;
        }
        console.error('Newsletter subscribe error', error);
        res.status(500).json({ message: 'Error subscribing to newsletter', error: error.message });
    }
};

// Admin - list newsletter subscribers, paginated, optional status filter
export const getNewsletterSubscribers = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const status = req.query.status as string;

        const query: Record<string, unknown> = {};
        if (status === 'subscribed' || status === 'unsubscribed') {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const [subscribers, total, subscribedCount] = await Promise.all([
            NewsletterSubscriber.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            NewsletterSubscriber.countDocuments(query),
            NewsletterSubscriber.countDocuments({ status: 'subscribed' }),
        ]);

        res.status(200).json({
            subscribers,
            total,
            page,
            pages: Math.max(1, Math.ceil(total / limit)),
            subscribedCount,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error listing newsletter subscribers', error: error.message });
    }
};
