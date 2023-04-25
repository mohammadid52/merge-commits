import React, {createContext, useContext, useMemo, useState} from 'react';

const ContextMenuContext = createContext<any>(null);

export function OverlayContextProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const [showLessonEditOverlay, setShowLessonEditOverlay] = useState<boolean>(true);
  const [collapseSidebarOverlay, setCollapseSidebarOverlay] = useState<boolean>(false);
  // Modal popIn
  const [modalPopVisible, setModalPopVisible] = useState<boolean>(false);

  const [currentModalDialog, setCurrentModalDialog] = useState<string>('');

  // This state handles all the modal components
  const [addContentModal, setAddContentModal] = useState<{
    show: boolean;
    type: string;
  }>({
    show: false,
    type: ''
  });
  const [showDataForCopyClone, setShowDataForCopyClone] = useState(false);

  const value = useMemo(
    () => ({
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
      showDataForCopyClone,
      setShowDataForCopyClone
    }),
    [
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
      showDataForCopyClone,
      setShowDataForCopyClone
    ]
  );

  return (
    <ContextMenuContext.Provider value={value}>
      {props.children}
    </ContextMenuContext.Provider>
  );
}

export const useOverlayContext = () => useContext(ContextMenuContext);
