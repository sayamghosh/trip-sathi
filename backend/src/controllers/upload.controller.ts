import type { Request, Response } from 'express';
import cloudinary from '../config/cloudinary.js';

export const uploadImage = (req: Request, res: Response): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No image file provided' });
                return resolve();
            }

            const stream = cloudinary.uploader.upload_stream(
                { folder: 'trip-sathi' },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        res.status(500).json({ message: 'Error uploading image to Cloudinary', error: error.message });
                        return resolve();
                    }

                    if (result) {
                        res.status(200).json({ url: result.secure_url });
                        return resolve();
                    }
                }
            );

            // Pipe the multer memory buffer directly to Cloudinary
            stream.end(req.file.buffer);
        } catch (error: any) {
            console.error('Upload catch error:', error);
            res.status(500).json({ message: 'Internal server error during upload', error: error.message });
            resolve();
        }
    });
};
