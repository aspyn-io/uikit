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

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onClose) {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        onClose
      ) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("keydown", handleEsc);
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  return (
    <FlowbiteModal show={show} onClose={onClose} {...rest}>
      <div ref={modalRef} className="max-h-screen overflow-y-auto">
        {children}
      </div>
    </FlowbiteModal>
  );
};

// Re-export subcomponents to make them accessible through Modal
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
