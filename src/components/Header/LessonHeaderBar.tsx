import React, {useContext, useEffect, useState} from 'react';
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
  isAtEnd,
  setisAtEnd,
}: LessonHeaderBarProps) => {
  const history = useHistory();
  const {lessonState, theme} = useContext(GlobalContext);

  // ##################################################################### //
  // ################## LOGIC FOR RETURNING TO CLASSROOM ################# //
  // ##################################################################### //

  const getRoomData = getLocalStorageData('room_info');
  const [waiting, setWaiting] = useState<boolean>(null);
  const [safeToLeave, setSafeToLeave] = useState<any>(null);

  const handleManualSave = () => {
    if (lessonState.updated) {
      setWaiting(true);
      setSafeToLeave(false);
    } else {
      setWaiting(false);
      setSafeToLeave(true);
    }
  };

  useEffect(() => {
    if (!lessonState.updated) {
      if (waiting === true && safeToLeave === false) {
        setWaiting(false);
        setSafeToLeave(true);
      } else {
        setWaiting(null);
        setSafeToLeave(null);
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

  // ------ POPUP MODAL ----- //
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
          header="Congratulations, you have reached the end of the lesson, do you want to go back to the dashboard?"
          button1={`${!waiting ? 'Go to the dashboard' : 'Saving your data...'}`}
          button2="Stay on lesson"
          svg="question"
          handleButton1={handleManualSave}
          handleButton2={handlePopup}
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
        <SideMenu lessonDataLoaded={lessonDataLoaded} handlePopup={handlePopup} />
      )}
    </div>
  );
};

export default LessonHeaderBar;
