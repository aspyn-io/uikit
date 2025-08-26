import React from "react";
import {
  HiCalendar,
  HiLightningBolt,
  HiCheck,
  HiPencil,
  HiPhone,
  HiChatAlt,
} from "react-icons/hi";
import { Spinner } from "flowbite-react";
import { format } from "date-fns";

export interface AppointmentAvailability {
  window_start_at: string;
  window_end_at: string;
  total_slots: number;
  name: string;
  openings: {
    calendar_id: string;
    start_at: string;
    end_at: string;
    calendar: {
      id: string;
      name: string;
    };
  }[];
}

interface AvailabilitySelectorProps {
  // Required props for scheduling
  schedulingType: "asap" | "specific";
  onSchedulingTypeChange: (type: "asap" | "specific") => void;

  // UI behavior
  /**
   * When true, hides the ASAP/Specific toggle UI. The component will still
   * render follow-up steps based on the current schedulingType value.
   */
  hideSchedulingTypeSelect?: boolean;

  // Date props
  specificDate: string;
  onSpecificDateChange: (date: string) => void;

  // Time window props
  selectedTimeWindow?: AppointmentAvailability | null;
  onTimeWindowChange?: (window: AppointmentAvailability | null) => void;

  // Availability data
  availabilityData: AppointmentAvailability[];
  loading: boolean;

  // Notes props
  customerNote?: string;
  onCustomerNoteChange?: (note: string) => void;
  showNotes?: boolean;
  showCsNumber?: boolean;
  // Configuration
  type?: "reschedule" | "reservice" | "create";
}

export const AvailabilitySelector: React.FC<AvailabilitySelectorProps> = ({
  schedulingType,
  onSchedulingTypeChange,
  hideSchedulingTypeSelect = false,
  specificDate,
  onSpecificDateChange,
  selectedTimeWindow,
  onTimeWindowChange,
  availabilityData,
  loading,
  customerNote = "",
  onCustomerNoteChange,
  showNotes = true,
  showCsNumber = true,
  type = "create",
}) => {
  // Helper function to handle time window changes
  const handleTimeWindowChange = (window: AppointmentAvailability | null) => {
    if (onTimeWindowChange) {
      onTimeWindowChange(window);
    }
  };

  const updateSchedulingType = (newType: "asap" | "specific") => {
    onSchedulingTypeChange(newType);

    // Reset related fields when changing type
    if (newType !== "specific") {
      onSpecificDateChange("");
      handleTimeWindowChange(null);
    }
  };

  const handleSpecificDateChange = (date: string) => {
    onSpecificDateChange(date);
    handleTimeWindowChange(null); // Reset selected time window when date changes
  };

  // Function to format selected time window for display
  const formatSelectedTimeWindow = (window: AppointmentAvailability) => {
    const startDate = new Date(window.window_start_at);
    const endDate = new Date(window.window_end_at);

    const dateStr = format(startDate, "MMM dd, yyyy");
    const startTime = format(startDate, "h:mm a");
    const endTime = format(endDate, "h:mm a");

    return `${dateStr} ${startTime} - ${endTime}`;
  };

  // Process availability data into time windows
  const timeWindows = React.useMemo(() => {
    if (!availabilityData || availabilityData.length === 0) {
      return [];
    }

    return availabilityData.map((window, index) => ({
      ...window,
      id: `window-${index}-${window.window_start_at}-${window.window_end_at}`,
      timeRange: `${format(
        new Date(window.window_start_at),
        "h:mm a"
      )} - ${format(new Date(window.window_end_at), "h:mm a")}`,
    }));
  }, [availabilityData]);

  // Dynamic content based on type
  const config = {
    reschedule: {
      title: "When would you like to reschedule?",
      asapText: "As soon as possible",
      asapDescription: "We'll find the next available slot",
    },
    reservice: {
      title: "When do you need service?",
      asapText: "As soon as possible",
      asapDescription: "We'll schedule the next available appointment",
    },
    create: {
      title: "When would you like to schedule the appointment?",
      asapText: "As soon as possible",
      asapDescription: "We'll find the next available slot",
    },
  };

  const currentConfig = config[type];

  return (
    <div className="space-y-6">
      {/* Scheduling Options */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {currentConfig.title}
        </h3>
        {!hideSchedulingTypeSelect && (
          <div className="space-y-3">
            {/* ASAP Option */}
            <label
              className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                schedulingType === "asap"
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400"
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              }`}
            >
              <input
                type="radio"
                name="schedulingType"
                checked={schedulingType === "asap"}
                onChange={() => updateSchedulingType("asap")}
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 dark:border-gray-600 dark:focus:ring-green-600"
              />
              <HiLightningBolt className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <span className="font-medium text-gray-900 dark:text-white">
                  {currentConfig.asapText}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentConfig.asapDescription}
                </p>
              </div>
            </label>

            {/* Specific Date Option */}
            <label
              className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                schedulingType === "specific"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              }`}
            >
              <input
                type="radio"
                name="schedulingType"
                checked={schedulingType === "specific"}
                onChange={() => updateSchedulingType("specific")}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-600"
              />
              <HiCalendar className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <span className="font-medium text-gray-900 dark:text-white">
                  Choose a specific date
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pick a date and see available times
                </p>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Conditional Details */}
      {schedulingType === "specific" && (
        <div className="border-1 border-blue-100 dark:bg-blue-900/20 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={specificDate}
              onChange={(e) => handleSpecificDateChange(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {specificDate && (
            <div>
              {/* Show selected time window summary or time window selection */}
              {selectedTimeWindow ? (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Selected Time Window
                  </label>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <HiCheck className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {selectedTimeWindow.name}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatSelectedTimeWindow(selectedTimeWindow)}
                          </span>
                          <button
                            onClick={() => handleTimeWindowChange(null)}
                            className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                            <HiPencil className="w-3 h-3" />
                            <span>Change</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select a time window from the available options below
                    </label>
                    {timeWindows.length > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {timeWindows.length} window
                        {timeWindows.length > 1 ? "s" : ""} available
                      </span>
                    )}
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-6">
                      <div className="flex items-center">
                        <Spinner size="sm" className="mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Loading available times...
                        </span>
                      </div>
                    </div>
                  ) : timeWindows.length === 0 ? (
                    <div className="my-8 flex flex-col items-center justify-center p-8 text-center border border-gray-200 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      {showCsNumber && (
                        <HiPhone className="w-10 h-10 text-blue-500 dark:text-blue-400 mb-4" />
                      )}
                      <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                        No available time slots found
                      </p>
                      <p className="text-base text-gray-600 dark:text-gray-400 max-w-md">
                        Try selecting a different date range
                        {showCsNumber && (
                          <>
                            {" "}
                            or contact our scheduling team at{" "}
                            <a
                              href="tel:18007377374"
                              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                            >
                              1-800-737-7374
                            </a>{" "}
                            for assistance.
                          </>
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {timeWindows.map((timeWindow) => {
                        return (
                          <button
                            key={timeWindow.id}
                            onClick={() => {
                              handleTimeWindowChange(timeWindow);
                            }}
                            className="p-3 rounded-lg border transition-colors text-center border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <div className="space-y-1">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {timeWindow.name}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {timeWindow.timeRange}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {timeWindow.total_slots} slot
                                {timeWindow.total_slots !== 1 ? "s" : ""}{" "}
                                available
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Notes Section */}
      {showNotes && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <HiChatAlt className="w-5 h-5" />
            {type === "reschedule"
              ? "Any special requests?"
              : type === "reservice"
              ? "Tell us about the issue or special requests"
              : "Additional notes or special requests"}
          </h3>
          <textarea
            value={customerNote}
            onChange={(e) => {
              if (onCustomerNoteChange) {
                onCustomerNoteChange(e.target.value);
              }
            }}
            placeholder={
              type === "reschedule"
                ? "Access instructions, pet information, specific areas of concern..."
                : type === "reservice"
                ? "Describe the problem, access instructions, pet information..."
                : "Access instructions, pet information, specific areas of concern..."
            }
            rows={3}
            maxLength={250}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
            {customerNote.length}/250
          </div>
        </div>
      )}
    </div>
  );
};
