import useLessonControls from '@customHooks/lessonControls';
import {getLocalStorageData, setLocalStorageData} from '@utilities/localStorage';
import React from 'react';
import {FaCompress, FaExpand} from 'react-icons/fa';
import {IconContext} from 'react-icons/lib/esm/iconContext';

interface IFullscreenToggleProps {
  displayData: any;
  lessonDispatch: any;
  lessonData: any;
  currentPage: string;
}

const PresentationModeToggle = ({
  displayData,
  lessonDispatch,
  lessonData,
  currentPage,
}: IFullscreenToggleProps) => {
  const {handleRoomUpdate, resetViewAndShare} = useLessonControls();
  const anyoneIsShared = displayData && displayData[0].studentAuthID !== '';
  const isPresenting = displayData && displayData[0].isTeacher === true;
  const getRoomData = getLocalStorageData('room_info');

  //TODO: to refactor this to lessonControls hook
  const getPageID = (locationIndex: string) => {
    if (lessonData && lessonData?.lessonPlan) {
      return lessonData.lessonPlan[parseInt(locationIndex)]?.id;
    }
  };

  const handlePresentationUpdate = async (roomID: string, pageID: string) => {
    lessonDispatch({
      type: 'SET_ROOM_SUBSCRIPTION_DATA',
      payload: {
        id: getRoomData.id,
        displayData: [{isTeacher: true, studentAuthID: '0', lessonPageID: pageID}],
      },
    });
    setLocalStorageData('room_info', {
      ...getRoomData,
      displayData: [{isTeacher: true, studentAuthID: '0', lessonPageID: pageID}],
    });
    await handleRoomUpdate({
      id: roomID,
      displayData: [{isTeacher: true, studentAuthID: '0', lessonPageID: pageID}],
    });
  };

  const handlePresentationToggle = async (
    presenting: boolean,
    sharingActive: boolean
  ) => {
    if (presenting) {
      await resetViewAndShare();
    } else {
      if (sharingActive) {
        await resetViewAndShare();
        await handlePresentationUpdate(getRoomData.id, getPageID(currentPage));
      } else {
        await handlePresentationUpdate(getRoomData.id, getPageID(currentPage));
      }
    }
  };

  return (
    <div className="w-1/3 flex justify-center h-8 align-middle font-bold text-xs leading-8 ">
      <span
        onClick={() => handlePresentationToggle(isPresenting, anyoneIsShared)}
        className="w-auto h-6 my-auto leading-4 text-xs text-white bg-blue-600 hover:bg-blue-500 hover:text-underline p-1 rounded-lg cursor-pointer">
        {isPresenting ? 'Stop Presenting' : 'Start Presenting'}
      </span>
    </div>
  );
};

export default React.memo(PresentationModeToggle);
