import { useState, useRef } from "react";
import { format, isToday, isTomorrow, formatDistanceToNow } from "date-fns";
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

import {
  Calendar,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  ClipboardList,
} from "lucide-react";

interface WorkOrder {
  id: string;
  status: string;
  description: string;
  duration: string;
}

interface AppointmentCardProps {
  datetime: string | Date;
  status?: string;
  calendarActive?: boolean;
  timeActive?: boolean;
  userActive?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onRescheduleAppointment?: () => void;
  onCancelAppointment?: () => void;
  onScheduleReturnService?: () => void;
  onRescheduleWorkOrder?: (workOrderId: string) => void;
  onCancelWorkOrder?: (workOrderId: string) => void;
  showSelectButton?: boolean;
  editable?: boolean;
  workOrders?: WorkOrder[];
  showIcons?: boolean;
  onWorkOrderClick?: (workOrderId: string) => void;
  appointmentId?: string;
  onCalendarClick?: (appointmentId: string) => void;
}

export const AppointmentCard = ({
  datetime,
  status,
  calendarActive = false,
  timeActive = false,
  userActive = false,
  isSelected = false,
  onSelect,
  onRescheduleAppointment,
  onCancelAppointment,
  onScheduleReturnService,
  onRescheduleWorkOrder,
  onCancelWorkOrder,
  showSelectButton = true,
  editable = false,
  workOrders = [],
  showIcons = true,
  onWorkOrderClick,
  appointmentId,
  onCalendarClick,
}: AppointmentCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  const date = new Date(datetime);

  const dayName = format(date, "EEEE");
  const monthName = format(date, "LLL").toUpperCase();
  const dayNumber = format(date, "d");
  const amOrPm = format(date, "a");

  let daysLabel = "";
  if (isToday(date)) {
    daysLabel = "Today";
  } else if (isTomorrow(date)) {
    daysLabel = "Tomorrow";
  } else {
    daysLabel = formatDistanceToNow(date, { addSuffix: true });
  }

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
    if (contentRef.current) {
      setMaxHeight(isExpanded ? 0 : contentRef.current.scrollHeight);
    }
  };

  return (
    <div
      className="border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-md"
      onClick={() => {
        if (appointmentId && onCalendarClick) {
          onCalendarClick(appointmentId);
        }
      }}
    >
      <div className="grid grid-cols-[60%_40%] items-center p-4">
        <div className="flex items-center gap-6">
          <div className="p-3 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
            <Calendar size={20} />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {dayNumber}
            </div>
            <div className="text-xs uppercase text-gray-500 dark:text-gray-400">
              {monthName}
            </div>
          </div>
          <div>
            <div className="text-gray-800 dark:text-gray-200 font-semibold">
              {dayName}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              {amOrPm} Appointment
            </div>
          </div>
          <Badge color="success" className="truncate max-w-[120px]">
            {daysLabel}
          </Badge>
          <div className="flex items-center gap-3">
            {showIcons && (
              <>
                <div
                  className={`p-2 rounded-full ${
                    calendarActive
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                  }`}
                >
                  <Calendar size={20} />
                </div>
                <div
                  className={`p-2 rounded-full ${
                    timeActive
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                  }`}
                >
                  <Clock size={20} />
                </div>
                <div
                  className={`p-2 rounded-full ${
                    userActive
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                  }`}
                >
                  <User size={20} />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          {status && (
            <Badge color="info" className="inline-block capitalize">
              {status}
            </Badge>
          )}
          {workOrders.length > 0 && (
            <Button
              color="gray"
              className="w-24 hover:bg-gray-200"
              outline
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded();
              }}
            >
              <div className="flex items-center gap-2">
                <ClipboardList
                  size={16}
                  className="text-gray-900 dark:text-white"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {workOrders.length}
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp
                  size={16}
                  className="ml-2 text-gray-900 dark:text-white"
                />
              ) : (
                <ChevronDown
                  size={16}
                  className="ml-2 text-gray-900 dark:text-white"
                />
              )}
            </Button>
          )}
          {(onRescheduleAppointment ||
            onCancelAppointment ||
            onScheduleReturnService) && (
            <div
              className="flex justify-end"
              onClick={(e) => e.stopPropagation()}
            >
              <Dropdown
                inline
                arrowIcon={false}
                label={<MoreVertical size={20} />}
                className="overflow-hidden"
              >
                {onRescheduleAppointment && (
                  <DropdownItem onClick={onRescheduleAppointment}>
                    Reschedule Appointment
                  </DropdownItem>
                )}
                {onCancelAppointment && (
                  <DropdownItem onClick={onCancelAppointment}>
                    Cancel Appointment
                  </DropdownItem>
                )}
                {onScheduleReturnService && (
                  <DropdownItem onClick={onScheduleReturnService}>
                    Schedule a Reservice
                  </DropdownItem>
                )}
              </Dropdown>
            </div>
          )}
          {!editable && showSelectButton && onSelect && (
            <Button
              color={isSelected ? "primary" : "light"}
              disabled={isSelected}
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.();
              }}
              className="dark:text-white"
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
          )}
        </div>
      </div>
      <div
        className="transition-max-height duration-300 ease-in-out"
        style={{ maxHeight: `${maxHeight}px` }}
        ref={contentRef}
      >
        <div className="border-t dark:border-gray-700">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>#</TableHeadCell>
                <TableHeadCell>Description</TableHeadCell>
                <TableHeadCell>Duration</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell className="text-right"></TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workOrders.map((order, index) => (
                <TableRow
                  key={order.id}
                  onClick={() => onWorkOrderClick?.(order.id)}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <TableCell className="text-gray-900 dark:text-white">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                    {order.description}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                    {order.duration}
                  </TableCell>
                  <TableCell>
                    <Badge
                      color={
                        order.status === "CREATED" ||
                        order.status === "SCHEDULED"
                          ? "info"
                          : order.status === "COMPLETED"
                            ? "success"
                            : order.status === "DEFERRED"
                              ? "warning"
                              : order.status === "CANCELLED"
                                ? "failure"
                                : "gray"
                      }
                      className="inline-block capitalize"
                    >
                      {order.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(onRescheduleWorkOrder || onCancelWorkOrder) && (
                      <div
                        className="flex justify-end"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Dropdown
                          inline
                          arrowIcon={false}
                          label={<MoreVertical size={16} />}
                          className="overflow-hidden"
                        >
                          {onRescheduleWorkOrder && (
                            <DropdownItem
                              onClick={() => onRescheduleWorkOrder(order.id)}
                            >
                              Reschedule Work Order
                            </DropdownItem>
                          )}
                          {onCancelWorkOrder && (
                            <DropdownItem
                              onClick={() => onCancelWorkOrder(order.id)}
                            >
                              Cancel Work Order
                            </DropdownItem>
                          )}
                        </Dropdown>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
