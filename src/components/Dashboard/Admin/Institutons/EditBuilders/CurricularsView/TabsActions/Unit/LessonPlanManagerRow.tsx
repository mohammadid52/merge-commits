import {DeleteActionBtn} from '@components/Atoms/Buttons/DeleteActionBtn';
import {GlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import React, {useContext, useState} from 'react';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {HiOutlineTrash} from 'react-icons/hi';
import {useHistory, useRouteMatch} from 'react-router-dom';

interface ILessonPlanManagerRowProps {
  index: number;
  lessonObject: any;
  syllabusObject?: any;
  checkIfRemovable?: any;
  handleToggleDelete?: any;
  gotoLessonBuilder?: any;
}

const LessonPlanManagerRow = ({
  index,
  lessonObject,
  syllabusObject,
  checkIfRemovable,
  handleToggleDelete,
  gotoLessonBuilder,
}: ILessonPlanManagerRowProps) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {LessonsListDict} = useDictionary(clientKey);

  return (
    <>
      <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4">
        {index + 1}.
      </div>
      <div
        className="flex w-2/10 items-center px-8 py-3 text-left text-s leading-4 font-medium whitespace-normal cursor-pointer"
        onClick={() => gotoLessonBuilder(lessonObject.id, lessonObject.type)}>
        {lessonObject.title || '--'}
      </div>
      <div className="flex w-1/10 items-center px-8 py-3 text-left text-s text-gray-500 leading-4 font-medium whitespace-normal cursor-pointer">
        {lessonObject.type || '--'}
      </div>
      <div className="flex w-3/10 items-center px-8 py-3 text-left text-s leading-4 font-medium whitespace-normal text-gray-500">
        {lessonObject?.measurements?.length > 0
          ? lessonObject?.measurements?.map((rubric: any, index: number) =>
              index === lessonObject?.measurements?.length - 1
                ? rubric?.rubric?.name + '.'
                : rubric?.rubric?.name + ', '
            )
          : '-'}
      </div>

      {checkIfRemovable(lessonObject, syllabusObject) ? (
        <span
          className={`w-1/10 flex items-center justify-center text-left px-8 py-3 cursor-pointer`}
          onClick={() => handleToggleDelete(lessonObject.name, lessonObject)}>
          {/* <DeleteActionBtn
            handleClick={() => handleToggleDelete(lessonObject.name, lessonObject)}
          /> */}
          <p className=" text-center text-red-500 hover:text-red-400  text-xs">Delete</p>
        </span>
      ) : (
        <span
          className={`relative w-1/10 flex text-gray-500 items-center justify-center text-left px-8 py-3`}
          onClick={() => {}}>
          {/* <HiOutlineTrash className="w-4 h-4 pointer-events-none" /> */}
          <p className="text-center  text-gray-500 text-xs">
            Delete {LessonsListDict[userLanguage]['NO_DELETE']}
          </p>
        </span>
      )}
    </>
  );
};

export default LessonPlanManagerRow;
