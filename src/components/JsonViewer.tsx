import { FC, ReactNode, useState } from "react";
import { Button, ButtonProps } from "flowbite-react";
import JsonViewerModal from "./JsonViewerModal";

interface BaseJsonViewerProps {
  data: any;
  title: string;
  buttonLabel?: ReactNode;
  buttonProps?: ButtonProps;
  invalidDataMessage?: string;
  allowCopy?: boolean;
}

interface UncontrolledJsonViewerProps extends BaseJsonViewerProps {
  show?: undefined;
  onClose?: undefined;
}

interface ControlledJsonViewerProps extends BaseJsonViewerProps {
  show: boolean;
  onClose: () => void;
}

export type JsonViewerProps =
  | ControlledJsonViewerProps
  | UncontrolledJsonViewerProps;

const JsonViewer: FC<JsonViewerProps> = ({
  data,
  title,
  buttonLabel = "View JSON",
  buttonProps,
  show: controlledShow,
  onClose,
  invalidDataMessage,
  allowCopy,
}) => {
  const [uncontrolledShow, setUncontrolledShow] = useState(false);

  const isControlled = controlledShow !== undefined;
  const modalShow = isControlled ? controlledShow : uncontrolledShow;

  const handleClose = () => {
    if (!isControlled) {
      setUncontrolledShow(false);
    }
    onClose?.();
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isControlled) {
      buttonProps?.onClick?.(event);
    } else {
      setUncontrolledShow(true);
    }
  };

  return (
    <>
      <Button {...buttonProps} color={"blue"} onClick={handleClick}>
        {buttonLabel}
      </Button>
      <JsonViewerModal
        show={modalShow}
        onClose={handleClose}
        title={title}
        data={data}
        invalidDataMessage={invalidDataMessage}
        allowCopy={allowCopy}
      />
    </>
  );
};

export default JsonViewer;
