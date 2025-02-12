import React, { useState } from "react";
import { Modal as FlowbiteModal, Button } from "flowbite-react";

interface ModalProps {
  title: string;
  message: string;
  buttonText: string;
}

export const Modal: React.FC<ModalProps> = ({ title, message, buttonText }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button onClick={toggleModal}>{buttonText}</Button>
      <FlowbiteModal show={isOpen} onClose={toggleModal}>
        <FlowbiteModal.Header>{title}</FlowbiteModal.Header>
        <FlowbiteModal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {message}
            </p>
          </div>
        </FlowbiteModal.Body>
        <FlowbiteModal.Footer>
          <Button onClick={toggleModal}>Close</Button>
        </FlowbiteModal.Footer>
      </FlowbiteModal>
    </>
  );
};

export default Modal;
