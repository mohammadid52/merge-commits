import React, {useEffect, useRef, useState} from 'react';
import {useWindowSize} from '../../../customHooks/windowSize';
import ExpandedMenu from './ExpandedMenu';
import {FloatingBar} from './FloatingBar';

const FloatingSideMenu = () => {
  const [menuOpenLevel, setMenuOpenLevel] = useState<number>(0);
  const [focusSection, setFocusSection] = useState<string>('');
  const [chatroom, setChatroom] = useState<any>({});

  const setMenuState = (level: number, section: string) => {
    if (level === -1 && section === 'reset') {
      setMenuOpenLevel(0);
      setFocusSection('Chat');
      setChatroom({});
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

  return (
    <div className="relative w-0 h-full flex flex-row flex-1 z-100">
      <div
        className={`
        fixed
        transform transition-all ease-in-out duration-400 
       ${menuOpenLevel === 0 ? 'w-0 -translate-x-0 h-100' : ''}
       ${menuOpenLevel === 1 ? 'w-56 -translate-x-56 h-128' : ''}
       ${menuOpenLevel === 2 ? 'w-84 -translate-x-84 h-136' : ''}

        top-1/2 -translate-y-1/2
        bg-gray-800 
        shadow`}>
        <div
          className={`relative transition transition-all ease-in-out duration-400 w-full h-full`}>
          <FloatingBar
            menuState={menuOpenLevel}
            setMenuState={setMenuState}
            focusSection={focusSection}
            setFocusSection={setFocusSection}
            chatroom={chatroom}
          />
          <ExpandedMenu
            menuState={menuOpenLevel}
            setMenuState={setMenuState}
            focusSection={focusSection}
            setFocusSection={setFocusSection}
            chatroom={chatroom}
            setChatroom={setChatroom}
          />
        </div>
      </div>
    </div>
  );
};

export default FloatingSideMenu;