import ContentCard from '../../Atoms/ContentCard';
import React from 'react';

const RoomTiles = (props: {classList: any}) => {
  const {classList} = props;
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
                  className={`w-full h-48 flex justify-center content-center items-center rounded border border-dark-gray border-opacity-10`}>
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