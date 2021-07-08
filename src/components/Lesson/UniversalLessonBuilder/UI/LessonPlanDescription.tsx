import {remove} from 'lodash';
import React, {useContext, useState} from 'react';
import {FaEdit, FaTrashAlt} from 'react-icons/fa';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import useDictionary from '../../../../customHooks/dictionary';
import {useQuery} from '../../../../customHooks/urlParam';
import {PaperClipIcon} from '@heroicons/react/solid';

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

  const Description = () => {
    return (
      <div className="bg-white overflow-hidden sm:rounded-lg max-w-256">
        {/* <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Page Overview</h3>
        </div> */}
        <div className="px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="bg-gray-100 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['PAGE_TITLE']}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {activePageData.title}
              </dd>
            </div>
            <div className="bg-white py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['PLAN_LABEL']}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {activePageData.label}
              </dd>
            </div>
            <div className="bg-gray-100 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['DESCRIPTION']}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {activePageData.description || '-'}
              </dd>
            </div>
            <div className="bg-white py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['ESTIMATED_TIME']}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {activePageData.estTime ? `${activePageData.estTime} min` : '-'}
              </dd>
            </div>
          </dl>
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

  return (
    <Description />
    // <div>
    //   <div className="flex">
    //     <h3 className={`text-base leading-6 font-medium ${themeTextColor} pb-4`}>
    //       Page Overview
    //     </h3>
    //     <div className="inline-flex justify-end">
    //       <div
    //         className="w-6 h-6 mr-2 cursor-pointer relative"
    //         onClick={handleEditPageDetail}>
    //         <FaEdit color={lessonPageTheme === 'light' ? 'black' : 'white'} />
    //       </div>
    //       <div className="w-6 h-6 cursor-pointer relative" onClick={onDeleteButtonClick}>
    //         <FaTrashAlt color={lessonPageTheme === 'light' ? 'black' : 'white'} />
    //       </div>
    //     </div>
    //   </div>
    //   <div
    //     className={`rounded-lg ${
    //       lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-light-gray'
    //     } border-light-gray p-2`}>
    //     {/* <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
    //       <span className="text-gray-900 mr-2">
    //         {' '}
    //         {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['ID']}:
    //       </span>
    //       <span className="whitespace-nowrap overflow-ellipsis overflow-hidden">
    //         {activePageData.id}
    //       </span>
    //     </p> */}
    //     <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
    //       <span className="text-gray-900 mr-2">
    //         {' '}
    //         {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['PAGE_TITLE']}:
    //       </span>
    //       <span className="whitespace-nowrap overflow-ellipsis overflow-hidden">
    //         {activePageData.title}
    //       </span>
    //     </p>
    //     <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
    //       <span className="text-gray-900 mr-2">
    //         {' '}
    //         {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['PLAN_LABEL']}:
    //       </span>
    //       <span className="whitespace-nowrap overflow-ellipsis overflow-hidden">
    //         {activePageData.label}
    //       </span>
    //     </p>
    //     <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
    //       <span className="text-gray-900 mr-2">
    //         {' '}
    //         {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['DESCRIPTION']}:
    //       </span>
    //       <span className="whitespace-nowrap overflow-ellipsis overflow-hidden">
    //         {activePageData.description || '-'}
    //       </span>
    //     </p>
    //     <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
    //       <span className="text-gray-900 mr-2">
    //         {' '}
    //         {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['ESTIMATED_TIME']}:
    //       </span>
    //       <span className="">
    //         {activePageData.estTime ? `${activePageData.estTime} min` : '-'}
    //       </span>
    //     </p>
    //   </div>
    // {show && (
    //   <ModalPopUp
    //     message={message}
    //     closeAction={closeAction}
    //     saveLabel={LessonBuilderDict[userLanguage]['BUTTON']['DELETE']}
    //     saveAction={() => deleteLessonPlan(activePageData.id)}
    //   />
    // )}
    // </div>
  );
};

export default LessonPlanDescription;
