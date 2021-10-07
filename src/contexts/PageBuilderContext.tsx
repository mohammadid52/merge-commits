import React, {createContext, useContext, useState} from 'react';
const PageBuilderContext = createContext(null);
type ActionTypes = 'edit' | 'delete' | 'init';
type MoveDirTypes = 'up' | 'down';

export const PageBuilderProvider = ({children}: any) => {
  const [showingPin, setShowingPin] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [actionMode, setActionMode] = useState<ActionTypes>('init');
  const [moveDir, setMoveDir] = useState<MoveDirTypes>('down');
  const [showMovementBox, setShowMovementBox] = useState(false);

  return (
    <PageBuilderContext.Provider
      value={{
        showingPin,
        setShowingPin,
        selectedComponent,
        setSelectedComponent,
        actionMode,
        setActionMode,
        moveDir,
        setMoveDir,
        showMovementBox,
        setShowMovementBox,
      }}>
      {children}
    </PageBuilderContext.Provider>
  );
};
export const usePageBuilderContext = () => useContext(PageBuilderContext);
