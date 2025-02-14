import { useState, useRef } from "react";
import { format, isToday, isTomorrow, differenceInDays } from "date-fns";
import { Badge, Button, Dropdown, Table } from "flowbite-react";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineDotsVertical,
  HiOutlineClipboardList,
} from "react-icons/hi";

interface WorkOrder {
  id: string;
  orderId: string;
  status: string;
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
  onRescheduleWorkOrder?: (workOrderId: string) => void;
  onCancelWorkOrder?: (workOrderId: string) => void;
  showSelectButton?: boolean;
  editable?: boolean;
  workOrders?: WorkOrder[];
  showIcons?: boolean;
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
  onRescheduleWorkOrder,
  onCancelWorkOrder,
  showSelectButton = true,
  editable = false,
  workOrders = [],
  showIcons = true,
}: AppointmentCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  const date = new Date(datetime);

  const dayName = format(date, "EEEE");
  const monthName = format(date, "LLL").toUpperCase();
  const dayNumber = format(date, "d");
  const amOrPm = format(date, "a");
  const daysDifference = differenceInDays(date, new Date());

  let daysLabel = "";
  if (isToday(date)) daysLabel = "Today";
  else if (isTomorrow(date)) daysLabel = "Tomorrow";
  else if (daysDifference < 7) daysLabel = `${daysDifference} days`;
  else
    daysLabel = `${Math.ceil(daysDifference / 7)} week${
      daysDifference > 7 ? "s" : ""
    }`;

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
    if (contentRef.current) {
      setMaxHeight(isExpanded ? 0 : contentRef.current.scrollHeight);
    }
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white overflow-hidden transition-all duration-300">
      <div className="grid grid-cols-[60%_40%] items-center p-4">
        <div className="flex items-center gap-6">
          <div className="p-3 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <HiOutlineCalendar size={20} />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-gray-900">{dayNumber}</div>
            <div className="text-xs uppercase text-gray-500">{monthName}</div>
          </div>
          <div>
            <div className="text-gray-800 font-semibold">{dayName}</div>
            <div className="text-gray-500 text-sm">{amOrPm} Appointment</div>
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
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <HiOutlineCalendar size={20} />
                </div>
                <div
                  className={`p-2 rounded-full ${
                    timeActive
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <HiOutlineClock size={20} />
                </div>
                <div
                  className={`p-2 rounded-full ${
                    userActive
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <HiOutlineUser size={20} />
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
            <Button color="gray" onClick={toggleExpanded}>
              <div className="flex items-center gap-2">
                <HiOutlineClipboardList size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  {workOrders.length}
                </span>
              </div>
              {isExpanded ? (
                <HiOutlineChevronUp size={16} className="ml-2 text-gray-500" />
              ) : (
                <HiOutlineChevronDown
                  size={16}
                  className="ml-2 text-gray-500"
                />
              )}
            </Button>
          )}
          {editable && (
            <Dropdown
              inline
              arrowIcon={false}
              label={<HiOutlineDotsVertical size={20} />}
              className="overflow-hidden"
            >
              <Dropdown.Item onClick={onRescheduleAppointment}>
                Reschedule Appointment
              </Dropdown.Item>
              <Dropdown.Item onClick={onCancelAppointment}>
                Cancel Appointment
              </Dropdown.Item>
            </Dropdown>
          )}
          {!editable && showSelectButton && onSelect && (
            <Button
              color={isSelected ? "primary" : "light"}
              disabled={isSelected}
              onClick={onSelect}
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
          )}
        </div>
      </div>
      <div
        className="transition-max-height duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight: `${maxHeight}px` }}
        ref={contentRef}
      >
        <div className="border-t">
          <Table>
            <Table.Head>
              <Table.HeadCell>Work Order ID</Table.HeadCell>
              <Table.HeadCell>Order ID</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell className="text-right"></Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {workOrders.map((order) => (
                <Table.Row key={order.id}>
                  <Table.Cell>{order.id}</Table.Cell>
                  <Table.Cell>{order.orderId}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={
                        order.status === "Active"
                          ? "success"
                          : order.status === "Pending"
                          ? "warning"
                          : "gray"
                      }
                      className="inline-block capitalize"
                    >
                      {order.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-end">
                      <Dropdown
                        inline
                        arrowIcon={false}
                        label={<HiOutlineDotsVertical size={16} />}
                        className="overflow-hidden"
                      >
                        <Dropdown.Item
                          onClick={() => onRescheduleWorkOrder?.(order.id)}
                        >
                          Reschedule Work Order
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => onCancelWorkOrder?.(order.id)}
                        >
                          Cancel Work Order
                        </Dropdown.Item>
                      </Dropdown>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};
