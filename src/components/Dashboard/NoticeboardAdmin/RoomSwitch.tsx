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

  const linkClass = 'w-full p-2 text-grayscale-lightest text-xs tracking-wider mx-auto border-b border-medium-gray';

  return (
    <div className={`${theme.section}`}>
      <div className={`flex flex-col p-4`}>
        {rooms.length > 0
          ? rooms.map((room: Room, i: number) => (
              <div
                key={`room_button_sb${i}`}
                id={room.id}
                data-name={room.name}
                onClick={(e) => handleRoomSelection(e, i)}
                className={`cursor-pointer ${linkClass} 
              ${activeRoom === room.id ? 'bg-grayscale-light bg-opacity-80' : 'bg-darker-gray bg-opacity-20'} 
              truncate ...`}>
                {room.name}
              </div>
            ))
          : 'No rooms...'}
      </div>
    </div>
  );
};

export default RoomSwitch;
