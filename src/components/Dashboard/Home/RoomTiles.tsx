import ContentCard from '../../Atoms/ContentCard';
import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';

const RoomTiles = (props: {classList: any, handleRoomSelection: any}) => {
  const {classList, handleRoomSelection} = props;
  const {state, dispatch} = useContext(GlobalContext);
  const history = useHistory();

  // // Select room on roomtile click
  // const handleRoomSelection = (e: React.MouseEvent)=> {
  //   const t = e.target as HTMLElement;
  //   dispatch({ type: 'UPDATE_ACTIVEROOM', payload: { data: t.id } });
  // }
  // Push user to classroom on room change
  useEffect(()=>{
    if(state.activeRoom !== ''){
      history.push('/dashboard/classroom')
    }
  },[state.activeRoom])

  return (
    <ContentCard>
      <div className={`grid grid-cols-4 gap-2`}>
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
              <div key={`home_class_${idx}`} className={`w-full p-2 flex flex-col justify-center items-center`}>

                <div
                  id={classObj.rooms.items[0].id}
                  onClick={(e) => handleRoomSelection(e, idx)}
                  className={`
                    w-full h-48 flex justify-center content-center items-center 
                    rounded border border-dark-gray border-opacity-10
                    cursor-pointer
                    hover:bg-dark-gray
                    hover:bg-opacity-10
                  `}>
                  <span className={`w-full h-auto p-2`}>{'no image'}</span>
                </div>
                {/**
                 * DISPLAY ROOM INFO
                 */}
                <div className={`h-16 text-center`}>
                  <h4>{(classObj.rooms.items.length > 0) ? classObj.rooms.items[0].name : 'No room name'}</h4>
                  <p>{classObj.name}</p>
                </div>

              </div>
            );
          }
        )}
      </div>
    </ContentCard>
  )
}

export default RoomTiles;