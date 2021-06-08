import React, {useContext, createContext, useState} from 'react';

export const UniversalLessonBuilderContext = createContext(null);

export const UniversalLessonBuilderProvider = ({children}: any) => {
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [newBlockSeqId, setNewBlockSeqId] = useState(null);
  return (
    <UniversalLessonBuilderContext.Provider
      value={{previewMode, setPreviewMode, newBlockSeqId, setNewBlockSeqId}}>
      {children}
    </UniversalLessonBuilderContext.Provider>
  );
};
export const useULBContext = () => useContext(UniversalLessonBuilderContext);
