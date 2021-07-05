import {remove} from 'lodash';
import React, {useContext, useState} from 'react';
import {FaEdit, FaTrashAlt} from 'react-icons/fa';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import useDictionary from '../../../../customHooks/dictionary';
import {useQuery} from '../../../../customHooks/urlParam';

import ModalPopUp from '../../../Molecules/ModalPopUp';
import {useHistory} from 'react-router';
import {updateLessonPageToDB} from '../../../../utilities/updateLessonPageToDB';

const LessonPlanDescription = ({activePageData = {}, setEditModal}: any) => {
  const {
    clientKey,
    state: {lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {}},
    userLanguage,
  } = useContext(GlobalContext);
  const {LessonBuilderDict} = useDictionary(clientKey);
  const {universalLessonDetails, setUniversalLessonDetails} = useULBContext();
  const params = useQuery(location.search);
  const history = useHistory();

  const lessonId = params.get('lessonId');
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
  const deleteLessonPlan = async (id: string) => {
    remove(universalLessonDetails.lessonPlan, (item: any) => item.id === id);
    setUniversalLessonDetails({...universalLessonDetails});
    const input = {
      id: lessonId,
      lessonPlan: [...universalLessonDetails.lessonPlan],
    };
    closeAction();
    history.goBack();
    await updateLessonPageToDB(input);
  };

  return (
    <div>
      <div className="flex">
        <h3 className={`text-base leading-6 font-medium ${themeTextColor} pb-4`}>
          Page Overview
        </h3>
        <div className="inline-flex justify-end">
          <div
            className="w-6 h-6 mr-2 cursor-pointer relative"
            onClick={handleEditPageDetail}>
            <FaEdit color={lessonPageTheme === 'light' ? 'black' : 'white'} />
          </div>
          <div className="w-6 h-6 cursor-pointer relative" onClick={onDeleteButtonClick}>
            <FaTrashAlt color={lessonPageTheme === 'light' ? 'black' : 'white'} />
          </div>
        </div>
      </div>
      <div
        className={`rounded-lg ${
          lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-light-gray'
        } border-light-gray p-2`}>
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
          saveAction={() => deleteLessonPlan(activePageData.id)}
        />
      )}
    </div>
  );
};

export default LessonPlanDescription;
