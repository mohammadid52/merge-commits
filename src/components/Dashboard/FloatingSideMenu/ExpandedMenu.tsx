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
  setMenuState?: (level: number, section: string) => void;
  focusSection?: string;
  setFocusSection?: React.Dispatch<React.SetStateAction<string>>;
  chatroom?: any;
  setChatroom?: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const {
    menuState,
    setMenuState,
    focusSection,
    setFocusSection,
    chatroom,
    setChatroom,
  } = props;
  const {state, clientKey} = useContext(GlobalContext);

  const setSelectedChatroom = (roomObj: any) => {
    if (!chatroom || (chatroom && chatroom.name !== roomObj.name)) {
      setChatroom(roomObj);
    }

    setMenuState(2, 'Chatroom');
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

  return (
    <div
      className={`
       absolute w-full h-full z-100`}>
      <div
        className={`
        absolute w-full h-full overflow-hidden flex flex-row
        transform transition-transform ease-in-out duration-400  z-100
        ${menuState > 0 && focusSection === 'Chatroom' ? 'bg-container' : ''}
        ${menuState > 0 && focusSection !== 'Chatroom' ? 'bg-gray-600' : ''}
        ${menuState > 0 ? '' : 'w-0 invisible'}
         `}>
        <SideMenuSection
          menuState={menuState}
          setMenuState={setMenuState}
          sectionLabel={`Chat`}
          sectionTitle={`Chat Rooms`}
          focusSection={focusSection}>
          <Rooms
            chatroom={chatroom}
            setSelectedChatroom={setSelectedChatroom}
            focusSection={focusSection}
            setFocusSection={setFocusSection}
          />
        </SideMenuSection>
        <SideMenuSection
          menuState={menuState}
          setMenuState={setMenuState}
          sectionLabel={`Call`}
          sectionTitle={'Call Links'}
          focusSection={focusSection}>
          <CallWidgetsSmall widgets={getCallWidgets()} />
        </SideMenuSection>
        <SideMenuSection
          menuState={menuState}
          setMenuState={setMenuState}
          sectionLabel={`File`}
          sectionTitle={'File Links'}
          focusSection={focusSection}>
          <FileWidgetsSmall widgets={getFileWidgets()} />
        </SideMenuSection>
        {focusSection === 'Chatroom' && (
          <SideMenuSection
            menuState={menuState}
            setMenuState={setMenuState}
            sectionLabel={`Chatroom`}
            sectionTitle={`${
              Object.keys(chatroom).length > 0 ? chatroom.name + ' Chat' : 'Chat Rooms'
            }`}
            focusSection={focusSection}>
            <RoomChat selectedRoom={chatroom} focusSection={focusSection} />
          </SideMenuSection>
        )}
      </div>
    </div>
  );
};

export default ExpandedMenu;