import React, { useContext, useEffect } from 'react';
import { DashboardProps } from '../Dashboard';
import { Syllabus } from './Classroom';
import { GlobalContext } from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';

const SyllabusSwitch = (props: DashboardProps) => {
  const { activeRoom, currentPage, syllabusLoading, handleSyllabusActivation } = props;
  const { state, theme, clientKey, userLanguage } = useContext(GlobalContext);
  const { classRoomDict } = useDictionary(clientKey);

  return (
    <>
      {syllabusLoading ? (
        <div className={`${theme.dashboard.card} ${theme.elem.textDark}`}>Loading units...</div>
      ) : null}

      <div className={`grid grid-cols-3 gap-2`}>
        {!syllabusLoading && state.roomData?.syllabus?.length > 0
          ? state.roomData.syllabus.map((syllabus: Syllabus, i: number) => {
              return (
                <div
                  key={`testSyllabus_${i}`}
                  id={`testSyllabus_${i}`}
                  className={`flex relative flex-col bg-white rounded-lg shadow py-4 pb-10 justify-center items-center`}>
                  <div className={``}>
                    <p className={`text-sm text-darker-gray text-center`}>
                      <b>Unit Name: </b>
                    </p>
                    <p className={`text-xl my-2 text-darker-gray text-center`}>{syllabus.name}</p>
                  </div>

                  {!syllabus.active ? (
                    <div
                      className="text-center rounded-b-lg absolute bottom-0 left-0 right-0 cursor-pointer text-base text-indigo-500 hover:bg-indigo-400 hover:text-white transition-all font-semibold w-auto py-2 duration-150"
                      onClick={() => handleSyllabusActivation(syllabus.id)}>
                      Activate
                    </div>
                  ) : (
                    <div
                      onClick={() => handleSyllabusActivation(syllabus.id)}
                      className={`w-full absolute rounded-b-lg bottom-0 left-0 right-0 py-2 flex justify-center  items-center text-base bg-green-400 text-white  font-semibold`}>
                      Active
                    </div>
                  )}
                </div>
              );
            })
          : null}
      </div>

      {activeRoom === '' ? (
        <div className={`py-4 px-6 bg-white rounded-lg shadow`}>
          <p>⬅️ {classRoomDict[userLanguage].MESSAGES.SELECT_SYLLABUS}...</p>
        </div>
      ) : null}

      {activeRoom !== '' && !syllabusLoading && state.roomData?.syllabus?.length === 0 ? (
        <div className={`py-4 px-6 bg-white rounded-lg shadow`}>
          {classRoomDict[userLanguage].MESSAGES.NO_SYLLABUS}...
        </div>
      ) : null}
    </>
  );
};

export default SyllabusSwitch;
