// import {PersonalizeEvents} from 'aws-sdk';
import {getAsset} from 'assets';
import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from 'contexts/GlobalContext';
import DotMenu from './RosterRow/DotMenu';
import {IRosterSectionProps} from './RosterSection';
import Buttons from '@components/Atoms/Buttons';

interface RosterRowProps extends IRosterSectionProps {
  number: number;
  personAuthID: string;
  studentID?: string;
  active: boolean;
  firstName: string;
  lastName: string;
  preferredName: string;
  role: string;
  currentLocation: string;
  lessonProgress: string;
  hot?: boolean;
}

const RosterRow: React.FC<RosterRowProps> = ({
  number,
  personAuthID,
  studentID,
  active,
  firstName,
  lastName,
  preferredName,
  currentLocation,
  handleViewStudentData,
  handleShareStudentData,
  viewedStudent,
  sharedStudent,
  handlePageChange,

  handleToggleRightView,
  hot
}: RosterRowProps) => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const theme = gContext.theme;
  const clientKey = gContext.clientKey;
  const themeColor = getAsset(clientKey, 'themeClassName');
  const lessonState = gContext.lessonState;
  const controlState = gContext.controlState;

  // ##################################################################### //
  // ########################### SHARING CHECKS ########################## //
  // ##################################################################### //

  const isLessonSurvey = lessonState.lessonData?.type === 'survey';
  const anyoneIsShared = lessonState.displayData[0].studentAuthID !== '';

  const studentIsInLesson = () => {
    const findInRoster = controlState.roster.find(
      (rosterStudent: any) => rosterStudent.personAuthID === personAuthID
    );
    if (typeof findInRoster !== 'undefined') {
      return true;
    } else {
      return false;
    }
  };

  const studentIsShared = () => {
    return sharedStudent === personAuthID;
  };

  const studentIsViewed = () => {
    return viewedStudent === personAuthID;
  };

  const handleRowSelection = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    const button = t.hasAttribute('aria-label');

    if (!button) {
      if (lessonState.lessonData?.type !== 'survey') {
        handleViewStudentData(personAuthID);
      }
      if (!studentIsViewed()) {
        handlePageChange(parseInt(currentLocation));
      }
    }
  };

  /*************************************
   * FREEZE PAGE LOCATION WHEN CURRENT *
   *  USER IS SHAREDSTUDENT.THIS WILL  *
   *      PREVENT LABEL SWITCHING      *
   *************************************/
  const [frozenPage, setFrozenPage] = useState<string>('');
  useEffect(() => {
    if (!studentIsShared()) {
      setFrozenPage(getPageLabel(currentLocation));
    }
  }, [currentLocation]);

  // ##################################################################### //
  // ######################### VISUAL LOGIC ETC. ######################### //
  // ##################################################################### //

  const getPageLabel = (locationIndex: string) => {
    if (lessonState.lessonData && lessonState.lessonData?.lessonPlan) {
      if (locationIndex === '') {
        return '--';
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
  const inactiveTextClass = 'text-gray-600 text-opacity-20';

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  const commonShareButtonClass = 'p-1 transition-all rounded-full text-white  text-sm';

  const disabledShareButton = (
    // <div
    //   id={`${personAuthID}`}
    //   data-studentid={personAuthID}
    //   draggable={false}
    //   className={` w-3/10 mx-auto cursor-not-allowed flex items-center text-center  ${
    //     active && activeHoverClass
    //   }`}
    //   onClick={() => {}}>
    //   <span className={`${commonShareButtonClass} bg-dark-gray bg-opacity-20`}>
    //     Share
    //   </span>
    // </div>
    <Buttons
      size="small"
      btnClass="w-1/4 ml-4"
      label={'Share'}
      disabled
      onClick={() => handleShareStudentData(personAuthID, getPageID(currentLocation))}
    />
  );

  return (
    <>
      {/* <div className="" /> */}
      <div
        id={`${personAuthID}`}
        draggable={false}
        className={`w-full flex h-10 rounded items-center shadow-sm px-1 ${
          active && activeHoverClass
        }  ${!active && inactiveTextClass} ${
          number % 2 === 0 ? 'bg-gray-200 bg-opacity-50' : ''
        } ${
          studentIsViewed() ? `bg-white border-l-4 ${theme.borderColor[themeColor]}` : ''
        } ${
          studentIsShared() ? `border-l-4 ${theme.borderColor[themeColor]}` : ''
        } roster-row `}>
        {/* STUDENT NAME */}
        <div
          id={`${personAuthID}`}
          onMouseDown={active ? handleRowSelection : undefined}
          draggable={false}
          className={`w-6/10 flex flex-row select-none ${active && activeHoverClass} `}>
          <div
            id={`${personAuthID}`}
            draggable={false}
            title={`${preferredName ? preferredName : firstName} ${lastName}`}
            className={`w-2/3 text-gray-600 overflow-hidden mr-2 flex items-center pointer-events-none text-sm whitespace-pre truncate ... ${
              active && activeHoverClass
            } `}>
            {preferredName ? preferredName : firstName} {lastName}
          </div>

          <div
            id={`${personAuthID}`}
            draggable={false}
            className={`w-1/3 mx-2 flex justify-center items-center pointer-events-none overflow-hidden text-gray-600 text-sm text-center ${
              active && activeHoverClass
            }`}>
            <div id={personAuthID} draggable={false} className={`pointer-events-none`}>
              {studentIsShared() ? frozenPage : getPageLabel(currentLocation)}
            </div>
          </div>
        </div>

        {/* MR SHARE BUTTON */}
        {!isLessonSurvey && hot ? (
          studentIsInLesson() ? (
            anyoneIsShared ? (
              studentIsShared() ? (
                // UNSHARE CURRENTLY SHARED STUDENT
                // <button
                //   id={`${personAuthID}`}
                //   draggable={false}
                //   className={`w-3/10 mx-auto flex items-center text-center  ${
                //     active && activeHoverClass
                //   }`}
                //   onClick={() =>
                //     handleShareStudentData(personAuthID, getPageID(currentLocation))
                //   }>
                //   <span
                //     id={`${personAuthID}`}
                //     className={`${commonShareButtonClass} bg-dark-red hover:bg-red-500 `}>
                //     Unshare
                //   </span>
                // </button>

                <Buttons
                  size="small"
                  btnClass="text-white outline-none  bg-dark-red hover:bg-red-500 w-1/4 ml-4 mr-2"
                  label={'Unshare'}
                  onClick={() =>
                    handleShareStudentData(personAuthID, getPageID(currentLocation))
                  }
                />
              ) : (
                // INACTIVE SHARE BUTTON IF ANY SHARING IS ACTIVE
                disabledShareButton
              )
            ) : (
              // ACTIVE SHARE BUTTON IF NO SHARING IS ACTIVE
              // <button
              //   id={`${personAuthID}`}
              //   data-studentid={personAuthID}
              //   draggable={false}
              //   className={` w-3/10 mx-auto flex items-center text-center  ${
              //     active && activeHoverClass
              //   }`}
              //   onClick={() =>
              //     handleShareStudentData(personAuthID, getPageID(currentLocation))
              //   }>
              //   <span
              //     className={`${commonShareButtonClass} bg-green-500 hover:bg-green-400`}>
              //     Share
              //   </span>
              // </button>

              <Buttons
                size="small"
                btnClass="text-white outline-none w-1/4 ml-4 mr-2"
                label={'Share'}
                greenBtn
                onClick={() =>
                  handleShareStudentData(personAuthID, getPageID(currentLocation))
                }
              />
            )
          ) : null
        ) : (
          // INACTIVE SHARE BUTTON IF LESSON IS SURVEY
          disabledShareButton
        )}

        {/* INFO BUTTON */}

        <div
          id={`${personAuthID}`}
          draggable={false}
          className={`w-auto flex items-center text-center ${active && activeHoverClass}`}
          onClick={() =>
            handleShareStudentData(personAuthID, getPageID(currentLocation))
          }>
          <div className={`dot-menu transition duration-150`}>
            <DotMenu
              menuItems={[
                {
                  label: 'Profile',
                  action: () =>
                    handleToggleRightView({view: 'profile', option: personAuthID})
                },
                {
                  label: 'Attendance',
                  action: () =>
                    handleToggleRightView({view: 'attendance', option: studentID})
                }
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RosterRow;
