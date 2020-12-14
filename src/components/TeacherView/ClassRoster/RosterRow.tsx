import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LessonControlContext } from '../../../contexts/LessonControlContext';
import ProgressSwitch from '../../General/LessonProgressSwitch';

interface RosterRowProps {
  keyProp: number;
  number: number;
  id: string;
  status: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  role: string;
  currentLocation: string;
  lessonProgress: string;
  handleSelect: (e: any) => Promise<void>;
  studentStatus: (status: string) => JSX.Element;
  handleShareStudentData?: () => void;
  handleQuitShare: () => void;
  handleQuitViewing: () => void;
  isSameStudentShared: boolean;
}

const RosterRow: React.FC<RosterRowProps> = (props: RosterRowProps) => {
  const {
    keyProp,
    number,
    id,
    status,
    firstName,
    lastName,
    preferredName,
    role,
    currentLocation,
    lessonProgress,
    handleSelect,
    studentStatus,
    handleShareStudentData,
    handleQuitShare,
    handleQuitViewing,
    isSameStudentShared,
  } = props;
  const { state, dispatch } = useContext(LessonControlContext);
  const location = useLocation();
  const [quickShare, setQuickShare] = useState<boolean>(false);
  const [shareable, setShareable] = useState(true);

  useEffect(() => {
    let result = /.+\/(breakdown)\/*.*/.test(lessonProgress);

    if (currentLocation) {
      result = /.+\/(breakdown)\/*.*/.test(currentLocation);
    } else if (lessonProgress) {
      result = /.+\/(breakdown)\/*.*/.test(lessonProgress);
    }

    if (result) {
      setShareable(true);
    }

    if (!result) {
      setShareable(false);
    }
  }, [lessonProgress]);

  const studentIsShared = () => {
    if (/* state.studentViewing.live &&  */ state.sharing) {
      return (
        state.displayData.studentInfo.firstName === firstName && state.displayData.studentInfo.lastName === lastName
      );
    }
  };

  const studentIsViewed = () => {
    if (state.studentViewing.live) {
      return state.studentViewing.studentInfo.id === id;
    }
  };

  const handleRowSelection = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    const button = t.hasAttribute('aria-label');

    if (!studentIsViewed() && !button) {
      handleSelect(e);
    }
  };

  return (
    /**
     *
     * \\\\\~~ . , ` -
     * THE WHOLE STUDENT ROW
     * /////~~ * ` . _
     *
     */
    <div
      key={keyProp}
      id={`${id}`}
      onClick={handleRowSelection}
      className={`w-full flex h-10 py-2 pl-2 pr-1 hover:font-semibold
                    ${number % 2 === 0 ? 'bg-white bg-opacity-20' : null} 
                    ${studentIsViewed() ? 'bg-blueberry bg-opacity-30' : null}
                    `}>
      {/* STUDENT STATUS */}

      {/* <div id={`${id}`} className={`w-1/10 text-center text-xs flex`}>
        {studentIsViewed() ? (
          <div onClick={handleQuitViewing}>
            <IconContext.Provider value={{ color: '#FFFFFF', size: '100%' }}>
              <AiOutlineEye style={{ pointerEvents: 'none' }} />
            </IconContext.Provider>
          </div>
        ) : (
          <div>
            <IconContext.Provider value={{ color: '#9098a9', size: '100%' }}>
              <AiOutlineEyeInvisible style={{ pointerEvents: 'none' }} />
            </IconContext.Provider>
          </div>
        )}
      </div> */}

      {/* STUDENT NAME */}

      <div id={`${id}`} className="w-8/10 flex flex-row hover:font-semibold cursor-pointer">
        <div
          id={`${id}`}
          className={`w-1/2 overflow-hidden mx-2 flex items-center hover:font-semibold cursor-pointer text-sm whitespace-pre`}>
          {preferredName ? preferredName : firstName} {lastName}
        </div>

        {/* LESSON PROGRESS */}

        <div
          id={`${id}`}
          className={`w-1/2 mx-2 flex justify-center items-center hover:font-semibold cursor-pointer overflow-hidden text-sm text-left`}>
          <ProgressSwitch label={currentLocation ? currentLocation : lessonProgress} id={id} />
        </div>
      </div>

      {/* STUDENT ROLEY */}

      {/* <div
        id={`${id}`}
        className={`w-1.5/10 mx-2 ${
          role !== 'ST' ? 'text-center text-white bg-dark-gray rounded-lg' : 'font-semibold'
        } text-center `}>
        {role === 'ST' ? 'Student' : role}
      </div> */}

      {/* MR SHARE BUTTON */}

      {shareable ? (
        studentIsShared() ? (
          <div
            aria-label={`asd`}
            id={`${id}`}
            className={`w-2/10 mx-2 flex items-center text-center rounded-lg hover:font-semibold cursor-pointer text-white bg-dark-red hover:bg-red-500 text-sm`}
            onClick={handleQuitShare}>
            <span id={`${id}`}>Unshare</span>
          </div>
        ) : studentIsViewed() ? (
          <div
            aria-label={`asd`}
            id={`${id}`}
            className={` w-2/10 mx-2 flex items-center text-center rounded-lg hover:font-semibold cursor-pointer text-white bg-sea-green hover:bg-green-400 text-sm`}
            onClick={handleShareStudentData}>
            <span id={`${id}`}>Share</span>
          </div>
        ) : (
          <div
            id={`${id}`}
            className={`w-2/10 mx-2 flex items-center text-center rounded-lg hover:font-semibold cursor-pointer text-sea-green text-sm`}>
            <span id={`${id}`}>Shareable</span>
          </div>
        )
      ) : (
        <div
          id={`${id}`}
          className={`w-2/10 mx-2 flex items-center text-center rounded-lg cursor-pointer text-light-gray text-sm`}>
          <span id={`${id}`}>N/A</span>
        </div>
      )}
    </div>
  );
};

export default RosterRow;
