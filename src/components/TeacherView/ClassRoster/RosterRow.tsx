import Buttons from '@components/Atoms/Buttons';
import Tooltip from '@components/Atoms/Tooltip';
import LocationBadge from '@components/Dashboard/Admin/Institutons/EditBuilders/LocationBadge';
import {API, graphqlOperation} from 'aws-amplify';
import * as customSubscriptions from 'customGraphql/customSubscriptions';

import {formatPageName} from '@components/Dashboard/Admin/UserManagement/List';
import {UserPageState} from 'API';
import {useGlobalContext} from 'contexts/GlobalContext';
import React, {useEffect, useState} from 'react';
import {MdOutlineScreenShare, MdOutlineStopScreenShare} from 'react-icons/md';
import {VscScreenFull} from 'react-icons/vsc';
import DotMenu from './RosterRow/DotMenu';
import {IRosterSectionProps} from './RosterSection';

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
  personEmail: string;
}

const RosterRow: React.FC<RosterRowProps> = ({
  number,
  personAuthID,
  kickoutStudent,
  removing,

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
  handleResetViewAndShare,
  handleToggleRightView,
  personEmail,
  hot,
  setRecordPrevPage,
  recordPrevPage
}: RosterRowProps) => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //
  const gContext = useGlobalContext();
  const lessonState = gContext.lessonState;
  const controlState = gContext.controlState;

  const {lessonData, displayData, currentPage} = lessonState;

  // ##################################################################### //
  // ########################### SHARING CHECKS ########################## //
  // ##################################################################### //

  const isLessonSurvey = lessonData?.type === 'survey';
  const anyoneIsShared = displayData[0].studentAuthID !== '';

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

  const handleRowSelection = () => {
    if (studentIsShared()) {
      handleShareStudentData?.(personAuthID, getPageID(currentLocation));
      handleViewStudentData?.(personAuthID);
      handlePageChange(parseInt(currentLocation));
    } else {
      if (lessonData?.type !== 'survey') {
        handleViewStudentData?.(personAuthID);
      }
      if (!studentIsViewed()) {
        setRecordPrevPage?.(currentPage);
        handlePageChange(parseInt(currentLocation));
      } else {
        handlePageChange(recordPrevPage);
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

  const unshareScreen = () => {
    // handleViewStudentData?.(personAuthID);

    handleResetViewAndShare?.();
    handlePageChange(recordPrevPage);
  };

  const shareScreen = async () => {
    handleViewStudentData?.(personAuthID);
    handleShareStudentData?.(personAuthID, getPageID(currentLocation));
  };

  // ##################################################################### //
  // ######################### VISUAL LOGIC ETC. ######################### //
  // ##################################################################### //

  const getPageLabel = (locationIndex: string) => {
    if (lessonData && lessonData?.lessonPlan) {
      if (locationIndex === '') {
        return '--';
      } else {
        return lessonData.lessonPlan[parseInt(locationIndex)]?.label;
      }
    }
  };

  const getPageID = (locationIndex: string) => {
    if (lessonData && lessonData?.lessonPlan) {
      if (locationIndex === '') {
        return 'n/a';
      } else {
        return lessonData.lessonPlan[parseInt(locationIndex)]?.id;
      }
    }
  };

  const activeHoverClass = 'hover:font-semibold cursor-pointer';
  const inactiveTextClass = 'text-gray-600 text-opacity-20';

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  const disabledShareButton = (
    <Buttons size="small" transparent Icon={MdOutlineScreenShare} disabled />
  );

  const active = false;

  const ifHotAndInLesson = studentIsInLesson() ? (
    anyoneIsShared ? (
      studentIsShared() ? (
        <Buttons
          size="small"
          Icon={MdOutlineStopScreenShare}
          greenBtn
          onClick={() => {
            // terminateSound.play();
            unshareScreen();
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
        transparent={!studentIsViewed()}
        Icon={MdOutlineScreenShare}
        onClick={shareScreen}
      />
    ) : (
      <Tooltip show={true} placement="left" text="view student screen first">
        {disabledShareButton}
      </Tooltip>
    )
  ) : null;

  let subscribe: any;

  const [localPageState, setLocalPageState] = useState({
    pageState: UserPageState.NOT_LOGGED_IN,
    lastPageStateUpdate: new Date().toISOString()
  });

  const subscribeToLocation = () => {
    const personLocationSub = API.graphql(
      graphqlOperation(customSubscriptions.onUpdatePerson, {
        authId: personAuthID
      })
      //@ts-ignore
    ).subscribe({
      next: (locationData: any) => {
        const updatedStudent = locationData.value.data.onUpdatePerson;
        if (updatedStudent) {
          setLocalPageState({
            pageState: updatedStudent.pageState,
            lastPageStateUpdate: updatedStudent.lastPageStateUpdate
          });
        }
      }
    });
    return personLocationSub;
  };

  useEffect(() => {
    if (personAuthID) {
      subscribe = subscribeToLocation();
    }
    return () => {
      subscribe.unsubscribe();
    };
  }, []);

  return (
    <>
      {/* <div className="" /> */}
      <div className="roster-row">
        <div
          draggable={false}
          className={`w-full px-4 flex py-2 transition-all duration-300 items-center ${
            active && activeHoverClass
          }  ${!active && inactiveTextClass} ${
            number % 2 === 0 ? 'bg-gray-200 bg-opacity-50' : ''
          } ${
            studentIsViewed()
              ? `theme-card-shadow border-l-4 iconoclast:border-500 curate:border-500 bg-opacity-50 iconoclast:bg-200 curate:bg-200`
              : ''
          } ${
            studentIsShared()
              ? 'border-l-4 border-green-600 bg-opacity-50 bg-green-200'
              : ''
          } ${
            removing === personAuthID
              ? 'bg-opacity-50 pointer-events-none filter blur-sm'
              : ''
          }`}>
          {/* STUDENT NAME */}
          <div
            draggable={false}
            className={`${hot ? 'w-5/10' : 'w-7/10'}  flex flex-row select-none ${
              active && activeHoverClass
            } `}>
            <div
              id={`${personAuthID}`}
              draggable={false}
              title={`${preferredName ? preferredName : firstName} ${lastName}`}
              className={`text-gray-600 overflow-hidden mr-2 flex items-center pointer-events-none text-sm whitespace-pre truncate  ${
                active && activeHoverClass
              } `}>
              {preferredName ? preferredName : firstName} {lastName}{' '}
              <LocationBadge
                style={onDemand ? {} : {fontSize: '.5rem'}}
                customText={onDemand ? 'SP' : 'CLSRM'}
                onDemand={Boolean(onDemand)}
              />
            </div>
          </div>
          <div className={hot ? 'w-3/10 ' : 'w-2/10'}>
            {hot && (
              <div
                draggable={false}
                className={`flex justify-start items-center pointer-events-none overflow-hidden text-gray-600 text-xs text-left ${
                  active && activeHoverClass
                }`}>
                <div
                  id={personAuthID}
                  draggable={false}
                  className={`pointer-events-none`}>
                  {studentIsShared() ? frozenPage : getPageLabel(currentLocation)}
                </div>
              </div>
            )}
          </div>

          <div className={`${hot ? 'w-2.5/10' : 'w-3/10'} flex items-center`}>
            <Buttons
              disabled={!hot}
              variant={
                studentIsShared()
                  ? 'primary'
                  : studentIsInLesson() && !studentIsViewed()
                  ? 'default'
                  : 'primary'
              }
              transparent={!hot}
              greenBtn={studentIsViewed() && !studentIsShared()}
              onClick={handleRowSelection}
              tooltip={
                studentIsViewed()
                  ? 'Cancel viewing student screen'
                  : 'View student screen'
              }
              size="small"
              Icon={VscScreenFull}
            />

            {/* MR SHARE BUTTON */}
            {!isLessonSurvey && hot
              ? ifHotAndInLesson
              : // INACTIVE SHARE BUTTON IF LESSON IS SURVEY
                disabledShareButton}
          </div>

          {/* INFO BUTTON */}

          <div
            id={`${personAuthID}`}
            draggable={false}
            className={`w-auto flex items-center text-center ${
              active && activeHoverClass
            }`}
            onClick={() =>
              handleShareStudentData?.(personAuthID, getPageID(currentLocation))
            }>
            <div className={`dot-menu transition duration-150`}>
              <DotMenu
                extraContent={
                  !hot && (
                    <div className="border-t-0 border-gray-500 mt-1 pt-1 text-sm capitalize text-gray-600 text-center">
                      {formatPageName(localPageState.pageState) || '--'}
                    </div>
                  )
                }
                // @ts-ignore
                menuItems={[
                  {
                    label: 'Profile',
                    action: () =>
                      handleToggleRightView?.({
                        view: 'profile',
                        option: personAuthID
                      })
                  },
                  {
                    label: 'Attendance',
                    action: () =>
                      handleToggleRightView?.({
                        view: 'attendance',
                        option: personAuthID
                      })
                  },
                  hot && {
                    label: 'Remove',
                    action: () => {
                      kickoutStudent?.(personAuthID, personEmail);
                    }
                  }
                ].filter(Boolean)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RosterRow;
