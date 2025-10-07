import React from "react";
import { Button, Spinner } from "flowbite-react";
import { Clock, Users, User } from "lucide-react";
import { SelectedSlot } from "./types";

interface SelectedAppointmentCardProps {
  selectedSlot: SelectedSlot;
  formatDate: (date: Date | string, format: string) => string;
  selectedWindow?: string;
  selectedTeam?: string;
  selectedTechnician?: string;
  onReserve?: () => void;
  reserveButtonText?: string;
  reserveButtonDisabled?: boolean;
  reserveLoading?: boolean;
  reservedSlot?: SelectedSlot | null;
  onCancelReservation?: () => void;
  cancelButtonText?: string;
  cancelLoading?: boolean;
  displayWindowOptions?: boolean;
  displayTeamOptions?: boolean;
  displayTechnicianOptions?: boolean;
}

export const SelectedAppointmentCard: React.FC<
  SelectedAppointmentCardProps
> = ({
  selectedSlot,
  formatDate,
  selectedWindow,
  selectedTeam,
  selectedTechnician,
  onReserve,
  reserveButtonText = "Reserve Appointment",
  reserveButtonDisabled = false,
  reserveLoading = false,
  reservedSlot,
  onCancelReservation,
  cancelButtonText = "Cancel Reservation",
  cancelLoading = false,
  displayWindowOptions = false,
  displayTeamOptions = false,
  displayTechnicianOptions = false,
}) => {
  return (
    <div className="shadow-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-300 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="text-lg text-blue-900 dark:text-blue-500">
            Selected Appointment
          </h4>
          <p className="text-blue-700 dark:text-blue-400">
            {formatDate(selectedSlot.date, "MMM d, yyyy")}
            {" - "}
            {selectedSlot.time_period.charAt(0).toUpperCase() +
              selectedSlot.time_period.slice(1).replace("_", " ")}
          </p>
          {(displayWindowOptions ||
            displayTeamOptions ||
            displayTechnicianOptions) && (
            <div className="mt-2 text-blue-600 dark:text-blue-400">
              <p className="flex items-center gap-1">
                {displayWindowOptions && (
                  <>
                    <Clock className="h-3 w-3" />
                    <span>Window: {selectedWindow || "Any"}</span>
                    {(displayTeamOptions || displayTechnicianOptions) && (
                      <span>•</span>
                    )}
                  </>
                )}
                {displayTeamOptions && (
                  <>
                    <Users className="h-3 w-3" />
                    <span>Team: {selectedTeam || "Any"}</span>
                    {displayTechnicianOptions && <span>•</span>}
                  </>
                )}
                {displayTechnicianOptions && (
                  <>
                    <User className="h-3 w-3" />
                    <span>Technician: {selectedTechnician || "Any"}</span>
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
