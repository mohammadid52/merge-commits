import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {Widget} from '../../../interfaces/ClassroomComponentsInterfaces';
import {SideMenuSection} from './SideMenuSection';
import Rooms from '../../RoomChat/Rooms';
import {CallWidgetsSmall} from './SectionContent/CallWidgetsSmall';
import {FileWidgetsSmall} from './SectionContent/FileWidgetsSmall';
import RoomChat from '../../RoomChat/RoomChat';

// GET ALL THE RELEVANT WIDGETS HERE

const ExpandedMenu = (props: {
  menuState?: number;
  setMenuState?: (level: number) => void;
  focusSection?: string;
  setFocusSection?: React.Dispatch<React.SetStateAction<string>>;
  chatroom?: any;
  setChatroom?: React.Dispatch<React.SetStateAction<any>>;
  isChatActive: boolean;
  toggleChat: (desiredState: boolean) => void;
}) => {
  const {
    menuState,
    setMenuState,
    focusSection,
    setFocusSection,
    chatroom,
    setChatroom,
    isChatActive,
    toggleChat,
  } = props;
  const {state, clientKey} = useContext(GlobalContext);

  const setSelectedChatroom = (roomObj: any) => {
    if (!chatroom || (chatroom && chatroom.name !== roomObj.name)) {
      setChatroom(roomObj);
    }
    if (focusSection !== 'Chat') {
      setFocusSection('Chat');
    }
    setMenuState(2);
  };

  const [widgets, setWidgets] = useState<any>([]);

  const getSideWidgets = () => {
    const thereAreWidgets = state.roomData.widgets.length > 0;
    if (thereAreWidgets) {
      return state.roomData.widgets.filter((widgetObj: Widget) => {
        return widgetObj.placement === 'sidebar' && widgetObj.active;
      });
    } else {
      return [];
    }
  };
  useEffect(() => {
    if (state.roomData.widgets.length > 0) {
      setWidgets(getSideWidgets);
    }
  }, [state.roomData.widgets]);

  const getCallWidgets = (): Widget[] => {
    return widgets.filter((widgetObj: Widget) => widgetObj.type === 'call');
  };

  const getFileWidgets = (): Widget[] => {
    return widgets.filter((widgetObj: Widget) => widgetObj.type === 'file');
  };

  // ${menuState === 0 ? 'w-auto h-100 overflow-hidden' : ''}
  // ${menuState === 1 && 'w-56 h-128'}
  // ${menuState === 2 && 'w-84 h-136'}
  return (
    <div
      className={`
       absolute w-full h-full`}>
      <div
        className={`
        absolute w-full h-full
        transform transition-all ease-in-out duration-700 
        ${isChatActive ? 'py-2' : 'p-2 '}
        flex flex-col`}>
        <SideMenuSection
          menuState={menuState}
          sectionLabel={`Chat`}
          sectionTitle={`${
            Object.keys(chatroom).length > 0 ? chatroom.name + ' Chat' : 'Chat Rooms'
          }`}
          focusSection={focusSection}
          isChatActive={isChatActive}>
          <Rooms chatroom={chatroom} setSelectedChatroom={setSelectedChatroom} />
          <RoomChat selectedRoom={chatroom} focusSection={focusSection} />
        </SideMenuSection>
        <SideMenuSection
          menuState={menuState}
          sectionLabel={`Call`}
          sectionTitle={'Call Links'}
          focusSection={focusSection}
          isChatActive={isChatActive}>
          <CallWidgetsSmall widgets={getCallWidgets()} />
        </SideMenuSection>
        <SideMenuSection
          menuState={menuState}
          sectionLabel={`File`}
          sectionTitle={'File Links'}
          focusSection={focusSection}
          isChatActive={isChatActive}>
          <FileWidgetsSmall widgets={getFileWidgets()} />
        </SideMenuSection>
      </div>
    </div>
  );
};

export default ExpandedMenu;