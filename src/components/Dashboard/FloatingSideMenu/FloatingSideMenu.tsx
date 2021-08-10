import React, {SetStateAction, useState} from 'react';
import {useEffect} from 'react';
import useDeviceDetect from '../../../customHooks/deviceDetect';
import ExpandedMenu from './ExpandedMenu';
import {FloatingBar} from './FloatingBar';

export interface FloatingSideMenuProps {
  menuState?: number;
  setMenuState?: (level: number, section: string) => void;
  focusSection?: string;
  setFocusSection?: React.Dispatch<React.SetStateAction<string>>;
  chatroom?: any;
  setOverlay?: React.Dispatch<SetStateAction<string>>;
  overlay?: string;
  callback?: any;
  callbackArg?: any;
  saveInProgress?: boolean;
  setSaveInProgress?: any;
}

const FloatingSideMenu = () => {
  const {browser} = useDeviceDetect();
  const scrollbarMarginRight = browser.includes('Firefox') ? 'mr-4' : 'mr-3';

  const [menuOpenLevel, setMenuOpenLevel] = useState<number>(0);
  const [focusSection, setFocusSection] = useState<string>('');
  const [chatroom, setChatroom] = useState<any>({});

  const [saveInProgress, setSaveInProgress] = useState<boolean>(false);
  const [fnQueue, setFnQueue] = useState<any[]>([]);

  const loopFns = async () => {
    const loopedFns = await fnQueue.reduce(async (acc: any[], func: any, idx: number) => {
      func();
      if (idx === fnQueue.length - 1) {
        console.log('queue cleared...');
      }
      return acc;
    }, []);
    return loopedFns;
  };

  useEffect(() => {
    if (fnQueue.length > 0 && !saveInProgress) {
      loopFns().then((_: void) => {
        console.log('queue cleared part 2 ...');
      });
    }
  }, [fnQueue, saveInProgress]);

  const setMenuState = (level: number, section: string) => {
    if (level === -1 && section === 'reset') {
      if (menuOpenLevel > 0) {
        if (focusSection === 'Chatroom') {
          setMenuOpenLevel(menuOpenLevel - 1);
          setFocusSection('Chat');
          setChatroom({});
        } else {
          setMenuOpenLevel(0);
          setFocusSection('');
        }
      }
    } else {
      if (section === focusSection) {
        if (level !== menuOpenLevel) {
          setMenuOpenLevel(level);
        } else {
          setMenuOpenLevel(0);
        }
      } else {
        setFocusSection(section);
        if (level !== menuOpenLevel) {
          setMenuOpenLevel(level);
        }
      }
    }
  };

  const handleSetMenuState = (level: number, section: string) => {
    if (saveInProgress) {
      setFnQueue((prevState: any[]) => [
        ...prevState,
        () => {
          setMenuState(level, section);
        },
      ]);
    } else {
      setMenuState(level, section);
    }
  };

  const handleSetFocusSection = (section: string) => {
    if (saveInProgress) {
      setFnQueue((prevState: any[]) => [
        ...prevState,
        () => {
          setFocusSection(section);
        },
      ]);
    } else {
      setFocusSection(section);
    }
  };

  return (
    <div>
      <div className={`relative`}>
        <div
          className={`
               relative
               w-0
               h-full
              ${menuOpenLevel === 3 ? 'mx-auto' : `ml-auto ${scrollbarMarginRight}`}
              flex flex-row flex-1 z-100`}>
          <div
            className={`
              fixed
              transform transition-all ease-in-out duration-400 
             ${menuOpenLevel === 0 ? 'w-0 -translate-x-0 h-100' : ''}
             ${menuOpenLevel === 1 ? 'w-56 -translate-x-56 h-128' : ''}
             ${menuOpenLevel === 2 ? 'w-84 -translate-x-84 h-136' : ''}
             ${menuOpenLevel === 3 ? 'w-full max-w-256 -translate-x-1/2 h-136' : ''}
              top-1/2 -translate-y-1/2
              bg-gray-800 
              shadow`}>
            <div
              className={`relative transition transition-all ease-in-out duration-400 w-full h-full`}>
              <FloatingBar
                menuState={menuOpenLevel}
                setMenuState={handleSetMenuState}
                focusSection={focusSection}
                setFocusSection={handleSetFocusSection}
                chatroom={chatroom}
              />
              <ExpandedMenu
                menuState={menuOpenLevel}
                setMenuState={handleSetMenuState}
                setSaveInProgress={setSaveInProgress}
                focusSection={focusSection}
                setFocusSection={handleSetFocusSection}
                chatroom={chatroom}
                setChatroom={setChatroom}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingSideMenu;
