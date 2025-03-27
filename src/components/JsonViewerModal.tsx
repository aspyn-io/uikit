import { FC } from 'react';
import { Modal, Button, Clipboard } from 'flowbite-react';
import { HiClipboard } from 'react-icons/hi';

export interface JsonViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  data: any;
  dismissible?: boolean;
  invalidDataMessage?: string;
  allowCopy?: boolean;
}

const JsonViewerModal: FC<JsonViewerModalProps> = ({
  isOpen,
  onClose,
  title = 'JSON Data Viewer',
  data,
  dismissible = true,
  invalidDataMessage = 'Unable to display data: Invalid or circular JSON structure',
  allowCopy = true,
}) => {
  const getFormattedJson = () => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return invalidDataMessage;
    }
  };

  const formattedJson = getFormattedJson();

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl" dismissible={dismissible}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body className="pl-5 pr-5 pt-2 pb-2">
        <div className="relative">
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm text-gray-700 dark:text-gray-200 overflow-auto max-h-[600px]">
            {allowCopy && formattedJson !== invalidDataMessage && (
              <Clipboard.WithIcon 
                valueToCopy={formattedJson}
                className="absolute top-5 right-4" 
              />
            )}
            {formattedJson}
          </pre>
        </div>
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
