import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LessonControlContext } from '../../../contexts/LessonControlContext';
import { studentObject } from '../../../state/LessonControlState';
import ProgressSwitch from '../../General/LessonProgressSwitch';
import ToolTip from '../../General/ToolTip/ToolTip';

interface RosterRowProps {
  key: number;
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
  handleShareStudentData: () => void;
}

const RosterRow: React.FC<RosterRowProps> = (props: RosterRowProps) => {
  const {
    key,
    number,
    id,
    status,
    firstName,
    lastName,
    preferredName,
    role,
    currentLocation,
    lessonProgress,
    studentStatus,
    handleShareStudentData,
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


  /**
   * 
   * 
   * CODE BELOW IS FOR QUICKLY VIEWING AND IMMEDIATELY SHARING STUDENT
   * WRITTEN SPECIFICALLY FOR THE "SHARE BUTTON" IN THE CLASS ROSTER
   * CODE BELOW NEEDS TO BE CLEANED UP BIGTIME
   * 
   * 
   */
  useEffect(() => {
    if (state.studentViewing.live && quickShare) {
      if (typeof state.displayData.studentInfo === 'undefined') {
        handleShareStudentData();
      } else if (state.studentViewing.studentInfo.student.id !== state.displayData.studentInfo.id) {
        handleShareStudentData();
      }

      setQuickShare(false);
    }
  }, [quickShare]);

  const handleSelect = async (e: any) => {
    const { id } = e.target;
    const selected = state.roster.filter((item: any) => {
      return item.id === id;
    });

    // console.log('selected', id, selected[0]);
    dispatch({ type: 'SET_STUDENT_VIEWING', payload: selected[0] });
  };

  const quickShareStudent = async (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    const id = t.id;

    handleSelect(e);
    setQuickShare(true);
  };

  return (
    <div
      key={key}
      id={`${id}`}
      className={`w-full flex py-2 pl-4 pr-1 
                                    ${number % 2 === 0 ? 'bg-white bg-opacity-20' : null} 
                                    ${
                                      /**
                                       * 
                                       *
                                       * IF ROW IS SELECTED,
                                       *  BUT ROW DOES NOT BELONG TO SOMEONE WHO IS BEING SHARED...
                                       *    mAKE A BLUEBERRY
                                       */
                                      state.studentViewing.studentInfo &&
                                      state.studentViewing.studentInfo.id === id &&
                                      state.displayData.studentInfo.firstName !== firstName &&
                                      state.displayData.studentInfo.lastName !== lastName
                                        ? 'bg-blueberry bg-opacity-60'
                                        : ''
                                    }

                                    ${
                                      /**
                                       * 
                                       * IF ROW BELONMGS TO PERSON WHO IS BEING SHARED
                                       * MAKE YELLOW BABBYYYY
                                       * 
                                       */
                                      typeof state.displayData.studentInfo === 'undefined'
                                        ? null
                                        : state.displayData.studentInfo.firstName === firstName &&
                                          state.displayData.studentInfo.lastName === lastName
                                        ? 'bg-yellow-500 bg-opacity-60'
                                        : null
                                    }`}>
      <div id={`${id}`} className={`w-.5/10 text-center mx-2 text-xs flex`}>
        {studentStatus(status)}
      </div>

      <div
        id={`${id}`}
        className={`w-4.3/10 mx-2 flex items-center hover:underline cursor-pointer`}
        onClick={handleSelect}>
        {preferredName ? preferredName : firstName} {lastName}
      </div>

      <div
        id={`${id}`}
        className={`w-3.5/10 mx-2 flex justify-center items-center overflow-hidden`}>
        <ProgressSwitch label={currentLocation ? currentLocation : lessonProgress} id={id} />
      </div>

      {/* <div
        id={`${id}`}
        className={`w-1.5/10 mx-2 ${
          role !== 'ST' ? 'text-center text-white bg-dark-gray rounded-lg' : 'font-semibold'
        } text-center `}>
        {role === 'ST' ? 'Student' : role}
      </div> */}

      {shareable ? (
        <div
          id={`${id}`}
          className={`w-1.5/10 mx-2 flex items-center text-center rounded-lg text-white bg-sea-green`}
          onClick={(e) => {
            quickShareStudent(e);
          }}>
          Share
        </div>
      ) : (
        <div
          id={`${id}`}
          className={`w-1.5/10 mx-2 flex items-center text-center rounded-lg text-light-gray bg-light-gray bg-opacity-40`}>
          Share
        </div>
      )}
    </div>
  );
};

export default RosterRow;
