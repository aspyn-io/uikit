// Time period types
export type TimePeriod = "any_time" | "morning" | "afternoon";

export interface TimeSlot {
  start_at: string;
  end_at: string;
  calendar_id: string;
  user?: {
    id: string;
    name: string;
  };
  team?: {
    id: string;
    name: string;
  };
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD format
  slots: {
    any_time?: TimeSlot[];
    morning?: TimeSlot[];
    afternoon?: TimeSlot[];
  };
  is_available: boolean;
}

export interface WeekData {
  week_start: string; // YYYY-MM-DD format
  week_end: string; // YYYY-MM-DD format
  days: DayAvailability[];
}

export interface SelectedSlot {
  date: string;
  time_period: TimePeriod;
  openings?: TimeSlot[]; // All available openings for this date/time_period
}

export interface SchedulableSlot {
  selectedSlot: SelectedSlot;
  timeSlot: TimeSlot; // The specific TimeSlot to schedule based on filters
}

export interface WindowOption {
  id: string;
  label: string;
  start_time?: string;
  end_time?: string;
  available?: boolean;
}

export interface TeamOption {
  id: string;
  name: string;
  available?: boolean;
}

export interface TechnicianOption {
  id: string;
  name: string;
  rating?: string;
  experience?: string;
  available?: boolean;
  avatar?: string;
}

export interface Labels {
  anyTime?: string;
  morning?: string;
  afternoon?: string;
  unavailable?: string;
  past?: string;
}
