import React, {useEffect, useState, useContext} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as customQueries from '../../customGraphql/customQueries';
import {GlobalContext} from '../../contexts/GlobalContext';
import {getLocalStorageData} from '../../utilities/localStorage';

interface Rooms {
  chatroom?: any;
  setSelectedChatroom?: Function;
  focusSection?: string;
  setFocusSection?: React.Dispatch<React.SetStateAction<string>>;
}

const Rooms = (props: Rooms) => {
  const {state, lessonState} = useContext(GlobalContext);
  const {chatroom, setSelectedChatroom, focusSection, setFocusSection} = props;
  const [rooms, setRooms] = useState(null);
  const [loadingRooms, setLoadingRooms] = useState(false);

  useEffect(() => {
    const roomsFromContext = state.roomData.rooms;
    const roomsFromLocal = getLocalStorageData('room_list');

    if (rooms === null) {
      if (roomsFromContext.length > 0 || roomsFromLocal.length > 0) {
        setLoadingRooms(true);
        if (roomsFromContext.length > 0) {
          setRooms(roomsFromContext);
          setLoadingRooms(false);
        } else if (roomsFromLocal.length > 0) {
          setRooms(roomsFromLocal);
          setLoadingRooms(false);
        }
      }
    }
  }, [state.roomData.rooms, lessonState.loaded]);

  const showMsg = (msg: string) => {
    return (
      <div className="truncate inline-flex items-center p-2 mb-2 border-0 border-dashed border-gray-600 text-gray-200 shadow-sm text-xs font-medium rounded">
        {msg}
      </div>
    );
  }

  const listRooms = () => {
    return (
      <>
        <div
          className={`
            transform transition ease-in-out duration-400 sm:duration-400
            ${Object.keys(chatroom).length > 0 ? 'h-0 overflow-hidden' : 'h-auto'}
            `}>
          {!(Object.keys(chatroom).length > 0) &&
            rooms.map((rm: any, index: any) => {
              return (
                <button
                  key={`chatroom_${index}`}
                  onClick={() => setSelectedChatroom(rm)}
                  type="button"
                  className={`
                        ${index < rooms.length - 1 ? 'mb-2' : ''}
                        p-2
                        truncate inline-flex 
                        items-center
                        border border-gray-200 
                        text-gray-200 bg-gray-500 
                        shadow-sm text-xs font-medium rounded 
                        hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
                  {rm.name}
                </button>
              );
            })}
        </div>
      </>
    );
  };

  const renderRooms = () => {
    if (Array.isArray(rooms) && !rooms.length) {
      return showMsg('You are not part of any room. Please contact admin.');
    }
    if (Array.isArray(rooms) && rooms.length) {
      return listRooms();
    }
  };

  return (
    <>
      {loadingRooms && showMsg('Loading Rooms...')}
      {!loadingRooms && renderRooms()}
    </>
  );
};

export default Rooms;
