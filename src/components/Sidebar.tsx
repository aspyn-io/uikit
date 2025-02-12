/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from "classnames";
import { Sidebar as FlowbiteSidebar, TextInput } from "flowbite-react";
import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import { HiSearch } from "react-icons/hi";

import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";

interface SidebarProps {
  children: ReactNode;
}

const Sidebar: FC<SidebarProps> = function ({ children }) {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
    useSidebarContext();

  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    const newPage = window.location.pathname;
    setCurrentPage(newPage);
  }, [setCurrentPage]);

  return (
    <div
      className={classNames("lg:!block", {
        hidden: !isSidebarOpenOnSmallScreens,
      })}
    >
      <FlowbiteSidebar
        aria-label="Sidebar with multi-level dropdown example"
        collapsed={isSidebarOpenOnSmallScreens && !isSmallScreen()}
      >
        <div className="flex h-full flex-col justify-between py-2">
          <div>
            <form className="pb-3 md:hidden">
              <TextInput
                icon={HiSearch}
                type="search"
                placeholder="Search"
                required
                size={32}
              />
            </form>
            <FlowbiteSidebar.Items>
              {children}
            </FlowbiteSidebar.Items>
          </div>
        </div>
      </FlowbiteSidebar>
    </div>
  );
};

export default Sidebar;
