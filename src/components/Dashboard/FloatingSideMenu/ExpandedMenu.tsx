import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {Widget} from '../../../interfaces/ClassroomComponentsInterfaces';
import {SideMenuSection} from './SideMenuSection';
import Rooms from '../../RoomChat/Rooms';
import {CallWidgetsSmall} from './SectionContent/CallWidgetsSmall';
import {FileWidgetsSmall} from './SectionContent/FileWidgetsSmall';
import RoomChat from '../../RoomChat/RoomChat';

// GET ALL THE RELEVANT WIDGETS HERE

const ExpandedMenu = (props: {isOpen: boolean; toggleMenu: () => void}) => {
  const {isOpen, toggleMenu} = props;
  const {state, clientKey} = useContext(GlobalContext);

  const [fullSection, setFullSection] = useState<string>('');

  const setIsolatedSection = (sectionStr: string) => {
    setFullSection(sectionStr);
  };

  const [chatroom, setChatroom] = useState<any>({});

  const setSelectedChatroom = (roomObj: any) => {
    if (!chatroom || (chatroom && chatroom.name !== roomObj.name)) {
      setChatroom(roomObj);
      setIsolatedSection('Chat');
    } else {
      setChatroom({});
      setIsolatedSection('');
    }
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
      h-100
      transform transition ease-in-out duration-400 sm:duration-400
      ${!isOpen ? 'scale-0 overflow-hidden' : 'scale-1'}
      relative flex flex-col`}>
      <div className={`p-2 h-full`}>
        <SideMenuSection
          sectionLabel={`Chat`}
          sectionTitle={`${
            Object.keys(chatroom).length > 0 ? chatroom.name + ' Chat' : 'Chat Rooms'
          }`}
          fullSection={fullSection}>
          <Rooms chatroom={chatroom} setSelectedChatroom={setSelectedChatroom} />
          <RoomChat selectedRoom={chatroom} fullSection={fullSection} />
        </SideMenuSection>
        <SideMenuSection
          sectionLabel={`Call`}
          sectionTitle={'Call Links'}
          fullSection={fullSection}>
          <CallWidgetsSmall widgets={getCallWidgets()} />
        </SideMenuSection>
        <SideMenuSection
          sectionLabel={`File`}
          sectionTitle={'File Links'}
          fullSection={fullSection}>
          <FileWidgetsSmall widgets={getFileWidgets()} />
        </SideMenuSection>
      </div>
    </div>
  );
};

export default ExpandedMenu;