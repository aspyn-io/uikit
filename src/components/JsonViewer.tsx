import { FC, ReactNode, useState } from 'react';
import { Button, ButtonProps } from 'flowbite-react';
import JsonViewerModal from './JsonViewerModal';

export interface JsonViewerProps {
  data: any;
  title: string;
  buttonLabel?: ReactNode;
  buttonProps?: ButtonProps;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  dismissible?: boolean;
  invalidDataMessage?: string;
  allowCopy?: boolean;
}

const JsonViewer: FC<JsonViewerProps> = ({
  data,
  title,
  buttonLabel = 'View JSON',
  buttonProps,
  isOpen: controlledIsOpen,
  onOpenChange,
  dismissible,
  invalidDataMessage,
  allowCopy,
}) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  
  const isControlled = controlledIsOpen !== undefined;
  const isModalOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;
  
  const handleOpenChange = (open: boolean) => {
    if (!isControlled) {
      setUncontrolledIsOpen(open);
    }
    onOpenChange?.(open);
  };

  return (
    <>
      <Button {...buttonProps} onClick={() => handleOpenChange(true)}>
        {buttonLabel}
      </Button>
      <JsonViewerModal
        isOpen={isModalOpen}
        onClose={() => handleOpenChange(false)}
        title={title}
        data={data}
        dismissible={dismissible}
        invalidDataMessage={invalidDataMessage}
        allowCopy={allowCopy}
      />
    </>
  );
};

export default JsonViewer;