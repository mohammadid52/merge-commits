import React, {useContext} from 'react';
import {CallLinkLauncher} from './Launchers/CallLinkLauncher';
import {FloatingSideMenuProps} from './FloatingSideMenu';
import {NotesLauncher} from './Launchers/NotesLauncher';
import {ChatroomListLauncher} from './Launchers/ChatroomListLauncher';
// import {FilesListLauncher} from './Launchers/FilesListLauncher';
import {GlobalContext} from '../../../contexts/GlobalContext';

export const FloatingBar = (props: FloatingSideMenuProps) => {
  const {lessonState} = useContext(GlobalContext);
  const {menuState, setMenuState, focusSection, setFocusSection, chatroom} = props;

  const handleSectionButtons = (section: string, callback?: any, callbackArg?: any) => {
    switch (section) {
      case 'Chat':
        if (focusSection !== section) setFocusSection('Chat');
        setMenuState(1, section);
        break;
      case 'Chatroom':
        if (focusSection !== section) setFocusSection('Chatroom');
        setMenuState(2, section);
        break;
      case 'Call':
        if (focusSection !== section) setFocusSection('Call');
        callback(callbackArg);
        break;
      case 'File':
        if (focusSection !== section) setFocusSection('File');
        setMenuState(1, section);
        break;
      case 'Notes':
        if (focusSection !== section) setFocusSection('Notes');
        setMenuState(3, section);
        break;
      case '':
        if (focusSection === section) setFocusSection('Chat');
        setMenuState(1, 'Chat');
        break;
      default:
        break;
    }
  };

  return (
    <div
      id={`floatingBar`}
      className={`
        w-12 -translate-x-12 left-0 top-1/2 -translate-y-1/2
        absolute 
        transform transition-all ease-in-out duration-400 
        ${menuState === 0 ? 'h-100 rounded-lg' : ''}
        ${menuState === 1 ? 'h-128 rounded-l-lg' : ''}
        ${menuState === 2 ? 'h-136 rounded-l-lg' : ''}
        ${menuState === 3 ? 'h-136 rounded-l-lg' : ''}
        bg-gray-700 border-r-1 border-gray-700  shadow
        flex flex-col`}>
      <ChatroomListLauncher
        chatroom={chatroom}
        callback={handleSectionButtons}
        menuState={menuState}
        setMenuState={setMenuState}
        focusSection={focusSection}
      />

      {lessonState.lessonData && lessonState.lessonData.id ? (
        <NotesLauncher callback={handleSectionButtons} />
      ) : null}

      <div
        onClick={() => handleSectionButtons(focusSection)}
        className={`h-max w-12 overflow-hidden flex flex-1 flex-col items-center justify-center text-center bg-charcoal hover:bg-gray-800 cursor-pointer`}>
        <div
          className={`transform -rotate-90 w-max flex flex-1 justify-center content-center items-center`}>
          <div
            className={`w-64 h-8 transform translate-y-0.5 text-base tracking-wider font-regular text-white  text-center`}>
            Links & Chatrooms
          </div>
        </div>
      </div>

      {/* <CallLinkLauncher callback={handleSectionButtons} /> */}
    </div>
  );
};
