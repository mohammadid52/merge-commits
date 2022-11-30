// import {PersonalizeEvents} from 'aws-sdk';
import {getAsset} from 'assets';
import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from 'contexts/GlobalContext';
import DotMenu from './RosterRow/DotMenu';
import {IRosterSectionProps} from './RosterSection';
import Buttons from '@components/Atoms/Buttons';
import useAuth from '@customHooks/useAuth';
import {VscScreenFull} from 'react-icons/vsc';
import {AiOutlineShareAlt} from 'react-icons/ai';
import useSounds from '@customHooks/useSounds';
import LocationBadge from '@components/Dashboard/Admin/Institutons/EditBuilders/LocationBadge';

interface RosterRowProps extends IRosterSectionProps {
  number: number;
  personAuthID: string;

  firstName: string;
  lastName: string;
  preferredName: string;
  role: string;
  currentLocation: string;
  lessonProgress: string;
  hot?: boolean;
  onDemand?: boolean;
}

const RosterRow: React.FC<RosterRowProps> = ({
  number,
  personAuthID,

  firstName,
  lastName,
  preferredName,
  currentLocation,
  handleViewStudentData,
  handleShareStudentData,
  viewedStudent,
  sharedStudent,
  handlePageChange,
  onDemand,
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
  // const [successSound, terminateSound] = useSounds(['success', 'error']);

  const studentIsShared = () => {
    return sharedStudent === personAuthID;
  };

  const studentIsViewed = () => {
    return viewedStudent === personAuthID;
  };

  const handleRowSelection = () => {
    if (lessonState.lessonData?.type !== 'survey') {
      handleViewStudentData(personAuthID);
    }
    if (!studentIsViewed()) {
      // successSound.play();
      handlePageChange(parseInt(currentLocation));
    } else {
      // terminateSound.play();
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

  const disabledShareButton = (
    <Buttons
      size="small"
      btnClass="mx-2"
      iconSize="w-4 h-6"
      Icon={AiOutlineShareAlt}
      disabled
      title="Share screen"
      transparent
      onClick={() => handleShareStudentData(personAuthID, getPageID(currentLocation))}
    />
  );

  const active = false;

  return (
    <>
      {/* <div className="" /> */}
      <div
        draggable={false}
        className={`w-full flex py-2 items-center shadow-sm px-1 ${
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
          draggable={false}
          className={`w-8/10 flex flex-row select-none ${active && activeHoverClass} `}>
          <div
            id={`${personAuthID}`}
            draggable={false}
            title={`${preferredName ? preferredName : firstName} ${lastName}`}
            className={`w-3/4 text-gray-600 overflow-hidden mr-2 flex items-center pointer-events-none text-sm whitespace-pre truncate ... ${
              active && activeHoverClass
            } `}>
            {preferredName ? preferredName : firstName} {lastName}{' '}
            {!hot && onDemand && <LocationBadge customText="SP" onDemand={onDemand} />}
          </div>

          <div
            draggable={false}
            className={`w-1/4 mx-2 flex justify-center items-center pointer-events-none overflow-hidden text-gray-600 text-sm text-center ${
              active && activeHoverClass
            }`}>
            <div id={personAuthID} draggable={false} className={`pointer-events-none`}>
              {!hot && onDemand
                ? null
                : studentIsShared()
                ? frozenPage
                : getPageLabel(currentLocation)}
            </div>
          </div>
        </div>

        <Buttons
          iconSize="w-4 h-6"
          disabled={!hot}
          greenBtn={studentIsViewed()}
          onClick={handleRowSelection}
          title="View student screen"
          size="small"
          Icon={VscScreenFull}
        />

        {/* MR SHARE BUTTON */}
        {!isLessonSurvey && hot ? (
          studentIsInLesson() ? (
            anyoneIsShared ? (
              studentIsShared() ? (
                <Buttons
                  size="small"
                  btnClass="text-white outline-none  bg-dark-red hover:bg-red-500 w-1/4 mx-2"
                  label={'Unshare'}
                  onClick={() => {
                    // terminateSound.play();
                    handleShareStudentData(personAuthID, getPageID(currentLocation));
                  }}
                />
              ) : (
                // INACTIVE SHARE BUTTON IF ANY SHARING IS ACTIVE
                disabledShareButton
              )
            ) : studentIsViewed() ? (
              // ACTIVE SHARE BUTTON IF NO SHARING IS ACTIVE

              <Buttons
                size="small"
                btnClass="text-white outline-none  mx-2"
                iconSize="w-4 h-6"
                Icon={AiOutlineShareAlt}
                transparent={!studentIsShared()}
                onClick={() => {
                  // successSound.play();
                  handleShareStudentData(personAuthID, getPageID(currentLocation));
                }}
              />
            ) : (
              disabledShareButton
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
                    handleToggleRightView({view: 'attendance', option: personAuthID})
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
