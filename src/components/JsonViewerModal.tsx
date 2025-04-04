import { FC } from "react";
import { Button, Clipboard, ClipboardWithIcon } from "flowbite-react";
import Modal, { ModalHeader, ModalBody, ModalFooter } from "./Modal";

export interface JsonViewerModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  data: any;
  invalidDataMessage?: string;
  allowCopy?: boolean;
}

const JsonViewerModal: FC<JsonViewerModalProps> = ({
  show,
  onClose,
  title = "JSON Data Viewer",
  data,
  invalidDataMessage = "Unable to display data: Invalid or circular JSON structure",
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
    <Modal show={show} onClose={onClose} size="4xl">
      <ModalHeader>{title}</ModalHeader>
      <ModalBody className="pl-5 pr-5 pt-2 pb-2">
        <div className="relative">
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm text-gray-700 dark:text-gray-200 overflow-auto max-h-[600px]">
            {allowCopy && formattedJson !== invalidDataMessage && (
              <ClipboardWithIcon
                valueToCopy={formattedJson}
                className="absolute top-5 right-4"
              />
            )}
            {formattedJson}
          </pre>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="gray" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default JsonViewerModal;
