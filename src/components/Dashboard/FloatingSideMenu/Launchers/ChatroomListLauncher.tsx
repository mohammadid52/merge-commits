import React, {useContext, useEffect, useState} from 'react';
import ButtonsRound from '../../../Atoms/ButtonsRound';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {FloatingSideMenuProps} from '../FloatingSideMenu';
import {IoChatbubble} from 'react-icons/io5';
import {getLocalStorageData} from '../../../../utilities/localStorage';

interface ChatroomListLauncherProps extends FloatingSideMenuProps {
  chatroom?: any;
  callback?: any;
}

export const ChatroomListLauncher = (props: ChatroomListLauncherProps) => {
  const {menuState, focusSection, chatroom, callback} = props;
  const {state, lessonState} = useContext(GlobalContext);
  const [thereAreChatrooms, setThereAreChatrooms] = useState<boolean>(false);

  useEffect(() => {
    const roomsFromContext = state.roomData.rooms;
    const roomsFromLocal = getLocalStorageData('room_list');

    if (roomsFromContext.length > 0 || roomsFromLocal.length > 0) {
      setThereAreChatrooms(true);
    } else {
      setThereAreChatrooms(false);
    }
  }, [state.roomData.rooms, lessonState.loaded]);

  return (
    <div className={`flex-0 h-12 border-b-0 border-charcoal`}>
      <ButtonsRound
        Icon={IoChatbubble}
        iconSizePX={16}
        buttonWHClass={`w-12 h-12`}
        onClick={
          thereAreChatrooms
            ? () => callback(Object.keys(chatroom).length > 0 ? 'Chatroom' : 'Chat')
            : undefined
        }
        containerBgClass={`${
          (menuState > 0 && focusSection === 'Chat') || focusSection === 'Chatroom'
            ? 'bg-red-700 hover:bg-red-600'
            : 'bg-transparent hover:bg-gray-800'
        } rounded-tl-lg `}
        buttonBgClass={`bg-transparent`}
        iconTxtColorClass={`text-white`}
      />
    </div>
  );
};
