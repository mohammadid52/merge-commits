import React, {useContext} from 'react';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {ClassroomControlProps} from '../Dashboard';

export interface Room {
  id: string;
  classID: string;
  teacherAuthID: string;
  name: string;
}

const SideRoomSelector = (props: ClassroomControlProps) => {
  // Essentials
  const {activeRoom, roomsLoading, handleRoomSelection} = props;
  const {state, clientKey, userLanguage} = useContext(GlobalContext);
  const {classRoomDict} = useDictionary(clientKey);

  const roomsTitle =
    'h-12 p-2 font-semibold text-grayscale-lightest flex items-center justify-start bg-darker-gray bg-opacity-60';
  const linkClass =
    'w-full p-2 text-grayscale-lightest text-xs tracking-wider mx-auto border-b-0 border-medium-gray';

  return (
    <div className={'z-50 min-h-screen w-32 min-w-32 flex flex-col bg-medium-gray'}>
      <div className={roomsTitle}>{classRoomDict[userLanguage]['LIST_TITLE']}:</div>
      <div id="roomlist">
        {state.roomData.rooms.length > 0 ? (
          state.roomData.rooms.map((room: Room, i: number) => {
            return (
              <div
                key={`room_button_sb${i}`}
                id={room.id}
                data-name={room.name}
                onClick={(e) => handleRoomSelection(e, i)}
                className={`cursor-pointer text-white ${linkClass} 
            ${activeRoom === room.id ? 'bg-indigo-600 ' : 'hover:bg-indigo-500'} 
            truncate ...`}>
                {room.name}
              </div>
            );
          })
        ) : roomsLoading === false ? (
          <>
            <p className={`${linkClass}`}>
              Loading {classRoomDict[userLanguage]['LIST_TITLE']}...
            </p>
          </>
        ) : (
          <>
            <p className={`${linkClass}`}>
              No {classRoomDict[userLanguage]['LIST_TITLE']} assigned to user
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SideRoomSelector;
