import React, {useContext, useEffect} from 'react';
import {NavLink, useHistory, useRouteMatch} from 'react-router-dom';
import {LessonContext} from '../../../contexts/LessonContext';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {getAsset} from '../../../assets';
import {LessonHeaderBarProps} from '../../../interfaces/LessonComponentsInterfaces';
import PositiveAlert from '../../General/Popup';
import {useOutsideAlerter} from '../../General/hooks/outsideAlerter';

const Branding = (props: LessonHeaderBarProps) => {
  const {state, theme, dispatch} = useContext(LessonContext);
  const {clientKey} = useContext(GlobalContext);
  const history = useHistory();
  const match = useRouteMatch();
  const {visible, setVisible, ref} = useOutsideAlerter(false);
  const userAtEnd = state.currentPage + 1 === state.pages.length;

  useEffect(() => {
    if (state.pages[state.currentPage + 1]) {
      if (state.pages[state.currentPage + 1].open) {
        // console.log(state.pages);
        return dispatch({type: 'CAN_CONTINUE'});
      }
      return dispatch({type: 'NO_CONTINUE'});
    }
    return dispatch({type: 'NO_CONTINUE'});
  }, [state.pages, state.currentPage]);

  const handleForward = () => {
    if (state.canContinue && state.currentPage < state.pages.length - 1) {
      history.push(`${match.url}/${state.pages[state.currentPage + 1].stage}`);
      dispatch({type: 'PAGE_FORWARD'});
    }
    if (userAtEnd) {
      props.handlePopup();
    }
  };

  const handleBack = () => {
    if (state.currentPage > 0) {
      history.push(`${match.url}/${state.pages[state.currentPage - 1].stage}`);
      dispatch({type: 'PAGE_BACK'});
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
          {/* BACK */}
          <div className="w-3.3/10 flex justify-center items-center">
            {state.data.lesson.type === 'lesson' && (
              <div
                className={`z-0  w-24 h-8 text-center flex justify-center items-center rounded-full ${
                  state.currentPage > 0
                    ? 'cursor-pointer bg-dark-red'
                    : 'cursor-default bg-darker-gray'
                } }`}
                onClick={handleBack}>
                <div className="w-auto h-auto text-white">Back</div>
              </div>
            )}
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

          {/* CONTINUE */}
          <div className="w-3.3/10 flex justify-center items-center">
            {state.data.lesson.type === 'lesson' && (
              <div
                className={`z-0  w-24 h-8 text-center flex justify-center items-center rounded-full ${
                  state.canContinue
                    ? 'bg-sea-green cursor-pointer'
                    : 'bg-dark-gray cursor-default'
                } `}
                onClick={handleForward}>
                <div className="w-auto h-auto text-white">Continue</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Branding;