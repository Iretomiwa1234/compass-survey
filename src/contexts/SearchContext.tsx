import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export type SearchItem = {
  id: string;
  title: string;
  description?: string;
  page: string;
  pagePath: string;
  section?: string;
  keywords?: string[];
  icon?: ReactNode;
  action?: () => void;
};

type SearchContextType = {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  searchItems: SearchItem[];
  registerSearchItems: (items: SearchItem[]) => void;
  unregisterSearchItems: (ids: string[]) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchItems, setSearchItems] = useState<SearchItem[]>([]);

  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => setIsOpen(false), []);
  const toggleSearch = useCallback(() => setIsOpen((prev) => !prev), []);

  const registerSearchItems = useCallback((items: SearchItem[]) => {
    setSearchItems((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const newItems = items.filter((item) => !existingIds.has(item.id));
      return [...prev, ...newItems];
    });
  }, []);

  const unregisterSearchItems = useCallback((ids: string[]) => {
    setSearchItems((prev) => prev.filter((item) => !ids.includes(item.id)));
  }, []);

  // Handle global keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!isOpen) {
          openSearch();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, openSearch]);

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        openSearch,
        closeSearch,
        toggleSearch,
        searchItems,
        registerSearchItems,
        unregisterSearchItems,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
