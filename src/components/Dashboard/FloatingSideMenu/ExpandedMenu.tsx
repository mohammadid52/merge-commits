import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {Widget} from '../../../interfaces/ClassroomComponentsInterfaces';
import {SideMenuSection} from './SideMenuSection';
import Rooms from '../../RoomChat/Rooms';
import {CallWidgetsSmall} from './CallWidgetsSmall';

// GET ALL THE RELEVANT WIDGETS HERE

const ExpandedMenu = (props: {isOpen: boolean; toggleMenu: () => void}) => {
  const {isOpen, toggleMenu} = props;
  const {state, clientKey} = useContext(GlobalContext);
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

  return (
    <div
      className={`
    transform transition ease-in-out duration-400 sm:duration-400
    ${!isOpen ? 'scale-0 overflow-hidden' : 'scale-1'}
    relative flex flex-col`}>
      <div className={`p-2`}>
        <SideMenuSection sectionTitle={'Chat Rooms'}>
          <Rooms />
        </SideMenuSection>
        <SideMenuSection sectionTitle={'Call Links'}>
          <CallWidgetsSmall widgets={getCallWidgets()} />
        </SideMenuSection>
        <SideMenuSection sectionTitle={'File Links'} />
      </div>
    </div>
  );
};

export default ExpandedMenu;