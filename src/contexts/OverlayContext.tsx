import React, {createContext, useContext, useState} from 'react';

const ContextMenuContext = createContext(null);

export function OverlayContextProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const [showLessonEditOverlay, setShowLessonEditOverlay] = useState<boolean>(true);
  const [collapseSidebarOverlay, setCollapseSidebarOverlay] = useState<boolean>(false);
  // Modal popIn
  const [modalPopVisible, setModalPopVisible] = useState<boolean>(false);

  const [currentModalDialog, setCurrentModalDialog] = useState<string>('');

  // This state handles all the modal components
  const [addContentModal, setAddContentModal] = useState<{show: boolean; type: string}>({
    show: false,
    type: '',
  });

  return (
    <ContextMenuContext.Provider
      value={{
        showLessonEditOverlay,
        setShowLessonEditOverlay,
        collapseSidebarOverlay,
        modalPopVisible,
        setModalPopVisible,
        currentModalDialog,
        setCurrentModalDialog,
        setCollapseSidebarOverlay,
        addContentModal,
        setAddContentModal,
      }}>
      {props.children}
    </ContextMenuContext.Provider>
  );
}

export const useOverlayContext = () => useContext(ContextMenuContext);
