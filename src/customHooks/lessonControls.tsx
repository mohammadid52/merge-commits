import {useContext} from 'react';
import {GlobalContext} from 'contexts/GlobalContext';
import {getLocalStorageData, setLocalStorageData} from 'utilities/localStorage';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import * as mutations from 'graphql/mutations';

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
        await API.graphql(
          graphqlOperation(mutations.updateRoom, {
            input: payload
          })
        );
      } catch (e) {
        console.error('handleRoomUpdate - ', e);
      }
    } else {
      console.log('incorrect data for handleRoomUpdate() - ', payload);
    }
  };

  const getPageID = (locationIndex: string, lessonPlan: any) => {
    if (lessonPlan) {
      return lessonPlan[parseInt(locationIndex)]?.id;
    }
  };

  // ~~~~~~~~~~~~ SHARING STATUS ~~~~~~~~~~~ //

  const viewedStudent = lessonState?.studentViewing;
  const sharedStudent = lessonState?.displayData[0]?.studentAuthID;

  const resetView = async () => {
    console.log('reset view');
    lessonDispatch({
      type: 'SET_ROOM_SUBSCRIPTION_DATA',
      payload: {
        id: getRoomData.id,
        studentViewing: '',
        displayData: lessonState.displayData
      }
    });

    setLocalStorageData('room_info', {
      ...getRoomData,
      studentViewing: '',
      displayData: lessonState.displayData
    });
    await handleRoomUpdate({
      id: getRoomData.id,
      studentViewing: '',
      displayData: lessonState.displayData
    });
  };

  const resetShare = async () => {
    console.log('reset share');
    lessonDispatch({
      type: 'SET_ROOM_SUBSCRIPTION_DATA',
      payload: {
        id: getRoomData.id,
        studentViewing: viewedStudent,
        displayData: [{isTeacher: false, studentAuthID: '', lessonPageID: ''}]
      }
    });

    setLocalStorageData('room_info', {
      ...getRoomData,
      studentViewing: viewedStudent,
      displayData: [{isTeacher: false, studentAuthID: '', lessonPageID: ''}]
    });
    await handleRoomUpdate({
      id: getRoomData.id,
      studentViewing: viewedStudent,
      displayData: [{isTeacher: false, studentAuthID: '', lessonPageID: ''}]
    });
  };

  const resetViewAndShare = async () => {
    if (viewedStudent !== '' || sharedStudent !== '') {
      await resetView();
      await resetShare();
    }
  };

  return {
    handleRoomUpdate: handleRoomUpdate,
    resetViewAndShare: resetViewAndShare,
    viewedStudent,
    sharedStudent,
    getPageID,
    resetView,
    resetShare
  };
};

export default useLessonControls;
