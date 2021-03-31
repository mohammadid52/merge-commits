import ContentCard from '../../Atoms/ContentCard';
import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';

const RoomTiles = (props: { classList: any; handleRoomSelection: any }) => {
  const { classList, handleRoomSelection } = props;
  const { state, dispatch } = useContext(GlobalContext);
  const history = useHistory();

  // // Select room on roomtile click
  // const handleRoomSelection = (e: React.MouseEvent)=> {
  //   const t = e.target as HTMLElement;
  //   dispatch({ type: 'UPDATE_ACTIVEROOM', payload: { data: t.id } });
  // }
  // Push user to classroom on room change
  useEffect(() => {
    if (state.activeRoom !== '') {
      history.push('/dashboard/classroom');
    }
  }, [state.activeRoom]);

  return (
    <ContentCard>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {classList &&
          classList.length > 0 &&
          classList.map(
            (
              classObj: {
                rooms: any;
                name: string;
                students: any[];
              },
              idx: number
            ) => {
              return (
                <div
                  key={`home_class_${idx}`}
                  id={classObj.rooms.items[0].id}
                  onClick={(e) => handleRoomSelection(e, idx)}
                  className="cursor-pointer relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  <div className="flex-1 min-w-0 pointer-events-none">
                    <span
                      className="focus:outline-none"
                      >
                      <span className="absolute inset-0" aria-hidden="true"></span>
                      <p className="text-sm font-medium text-gray-900">
                        {classObj.rooms.items.length > 0 ? classObj.rooms.items[0].name : 'No room name'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{classObj.name}</p>
                    </span>
                  </div>
                </div>
              );
            }
          )}
      </div>
    </ContentCard>
  );
};

export default RoomTiles;
