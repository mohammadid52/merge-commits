import React, {useContext, useEffect, useState} from 'react';
import {NavLink, useHistory, useRouteMatch} from 'react-router-dom';
import {LessonContext} from '../../../contexts/LessonContext';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {getAsset} from '../../../assets';
import {LessonHeaderBarProps} from '../../../interfaces/LessonComponentsInterfaces';
import PositiveAlert from '../../General/Popup';
import {useOutsideAlerter} from '../../General/hooks/outsideAlerter';
import {getLocalStorageData} from '../../../utilities/localStorage';

const Foot = ({isAtEnd, setisAtEnd}: LessonHeaderBarProps) => {
  const {state, dispatch, lessonState, lessonDispatch, clientKey, theme} = useContext(
    GlobalContext
  );
  const history = useHistory();
  const match = useRouteMatch();

  const PAGES = lessonState.lessonData.lessonPlan;

  // ~~~~~~~~~ SIMPLE LOGIC CHECKS ~~~~~~~~~ //

  const canContinue = () => {
    if (PAGES) {
      return (
        lessonState.currentPage < PAGES.length - 1 &&
        PAGES[lessonState.currentPage + 1]?.open !== false
      );
    } else {
      return false;
    }
  };

  const userAtEnd = () => {
    return lessonState.currentPage === PAGES.length - 1;
  };

  // ##################################################################### //
  // ############################# NAVIGATION ############################ //
  // ##################################################################### //
  const handleForward = () => {
    if (!userAtEnd()) {
      if (isAtEnd) setisAtEnd(false);
      if (canContinue()) {
        history.push(`${match.url}/${lessonState.currentPage + 1}`);
        lessonDispatch({
          type: 'SET_CURRENT_PAGE',
          payload: lessonState.currentPage + 1,
        });
      }
    } else if (userAtEnd()) {
      handlePopup();
    }
  };

  const handleBack = () => {
    if (userAtEnd()) {
      if (isAtEnd) setisAtEnd(false);
      history.push(`${match.url}/${lessonState.currentPage - 1}`);
      lessonDispatch({
        type: 'SET_CURRENT_PAGE',
        payload: lessonState.currentPage - 1,
      });
    } else if (!userAtEnd() && lessonState.currentPage > 0) {
      if (isAtEnd) setisAtEnd(false);
      history.push(`${match.url}/${lessonState.currentPage - 1}`);
      lessonDispatch({
        type: 'SET_CURRENT_PAGE',
        payload: lessonState.currentPage - 1,
      });
    }
  };

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
    <>
      <div className="mt-auto mb-0 bg-darker-gray flex-row justify-center items-center">
        <div className={`${visible ? 'absolute z-100' : 'hidden'}`} onClick={handlePopup}>
          <PositiveAlert
            alert={visible}
            setAlert={setVisible}
            header="Are you sure you want to leave the Lesson?"
            button1="Go to the dashboard"
            button2="Cancel"
            svg="question"
            handleButton1={handleManualSave}
            handleButton2={() => handlePopup}
            theme="dark"
            fill="screen"
          />
        </div>

        <div
          className={`w-256 h-auto mx-auto bg-darker-gray py-8 flex flex-row justify-center items-start text-center`}>
          {/* BACK BUTTON */}

          <div className="w-3.3/10 flex justify-center items-center">
            <div
              className={`z-0  w-24 h-8 text-center flex justify-center items-center rounded-full ${
                lessonState.currentPage > 0
                  ? 'cursor-pointer bg-dark-red'
                  : 'cursor-default bg-darker-gray'
              } }`}
              onClick={handleBack}>
              <div className="w-auto h-auto text-white">Back</div>
            </div>
          </div>

          {/* LOGO */}
          <div className="w-3.3/10 flex justify-center items-center">
            <NavLink to="/dashboard">
              <img
                className="h-20 px-4"
                src={getAsset(clientKey, 'main_logo')}
                alt="Logo"
              />
            </NavLink>
          </div>

          {/* FORWARD BUTTON */}

          <div className="w-3.3/10 flex justify-center items-center">
            <div
              className={`z-0  w-24 h-8 text-center flex justify-center items-center rounded-full ${
                canContinue || userAtEnd
                  ? 'bg-sea-green cursor-pointer'
                  : 'bg-dark-gray cursor-default'
              } `}
              onClick={handleForward}>
              <div className="w-auto h-auto text-white">Continue</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Foot;
