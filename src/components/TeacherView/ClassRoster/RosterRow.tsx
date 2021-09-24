import React, {useContext, useState} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';

interface RosterRowProps {
  number: number;
  id: string;
  active: boolean;
  firstName: string;
  lastName: string;
  preferredName: string;
  role: string;
  currentLocation: string;
  lessonProgress: string;
  handleResetViewAndShare?: () => void;
  handleViewStudentData?: (id: string) => void;
  handleShareStudentData?: (idStr: string, pageIdStr: string) => void;
  viewedStudent: string;
  sharedStudent: string;
  handlePageChange?: any;
}

const RosterRow: React.FC<RosterRowProps> = ({
  number,
  id,
  active,
  firstName,
  lastName,
  preferredName,
  currentLocation,
  handleResetViewAndShare,
  handleViewStudentData,
  handleShareStudentData,
  viewedStudent,
  sharedStudent,
  handlePageChange,
}: RosterRowProps) => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;

  // ##################################################################### //
  // ########################### SHARING CHECKS ########################## //
  // ##################################################################### //

  const anyoneIsShared = lessonState.displayData[0].studentAuthID !== '';

  const studentIsShared = () => {
    return sharedStudent === id;
  };

  const studentIsViewed = () => {
    return viewedStudent === id;
  };

  const handleRowSelection = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    const button = t.hasAttribute('aria-label');

    if (!button) {
      handleViewStudentData(id);
      if (!studentIsViewed()) {
        handlePageChange(parseInt(currentLocation));
      }
    }
  };

  // ##################################################################### //
  // ######################### VISUAL LOGIC ETC. ######################### //
  // ##################################################################### //

  const getPageLabel = (locationIndex: string) => {
    if (lessonState.lessonData && lessonState.lessonData?.lessonPlan) {
      if (locationIndex === '') {
        return 'n/a';
      } else {
        return lessonState.lessonData.lessonPlan[parseInt(locationIndex)]?.label;
      }
    }
  };

  const getPageID = (locationIndex: string) => {
    if (lessonState.lessonData && lessonState.lessonData?.lessonPlan) {
      if (locationIndex === '') {
        return 'n/a';
      } else {
        return lessonState.lessonData.lessonPlan[parseInt(locationIndex)]?.id;
      }
    }
  };

  const activeHoverClass = 'hover:font-semibold cursor-pointer';
  const inactiveTextClass = 'text-dark-gray text-opacity-20';

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <div
      id={`${id}`}
      // onMouseDown={active ? handleRowSelection : undefined}
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
        onMouseDown={active ? handleRowSelection : undefined}
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
      {anyoneIsShared ? (
        studentIsShared() ? (
          // UNSHARE CURRENTLY SHARED STUDENT
          <div
            aria-label={`asd`}
            id={`${id}`}
            draggable={false}
            className={`w-2/10 mx-2 flex items-center text-center rounded-lg text-white bg-dark-red hover:bg-red-500 text-sm ${
              active && activeHoverClass
            }`}
            onClick={() => handleShareStudentData(id, getPageID(currentLocation))}>
            <span id={`${id}`}>Unshare</span>
          </div>
        ) : (
          // INACTIVE SHARE BUTTON IF ANY SHARING IS ACTIVE
          <div
            id={`${id}`}
            data-studentID={id}
            draggable={false}
            className={` w-2/10 mx-2 flex items-center text-center rounded-lg text-white bg-dark-gray bg-opacity-20 text-sm ${
              active && activeHoverClass
            }`}
            onClick={() => {}}>
            <span className="pointer-events-none">Share</span>
          </div>
        )
      ) : (
        // ACTIVE SHARE BUTTON IF NO SHARING IS ACTIVE
        <div
          id={`${id}`}
          data-studentID={id}
          draggable={false}
          className={` w-2/10 mx-2 flex items-center text-center rounded-lg text-white bg-green-500 bg-opacity-20 text-sm ${
            active && activeHoverClass
          }`}
          onClick={() => handleShareStudentData(id, getPageID(currentLocation))}>
          <span className="pointer-events-none">Share</span>
        </div>
      )}
    </div>
  );
};

export default RosterRow;
