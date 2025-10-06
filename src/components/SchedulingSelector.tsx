/**
 * SchedulingSelector Component
 *
 * Main export for the scheduling selector component.
 * This component allows users to select appointment time slots,
 * choose preferences (time windows, teams, technicians), and reserve appointments.
 *
 * @see ./scheduling/SchedulingSelector.tsx for the main implementation
 */

export { SchedulingSelector } from "./scheduling";
export type {
  TimePeriod,
  TimeSlot,
  DayAvailability,
  WeekData,
  SelectedSlot,
  WindowOption,
  TeamOption,
  TechnicianOption,
  Labels,
} from "./scheduling/types";

// Re-export for backward compatibility as RescheduleSelector
export { SchedulingSelector as RescheduleSelector } from "./scheduling";
