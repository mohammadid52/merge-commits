import React, {useContext, useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import {useHistory} from 'react-router-dom';
import {useOutsideAlerter} from '../General/hooks/outsideAlerter';
import PositiveAlert from '../General/Popup';
import LessonTopMenu from '../Lesson/Header/LessonTopMenu';
import SideMenu from '../Lesson/Header/SideMenu';
import {LessonHeaderBarProps} from '../../interfaces/LessonComponentsInterfaces';
import {GlobalContext} from '../../contexts/GlobalContext';
import {getLocalStorageData} from '../../utilities/localStorage';

const LessonHeaderBar = ({
  lessonDataLoaded,
  overlay,
  setOverlay,
  isAtEnd,
  setisAtEnd,
}: LessonHeaderBarProps) => {
  const history = useHistory();
  const {lessonState, theme} = useContext(GlobalContext);

  const getRoomData = getLocalStorageData('room_info');
  const [waiting, setWaiting] = useState<boolean>(null);
  const [safeToLeave, setSafeToLeave] = useState<any>(false);

  const handleManualSave = () => {
    setWaiting(true);
  };

  useEffect(() => {
    if (!lessonState.update) {
      if (waiting === true) {
        setWaiting(false);
        setSafeToLeave(true);
      }
    }
  }, [lessonState.updated]);

  useEffect(() => {
    console.log('safeToLeave State - ', safeToLeave);
    if (safeToLeave === true) {
      handlePopup();
      history.push(`/dashboard/classroom/${getRoomData.id}`);
    }
  }, [safeToLeave]);

  const {visible, setVisible} = useOutsideAlerter(false);
  const handlePopup = () => {
    setVisible((prevState: any) => !prevState);
  };

  return (
    <div
      className={`z-40 relative center w-full 
        h-.7/10 text-gray-200 shadow-2xl
        ${theme.toolbar.bg} `}>
      {/**
       *
       * Potentially need to fix html below
       *
       */}
      <div className={`${visible ? 'absolute z-100' : 'hidden'}`}>
        <PositiveAlert
          alert={visible}
          setAlert={setVisible}
          header="Are you sure you want to leave the Lesson?"
          button1={`${!waiting ? 'Go to the dashboard' : 'Saving your data...'}`}
          button2="Cancel"
          svg="question"
          handleButton1={handleManualSave}
          handleButton2={() => handlePopup}
          theme="dark"
          fill="screen"
        />
      </div>

      <LessonTopMenu
        handlePopup={handlePopup}
        isAtEnd={isAtEnd}
        setisAtEnd={setisAtEnd}
      />

      {/**
       *
       *
       * SIDE MENU UNDER PROGRESS BAR HIDDEN UNTIL FURTHER NOTICE
       *
       *
       */}

      {lessonDataLoaded && (
        <SideMenu
          lessonDataLoaded={lessonDataLoaded}
          handlePopup={handlePopup}
          overlay={overlay}
          setOverlay={setOverlay}
        />
      )}
    </div>
  );
};

export default LessonHeaderBar;
