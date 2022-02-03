import React, {createContext, useContext, useRef, useState} from 'react';
const GameChangerContext = createContext(null);

// TYPES

export type SelectedEmotion = {primary: string; secondary: string};

export const GameChangerProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  // numbers
  const [selectedCard, setSelectedCard] = useState<null | number>(null);
  const [initialIndex, setInitialIndex] = useState<number>(1);
  const [countSelected, setCountSelected] = useState<null | number>(null);
  const [counter, setCounter] = useState<number>(1);

  const goBackCallback = useRef();

  // booleans
  const [showHowTo, setShowHowTo] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [primaryEmotion, setPrimaryEmotion] = useState('');
  const [secondaryEmotion, setSecondaryEmotion] = useState('');
  const [replaceIdx, setReplaceIdx] = useState(null);

  return (
    <GameChangerContext.Provider
      value={{
        selectedCard,
        setSelectedCard,
        showHowTo,
        setShowHowTo,
        showInfo,
        setShowInfo,
        isPlayingMusic,
        setIsPlayingMusic,
        counter,
        setCounter,
        isActive,
        setIsActive,
        isCompleted,
        setIsCompleted,
        initialIndex,
        setInitialIndex,
        countSelected,
        setCountSelected,
        goBackCallback,
        selectedEmotions,
        setSelectedEmotions,
        secondaryEmotion,
        setSecondaryEmotion,
        primaryEmotion,
        setPrimaryEmotion,
        replaceIdx,
        setReplaceIdx,
      }}>
      {children}
    </GameChangerContext.Provider>
  );
};
export const useGameChangers = (): {
  selectedCard: number | null;
  showHowTo: boolean;
  showInfo: boolean;
  isCompleted: boolean;
  isPlayingMusic: boolean;
  isActive: boolean;
  initialIndex: number;
  counter: number;
  countSelected: number | null;
  goBackCallback?: any;
  setCountSelected: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedCard: React.Dispatch<React.SetStateAction<number | null>>;
  setShowHowTo: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlayingMusic: React.Dispatch<React.SetStateAction<boolean>>;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
  setInitialIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedEmotions: SelectedEmotion[];
  setSelectedEmotions: React.Dispatch<React.SetStateAction<SelectedEmotion[]>>;
} => useContext(GameChangerContext);
