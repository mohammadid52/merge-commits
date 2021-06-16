import React, {createContext, useContext, useState} from 'react';

export const MovableListContext = createContext(null);

export const MovableListProvider = ({children, data}: any) => {
  const [movableList, setMovableList] = useState(data);
  return (
    <MovableListContext.Provider value={{movableList, setMovableList}}>
      {children}
    </MovableListContext.Provider>
  );
};

export const useMovableList = () => useContext(MovableListContext);
