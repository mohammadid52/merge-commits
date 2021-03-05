import { useState, useEffect, useContext } from 'react';
import {GlobalContext} from '../contexts/GlobalContext';
import { API, graphqlOperation } from '@aws-amplify/api';
import * as customQueries from '../customGraphql/customQueries';

const useLoadRooms = () => {
  const { state, theme, dispatch } = useContext(GlobalContext);
  const [rooms, setRooms] = useState<any[]>([]);
  /**
   * INIT TEACHER ROOM
   */
  useEffect(() => {
    const userAuthID = state.user.authId;
    const userRole = state.user.role;
    const listRoomTeacher = async () => {
      if (userRole === 'FLW' || userRole === 'TR') {
        try {
          const classIdFromRoomsFetch: any = await API.graphql(
            graphqlOperation(customQueries.listRooms, { filter: { teacherAuthID: { eq: userAuthID } } })
          );
          const response = await classIdFromRoomsFetch;
          const arrayOfResponseObjects = response?.data?.listRooms?.items;
          setRooms(arrayOfResponseObjects);
          dispatch({
            type: 'UPDATE_ROOM',
            payload: {
              property: 'rooms',
              data: arrayOfResponseObjects,
            },
          });
        } catch (e) {
          console.error('Classes Fetch ERR: ', e);
        }
      }
    };
    (userRole === 'FLW' || userRole === 'TR' ) && listRoomTeacher();
  }, []);

  return rooms;
}

export default useLoadRooms;