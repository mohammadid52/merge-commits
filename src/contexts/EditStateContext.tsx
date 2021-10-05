import React, {createContext, useContext, useState} from 'react';

const ContextMenuContext = createContext(null);

export function EditStateContextProvider(
  props: React.PropsWithChildren<{}>
): JSX.Element {
  const [spaceBetweenComp, setSpaceBetweenComp] = useState(32);

  return (
    <ContextMenuContext.Provider
      value={{
        spaceBetweenComp,
        setSpaceBetweenComp,
      }}>
      {props.children}
    </ContextMenuContext.Provider>
  );
}

export const useEditStateContext = () => useContext(ContextMenuContext);
