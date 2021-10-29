import React, {createContext, useContext, useState} from 'react';
const PageBuilderContext = createContext(null);

// TYPES
type ActionTypes = 'edit' | 'delete' | 'init';
type MoveDirTypes = 'up' | 'down';
type NavState = 'home' | 'addContent' | 'space';

export const PageBuilderProvider = ({children}: any) => {
  const [showingPin, setShowingPin] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [actionMode, setActionMode] = useState<ActionTypes>('init');
  const [moveDir, setMoveDir] = useState<MoveDirTypes>('down');
  const [showMovementBox, setShowMovementBox] = useState(false);
  const [navState, setNavState] = useState<NavState>('home');
  const [activeContentItem, setActiveContentItem] = useState(null); // content type
  const [showLocationIcon, setShowLocationIcon] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [showingBlockPin, setShowingBlockPin] = useState(false);

  return (
    <PageBuilderContext.Provider
      value={{
        showingPin,
        setShowingPin,
        selectedComponent,
        setSelectedComponent,
        selectedType,
        setSelectedType,
        actionMode,
        setActionMode,
        moveDir,
        setMoveDir,
        showMovementBox,
        showLocationIcon,
        setShowLocationIcon,
        setShowMovementBox,
        navState,
        setNavState,
        activeContentItem,
        setActiveContentItem,
        showingBlockPin,
        setShowingBlockPin,
      }}>
      {children}
    </PageBuilderContext.Provider>
  );
};
export const usePageBuilderContext = () => useContext(PageBuilderContext);
