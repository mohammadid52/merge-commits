import React, {useEffect} from 'react';
import useLessonControls from 'customHooks/lessonControls';
import {getLocalStorageData, setLocalStorageData} from 'utilities/localStorage';
import {FaCompress, FaExpand} from 'react-icons/fa';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {StudentWindowTitleBarProps} from '../StudentWindowTitleBar';
import Buttons from 'components/Atoms/Buttons';

interface IFullscreenToggleProps extends StudentWindowTitleBarProps {
  displayData: any;
  lessonDispatch: any;
  lessonData: any;
  currentPage: string;
}

const PresentationModeToggle = ({
  theme,
  themeColor,
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

  useEffect(() => {
    if (isPresenting && currentSharedPage !== getPageID(currentPage)) {
      handlePresentationUpdate(getRoomData.id, getPageID(currentPage));
    }
  }, [isPresenting, currentPage]);

  return (
    <div className="w-1/3 flex justify-center h-8 align-middle leading-8 ">
      {/* <span
        onClick={() => handlePresentationToggle(isPresenting, anyoneIsShared)}
        className={`${
          isPresenting ? 'text-red-500' : theme.textColor[themeColor]
        } w-auto h-6 my-auto text-sm underline leading-4 transform hover:scale-110 transition-transform duration-150 p-1 cursor-pointer`}>
        {isPresenting ? 'Stop Presenting' : 'Start Presenting'}
      </span> */}
      <Buttons
        overrideClass
        btnClass={`${
          isPresenting ? theme.btn['cancel'] : theme.btn[themeColor]
        } h-8 font-bold uppercase text-xs p-1 rounded flex items-center w-auto`}
        label={isPresenting ? 'Stop Presenting' : 'Start Presenting'}
        onClick={() => handlePresentationToggle(isPresenting, anyoneIsShared)}
      />
    </div>
  );
};

export default React.memo(PresentationModeToggle);
