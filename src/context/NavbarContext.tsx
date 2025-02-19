import { createContext, useContext, useState, PropsWithChildren } from "react";

interface NavbarContextProps {
  title: string;
  showSearch: boolean;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
  setTitle: (title: string) => void;
  setShowSearch: (show: boolean) => void;
  setOnSearch: React.Dispatch<React.SetStateAction<(event: React.ChangeEvent<HTMLInputElement>) => void>>;
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

  return (
    <NavbarContext.Provider
      value={{
        title,
        showSearch,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        setTitle,
        setShowSearch,
        setOnSearch,
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
