import React, {Fragment, useContext} from 'react';
import {useHistory} from 'react-router';

import PageWrapper from '../../../../Atoms/PageWrapper';
import Buttons from '../../../../Atoms/Buttons';
import {getAsset} from '../../../../../assets';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import Tooltip from '../../../../Atoms/Tooltip';

interface LessonPlansListProps {
  lessonId: string;
  universalLessonDetails: any;
}

const LessonPlansList = ({lessonId, universalLessonDetails}: LessonPlansListProps) => {
  const history = useHistory();
  const {clientKey, theme, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {LessonBuilderDict} = useDictionary(clientKey);

  const pages = universalLessonDetails?.lessonPlan || [];

  const addNewLessonPlan = () => {
    history.push(`/dashboard/universal-lesson-builder`);
  };

  // const editCurrentCurricular = (id: string) => {
  //   history.push(`/dashboard/manage-institutions/${instId}/curricular?id=${id}`);
  // };

  return (
    <div className="pt-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper defaultClass="">
          {/* <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">
            Lesson Plans
          </h3> */}
          {pages.length > 0 ? (
            <Fragment>
              <div className="flex justify-end w-full m-auto ">
                <Buttons
                  btnClass="mx-4"
                  label={LessonBuilderDict[userLanguage]['BUTTON']['ADD_PLAN']}
                  onClick={addNewLessonPlan}
                />
              </div>
              <div className="flex justify-between w-full m-auto px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>
                    {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['ID']}
                  </span>
                </div>
                <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>
                    {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['PAGE_TITLE']}
                  </span>
                </div>
                <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>
                    {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['PLAN_LABEL']}
                  </span>
                </div>
                <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>
                    {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['DESCRIPTION']}
                  </span>
                </div>
                <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>
                    {
                      LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN'][
                        'ESTIMATED_TIME'
                      ]
                    }
                  </span>
                </div>
                <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>
                    {
                      LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN'][
                        'ACTION'
                      ]
                    }
                  </span>
                </div>
              </div>

              <div className="mb-8 w-full m-auto max-h-88 overflow-y-auto">
                {pages.map((page:any, index:number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                    <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">
                      {page.id}
                    </div>
                    <div className="flex w-6/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                      {page.title || '-'}
                    </div>
                    <div className="flex w-3/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                      {page.label || '-'}
                    </div>
                    <div className="flex w-3/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                      -
                    </div>
                    <div className="flex w-3/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                      45 Min
                    </div>
                    <span
                      className={`w-3/10 h-6 flex items-center text-left px-8 py-3 cursor-pointer ${theme.textColor[themeColor]}`}
                      // onClick={() => editCurrentCurricular(page.id)}
                      >
                      <Tooltip text="View Lesson details" placement="left">
                        {LessonBuilderDict[userLanguage]['BUTTON']['VIEW']}
                      </Tooltip>
                    </span>
                  </div>
                ))}
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="flex justify-center mt-8">
                <Buttons
                  btnClass="mx-4"
                  label={LessonBuilderDict[userLanguage]['BUTTON']['ADD']}
                  onClick={addNewLessonPlan}
                />
              </div>
              <p className="text-center p-16">
                {' '}
                {/* {InstitueCurriculam[userLanguage]['INFO']} */}
              </p>
            </Fragment>
          )}
        </PageWrapper>
      </div>
    </div>
  );
};

export default LessonPlansList;
