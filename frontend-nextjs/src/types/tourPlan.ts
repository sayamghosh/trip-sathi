export interface TourPlanGuide {
  _id?: string;
  name?: string;
  profileImage?: string;
  phone?: string;
  address?: string;
}

export interface TourPlanSummary {
  _id: string;
  title: string;
  locations: string[];
  durationDays: number;
  durationNights: number;
  basePrice: number;
  bannerImages?: string[];
  guideId?: TourPlanGuide | null;
  description?: string;
  days?: TourPlanDay[];
}

export interface TourPlanActivity {
  type: string;
  title: string;
  description?: string;
  duration?: string;
  images?: string[];
  hotelRef?: unknown;
}

export interface TourPlanDay {
  dayNumber: number;
  title: string;
  activities: TourPlanActivity[];
}

export interface TourPlanDetailed extends TourPlanSummary {
  description: string;
  days: TourPlanDay[];
}
