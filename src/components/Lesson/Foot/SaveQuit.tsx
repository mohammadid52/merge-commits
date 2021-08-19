import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {AiOutlineSave} from 'react-icons/ai';
import {getLocalStorageData} from '../../../utilities/localStorage';

interface SaveQuitProps {
  id?: string;
  feedback?: {
    like: string;
    text: string;
  };
  roomID: string;
}

const SaveQuit = (props: SaveQuitProps) => {
  const {lessonState} = useContext(GlobalContext);
  const history = useHistory();

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
    // console.log('safeToLeave State - ', safeToLeave);
    if (safeToLeave === true) {
      history.push(`/dashboard/classroom/${getRoomData.id}`);
    }
  }, [safeToLeave]);

  return (
    <>
      {/* {alert ? (
        <div className={`${alert ? 'absolute z-100 top-0' : 'hidden'}`}>
          <Popup
            alert={visible}
            setAlert={setVisible}
            header="You have completed a lesson!"
            button1={`${!waiting ? 'Go to the dashboard' : 'Saving your data...'}`}
            svg="smile"
            handleButton1={handleManualSave}
            fill="screen"
          />
        </div>
      ) : null} */}

      <div className={'w-full items-center justify-center flex py-4'}>
        <button
          type="submit"
          className={`py-1 min-w-48 w-auto px-4 font-semibold bg-blueberry hover:bg-blue-500 hover:text-underline text-white flex justify-center items-center rounded my-4`}
          onClick={handleManualSave}>
          <IconContext.Provider
            value={{className: 'w-auto mr-2', style: {cursor: 'pointer'}}}>
            <AiOutlineSave size={24} />
          </IconContext.Provider>
          <span>{waiting ? 'Saving your data...' : 'Save and Go to Classroom'}</span>
        </button>
      </div>
    </>
  );
};

export default SaveQuit;
