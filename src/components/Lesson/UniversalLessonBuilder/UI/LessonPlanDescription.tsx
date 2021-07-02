import React, {useContext, useState} from 'react';
import {FaEdit, FaTrashAlt} from 'react-icons/fa';

import {GlobalContext} from '../../../../contexts/GlobalContext';
import useDictionary from '../../../../customHooks/dictionary';

import ModalPopUp from '../../../Molecules/ModalPopUp';

const LessonPlanDescription = ({activePageData = {}, setEditModal}: any) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {LessonBuilderDict} = useDictionary(clientKey);
  const [confirmationConfig, setConfirmationConfig] = useState<{
    show: boolean;
    message: string;
    saveAction?: () => void;
  }>({
    show: false,
    message: '',
  });
  const onDeleteButtonClick = () => {
    setConfirmationConfig({
      message:
        'Are you sure you want to delete the this page? All of your data will be permanently removed. This action cannot be undone.',
      show: true,
    });
  };
  const closeAction = () => {
    setConfirmationConfig({
      message: '',
      show: false,
    });
  };
  const handleEditPageDetail = () => {
    setEditModal({
      show: true,
      content: {
        id: activePageData.id,
        title: activePageData.title,
        description: activePageData.description,
        label: activePageData.label,
        estTime: activePageData.estTime,
      },
      editOnlyId: false,
    });
  };
  const {message = '', show = false} = confirmationConfig;
  return (
    <div>
      <div className="flex">
        <h3 className="text-base leading-6 font-medium text-white pb-4 ">
          Page Overview
        </h3>
        <div className="inline-flex justify-end">
          <FaEdit
            className="w-6 h-6 mr-2 cursor-pointer"
            color={'white'}
            onClick={handleEditPageDetail}
          />
          <FaTrashAlt
            className="w-6 h-6 cursor-pointer"
            color={'white'}
            onClick={onDeleteButtonClick}
          />
        </div>
      </div>
      <div className="rounded-lg bg-light-gray border-light-gray p-2">
        {/* <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
          <span className="text-gray-900 mr-2">
            {' '}
            {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['ID']}:
          </span>
          <span className="whitespace-nowrap overflow-ellipsis overflow-hidden">
            {activePageData.id}
          </span>
        </p> */}
        <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
          <span className="text-gray-900 mr-2">
            {' '}
            {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['PAGE_TITLE']}:
          </span>
          <span className="whitespace-nowrap overflow-ellipsis overflow-hidden">
            {activePageData.title}
          </span>
        </p>
        <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
          <span className="text-gray-900 mr-2">
            {' '}
            {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['PLAN_LABEL']}:
          </span>
          <span className="whitespace-nowrap overflow-ellipsis overflow-hidden">
            {activePageData.label}
          </span>
        </p>
        <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
          <span className="text-gray-900 mr-2">
            {' '}
            {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['DESCRIPTION']}:
          </span>
          <span className="whitespace-nowrap overflow-ellipsis overflow-hidden">
            {activePageData.description || '-'}
          </span>
        </p>
        <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
          <span className="text-gray-900 mr-2">
            {' '}
            {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['ESTIMATED_TIME']}:
          </span>
          <span className="">
            {activePageData.estTime ? `${activePageData.estTime} min` : '-'}
          </span>
        </p>
      </div>
      {show && (
        <ModalPopUp
          message={message}
          closeAction={closeAction}
          saveLabel={LessonBuilderDict[userLanguage]['BUTTON']['DELETE']}
        />
      )}
    </div>
  );
};

export default LessonPlanDescription;
