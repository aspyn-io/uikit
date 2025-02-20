import { createContext, useContext, useState, PropsWithChildren } from "react";

interface NavbarContextProps {
  title: string;
  showSearch: boolean;
  isSidebarCollapsed: boolean;
  titleLink: string; // Add titleLink
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
  setTitle: (title: string) => void;
  setShowSearch: (show: boolean) => void;
  setOnSearch: React.Dispatch<React.SetStateAction<(event: React.ChangeEvent<HTMLInputElement>) => void>>;
  setTitleLink: (link: string) => void; // Add setTitleLink
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const NavbarContext = createContext<NavbarContextProps>(undefined!);

export function NavbarProvider({ children }: PropsWithChildren) {
  const [title, setTitle] = useState("Aspyn");
  const [showSearch, setShowSearch] = useState(false);
  const [onSearch, setOnSearch] = useState<(event: React.ChangeEvent<HTMLInputElement>) => void>(() => {
    // @ts-ignore
    return (event) => console.log(event.target.value);
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [titleLink, setTitleLink] = useState("/"); // Add titleLink state

  return (
    <NavbarContext.Provider
      value={{
        title,
        showSearch,
        isSidebarCollapsed,
        titleLink,
        setIsSidebarCollapsed,
        setTitle,
        setShowSearch,
        setOnSearch,
        setTitleLink,
        onSearch,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbarContext(): NavbarContextProps {
  const context = useContext(NavbarContext);

  if (typeof context === "undefined") {
    throw new Error(
      "useNavbarContext should be used within the NavbarContext provider!"
    );
  }

  return context;
}
