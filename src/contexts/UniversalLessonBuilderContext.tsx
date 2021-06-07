import React, {useContext, createContext, useState} from 'react';

export const UniversalLessonBuilderContext = createContext(null);

export const UniversalLessonBuilderProvider = ({children}: any) => {
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  return (
    <UniversalLessonBuilderContext.Provider value={{previewMode, setPreviewMode}}>
      {children}
    </UniversalLessonBuilderContext.Provider>
  );
};
export const useULBContext = () => useContext(UniversalLessonBuilderContext);
