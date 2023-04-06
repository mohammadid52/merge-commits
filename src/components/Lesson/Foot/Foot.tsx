import Buttons from '@components/Atoms/Buttons';
import {Modal, Result} from 'antd';
import {getAsset} from 'assets';
import {useGlobalContext} from 'contexts/GlobalContext';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {getLocalStorageData} from 'utilities/localStorage';
import {useOutsideAlerter} from '../../General/hooks/outsideAlerter';

const Foot = () => {
  const {lessonState, clientKey} = useGlobalContext();
  const history = useHistory();

  // ##################################################################### //
  // ############################# NAVIGATION ############################ //
  // ##################################################################### //

  // ##################################################################### //
  // ################## LOGIC FOR RETURNING TO CLASSROOM ################# //
  // ##################################################################### //

  const getRoomData = getLocalStorageData('room_info');
  const [waiting, setWaiting] = useState<boolean>(false);
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
        setWaiting(false);
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
      <div className="mt-auto mb-0 bg-dark-blue flex-row justify-center items-center">
        <Modal open={visible}>
          <Result
            status="warning"
            title={'Are you sure you want to leave the Lesson?'}
            extra={[
              <Buttons onClick={handleManualSave} label={'Go to the dashboard'} />,
              <Buttons onClick={handlePopup} label={'Cancel'} />
            ]}
          />
        </Modal>

        <div
          className={`w-full lg:w-256 h-auto mx-auto  py-8 flex flex-row justify-center items-start text-center`}>
          {/* BACK BUTTON */}

          <div className="w-3.3/10 flex justify-center items-center"></div>

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
                  : 'bg-dark cursor-default'
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
