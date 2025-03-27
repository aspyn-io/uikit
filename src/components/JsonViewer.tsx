import { FC, ReactNode } from 'react';
import { Button, ButtonProps } from 'flowbite-react';
import JsonViewerModal from './JsonViewerModal';

export interface JsonViewerProps {
  data: any;
  title?: string;
  buttonLabel?: ReactNode;
  buttonProps?: ButtonProps;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dismissible?: boolean;
  invalidDataMessage?: string;
  allowCopy?: boolean;
}

const JsonViewer: FC<JsonViewerProps> = ({
  data,
  title,
  buttonLabel = 'View JSON',
  buttonProps,
  isOpen,
  onOpenChange,
  dismissible,
  invalidDataMessage,
  allowCopy,
}) => {
  return (
    <>
      <Button {...buttonProps} onClick={() => onOpenChange(true)}>
        {buttonLabel}
      </Button>
      <JsonViewerModal
        isOpen={isOpen}
        onClose={() => onOpenChange(false)}
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