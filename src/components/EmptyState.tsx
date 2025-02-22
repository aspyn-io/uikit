import { ReactNode, ButtonHTMLAttributes, HTMLAttributes } from "react";
import { Button } from "flowbite-react";

function mergeClasses(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonClick?: () => void;
  layout?: "centered" | "left" | "card" | "fullscreen" | "dashed";
  illustration?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  iconClassName?: string;
  illustrationClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionsClassName?: string;
  asButton?: boolean;
  onClick?: () => void;
}

export function EmptyState({
  title,
  description,
  icon,
  buttonText,
  onButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick,
  layout = "centered",
  illustration,
  className,
  size = "md",
  iconClassName,
  illustrationClassName,
  titleClassName,
  descriptionClassName,
  actionsClassName,
  asButton,
  onClick,
}: EmptyStateProps) {
  const sizes = {
    sm: {
      wrapper: "p-4",
      title: "text-base",
      description: "text-sm",
    },
    md: {
      wrapper: "p-6",
      title: "text-lg",
      description: "text-base",
    },
    lg: {
      wrapper: "p-8",
      title: "text-xl",
      description: "text-lg",
    },
  };

  const baseClassName = mergeClasses(
    "flex flex-col items-center text-center",
    sizes[size].wrapper,
    layout === "left" && "items-start text-left",
    layout === "card" &&
      "bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700",
    layout === "fullscreen" && "min-h-screen justify-center",
    layout === "dashed" &&
      [
        "relative block w-full rounded-lg border-2 border-dashed",
        "border-gray-300 dark:border-gray-600",
        "hover:border-gray-400 dark:hover:border-gray-500",
        "focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400",
      ].join(" "),
    className
  );

  const content = (
    <>
      {illustration && (
        <div className={mergeClasses("mb-6", illustrationClassName)}>
          {illustration}
        </div>
      )}

      {icon && (
        <div
          className={mergeClasses(
            "text-gray-500 dark:text-gray-400 mb-4",
            layout === "dashed" && "mx-auto",
            iconClassName
          )}
        >
          {icon}
        </div>
      )}

      <h3
        className={mergeClasses(
          sizes[size].title,
          "font-medium text-gray-900 dark:text-white",
          layout === "dashed" && "mt-2",
          titleClassName
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={mergeClasses(
            sizes[size].description,
            "text-gray-500 dark:text-gray-400 mt-2",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}

      {(buttonText || secondaryButtonText) && !asButton && (
        <div
          className={mergeClasses(
            "mt-6 flex flex-wrap gap-3",
            layout === "left" ? "justify-start" : "justify-center",
            actionsClassName
          )}
        >
          {buttonText && onButtonClick && (
            <Button onClick={onButtonClick}>{buttonText}</Button>
          )}
          {secondaryButtonText && onSecondaryButtonClick && (
            <Button color="gray" outline onClick={onSecondaryButtonClick}>
              {secondaryButtonText}
            </Button>
          )}
        </div>
      )}
    </>
  );

  if (asButton) {
    return (
      <button type="button" onClick={onClick} className={baseClassName}>
        {content}
      </button>
    );
  }

  return (
    <div
      role="region"
      aria-label={`Empty state: ${title}`}
      className={baseClassName}
    >
      {content}
    </div>
  );
}

export default EmptyState;
