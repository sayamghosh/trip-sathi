import type { Request, Response } from 'express';
import Hotel from '../models/hotel.model.js';

export const createHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const guideId = (req as any).user.id;
        const hotelData = req.body;

        const newHotel = new Hotel({
            ...hotelData,
            guideId
        });

        await newHotel.save();
        res.status(201).json({ message: 'Hotel created successfully', hotel: newHotel });
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating hotel', error: error.message });
    }
};

export const getHotelsByGuide = async (req: Request, res: Response): Promise<void> => {
    try {
        const guideId = (req as any).user.id;
        const hotels = await Hotel.find({ guideId }).sort({ createdAt: -1 });
        res.status(200).json(hotels);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving hotels', error: error.message });
    }
};
