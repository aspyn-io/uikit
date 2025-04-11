import React from "react";
import {
  Breadcrumb as FlowbiteBreadcrumb,
  BreadcrumbItem as FlowbiteBreadcrumbItem,
} from "flowbite-react";
import { Link } from "react-router-dom";
import type { ReactNode, AnchorHTMLAttributes } from "react";

// Derive types for Breadcrumb and BreadcrumbItem
type BreadcrumbProps = React.ComponentProps<typeof FlowbiteBreadcrumb>;
type BreadcrumbItemProps = React.ComponentProps<typeof FlowbiteBreadcrumbItem>;

// CustomBreadcrumbItemProps resolves conflicts between BreadcrumbItemProps and AnchorHTMLAttributes
type CustomBreadcrumbItemProps = Omit<
  BreadcrumbItemProps & AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "onAbort" | "onError"
> & {
  to?: string; // Add `to` for React Router links
  href?: string; // Add `href` for anchor links
  children: ReactNode; // Ensure children are required
};

const BreadcrumbItem: React.FC<CustomBreadcrumbItemProps> = ({
  to,
  href,
  target,
  rel,
  children,
  ...props
}) => {
  if (to) {
    // Use React Router's Link when `to` is provided
    return (
      <FlowbiteBreadcrumbItem {...props}>
        <Link to={to} target={target} rel={rel}>
          {children}
        </Link>
      </FlowbiteBreadcrumbItem>
    );
  }

  // Default behavior with `href`
  return (
    <FlowbiteBreadcrumbItem {...props}>
      <a href={href} target={target} rel={rel}>
        {children}
      </a>
    </FlowbiteBreadcrumbItem>
  );
};

// Custom Breadcrumb component that uses the custom BreadcrumbItem
export const Breadcrumb: React.FC<BreadcrumbProps> & {
  Item: typeof BreadcrumbItem;
} = ({ ...props }) => {
  return <FlowbiteBreadcrumb {...props} />;
};

// Attach the custom Breadcrumb.Item
Breadcrumb.Item = BreadcrumbItem;

export default Breadcrumb;
