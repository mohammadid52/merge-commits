import React, {useContext, useEffect, useState} from 'react';
import {NavLink, useHistory, useRouteMatch} from 'react-router-dom';
import {LessonContext} from '../../../contexts/LessonContext';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {getAsset} from '../../../assets';
import {LessonHeaderBarProps} from '../../../interfaces/LessonComponentsInterfaces';
import PositiveAlert from '../../General/Popup';
import {useOutsideAlerter} from '../../General/hooks/outsideAlerter';

const Foot = (props: LessonHeaderBarProps) => {
  const {state, dispatch, lessonState, lessonDispatch, clientKey, theme} = useContext(
    GlobalContext
  );
  const history = useHistory();
  const match = useRouteMatch();
  const [visible, setVisible] = useState<boolean>(false);

  //  NAVIGATION CONSTANTS
  const PAGES = lessonState.lessonData.lessonPlan;
  const CURRENT_PAGE = lessonState.currentPage;

  //  ENABLE NAVIGATION DEPENDING ON PAGE POSITION
  const [canContinue, setCanContinue] = useState<boolean>(false);
  const [userAtEnd, setUserAtEnd] = useState<boolean>(false);
  useEffect(() => {
    if (PAGES) {
      const CAN_CONTINUE = PAGES[CURRENT_PAGE + 1].open;
      const USER_AT_END = CURRENT_PAGE === PAGES.length - 1;

      if (CAN_CONTINUE && !USER_AT_END) {
        setCanContinue(true);
      } else if (CAN_CONTINUE && USER_AT_END) {
        setCanContinue(true);
        setUserAtEnd(true);
      }
    }
  }, [lessonState.lessonData]);

  //  NAVIGATION CONTROLS
  const handleForward = () => {
    if (canContinue && !userAtEnd) {
      history.push(`${match.url}/${CURRENT_PAGE + 1}`);
      lessonDispatch({
        type: 'SET_CURRENT_PAGE',
        payload: CURRENT_PAGE + 1,
      });
    }
    if (userAtEnd) {
      props.handlePopup();
    }
  };

  const handleBack = () => {
    if (CURRENT_PAGE > 0) {
      history.push(`${match.url}/${CURRENT_PAGE - 1}`);
      lessonDispatch({
        type: 'SET_CURRENT_PAGE',
        payload: CURRENT_PAGE - 1,
      });
    }
  };

  const handlePopup = () => {
    setVisible((prevState: any) => !prevState);
  };

  const handleSubmit = () => {
    history.push('/dashboard');
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
            handleButton1={handleSubmit}
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
