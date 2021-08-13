import React, { createContext, useContext, useState } from "react";

const ContextMenuContext = createContext({});

interface IPositionProps {
  x: number;
  y: number;
}

export function ContextMenuProvider(
  props: React.PropsWithChildren<{}>
): JSX.Element {
  const [show, setShow] = useState<boolean>(false);
  const [position, setPosition] = useState<{x: number, y: number}>({ x: 0, y: 0 });

  return (
    <ContextMenuContext.Provider
      value={{
        position,
        show,
        setShow: (s: boolean): void => setShow(s),
        setPosition: ({x, y}: IPositionProps) => setPosition({x: x, y: y}),
      }}>
      {props.children}
    </ContextMenuContext.Provider>
  );
}

export const useContextMenu = () => {
  return useContext(ContextMenuContext);
};
