import { createContext, useContext, useState, PropsWithChildren } from "react";

interface NavbarContextProps {
  title: string;
  showSearch: boolean;
  isSidebarCollapsed: boolean;
  logoLink: string;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
  setTitle: (title: string) => void;
  setShowSearch: (show: boolean) => void;
  setOnSearch: React.Dispatch<React.SetStateAction<(event: React.ChangeEvent<HTMLInputElement>) => void>>;
  setLogoLink: (link: string) => void;
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
  const [logoLink, setLogoLink] = useState("/");

  return (
    <NavbarContext.Provider
      value={{
        title,
        showSearch,
        isSidebarCollapsed,
        logoLink,
        setIsSidebarCollapsed,
        setTitle,
        setShowSearch,
        setOnSearch,
        setLogoLink,
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
