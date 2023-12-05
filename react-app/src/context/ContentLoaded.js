import { createContext, useContext, useState } from 'react';

const ContentLoadedContext = createContext();

export function ContentLoadedProvider({ children }) {
  const [sidebarLoaded, setSidebarLoaded] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);
  const [appWorkspace, setAppWorkspace] = useState(null);

  const contextValue = {
    sidebarLoaded,
    setSidebarLoaded,
    appWorkspace,
    setAppWorkspace,
    userLoaded,
    setUserLoaded
  };

  return (
    <>
      <ContentLoadedContext.Provider value={contextValue}>
        {children}
      </ContentLoadedContext.Provider>
    </>
  );
}

export const useContentLoaded = () => useContext(ContentLoadedContext);
