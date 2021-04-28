import React, {useEffect, useRef, useState} from 'react';
import {useWindowSize} from '../../../customHooks/windowSize';
import ExpandedMenu from './ExpandedMenu';
import {FloatingBar} from './FloatingBar';

const FloatingSideMenu = () => {
  const [chatActive, setChatActive] = useState(false);

  const [menuOpenLevel, setMenuOpenLevel] = useState<number>(0);
  const [focusSection, setFocusSection] = useState<string>('');
  const [chatroom, setChatroom] = useState<any>({});

  useEffect(() => {
    if (menuOpenLevel < 2) {
      setFocusSection('');
      setChatActive(false);
      setChatroom({});
    }
  }, [menuOpenLevel]);

  const toggleChat = (desiredState: boolean) => {
    setChatActive(desiredState);
  };

  const setMenuState = (level: number) => {
    if (menuOpenLevel !== level) {
      setMenuOpenLevel(level);
    } else if (menuOpenLevel > 0 && level > 0) {
      setMenuOpenLevel(level - 1);
    }
  };

  return (
    <div className="relative w-0 h-full flex flex-row flex-1 z-100">
      <div
        className={`
        fixed
        transform transition-all ease-in-out duration-700 
       ${menuOpenLevel === 0 ? 'w-0 -translate-x-0 h-100' : ''}
       ${menuOpenLevel === 1 ? 'w-56 -translate-x-56 h-128' : ''}
       ${menuOpenLevel === 2 ? 'w-84 -translate-x-84 h-136' : ''}

        top-1/2 -translate-y-1/2
        bg-gray-800 
        shadow`}>
        <div
          className={`relative transition transition-all ease-in-out duration-700 w-full h-full`}>
          <FloatingBar
            menuState={menuOpenLevel}
            setMenuState={setMenuState}
            isChatActive={chatActive}
            toggleChat={toggleChat}
          />
          <ExpandedMenu
            menuState={menuOpenLevel}
            setMenuState={setMenuState}
            focusSection={focusSection}
            setFocusSection={setFocusSection}
            chatroom={chatroom}
            setChatroom={setChatroom}
            isChatActive={chatActive}
            toggleChat={toggleChat}
          />
        </div>
      </div>
    </div>
  );
};

export default FloatingSideMenu;