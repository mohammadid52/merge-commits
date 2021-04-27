import React, {useEffect, useState, useContext} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as customQueries from '../../customGraphql/customQueries';
import {GlobalContext} from '../../contexts/GlobalContext';

interface Rooms {
  selectRoom?: Function;
}

const Rooms = (props: Rooms) => {
  const {state, dispatch} = useContext(GlobalContext);
  const {selectRoom} = props;
  const [rooms, setRooms] = useState(null);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const fetchRooms = async () => {
    setLoadingRooms(true);
    let rooms: any = await API.graphql(
      graphqlOperation(customQueries.getChatRooms, {
        email: state.user.email,
        authId: state.user.authId,
      })
    );
    let classes = rooms.data.getPerson?.classes?.items || [];
    let chatRooms: any = [];
    classes.map((cls: any, i: any) => {
      let rooms = cls.class.rooms?.items;
      chatRooms = chatRooms.concat(rooms);
    });
    setRooms(chatRooms);
    setLoadingRooms(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const showLoader = () => {
    return <div>Loading Rooms...</div>;
  };

  const showNoRooms = () => {
    return <div>You are not part of any room. Please contact admin.</div>;
  };

  const listRooms = () => {
    return (
      <div>
        {rooms.map((rm: any, index: any) => {
          return (
            <button
              key={index}
              onClick={() => selectRoom(rm)}
              type="button"
              className="truncate inline-flex items-center p-2 mb-2 border border-gray-200 text-gray-200 bg-gray-600 shadow-sm text-xs font-medium rounded hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {rm.name}
            </button>
          );
        })}
      </div>
    );
  };

  const renderRooms = () => {
    if (Array.isArray(rooms) && !rooms.length) {
      return showNoRooms();
    }
    if (Array.isArray(rooms) && rooms.length) {
      return listRooms();
    }
  };

  return (
    <>
      {loadingRooms && showLoader()}
      {!loadingRooms && renderRooms()}
    </>
  );
};

export default Rooms;