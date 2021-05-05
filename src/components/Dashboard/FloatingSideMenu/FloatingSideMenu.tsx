import React, { SetStateAction, useState } from 'react';
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
}

const FloatingSideMenu = (props: FloatingSideMenuProps) => {
  const {overlay, setOverlay} = props;
  const [menuOpenLevel, setMenuOpenLevel] = useState<number>(0);
  const [focusSection, setFocusSection] = useState<string>('');
  const [chatroom, setChatroom] = useState<any>({});

  const setMenuState = (level: number, section: string) => {
    if (level === -1 && section === 'reset') {
      if (menuOpenLevel > 0) setMenuOpenLevel(menuOpenLevel - 1);
      if (focusSection === 'Chatroom') {
        setFocusSection('Chat');
        setChatroom({});
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

  return (
    <div>
      <div className={`relative`}>
        <div className="relative ml-auto mr-0 w-0 h-full flex flex-row flex-1 z-100">
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
                overlay={overlay}
                setOverlay={setOverlay}
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
      </div>
    </div>
  );
};

export default FloatingSideMenu;