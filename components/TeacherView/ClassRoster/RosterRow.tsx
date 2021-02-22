import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LessonControlContext } from '../../../contexts/LessonControlContext';
import ProgressSwitch from '../../General/LessonProgressSwitch';

interface RosterRowProps {
  keyProp: number;
  number: number;
  id: string;
  active: boolean;
  firstName: string;
  lastName: string;
  preferredName: string;
  role: string;
  currentLocation: string;
  lessonProgress: string;
  handleSelect?: (e: any) => Promise<void>;
  handleShareStudentData?: () => void;
  handleQuitShare: () => void;
  handleQuitViewing: () => void;
  isSameStudentShared: boolean;
  viewedStudent: string;
  setViewedStudent: React.Dispatch<React.SetStateAction<string>>;
}

const RosterRow: React.FC<RosterRowProps> = (props: RosterRowProps) => {
  const {
    keyProp,
    number,
    id,
    active,
    firstName,
    lastName,
    preferredName,
    role,
    currentLocation,
    lessonProgress,
    handleSelect,
    handleShareStudentData,
    handleQuitShare,
    handleQuitViewing,
    isSameStudentShared,
    viewedStudent,
    setViewedStudent
  } = props;
  const { state, dispatch } = useContext(LessonControlContext);
  const [shareable, setShareable] = useState(true);

  useEffect(() => {
    if (currentLocation) {
      const indexToPage = state.pages[currentLocation].stage;
      let result = /.+\/(breakdown)\/*.*/.test(indexToPage);

      if (currentLocation) {
        result = /.+\/(breakdown)\/*.*/.test(indexToPage);
      } else if (lessonProgress) {
        result = /.+\/(breakdown)\/*.*/.test(indexToPage);
      }

      if (result) {
        setShareable(true);
      }

      if (!result) {
        setShareable(false);
      }
    } else {
      setShareable(false);
    }
  }, [currentLocation]);

  const studentIsShared = () => {
    if (/* state.studentViewing.live &&  */ state.sharing) {
      return (
        state.displayData.studentInfo.firstName === firstName && state.displayData.studentInfo.lastName === lastName
      );
    }
  };

  const studentIsViewed = () => {
    if (state.studentViewing.live) {
      return viewedStudent === id;
    }
  };

  const handleRowSelection = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    const button = t.hasAttribute('aria-label');

    if (!studentIsViewed() && !button) {
      handleSelect(e);
    }
  };

  const getPageLabel = (locationIndex: string) => {
    if (locationIndex === '') {
      return 'n/a';
    } else {
      return state.pages[parseInt(locationIndex)].stage;
    }
  };

  const activeHoverClass = 'hover:font-semibold cursor-pointer';
  const inactiveTextClass = 'text-dark-gray text-opacity-20';

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
      onClick={active && handleRowSelection}
      className={`w-full flex h-10 py-2 pl-2 pr-1 
                    ${ active && activeHoverClass} 
                    ${ !active && inactiveTextClass }
                    ${number % 2 === 0 ? 'bg-white bg-opacity-20' : null} 
                    ${studentIsViewed() ? 'bg-blueberry bg-opacity-30' : null}
                    `}>

      {/* STUDENT NAME */}
      <div id={`${id}`} className={`w-8/10 flex flex-row ${ active && activeHoverClass}`}>
        <div
          id={`${id}`}
          className={`w-1/2 overflow-hidden mx-2 flex items-center text-sm whitespace-pre truncate ... ${ active && activeHoverClass} `}>
          {preferredName ? preferredName : firstName} {lastName}
        </div>

        {/* LESSON PROGRESS */}
        <div
          id={`${id}`}
          className={`w-1/2 mx-2 flex justify-center items-center overflow-hidden text-sm text-left ${ active && activeHoverClass}`}>
          <ProgressSwitch label={getPageLabel(currentLocation)} id={id} />
        </div>
      </div>


      {/* MR SHARE BUTTON */}
      {shareable ? (
        studentIsShared() ? (
          <div
            aria-label={`asd`}
            id={`${id}`}
            className={`w-2/10 mx-2 flex items-center text-center rounded-lg text-white bg-dark-red hover:bg-red-500 text-sm ${ active && activeHoverClass}`}
            onClick={handleQuitShare}>
            <span id={`${id}`}>Unshare</span>
          </div>
        ) : studentIsViewed() ? (
          <div
            aria-label={`asd`}
            id={`${id}`}
            className={` w-2/10 mx-2 flex items-center text-center rounded-lg text-white bg-sea-green hover:bg-green-400 text-sm ${ active && activeHoverClass}`}
            onClick={handleShareStudentData}>
            <span id={`${id}`}>Share</span>
          </div>
        ) : (
          <div
            id={`${id}`}
            className={`w-2/10 mx-2 flex items-center text-center rounded-lg text-sea-green text-sm ${ active && activeHoverClass} `}>
            <span id={`${id}`}>Shareable</span>
          </div>
        )
      ) : (
        <div
          id={`${id}`}
          className={`w-2/10 mx-2 flex items-center text-center rounded-lg text-sm ${active && 'cursor-pointer text-light-gray'}`}>
          <span id={`${id}`}>N/A</span>
        </div>
      )}
    </div>
  );
};

export default RosterRow;
