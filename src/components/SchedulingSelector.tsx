/**
 * SchedulingSelector Component
 *
 * Main export for the scheduling selector component.
 * This component allows users to select appointment time slots,
 * choose preferences (time windows, teams, technicians), and reserve appointments.
 *
 * @see ./scheduling/SchedulingSelector.tsx for the main implementation
 */

/**
 * SchedulingSelector Component
 *
 * A comprehensive appointment scheduling component that allows users to:
 * - Select time slots from a weekly calendar view
 * - Choose preferences (time windows, teams, technicians)
 * - Reserve appointments with loading states
 *
 * This component has been refactored into a modular structure for better
 * maintainability and reusability.
 *
 * @see ./scheduling/SchedulingSelector.tsx for the main implementation
 * @see ./scheduling/README.md for architecture details
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
