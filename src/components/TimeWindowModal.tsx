import { Card, Button, Label, TextInput } from "flowbite-react";
import Modal from "./Modal";
import { FC, JSX, useState } from "react";
import { format, addDays } from "date-fns";

export interface TimeWindow {
  window_start_at: string;
  window_end_at: string;
  total_slots: number;
}

// Use a generic type T that extends TimeWindow
interface TimeWindowModalProps<T extends TimeWindow> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  timeWindows: T[];
  onSubmit: (selectedTimeWindow: T, startDate: string, endDate: string) => void;
  onSearch?: (startDate: string, endDate: string) => void;
}

// Helper function to format dates and times
const formatDateTime = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const sameDay = startDate.toDateString() === endDate.toDateString();

  return {
    date: startDate.toLocaleDateString(undefined, dateOptions),
    start: startDate.toLocaleTimeString(undefined, timeOptions),
    end: sameDay
      ? endDate.toLocaleTimeString(undefined, timeOptions)
      : `${endDate.toLocaleDateString(
          undefined,
          dateOptions
        )}, ${endDate.toLocaleTimeString(undefined, timeOptions)}`,
  };
};

// Make the component generic with <T extends TimeWindow>
const TimeWindowModal = <T extends TimeWindow>({
  isOpen,
  onClose,
  title = "Select Time Window",
  timeWindows,
  onSubmit,
  onSearch = () => {},
}: TimeWindowModalProps<T>): JSX.Element => {
  const [selectedWindow, setSelectedWindow] = useState<T | null>(null);
  const [startDate, setStartDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState<string>(
    format(addDays(new Date(), 3), "yyyy-MM-dd")
  );

  const handleSearch = () => {
    onSearch(startDate, endDate);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <Modal.Header>{title}</Modal.Header>
      </div>

      <Modal.Body>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <TextInput
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <TextInput
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <Button onClick={handleSearch} color="primary">
            Search
          </Button>
        </div>

        {timeWindows.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No available slots found. Please try expanding your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {timeWindows.map((window) => {
              const { date, start, end } = formatDateTime(
                window.window_start_at,
                window.window_end_at
              );
              return (
                <Card
                  key={`${window.window_start_at}-${window.window_end_at}`}
                  className={`cursor-pointer transition-transform transform hover:scale-105 ${
                    selectedWindow === window
                      ? "ring-2 ring-blue-500 dark:ring-blue-700"
                      : ""
                  }`}
                  onClick={() => setSelectedWindow(window)}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      <span className="font-normal">{date}</span>
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Start: <span className="font-normal">{start}</span>
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      End: <span className="font-normal">{end}</span>
                    </p>
                    {window.total_slots !== undefined && (
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-400">
                        Total Slots:{" "}
                        <span className="font-normal">
                          {window.total_slots}
                        </span>
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-end space-x-3 w-full">
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() =>
              selectedWindow && onSubmit(selectedWindow, startDate, endDate)
            }
            disabled={!selectedWindow || !startDate || !endDate}
          >
            Confirm
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default TimeWindowModal;
