import React, { createContext, useContext, useState } from "react";
const PageBuilderContext = createContext<any>(null);

// TYPES
type ActionTypes = "edit" | "delete" | "init";
type MoveDirTypes = "up" | "down";
type NavState = "home" | "addContent" | "space";

export const PageBuilderProvider = ({ children }: any) => {
  const [showingPin, setShowingPin] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<any | null>(null);
  const [actionMode, setActionMode] = useState<ActionTypes>("init");
  const [moveDir, setMoveDir] = useState<MoveDirTypes>("down");
  const [showMovementBox, setShowMovementBox] = useState(false);
  const [navState, setNavState] = useState<NavState>("home");
  const [activeContentItem, setActiveContentItem] = useState<any | null>(null); // content type
  const [showLocationIcon, setShowLocationIcon] = useState(false);
  const [selectedType, setSelectedType] = useState<any | null>(null);
  const [showingBlockPin, setShowingBlockPin] = useState(false);

  // Disable Game Changers - Emotion Component is one already exists on current page -> Here i am saving local state for that
  const [emotionComponentExists, setEmotionComponentExists] = useState(false);

  const [emotionComponentData, setEmotionComponentData] = useState<any | null>(
    null
  );

  const [showMessage, setShowMessage] = useState(false);

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
        setEmotionComponentData,
        emotionComponentData,
        showLocationIcon,
        setShowLocationIcon,
        setShowMovementBox,
        navState,
        setNavState,
        activeContentItem,
        setActiveContentItem,
        showingBlockPin,
        setShowingBlockPin,
        showMessage,
        setShowMessage,
        emotionComponentExists,
        setEmotionComponentExists,
      }}
    >
      {children}
    </PageBuilderContext.Provider>
  );
};
export const usePageBuilderContext = () => useContext(PageBuilderContext);
