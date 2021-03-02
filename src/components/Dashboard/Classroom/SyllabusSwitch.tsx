import React, { useContext } from 'react';
import { DashboardProps } from '../Dashboard';
import { Syllabus } from './Classroom';
import { GlobalContext } from '../../../contexts/GlobalContext';

const SyllabusSwitch = (props: DashboardProps) => {
  const { activeRoom, currentPage, syllabusLoading, handleSyllabusActivation } = props;
  const { state, theme } = useContext(GlobalContext);

  return (
    <>
      {syllabusLoading ? (
        <div className={`${theme.dashboard.card} ${theme.elem.textDark}`}>Loading units...</div>
      ) : null}

      {!syllabusLoading && state.roomData?.syllabus?.length > 0
        ? state.roomData.syllabus.map((syllabus: Syllabus, i: number) => {
            return (
              <div
                key={`testSyllabus_${i}`}
                id={`testSyllabus_${i}`}
                className={`${theme.dashboard.card} ${theme.elem.textDark}`}>
                <div className={``}>
                  <p className={`text-sm text-darker-gray`}><b>Unit Name: </b>{syllabus.name}</p>
                  <p className={`text-sm text-darker-gray`}><b>Description:</b> {syllabus.description}</p>
                </div>

                {!syllabus.active ? (
                  <div
                    className={`w-48 flex justify-center items-center cursor-pointer text-base text-blueberry font-semibold`}
                    onClick={() => handleSyllabusActivation(syllabus.id)}>
                    Activate
                  </div>
                ) : (
                  <div className={`w-48 flex justify-center items-center text-base text-light-gray font-normal`}>
                    Active
                  </div>
                )}
              </div>
            );
          })
        : null}

      {activeRoom === '' ? (
        <div className={`${theme.dashboard.card} ${theme.elem.textDark}`}> ⬅️ Select a classroom to see applicable units ...</div>
      ) : null}

      {activeRoom !== '' && !syllabusLoading && state.roomData?.syllabus?.length === 0 ? (
        <div className={`${theme.dashboard.card} ${theme.elem.textDark}`}>No units...</div>
      ) : null}
    </>
  );
};

export default SyllabusSwitch;
