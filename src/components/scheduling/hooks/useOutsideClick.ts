import { useEffect, RefObject } from "react";

/**
 * Hook to detect clicks outside a referenced element
 */
export const useOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
  isActive: boolean = true
) => {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler, isActive]);
};
