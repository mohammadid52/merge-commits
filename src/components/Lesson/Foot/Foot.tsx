import {getAsset} from 'assets';
import {GlobalContext} from 'contexts/GlobalContext';
import {LessonHeaderBarProps} from 'interfaces/LessonComponentsInterfaces';
import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {getLocalStorageData} from 'utilities/localStorage';
import {useOutsideAlerter} from '../../General/hooks/outsideAlerter';
import PositiveAlert from '../../General/Popup';

const Foot = ({}: LessonHeaderBarProps) => {
  const {lessonState, clientKey} = useContext(GlobalContext);
  const history = useHistory();

  // ##################################################################### //
  // ############################# NAVIGATION ############################ //
  // ##################################################################### //

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
          className={`w-full lg:w-256 h-auto mx-auto bg-darker-gray py-8 flex flex-row justify-center items-start text-center`}>
          {/* BACK BUTTON */}

          <div className="w-3.3/10 flex justify-center items-center">
            {/* <div
              className={`z-0  w-24 h-8 text-center flex justify-center items-center rounded-full ${
                lessonState.currentPage > 0
                  ? 'cursor-pointer bg-dark-red'
                  : 'cursor-default bg-darker-gray'
              } }`}
              onClick={handleBack}>
              <div className="w-auto h-auto text-white">Back</div>
            </div> */}
          </div>

          {/* LOGO */}
          <div className="w-3.3/10 flex justify-center items-center">
            {/* <NavLink to="/dashboard"> */}
            <img
              className="h-20 px-4"
              src={getAsset(clientKey, 'main_logo')}
              alt="Logo"
            />
            {/* </NavLink> */}
          </div>

          {/* FORWARD BUTTON */}

          <div className="w-3.3/10 flex justify-center items-center">
            {/* <div
              className={`z-0  w-24 h-8 text-center flex justify-center items-center rounded-full ${
                canContinue() || userAtEnd()
                  ? 'bg-sea-green cursor-pointer'
                  : 'bg-dark-gray cursor-default'
              } `}
              onClick={handleForward}>
              <div className="w-auto h-auto text-white">Continue</div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Foot;
