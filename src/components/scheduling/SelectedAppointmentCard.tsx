import React from "react";
import { Button, Spinner } from "flowbite-react";
import { Clock, Users, User } from "lucide-react";
import { parse } from "date-fns";
import {
  SelectedSlot,
  TeamOption,
  TechnicianOption,
  WindowOptionWithAvailability,
} from "./types";

/**
 * SelectedAppointmentCard - Displays the currently selected appointment details
 * Shows date, time period, selected preferences, and action buttons
 */
interface SelectedAppointmentCardProps {
  selectedSlot: SelectedSlot;
  formatDate: (date: Date | string, format: string) => string;
  selectedWindow?: string;
  selectedTeam?: string;
  selectedTechnician?: string;
  windowOptions?: WindowOptionWithAvailability[];
  teamOptions?: TeamOption[];
  technicianOptions?: TechnicianOption[];
  onReserve?: () => void;
  reserveButtonText?: string;
  reserveButtonDisabled?: boolean;
  reserveLoading?: boolean;
  reservedSlot?: SelectedSlot | null;
  onCancelReservation?: () => void;
  cancelButtonText?: string;
  cancelLoading?: boolean;
}

/**
 * Formats a time string to a display format using the provided formatDate function
 * Handles both ISO timestamp format and simple time format (HH:mm:ss)
 */
const formatTimeInTimezone = (
  timeString: string,
  formatDate: (date: Date | string, format: string) => string
): string => {
  try {
    let time: Date;

    // Check if it's an ISO timestamp format
    if (timeString.includes("T") || timeString.includes("Z")) {
      // Parse ISO timestamp
      time = new Date(timeString);
    } else {
      // Parse simple time string (HH:mm:ss format)
      time = parse(timeString, "HH:mm:ss", new Date());
    }

    // Use the provided formatDate function (which is timezone-aware from useTimezoneFormat hook)
    return formatDate(time, "h:mm a");
  } catch (error) {
    // Fallback to original string if parsing fails
    console.error("Error formatting time:", error);
    return timeString;
  }
};

export const SelectedAppointmentCard: React.FC<
  SelectedAppointmentCardProps
> = ({
  selectedSlot,
  formatDate,
  selectedWindow,
  selectedTeam,
  selectedTechnician,
  windowOptions = [],
  teamOptions = [],
  technicianOptions = [],
  onReserve,
  reserveButtonText = "Reserve Appointment",
  reserveButtonDisabled = false,
  reserveLoading = false,
  reservedSlot,
  onCancelReservation,
  cancelButtonText = "Cancel Reservation",
  cancelLoading = false,
}) => {
  // Get display names for selected team and technician
  const selectedTeamName = selectedTeam
    ? teamOptions.find((team) => team.id === selectedTeam)?.name || selectedTeam
    : "Any";

  const selectedTechnicianName = selectedTechnician
    ? technicianOptions.find((tech) => tech.id === selectedTechnician)?.name ||
      selectedTechnician
    : "Any";

  // Get selected window label with timezone formatting
  const selectedWindowLabel = selectedWindow
    ? (() => {
        const windowOption = windowOptions.find(
          (window) => window.id === selectedWindow
        );
        if (windowOption) {
          // Format the time window using the formatDate function (timezone-aware)
          return `${formatTimeInTimezone(
            windowOption.start_time,
            formatDate
          )} - ${formatTimeInTimezone(windowOption.end_time, formatDate)}`;
        }
        return selectedWindow;
      })()
    : "Any";

  // Format time period for display
  const formatTimePeriod = (timePeriod: string): string => {
    return (
      timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1).replace("_", " ")
    );
  };

  // Check if any preferences are available to display
  const hasPreferences =
    windowOptions.length > 0 ||
    teamOptions.length > 0 ||
    technicianOptions.length > 0;

  return (
    <div className="shadow-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-300 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="text-lg text-blue-900 dark:text-blue-500">
            Selected Appointment
          </h4>
          <p className="text-blue-700 dark:text-blue-400">
            {formatDate(
              selectedSlot.openings?.[0].start_at || new Date(),
              "MMM d, yyyy"
            )}
            {" - "}
            {formatTimePeriod(selectedSlot.time_period)}
          </p>
          {hasPreferences && (
            <div className="mt-2 text-blue-600 dark:text-blue-400">
              <p className="flex items-center gap-1">
                {windowOptions.length > 0 && (
                  <>
                    <Clock className="h-3 w-3" />
                    <span>Window: {selectedWindowLabel}</span>
                    {(teamOptions.length > 0 ||
                      technicianOptions.length > 0) && <span>•</span>}
                  </>
                )}
                {teamOptions.length > 0 && (
                  <>
                    <Users className="h-3 w-3" />
                    <span>Team: {selectedTeamName}</span>
                    {technicianOptions.length > 0 && <span>•</span>}
                  </>
                )}
                {technicianOptions.length > 0 && (
                  <>
                    <User className="h-3 w-3" />
                    <span>Technician: {selectedTechnicianName}</span>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
        {(onReserve || (reservedSlot && onCancelReservation)) && (
          <div className="flex items-center">
            {reservedSlot && onCancelReservation ? (
              <Button
                size="md"
                color="red"
                onClick={onCancelReservation}
                disabled={cancelLoading}
              >
                {cancelLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    <span>Cancelling...</span>
                  </div>
                ) : (
                  cancelButtonText
                )}
              </Button>
            ) : (
              onReserve && (
                <Button
                  size="md"
                  onClick={onReserve}
                  disabled={reserveButtonDisabled || reserveLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {reserveLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    reserveButtonText
                  )}
                </Button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
