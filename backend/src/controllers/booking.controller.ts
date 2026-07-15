import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import Booking from '../models/booking.model.js';
import TourPlan from '../models/tourPlan.model.js';
import CallbackRequest from '../models/callbackRequest.model.js';

const TOUR_PLAN_POPULATE = 'title basePrice durationDays durationNights locations';

export const createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user;
        const {
            callbackRequestId,
            tourPlanId,
            travelerName,
            travelerEmail,
            travelerPhone,
            travelerAddress,
            governmentIdNumber,
            tripDate,
            numberOfTravelers,
            finalPrice,
            paymentStatus,
            advanceAmount,
            notes,
        } = req.body;

        if (!tourPlanId || !travelerName || !travelerPhone || !tripDate || finalPrice === undefined) {
            res.status(400).json({ message: 'tourPlanId, travelerName, travelerPhone, tripDate and finalPrice are required' });
            return;
        }

        const tourPlan = await TourPlan.findById(tourPlanId);
        if (!tourPlan) { res.status(404).json({ message: 'Tour plan not found' }); return; }
        if (tourPlan.guideId.toString() !== user.id && user.role !== 'admin') {
            res.status(403).json({ message: 'You do not own this tour plan' });
            return;
        }

        const resolvedPaymentStatus = paymentStatus || 'unpaid';
        if (resolvedPaymentStatus === 'advance_paid') {
            if (!advanceAmount || advanceAmount <= 0) {
                res.status(400).json({ message: 'advanceAmount is required and must be greater than 0 for advance_paid bookings' });
                return;
            }
            if (advanceAmount > finalPrice) {
                res.status(400).json({ message: 'advanceAmount cannot exceed finalPrice' });
                return;
            }
        }

        let linkedCallback = null;
        if (callbackRequestId) {
            linkedCallback = await CallbackRequest.findOne({ _id: callbackRequestId, guideId: user.id });
            if (!linkedCallback) { res.status(404).json({ message: 'Callback request not found' }); return; }
        }

        const bookingPayload: Record<string, unknown> = {
            guideId: user.id,
            tourPlanId,
            travelerName,
            travelerPhone,
            tripDate,
            numberOfTravelers: numberOfTravelers || 1,
            finalPrice,
            paymentStatus: resolvedPaymentStatus,
        };
        if (linkedCallback?._id) bookingPayload.callbackRequestId = linkedCallback._id;
        if (linkedCallback?.userId) bookingPayload.userId = linkedCallback.userId;
        if (travelerEmail) bookingPayload.travelerEmail = travelerEmail;
        if (travelerAddress) bookingPayload.travelerAddress = travelerAddress;
        if (governmentIdNumber) bookingPayload.governmentIdNumber = governmentIdNumber;
        if (resolvedPaymentStatus === 'advance_paid') bookingPayload.advanceAmount = advanceAmount;
        if (notes) bookingPayload.notes = notes;

        const booking = await Booking.create(bookingPayload);

        if (linkedCallback) {
            linkedCallback.status = 'positive';
            linkedCallback.isRead = true;
            await linkedCallback.save();
        }

        const populated = await booking.populate('tourPlanId', TOUR_PLAN_POPULATE);

        res.status(201).json({ message: 'Booking created', booking: populated });
    } catch (error: any) {
        console.error('Create booking error', error);
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
};

export const getGuideBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user;
        const {
            page = '1',
            limit = '8',
            search,
            status = 'confirmed',
            tourPlanId,
            dateFrom,
            dateTo,
        } = req.query as Record<string, string>;

        const filter: Record<string, any> = user.role === 'admin' ? {} : { guideId: user.id };

        if (status && status !== 'all') {
            filter.status = status;
        }
        if (tourPlanId) {
            filter.tourPlanId = tourPlanId;
        }
        if (search) {
            const regex = new RegExp(search, 'i');
            filter.$or = [{ travelerName: regex }, { travelerEmail: regex }, { travelerPhone: regex }];
        }
        if (dateFrom || dateTo) {
            filter.tripDate = {};
            if (dateFrom) filter.tripDate.$gte = new Date(dateFrom);
            if (dateTo) filter.tripDate.$lte = new Date(dateTo);
        }

        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.max(1, parseInt(limit, 10) || 8);

        const [data, total] = await Promise.all([
            Booking.find(filter)
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .populate('tourPlanId', TOUR_PLAN_POPULATE)
                .lean(),
            Booking.countDocuments(filter),
        ]);

        res.status(200).json({
            data,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.max(1, Math.ceil(total / limitNum)),
            },
        });
    } catch (error: any) {
        console.error('Get guide bookings error', error);
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

export const getBookingMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user;
        const months = Math.max(1, parseInt((req.query.months as string) || '12', 10));
        const guideId = user.role === 'admin' ? undefined : new mongoose.Types.ObjectId(user.id);

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - (months - 1));
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        const matchStage: Record<string, any> = guideId ? { guideId } : {};

        const [result] = await Booking.aggregate([
            { $match: matchStage },
            {
                $facet: {
                    totals: [
                        { $match: { status: { $ne: 'cancelled' } } },
                        {
                            $group: {
                                _id: null,
                                totalRevenue: { $sum: '$finalPrice' },
                                totalBookings: { $sum: 1 },
                                totalParticipants: { $sum: '$numberOfTravelers' },
                            },
                        },
                    ],
                    monthly: [
                        { $match: { createdAt: { $gte: startDate } } },
                        {
                            $group: {
                                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, status: '$status' },
                                count: { $sum: 1 },
                                revenue: { $sum: '$finalPrice' },
                            },
                        },
                    ],
                    byPackage: [
                        { $match: { status: { $ne: 'cancelled' } } },
                        {
                            $group: {
                                _id: '$tourPlanId',
                                count: { $sum: 1 },
                                participants: { $sum: '$numberOfTravelers' },
                            },
                        },
                        { $sort: { count: -1 } },
                        { $limit: 4 },
                        {
                            $lookup: {
                                from: 'tourplans',
                                localField: '_id',
                                foreignField: '_id',
                                as: 'plan',
                            },
                        },
                    ],
                },
            },
        ]);

        const totals = result.totals[0] || { totalRevenue: 0, totalBookings: 0, totalParticipants: 0 };

        // Zero-fill the monthly buckets so the chart always shows a fixed window.
        const monthly: { month: string; confirmed: number; cancelled: number; revenue: number }[] = [];
        const bucketIndex: Record<string, number> = {};
        for (let i = months - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(1);
            d.setMonth(d.getMonth() - i);
            const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
            bucketIndex[key] = monthly.length;
            monthly.push({
                month: `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear().toString().slice(-2)}`,
                confirmed: 0,
                cancelled: 0,
                revenue: 0,
            });
        }
        for (const row of result.monthly) {
            const key = `${row._id.year}-${row._id.month}`;
            const idx = bucketIndex[key];
            const bucket = idx === undefined ? undefined : monthly[idx];
            if (!bucket) continue;
            if (row._id.status === 'cancelled') {
                bucket.cancelled += row.count;
            } else {
                bucket.confirmed += row.count;
                bucket.revenue += row.revenue;
            }
        }

        const topPackages = result.byPackage.map((p: any) => ({
            tourPlanId: p._id,
            title: p.plan?.[0]?.title || 'Custom Package',
            count: p.count,
            participants: p.participants,
        }));

        res.status(200).json({ totals, monthly, topPackages });
    } catch (error: any) {
        console.error('Get booking metrics error', error);
        res.status(500).json({ message: 'Error fetching booking metrics', error: error.message });
    }
};

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user;
        const { id } = req.params;
        const { cancellationReason } = req.body;

        const query: Record<string, unknown> = { _id: id };
        if (user.role !== 'admin') query.guideId = user.id;
        const booking = await Booking.findOne(query);

        if (!booking) { res.status(404).json({ message: 'Booking not found' }); return; }
        if (booking.status === 'cancelled') {
            res.status(400).json({ message: 'Booking is already cancelled' });
            return;
        }

        booking.status = 'cancelled';
        booking.cancelledAt = new Date();
        if (cancellationReason) booking.cancellationReason = cancellationReason;
        await booking.save();

        const populated = await booking.populate('tourPlanId', TOUR_PLAN_POPULATE);

        res.status(200).json({ message: 'Booking cancelled', booking: populated });
    } catch (error: any) {
        console.error('Cancel booking error', error);
        res.status(500).json({ message: 'Error cancelling booking', error: error.message });
    }
};
