// Time period types
export type TimePeriod = string;

/**
 * Configuration for a time period to display in the scheduling selector
 * @example
 * ```ts
 * const timePeriods: TimePeriodConfig[] = [
 *   { id: "morning", label: "Morning", order: 1 },
 *   { id: "afternoon", label: "Afternoon", order: 2 },
 * ];
 * ```
 */
export interface TimePeriodConfig {
  id: string;
  label: string;
  order?: number; // Optional order for display, defaults to definition order
}

/**
 * Represents a specific time slot with calendar and optional team/user information
 */
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

/**
 * Availability data for a single day
 */
export interface DayAvailability {
  date: string; // YYYY-MM-DD format
  slots: Record<string, TimeSlot[] | undefined>;
  is_available: boolean;
}

/**
 * Complete week data with availability for all days
 * Typically fetched from an API and passed to the SchedulingSelector component
 */
export interface WeekData {
  week_start: string; // YYYY-MM-DD format
  week_end: string; // YYYY-MM-DD format
  days: DayAvailability[];
}

/**
 * Represents a user's selected time slot with all available openings
 * Parent component should use this to filter and generate preference options
 */
export interface SelectedSlot {
  date: string;
  time_period: TimePeriod;
  openings?: TimeSlot[]; // All available openings for this date/time_period
}

/**
 * The final schedulable slot after applying all filters
 * This is what should be sent to the API when reserving
 */
export interface SchedulableSlot {
  selectedSlot: SelectedSlot;
  timeSlot: TimeSlot; // The specific TimeSlot to schedule based on filters
}

/**
 * Basic time window option
 */
export interface WindowOption {
  id: string;
  label: string;
  start_time: string;
  end_time: string;
}

/**
 * Time window option with availability flag
 * Used to show which windows are available for the selected slot
 */
export interface WindowOptionWithAvailability extends WindowOption {
  available: boolean;
}

/**
 * Team option for team selection dropdown
 */
export interface TeamOption {
  id: string;
  name: string;
  available?: boolean;
}

/**
 * Technician option for technician selection dropdown
 * Includes optional display metadata like rating and experience
 */
export interface TechnicianOption {
  id: string;
  name: string;
  rating?: string;
  experience?: string;
  available?: boolean;
  avatar?: string;
}

/**
 * Custom labels for UI text
 * Used for internationalization or custom messaging
 */
export interface CustomLabels {
  unavailable?: string;
  past?: string;
}
