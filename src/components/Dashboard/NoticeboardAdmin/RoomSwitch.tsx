import React, { useContext, useEffect } from 'react';
import { DashboardProps } from '../Dashboard';
import { GlobalContext } from '../../../contexts/GlobalContext';
import useLoadRooms from '../../../customHooks/loadRooms';
import { Room } from '../Menu/SideRoomSelector';

const RoomSwitch = (props: DashboardProps) => {
  const { loading, activeRoom, setActiveRoom, activeRoomName, setActiveRoomName } = props;
  const { state, theme } = useContext(GlobalContext);
  const rooms = useLoadRooms();
  //

  useEffect(() => {
    console.log('rooms hook - ', rooms);
  }, [rooms]);

  const handleRoomSelection = (e: React.MouseEvent, i: number) => {
    const t = e.target as HTMLElement;
    const name = t.getAttribute('data-name');
    if (activeRoom !== t.id && loading === false) {
      setActiveRoom(t.id);
      setActiveRoomName(name);
    }
  };

  const linkClass = 'w-full p-2 text-sm tracking-wider mx-auto border-b border-medium-gray';

  return (
    <div className={`${theme.section}`}>
      <div className={`grid grid-cols-4 gap-2 px-4`}>
        {rooms.length > 0
          ? rooms.map((room: Room, i: number) => (
              <div
                key={`room_button_sb${i}`}
                id={room.id}
                data-name={room.name}
                onClick={(e) => handleRoomSelection(e, i)}
                className={`rounded p-2 cursor-pointer truncate ...
                ${linkClass} 
                ${activeRoom === room.id 
                  ? 'font-semibold text-grayscale-lightest bg-darker-gray bg-opacity-20' 
                  : 'text-grayscale-lightest bg-grayscale-light bg-opacity-80'} 
              `}>
                {room.name}
              </div>
            ))
          : 'No rooms...'}
      </div>
    </div>
  );
};

export default RoomSwitch;
