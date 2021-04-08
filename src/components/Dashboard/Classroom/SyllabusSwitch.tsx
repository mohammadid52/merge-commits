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
                  className={`flex flex-col bg-white rounded-lg shadow py-4 justify-center items-center`}>
                  <div className={``}>
                    <p className={`text-sm text-darker-gray text-center`}>
                      <b>Unit Name: </b>
                    </p>
                    <p className={`text-xl my-2 text-darker-gray text-center`}>{syllabus.name}</p>
                  </div>

                  {!syllabus.active ? (
                    <div
                      className="text-center cursor-pointer text-base text-indigo-500 hover:bg-indigo-400 hover:text-white transition-all font-semibold w-auto py-0 px-2 rounded-md duration-300"
                      onClick={() => handleSyllabusActivation(syllabus.id)}>
                      Activate
                    </div>
                  ) : (
                    <div className={`w-full flex justify-center items-center text-base text-green-400 font-semibold`}>
                      Active
                    </div>
                  )}
                </div>
              );
            })
          : null}
      </div>

      {activeRoom === '' ? (
        <div className={`${theme.dashboard.card} ${theme.elem.textDark}`}>
          ⬅️ {classRoomDict[userLanguage].MESSAGES.SELECT_SYLLABUS}...
        </div>
      ) : null}

      {activeRoom !== '' && !syllabusLoading && state.roomData?.syllabus?.length === 0 ? (
        <div className={`${theme.dashboard.card} ${theme.elem.textDark}`}>
          {classRoomDict[userLanguage].MESSAGES.NO_SYLLABUS}...
        </div>
      ) : null}
    </>
  );
};

export default SyllabusSwitch;
