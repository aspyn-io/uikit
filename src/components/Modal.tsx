import React from "react";
import {
  Modal as FlowbiteModal,
  ModalHeader,
  ModalBody as FlowbiteModalBody,
  ModalFooter,
} from "flowbite-react";
import type { ModalProps } from "flowbite-react";

export interface CustomModalProps extends ModalProps {
  dismissible?: boolean;
}

// Custom ModalBody component with scrolling support
const ModalBody: React.FC<
  React.ComponentPropsWithoutRef<typeof FlowbiteModalBody>
> = ({ children, className, ...props }) => {
  return (
    <FlowbiteModalBody
      className={`overflow-y-auto overflow-x-hidden flex-1 max-h-[calc(90vh-8rem)] min-h-0 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </FlowbiteModalBody>
  );
};

export const Modal: React.FC<CustomModalProps> & {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
} = ({ show, onClose, children, dismissible = true, className, ...rest }) => {
  return (
    <FlowbiteModal
      dismissible={dismissible}
      className={`!overflow-hidden ${className || ""}`}
      theme={{
        root: {
          show: {
            on: "flex bg-black/50 dark:bg-black/50",
            off: "hidden",
          },
          base: "fixed top-0 right-0 left-0 z-50 h-modal h-screen overflow-hidden md:inset-0 md:h-full",
        },
        content: {
          base: "relative h-full w-full p-4 md:h-auto",
          inner:
            "relative flex max-h-[90vh] min-h-0 flex-col rounded-lg bg-white shadow dark:bg-gray-700",
        },
      }}
      show={show}
      onClose={onClose}
      {...rest}
    >
      {children}
    </FlowbiteModal>
  );
};

// Re-export subcomponents to make them accessible through Modal
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
