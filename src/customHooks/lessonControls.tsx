import {useContext} from 'react';
import {GlobalContext} from '@contexts/GlobalContext';
import {getLocalStorageData, setLocalStorageData} from '@utilities/localStorage';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import * as mutations from '@graphql/mutations';

const useLessonControls = () => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch;

  // ~~~~~~~~~~~ LOCAL & SESSION ~~~~~~~~~~~ //
  const getRoomData = getLocalStorageData('room_info');

  // ~~~~~~~~~~~~~~~~~ CRUD ~~~~~~~~~~~~~~~~ //

  const handleRoomUpdate = async (payload: any) => {
    if (typeof payload === 'object' && Object.keys(payload).length > 0) {
      try {
        const updateRoom: any = await API.graphql(
          graphqlOperation(mutations.updateRoom, {
            input: payload,
          })
        );
      } catch (e) {
        console.error('handleRoomUpdate - ', e);
      }
    } else {
      console.log('incorrect data for handleRoomUpdate() - ', payload);
    }
  };

  // ~~~~~~~~~~~~ SHARING STATUS ~~~~~~~~~~~ //

  const viewedStudent = lessonState?.studentViewing;
  const sharedStudent = lessonState?.displayData[0]?.studentAuthID;

  const resetViewAndShare = async () => {
    if (viewedStudent !== '' || sharedStudent !== '') {
      lessonDispatch({
        type: 'SET_ROOM_SUBSCRIPTION_DATA',
        payload: {
          id: getRoomData.id,
          studentViewing: '',
          displayData: [{studentAuthID: '', lessonPageID: ''}],
        },
      });

      setLocalStorageData('room_info', {
        ...getRoomData,
        studentViewing: '',
        displayData: [{studentAuthID: '', lessonPageID: ''}],
      });
      await handleRoomUpdate({
        id: getRoomData.id,
        studentViewing: '',
        displayData: [{studentAuthID: '', lessonPageID: ''}],
      });
    }
  };

  return {
    resetViewAndShare: resetViewAndShare,
  };
};

export default useLessonControls;
