import React, {useContext, useState} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';

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
  handlePageChange?: any;
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
    currentLocation,
    handleSelect,
    handleShareStudentData,
    handleQuitShare,
    viewedStudent,
    handlePageChange,
  } = props;
  const {lessonState, controlState} = useContext(GlobalContext);
  const [shareable] = useState(true);

  const studentIsShared = () => {
    if (controlState.sharing) {
      return (
        controlState.displayData.studentInfo.firstName === firstName &&
        controlState.displayData.studentInfo.lastName === lastName
      );
    }
  };

  const studentIsViewed = () => {
    if (controlState.studentViewing.live) {
      return viewedStudent === id;
    }
  };

  const handleRowSelection = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    const button = t.hasAttribute('aria-label');

    if (!studentIsViewed() && !button) {
      handleSelect(e);
      handlePageChange(parseInt(currentLocation));
    }
  };

  const getPageLabel = (locationIndex: string) => {
    if (locationIndex === '') {
      return 'n/a';
    } else {
      return lessonState.lessonData.lessonPlan[parseInt(locationIndex)]?.label;
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
      onMouseDown={active ? handleRowSelection : undefined}
      draggable={false}
      className={`w-full flex h-10 py-2 pl-2 pr-1 
                    ${active && activeHoverClass} 
                    ${!active && inactiveTextClass}
                    ${number % 2 === 0 ? 'bg-white bg-opacity-20' : null} 
                    ${studentIsViewed() ? 'bg-blueberry bg-opacity-30' : null}
                    `}>
      {/* STUDENT NAME */}
      <div
        id={`${id}`}
        draggable={false}
        className={`w-8/10 flex flex-row select-none ${active && activeHoverClass} `}>
        <div
          id={`${id}`}
          draggable={false}
          className={`w-1/2 overflow-hidden mx-2 flex items-center pointer-events-none text-sm whitespace-pre truncate ... ${
            active && activeHoverClass
          } `}>
          {preferredName ? preferredName : firstName} {lastName}
        </div>

        <div
          id={`${id}`}
          draggable={false}
          className={`w-1/2 mx-2 flex justify-center items-center pointer-events-none overflow-hidden text-sm text-left ${
            active && activeHoverClass
          }`}>
          <div id={id} draggable={false} className={`pointer-events-none`}>
            {getPageLabel(currentLocation)}
          </div>
        </div>
      </div>

      {/* MR SHARE BUTTON */}
      {shareable ? (
        studentIsShared() ? (
          <div
            aria-label={`asd`}
            id={`${id}`}
            draggable={false}
            className={`w-2/10 mx-2 flex items-center text-center rounded-lg text-white bg-dark-red hover:bg-red-500 text-sm ${
              active && activeHoverClass
            }`}
            onClick={handleQuitShare}>
            <span id={`${id}`}>Unshare</span>
          </div>
        ) : studentIsViewed() ? (
          <div
            aria-label={`asd`}
            id={`${id}`}
            draggable={false}
            className={` w-2/10 mx-2 flex items-center text-center rounded-lg text-white bg-sea-green hover:bg-green-400 text-sm ${
              active && activeHoverClass
            }`}
            onClick={handleShareStudentData}>
            <span id={`${id}`}>Share</span>
          </div>
        ) : (
          <div
            id={`${id}`}
            draggable={false}
            className={`w-2/10 mx-2 flex items-center select-none text-center rounded-lg text-sea-green text-sm ${
              active && activeHoverClass
            } `}>
            <span id={`${id}`}>Shareable</span>
          </div>
        )
      ) : (
        <div
          id={`${id}`}
          draggable={false}
          className={`w-2/10 mx-2 flex items-center select-none text-center rounded-lg text-sm ${
            active && 'cursor-pointer text-light-gray'
          }`}>
          <span id={`${id}`}>N/A</span>
        </div>
      )}
    </div>
  );
};

export default RosterRow;