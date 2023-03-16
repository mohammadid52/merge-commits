import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import React from 'react';
import {FaBook} from 'react-icons/fa';
import {useHistory} from 'react-router';
import {DashboardProps} from '../Dashboard';

import Buttons from 'atoms/Buttons';
import {Syllabus} from '@interfaces/ClassroomInterface';

const SyllabusSwitch = ({
  classRoomActiveSyllabus,
  curriculumName,
  activeRoom,

  syllabusLoading,
  handleSyllabusActivation,
  institutionId,
  syllabusActivating
}: DashboardProps) => {
  const history = useHistory();
  const {state} = useGlobalContext();
  const {classRoomDict, userLanguage} = useDictionary();

  return (
    <>
      {syllabusLoading ? (
        <div className="relative rounded-lg flex mb-8">
          <div className="animate-pulse space-y-8 flex flex-col">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-2`}>
              <div className={'h-12 bg-gray-400 rounded-lg'} />
              <div className={'h-12 bg-gray-400 rounded-lg'} />
            </div>
          </div>
        </div>
      ) : state.roomData?.syllabus?.length ? (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-2`}>
          {state.roomData.syllabus.map((syllabus: Syllabus, i: number) => {
            const isActive = classRoomActiveSyllabus === syllabus.id;

            return (
              <div
                id={`testSyllabus_${i}`}
                className={`${
                  isActive
                    ? 'pointer-events-none iconoclast:bg-500 curate:bg-500'
                    : 'pointer-events-auto bg-white'
                } flex relative flex-col transition-all rounded-xl customShadow hover:theme-card-shadow justify-center items-center h-full`}>
                <div className={`flex justify-between items-center p-4`}>
                  <div className="flex items-center">
                    <span className={`w-auto ${isActive ? 'text-white' : 'theme-text'} `}>
                      <FaBook className="w-6 h-6" />
                    </span>
                    <span
                      className={`text-sm 2xl:text-base ${
                        isActive ? 'text-white' : 'text-gray-900'
                      } font-medium pl-4`}>
                      {syllabus.name}
                    </span>
                  </div>

                  {!isActive && (
                    <Buttons
                      greenBtn={isActive}
                      loading={syllabusActivating}
                      btnClass="ml-2"
                      onClick={() => handleSyllabusActivation?.(syllabus.id)}
                      label={'Select'}
                    />
                  )}
                </div>
              </div>
              // </Tooltip>
            );
          })}
        </div>
      ) : (
        <div>
          No units or lessons have been created for {curriculumName}. Please complete
          curriculum set up to continue.
          <div className="flex justify-center">
            <Buttons
              label="Go to Curriculum"
              btnClass="mr-4 mt-4"
              onClick={() =>
                history.push(
                  `/dashboard/manage-institutions/institution?id=${institutionId}&tab=curricular`
                )
              }
            />
          </div>
        </div>
      )}

      {!syllabusLoading ? (
        activeRoom === '' ? (
          <div className={`py-4 px-6 bg-white rounded-lg shadow`}>
            <p>⬅️ {classRoomDict[userLanguage].MESSAGES.SELECT_SYLLABUS}...</p>
          </div>
        ) : (
          activeRoom !== '' &&
          !state.roomData?.syllabus?.length && (
            <div className={`py-4 px-6 bg-white rounded-lg shadow`}>
              <p>⬅️ {classRoomDict[userLanguage].MESSAGES.SELECT_SYLLABUS}...</p>
            </div>
          )
        )
      ) : null}
    </>
  );
};

export default SyllabusSwitch;
