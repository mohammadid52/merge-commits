import React, {Fragment, useContext} from 'react';
import {useHistory} from 'react-router';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import * as mutations from '../../../../../graphql/mutations';
import {graphqlOperation, API} from 'aws-amplify';

import PageWrapper from '../../../../Atoms/PageWrapper';
import Buttons from '../../../../Atoms/Buttons';
import Tooltip from '../../../../Atoms/Tooltip';

import {getAsset} from '../../../../../assets';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
import useDictionary from '../../../../../customHooks/dictionary';

interface LessonPlansListProps {
  lessonId: string;
  universalLessonDetails: any;
}

const LessonPlansList = ({lessonId, universalLessonDetails}: LessonPlansListProps) => {
  const history = useHistory();
  const {clientKey, theme, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {LessonBuilderDict} = useDictionary(clientKey);
  const {setPreviewMode, updateMovableList} = useULBContext();

  const pages =
    universalLessonDetails.id === lessonId
      ? universalLessonDetails?.lessonPlan || []
      : [];

  const addNewLessonPage = () => {
    history.push(
      `/dashboard/lesson-builder/lesson/page-builder?lessonId=${lessonId}&isNewPage=${true}`
    );
  };

  const addNewLessonPlan = () => {
    history.push(
      `/dashboard/lesson-builder/lesson/add/lesson-plan?lessonId=${lessonId}&isNewPage=${true}`
    );
  };

  const editLessonPage = (id: string) => {
    setPreviewMode(false);
    history.push(
      `/dashboard/lesson-builder/lesson/page-builder?lessonId=${lessonId}&pageId=${id}`
    );
  };

  const lessonPagePreview = (id: string) => {
    setPreviewMode(true);
    history.push(
      `/dashboard/lesson-builder/lesson/page-builder?lessonId=${lessonId}&pageId=${id}`
    );
  };

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(pages);

    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateMovableList(items, 'page');
  };

  return (
    <div className="flex m-auto justify-center">
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
                  onClick={addNewLessonPage}
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
                    {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['ACTION']}
                  </span>
                </div>
              </div>

              <div className="mb-8 w-full m-auto max-h-88 overflow-y-auto">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="partContent">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {pages.map((page: any, index: number) => (
                          <Draggable
                            draggableId={`${page.id}`}
                            index={index}
                            key={`${page.id}`}>
                            {(provided) => (
                              <div
                                key={index}
                                className="flex justify-between items-center w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}>
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
                                  className={`w-3/10 h-6 flex items-center text-left px-8 py-3 cursor-pointer ${theme.textColor[themeColor]}`}>
                                  <span onClick={() => lessonPagePreview(page.id)}>
                                    <Tooltip text="Preview Page" placement="left">
                                      {
                                        LessonBuilderDict[userLanguage]['BUTTON'][
                                          'PREVIEW'
                                        ]
                                      }
                                    </Tooltip>
                                  </span>
                                  &nbsp;|&nbsp;
                                  <span onClick={() => editLessonPage(page.id)}>
                                    <Tooltip text="Edit page" placement="left">
                                      {LessonBuilderDict[userLanguage]['BUTTON']['EDIT']}
                                    </Tooltip>
                                  </span>
                                </span>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="flex justify-center my-4">
                <Buttons
                  btnClass="mx-4"
                  label={LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['BUTTON']}
                  onClick={addNewLessonPlan}
                />
              </div>
            </Fragment>
          )}
        </PageWrapper>
      </div>
    </div>
  );
};

export default LessonPlansList;
