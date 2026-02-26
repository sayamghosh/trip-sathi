import type { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─── Shared helper to verify the Google ID token ───────────────────────────
async function verifyGoogleToken(idToken: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) throw new Error('Missing GOOGLE_CLIENT_ID env variable');
    const ticket = await client.verifyIdToken({ idToken, audience: clientId });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) throw new Error('Invalid Google token payload');
    // Destructure after verifying email is present, so TypeScript knows it's a string
    const { sub: googleId, email, name, picture } = payload;
    return { googleId, email: email as string, name, picture };
}

// ─── Traveller login (existing behaviour) ──────────────────────────────────
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { idToken } = req.body;
        if (!idToken) { res.status(400).json({ message: 'ID Token is required' }); return; }

        const { googleId, email, name, picture } = await verifyGoogleToken(idToken);

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ googleId, email, name: name || '', picture: picture || '' });
            await user.save();
        } else if (user.picture !== picture || user.name !== name) {
            user.picture = picture || '';
            user.name = name || '';
            await user.save();
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
                phone: user.phone,
                address: user.address,
            }
        });
    } catch (error: any) {
        console.error('Google login error:', error);
        res.status(500).json({ message: 'Internal server error', details: error?.message });
    }
};

// ─── Guide signup/login (sets role = 'guide') ────────────────────────────
export const googleGuideLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { idToken, phone, address } = req.body;
        if (!idToken) { res.status(400).json({ message: 'ID Token is required' }); return; }

        const { googleId, email, name, picture } = await verifyGoogleToken(idToken);
        if (!email) { res.status(400).json({ message: 'Email not found in token' }); return; }

        const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';
        const trimmedAddress = typeof address === 'string' ? address.trim() : '';

        let user = await User.findOne({ email });

        const needsContact = !user || user.role !== 'guide' || !user.phone || !user.address;

        if (needsContact && (!trimmedPhone || !trimmedAddress)) {
            res.status(400).json({ message: 'Phone number and address are required to register as a guide.' });
            return;
        }

        if (!user) {
            // New user — create directly as guide with required contact info
            user = new User({
                googleId,
                email,
                name: name || '',
                picture: picture || '',
                role: 'guide',
                phone: trimmedPhone,
                address: trimmedAddress,
            });
            await user.save();
        } else {
            // Existing user — upgrade to guide and sync profile/contact info if missing
            user.role = 'guide';
            user.picture = picture || user.picture;
            user.name = name || user.name;

            if (needsContact) {
                user.phone = trimmedPhone;
                user.address = trimmedAddress;
            }

            await user.save();
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
                phone: user.phone,
                address: user.address,
            }
        });
    } catch (error: any) {
        console.error('Guide login error:', error);
        res.status(500).json({ message: 'Internal server error', details: error?.message });
    }
};
