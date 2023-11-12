import React, { PropsWithChildren, useCallback, useState } from "react";

export const GraphContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<number>(0);
  const refresh = useCallback(() => {
    setState(state + 1);
  }, [state, setState]);

  return (
    <GraphRefreshContext.Provider value={{ state, refresh }}>
      {children}
    </GraphRefreshContext.Provider>
  )
}


export const GraphRefreshContext = React.createContext<{
  state: number,
  refresh: () => void,
}>({ state: 0, refresh: () => {}});
