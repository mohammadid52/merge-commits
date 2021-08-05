import React, {useContext} from 'react';
import {FaBook} from 'react-icons/fa';
import {DashboardProps} from '../Dashboard';
import {Syllabus} from './Classroom';
import {GlobalContext} from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';
import {getAsset} from '../../../assets';

const SyllabusSwitch = (props: DashboardProps) => {
  const {
    classRoomActiveSyllabus,
    activeRoom,
    currentPage,
    syllabusLoading,
    handleSyllabusActivation,
  } = props;
  const {state, theme, clientKey, userLanguage} = useContext(GlobalContext);
  const {classRoomDict} = useDictionary(clientKey);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const getBG = (theme = 'indigo') => {
    return `text-${theme}-500 hover:bg-${theme}-400`;
  };
  
  return (
    <>
      {syllabusLoading && !(state.roomData?.syllabus?.length > 0) ? (
        <div
          className={`shadow text-center bg-white rounded-lg p-6 ${theme.elem.textDark}`}>
          Loading units...
        </div>
      ) : null}

      <div className={`grid grid-cols-3 md:grid-cols-2 gap-2`}>
        {!syllabusLoading && state.roomData?.syllabus?.length > 0
          ? state.roomData.syllabus.map((syllabus: Syllabus, i: number) => {
              return (
                <div
                  key={`testSyllabus_${i}`}
                  id={`testSyllabus_${i}`}
                  className={`flex relative flex-col ${classRoomActiveSyllabus === syllabus.id ? 'bg-white' : 'bg-gray-400'} rounded-lg shadow justify-center items-center`}>
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
