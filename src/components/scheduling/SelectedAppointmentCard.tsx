import React from "react";
import { Button, Spinner } from "flowbite-react";
import { Clock, Users, User } from "lucide-react";
import {
  SelectedSlot,
  WindowOption,
  TeamOption,
  TechnicianOption,
} from "./types";

interface SelectedAppointmentCardProps {
  selectedSlot: SelectedSlot;
  formatDate: (date: Date | string, format: string) => string;
  windowOptions: WindowOption[];
  teamOptions: TeamOption[];
  technicianOptions: TechnicianOption[];
  selectedWindow?: string;
  selectedTeam?: string;
  selectedTechnician?: string;
  onReserve?: () => void;
  reserveButtonText?: string;
  reserveButtonDisabled?: boolean;
  reserveLoading?: boolean;
  reservedSlot?: SelectedSlot | null;
}

export const SelectedAppointmentCard: React.FC<
  SelectedAppointmentCardProps
> = ({
  selectedSlot,
  formatDate,
  windowOptions,
  teamOptions,
  technicianOptions,
  selectedWindow,
  selectedTeam,
  selectedTechnician,
  onReserve,
  reserveButtonText = "Reserve Appointment",
  reserveButtonDisabled = false,
  reserveLoading = false,
  reservedSlot,
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
          {(windowOptions.length > 0 ||
            teamOptions.length > 0 ||
            technicianOptions.length > 0) && (
            <div className="mt-2 text-blue-600 dark:text-blue-400">
              <p className="flex items-center gap-1">
                {windowOptions.length > 0 && (
                  <>
                    <Clock className="h-3 w-3" />
                    <span>
                      Window:{" "}
                      {selectedWindow
                        ? windowOptions.find((w) => w.id === selectedWindow)
                            ?.label
                        : "Any"}
                    </span>
                    {(teamOptions.length > 0 ||
                      technicianOptions.length > 0) && <span>•</span>}
                  </>
                )}
                {teamOptions.length > 0 && (
                  <>
                    <Users className="h-3 w-3" />
                    <span>
                      Team:{" "}
                      {selectedTeam
                        ? teamOptions.find((t) => t.id === selectedTeam)?.name
                        : "Any"}
                    </span>
                    {technicianOptions.length > 0 && <span>•</span>}
                  </>
                )}
                {technicianOptions.length > 0 && (
                  <>
                    <User className="h-3 w-3" />
                    <span>
                      Technician:{" "}
                      {selectedTechnician
                        ? technicianOptions.find(
                            (t) => t.id === selectedTechnician
                          )?.name
                        : "Any"}
                    </span>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
        {onReserve && (
          <div className="flex items-center">
            <Button
              size="md"
              onClick={onReserve}
              disabled={
                reserveButtonDisabled || !!reservedSlot || reserveLoading
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {reserveLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span>Processing...</span>
                </div>
              ) : reservedSlot ? (
                "Appointment Reserved"
              ) : (
                reserveButtonText
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
