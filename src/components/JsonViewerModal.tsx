import { FC } from 'react';
import { Modal, Button } from 'flowbite-react';

export interface JsonViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  data: any;
  dismissible?: boolean;
  invalidDataMessage?: string;
}

const JsonViewerModal: FC<JsonViewerModalProps> = ({
  isOpen,
  onClose,
  title = 'JSON Data Viewer',
  data,
  dismissible = true,
  invalidDataMessage = 'Unable to display data: Invalid or circular JSON structure',
}) => {
  const getFormattedJson = () => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return invalidDataMessage;
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl" dismissible={dismissible}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body className="pl-5 pr-5 pt-2 pb-2">
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm text-gray-700 dark:text-gray-200 overflow-auto max-h-[600px]">
          {getFormattedJson()}
        </pre>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JsonViewerModal;
