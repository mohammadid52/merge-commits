import Buttons from 'atoms/Buttons';
import useLessonControls from 'customHooks/lessonControls';
import React, {useEffect} from 'react';
import {CgScreen} from 'react-icons/cg';
import {getLocalStorageData, setLocalStorageData} from 'utilities/localStorage';
import {StudentWindowTitleBarProps} from '../StudentWindowTitleBar';

interface IFullscreenToggleProps extends StudentWindowTitleBarProps {
  displayData: any;
  lessonDispatch: any;
  lessonData: any;
  currentPage: number;
}

const PresentationModeToggle = ({
  displayData,
  lessonDispatch,
  lessonData,
  currentPage
}: IFullscreenToggleProps) => {
  const {handleRoomUpdate, resetViewAndShare} = useLessonControls();
  const anyoneIsShared = displayData && displayData[0].studentAuthID !== '';
  const currentSharedPage = displayData && displayData[0].lessonPageID;
  const isPresenting = displayData && displayData[0].isTeacher === true;

  const getRoomData = getLocalStorageData('room_info');

  //TODO: to refactor this to lessonControls hook
  const getPageID = (locationIndex: number | string) => {
    if (lessonData && lessonData?.lessonPlan) {
      if (typeof locationIndex === 'number') {
        return lessonData.lessonPlan[locationIndex]?.id;
      }
      return lessonData.lessonPlan[parseInt(locationIndex)]?.id;
    }
  };

  const handlePresentationUpdate = async (roomID: string, pageID: string) => {
    lessonDispatch({
      type: 'SET_ROOM_SUBSCRIPTION_DATA',
      payload: {
        id: getRoomData.id,
        displayData: [{isTeacher: true, studentAuthID: '0', lessonPageID: pageID}]
      }
    });
    setLocalStorageData('room_info', {
      ...getRoomData,
      displayData: [{isTeacher: true, studentAuthID: '0', lessonPageID: pageID}]
    });
    await handleRoomUpdate({
      id: roomID,
      displayData: [{isTeacher: true, studentAuthID: '0', lessonPageID: pageID}]
    });
  };

  const handlePresentationToggle = async (
    presenting: boolean,
    sharingActive: boolean
  ) => {
    if (presenting) {
      // offSound.play();
      await resetViewAndShare();
    } else {
      // offSound.pause();
      // onSound.play();
      sharingActive && (await resetViewAndShare());
      await handlePresentationUpdate(getRoomData.id, getPageID(currentPage));
    }
  };

  useEffect(() => {
    if (isPresenting && currentSharedPage !== getPageID(currentPage)) {
      handlePresentationUpdate(getRoomData.id, getPageID(currentPage));
    }
  }, [isPresenting, currentPage]);

  return (
    <Buttons
      Icon={CgScreen}
      size="middle"
      transparent={isPresenting}
      label={isPresenting ? 'Stop Presenting' : 'Start Presenting'}
      onClick={() => handlePresentationToggle(isPresenting, anyoneIsShared)}
    />
  );
};

export default React.memo(PresentationModeToggle);
