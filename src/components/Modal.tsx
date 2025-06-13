import React, { useRef, useEffect } from "react";
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
const ModalBody: React.FC<React.ComponentPropsWithoutRef<typeof FlowbiteModalBody>> = ({ children, className, ...props }) => {
  return (
    <FlowbiteModalBody 
      className={`overflow-y-auto flex-1 ${className || ''}`}
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
} = ({ show, onClose, children, dismissible = true, ...rest }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <FlowbiteModal
      dismissible={dismissible}
      theme={{
        root: {
          show: {
            on: "flex bg-black/50 dark:bg-black/50",
            off: "hidden",
          },
        },
        content: {
          base: "relative h-full w-full p-4 md:h-auto",
          inner: "relative flex max-h-[90vh] flex-col rounded-lg bg-white shadow dark:bg-gray-700",
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
