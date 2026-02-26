import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1] as string;
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

    try {
        const decoded = jwt.verify(token, jwtSecret) as unknown as { id: string; role: string };
        (req as any).user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export const isGuide = (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    if (!user || (user.role !== 'guide' && user.role !== 'admin')) {
        res.status(403).json({ message: 'Access denied: Requires guide or admin role' });
        return;
    }
    next();
};
