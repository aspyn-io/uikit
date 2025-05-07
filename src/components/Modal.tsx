import React, { useRef, useEffect } from "react";
import {
  Modal as FlowbiteModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "flowbite-react";
import type { ModalProps } from "flowbite-react";

export const Modal: React.FC<ModalProps> & {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
} = ({ show, onClose, children, ...rest }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <FlowbiteModal
      dismissible
      theme={{
        root: {
          show: {
            on: "flex bg-black/50 dark:bg-black/50",
            off: "hidden",
          },
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
