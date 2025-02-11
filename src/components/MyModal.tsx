import React, { useState } from 'react';
import { Modal, Button } from 'flowbite-react';

interface ModalProps {
  title: string;
  message: string;
  buttonText: string;
}

export const MyModal: React.FC<ModalProps> = ({ title, message, buttonText }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button onClick={toggleModal}>
        {buttonText}
      </Button>
      <Modal show={isOpen} onClose={toggleModal}>
        <Modal.Header>
          {title}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {message}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={toggleModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
