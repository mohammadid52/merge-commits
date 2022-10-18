import React, {useContext} from 'react';
import {FaBook} from 'react-icons/fa';
import {useHistory} from 'react-router';
import {DashboardProps} from '../Dashboard';
import {Syllabus} from './Classroom';
import {GlobalContext, useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {getAsset} from 'assets';

import Buttons from 'atoms/Buttons';
// import ProgressBar from './ProgressBar';

const SyllabusSwitch = ({
  classRoomActiveSyllabus,
  curriculumName,
  activeRoom,
  currentPage,
  syllabusLoading,
  handleSyllabusActivation,
  institutionId
}: DashboardProps) => {
  const history = useHistory();
  const {state, theme, clientKey, userLanguage} = useGlobalContext();
  const {classRoomDict} = useDictionary(clientKey);

  return (
    <>
      {syllabusLoading ? (
        <div className="relative shadow rounded-lg flex mb-8">
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
            // const progressPercentage = completedLessons;
            return (
              <div
                key={`testSyllabus_${i}`}
                id={`testSyllabus_${i}`}
                className={`flex relative flex-col ${
                  classRoomActiveSyllabus === syllabus.id ? 'bg-white' : 'bg-gray-400'
                } rounded-lg shadow justify-center items-center`}>
                <div className={`flex justify-between p-2`}>
                  <div className="flex items-center">
                    <span className="w-auto">
                      <FaBook className="w-6 h-6" />
                    </span>
                    <span className={`text-sm 2xl:text-base text-darker-gray pl-2`}>
                      {syllabus.name}
                    </span>
                  </div>

                  {classRoomActiveSyllabus !== syllabus.id ? (
                    <div
                      className={`${theme.btn.iconoclastIndigo} text-center rounded-lg cursor-pointer text-sm 2xl:text-base hover:text-white transition-all w-24 py-1 duration-150`}
                      onClick={() => handleSyllabusActivation(syllabus.id)}>
                      Select
                    </div>
                  ) : (
                    <div
                      className={`w-24 rounded-lg py-1 flex justify-center  items-center text-base bg-green-400 text-white font-semibold`}>
                      Active
                    </div>
                  )}
                </div>
                {/* <ProgressBar progressPercentage={60} /> */}
              </div>
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
