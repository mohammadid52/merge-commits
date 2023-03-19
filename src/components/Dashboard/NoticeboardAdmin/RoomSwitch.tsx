import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import useLoadRooms from 'customHooks/loadRooms';
import React from 'react';
import {DashboardProps} from '../Dashboard';

interface Room {
  id: string;
  classID: string;
  teacherAuthID: string;
  name: string;
}

const RoomSwitch = (props: DashboardProps) => {
  const {loading, activeRoom, setActiveRoom, setActiveRoomName} = props;
  const {theme, userLanguage} = useGlobalContext();
  const {noticeboardDict} = useDictionary();
  const rooms = useLoadRooms();

  const handleRoomSelection = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    const name = t.getAttribute('data-name');
    if (activeRoom !== t.id && loading === false) {
      setActiveRoom?.(t.id);
      name && setActiveRoomName?.(name);
    }
  };

  const linkClass =
    'w-full p-2 text-sm tracking-wider mx-auto border-b-0 border-medium-gray';

  return (
    <div className={`${theme.section}`}>
      <div className={`grid grid-cols-4 gap-2 px-4`}>
        {rooms.length > 0
          ? rooms.map((room: Room, i: number) => (
              <div
                key={`room_button_sb${i}`}
                id={room.id}
                data-name={room.name}
                onClick={(e) => handleRoomSelection(e)}
                className={`rounded p-2 cursor-pointer truncate ...
                ${linkClass} 
                ${
                  activeRoom === room.id
                    ? 'font-semibold text-grayscale-lightest bg-darker-gray bg-opacity-20'
                    : 'text-grayscale-lightest bg-grayscale-light bg-opacity-80'
                } 
              `}>
                {room.name}
              </div>
            ))
          : noticeboardDict[userLanguage].ROOMS.NONE}
      </div>
    </div>
  );
};

export default RoomSwitch;
