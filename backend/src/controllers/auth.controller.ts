import type { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            res.status(400).json({ message: 'ID Token is required' });
            return;
        }

        const clientId = process.env.GOOGLE_CLIENT_ID;
        if (!clientId) {
            res.status(500).json({ message: 'Server configured incorrectly: Missing Google Client ID' });
            return;
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: clientId,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            res.status(400).json({ message: 'Invalid Google token' });
            return;
        }

        const { sub: googleId, email, name, picture } = payload;

        // Check if user exists, else create new user
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                googleId,
                email,
                name: name || '',
                picture: picture || '',
            });
            await user.save();
        } else if (user.picture !== picture) {
            user.picture = picture || '';
            user.name = name || ''; // Also sync name while we're at it
            await user.save();
        }

        // Generate JWT
        const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_for_development_only';
        const token = jwt.sign(
            { id: user._id, role: user.role },
            jwtSecret,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                picture: user.picture,
                role: user.role,
            }
        });

    } catch (error: any) {
        console.error('Google login error:', error);
        res.status(500).json({
            message: 'Internal server error during authentication',
            details: error?.message || 'Unknown error'
        });
    }
};
