import Buttons from 'atoms/Buttons';
import PageWrapper from 'atoms/PageWrapper';

import {Fragment} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {useHistory} from 'react-router';

import useAuth from '@customHooks/useAuth';
import {UniversalLessonPage} from '@interfaces/UniversalLessonInterfaces';
import {getAsset} from 'assets';
import Loader from 'atoms/Loader';
import {useGlobalContext} from 'contexts/GlobalContext';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import useDictionary from 'customHooks/dictionary';

interface LessonPlansListProps {
  lessonId: string;
  loading: boolean;
  universalLessonDetails: {
    institutionID?: string;
    lessonPlan: UniversalLessonPage[];
  };
}

const LessonPlansList = ({
  lessonId,
  loading,
  universalLessonDetails
}: LessonPlansListProps) => {
  const history = useHistory();
  const {
    clientKey,

    theme,
    userLanguage
  } = useGlobalContext();
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {BUTTONS, LessonBuilderDict} = useDictionary();
  const {setPreviewMode, updateMovableList} = useULBContext();

  const {isSuperAdmin} = useAuth();

  const pages = universalLessonDetails.lessonPlan;

  const addNewLessonPlan = () => {
    history.push(
      isSuperAdmin
        ? `/dashboard/manage-institutions/lessons/${lessonId}/lesson-plan`
        : `/dashboard/manage-institutions/institution/${universalLessonDetails.institutionID}/lessons/${lessonId}/lesson-plan`
    );
  };

  const editLessonPage = (id: string) => {
    setPreviewMode(false);
    history.push(
      isSuperAdmin
        ? `/dashboard/manage-institutions/lessons/${lessonId}/page-builder?pageId=${id}`
        : `/dashboard/manage-institutions/institution/${universalLessonDetails.institutionID}/lessons/${lessonId}/page-builder?pageId=${id}`
    );
  };

  const lessonPagePreview = (id: string) => {
    setPreviewMode(true);
    const baseUrl = isSuperAdmin
      ? '/dashboard/manage-institutions'
      : `/dashboard/manage-institutions/institution/${universalLessonDetails.institutionID}`;
    history.push(`${baseUrl}/lessons/${lessonId}/page-builder?pageId=${id}`);
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
        <PageWrapper defaultClass="px-8">
          {/* <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">
            Lesson Plans
          </h3> */}
          {loading ? (
            <div className="py-20 text-center mx-auto flex justify-center items-center w-full">
              <div className="items-center flex justify-center flex-col">
                <Loader color="rgba(160, 174, 192, 1)" />
                <p className="mt-2 text-center text-lg text-gray-500">
                  {/* @Mohammad TODO: Add this to dictionary  */}
                  Loading Lessons
                </p>
              </div>
            </div>
          ) : pages.length > 0 ? (
            <Fragment>
              <div className="flex justify-end w-full m-auto ">
                <Buttons
                  btnClass="mx-4"
                  label={LessonBuilderDict[userLanguage]['BUTTON']['ADD_PLAN']}
                  onClick={addNewLessonPlan}
                />
              </div>
              <div className="w-full flex justify-between border-b-0 border-gray-200 mt-8">
                <div className="w-1/10 px-4 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>
                    {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['ID']}
                  </span>
                </div>
                <div className="w-6/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>
                    {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['PAGE_TITLE']}
                  </span>
                </div>
                <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>
                    {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['PLAN_LABEL']}
                  </span>
                </div>
                <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>
                    {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['DESCRIPTION']}
                  </span>
                </div>
                <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>
                    {
                      LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN'][
                        'ESTIMATED_TIME'
                      ]
                    }
                  </span>
                </div>
                <div className="w-2/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
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
                                className="flex justify-between bg-white w-full border-b-0 border-gray-200"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}>
                                <div className="w-1/10 flex items-center px-4 py-4 whitespace-normal text-left text-sm leading-5 font-medium">
                                  {'-'}
                                </div>
                                <div className="flex w-6/10 truncate items-center px-8 py-3 text-s leading-4 font-medium whitespace-normal">
                                  {page.title || '-'}
                                </div>
                                <div className="flex w-3/10 items-center px-8 py-3 text-s leading-4 font-medium whitespace-normal">
                                  {page.label || '-'}
                                </div>

                                <div className="flex w-3/10 items-center px-8 py-3 text-s leading-4 font-medium whitespace-normal">
                                  {'-'}
                                </div>

                                <div className="flex w-3/10 items-center px-8 py-3 text-s leading-4 font-medium whitespace-normal">
                                  45 Min
                                </div>
                                <span
                                  className={`w-2/10 flex items-center px-8 py-3 cursor-pointer ${theme.textColor[themeColor]}`}>
                                  <span onClick={() => lessonPagePreview(page.id)}>
                                    {LessonBuilderDict[userLanguage]['BUTTON']['PREVIEW']}
                                  </span>
                                  <span className="flex justify-center">
                                    &nbsp;|&nbsp;
                                  </span>
                                  <span onClick={() => editLessonPage(page.id)}>
                                    {BUTTONS[userLanguage]['DELETE']}
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
              <div className="text-center text-lg text-gray-600 font-medium">
                <p>You don't have any pages</p>
              </div>
              <div className="flex justify-center my-4">
                <Buttons
                  btnClass="mx-4"
                  label={LessonBuilderDict[userLanguage]['BUTTON']['ADD_PLAN']}
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
