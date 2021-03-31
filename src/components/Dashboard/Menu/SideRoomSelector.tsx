import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { ClassroomControlProps } from '../Dashboard';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { API, graphqlOperation } from '@aws-amplify/api';
import * as customQueries from '../../../customGraphql/customQueries';
import { getArrayOfUniqueValueByProperty } from '../../../utilities/arrays';
import { createFilterToFetchSpecificItemsOnly } from '../../../utilities/strings';
import useDictionary from '../../../customHooks/dictionary';
import * as queries from '../../../graphql/queries';
import { Syllabus } from '../Classroom/Classroom';

export interface Room {
  id: string;
  classID: string;
  teacherAuthID: string;
  name: string;
}

const SideRoomSelector = (props: ClassroomControlProps) => {
  // Essentials
  const {
    homeData,
    activeRoom,
    roomsLoading,
    handleRoomSelection,
  } = props;
  const { state, theme, clientKey, userLanguage } = useContext(GlobalContext);
  const { classRoomDict } = useDictionary(clientKey);

  const roomsTitle =
    'h-12 p-2 font-semibold text-grayscale-lightest flex items-center justify-start bg-darker-gray bg-opacity-60';
  const linkClass = 'w-full p-2 text-grayscale-lightest text-xs tracking-wider mx-auto border-b border-medium-gray';

  return (
    <div className={`${theme.sidemenu.secondary} mr-2`}>
      <div className={roomsTitle}>{classRoomDict[userLanguage]['LIST_TITLE']}:</div>
      {state.roomData.rooms.length > 0 ? (
        state.roomData.rooms.map((room: Room, i: number) => {
          return (
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
          );
        })
      ) : roomsLoading === false ? (
        <>
          <p className={`${linkClass}`}>Loading {classRoomDict[userLanguage]['LIST_TITLE']}...</p>
        </>
      ) : (
        <>
          <p className={`${linkClass}`}>No {classRoomDict[userLanguage]['LIST_TITLE']} assigned to user</p>
        </>
      )}
    </div>
  );
};

export default SideRoomSelector;
