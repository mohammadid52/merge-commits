import {remove} from 'lodash';
import React, {Fragment, useContext, useState} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {FaTasks} from 'react-icons/fa';
import {useHistory} from 'react-router';
import {getAsset} from 'assets';
import {GlobalContext} from '@contexts/GlobalContext';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import useDictionary from '@customHooks/dictionary';
import {UniversalLessonPage} from '@interfaces/UniversalLessonInterfaces';
import {updateLessonPageToDB} from '@utilities/updateLessonPageToDB';
import Buttons from '@atoms/Buttons';
import Loader from '@atoms/Loader';
import PageWrapper from '@atoms/PageWrapper';
import Popover from '@atoms/Popover';
import ModalPopUp from '@molecules/ModalPopUp';
import PageBuilderLayout from '@components/Lesson/UniversalLessonBuilder/views/PageBuilderLayout';
import NewLessonPlanSO from '@components/Lesson/UniversalLessonBuilder/UI/SlideOvers/NewLessonPlanSO';

interface LessonPlansListProps {
  lessonId: string;
  lessonName: string;
  loading: boolean;
  universalLessonDetails: {
    institutionID?: string;
    lessonPlan: UniversalLessonPage[];
  };
}

interface PageRowProps {
  index: number;
  page: UniversalLessonPage;
  toggleDeleteModal: (show: boolean, id?: string) => void;
  lessonPagePreview: (id: string, preview?: boolean) => void;
}

const PageRow = ({page, lessonPagePreview, toggleDeleteModal, index}: PageRowProps) => {
  const textClass = `text-sm leading-5  transition-all duration-50 `;
  const [showMenu, setShowMenu] = useState(false);

  const {clientKey, theme, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {BUTTONS, LessonBuilderDict} = useDictionary(clientKey);
  return (
    <Draggable draggableId={`${page.id}`} index={index} key={`${page.id}`}>
      {(provided) => (
        <div
          onClick={() => lessonPagePreview(page.id, false)}
          key={index}
          className="flex justify-between bg-white w-full border-b-0 border-gray-200"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          <div className="flex w-3/10 items-center px-8 py-3 text-sm leading-4 font-medium whitespace-normal">
            {page.label || '-'}
          </div>
          <div className="flex w-5/10 items-center px-8 py-3 text-sm leading-4 whitespace-normal">
            {page.title || '-'}
          </div>
          <div className="flex w-3/10 justify-start items-center px-8 py-3 text-sm leading-4 whitespace-normal">
            {page.interactionType ? page.interactionType.join(', ') : '-'}
          </div>
          <div
            className="flex justify-start flex-col w-4/10 items-center px-8 py-3 text-sm leading-4 whitespace-normal custom-editor-description"
            dangerouslySetInnerHTML={{__html: page.description}}
          />

          <div className="flex w-2/10 justify-start items-center px-8 py-3 text-sm leading-4 whitespace-normal">
            {page.estTime ? `${page.estTime} min` : ''}
          </div>
          <div
            className={`w-1/10 flex items-center px-8 py-3 cursor-pointer ${theme.textColor[themeColor]} text-sm justify-center`}>
            <Popover
              show={showMenu}
              bottom={1.5}
              dir={'top'}
              minWidth={48}
              minHeight={16}
              rounded="lg"
              setShow={setShowMenu}
              content={
                <dl className="grid grid-cols-1 gap-y-3">
                  <div className="col-span-1">
                    <dt
                      onClick={() => lessonPagePreview(page.id)}
                      className={`${textClass} text-gray-800 hover:iconoclast:text-500  hover:curate:text-500`}>
                      {LessonBuilderDict[userLanguage]['BUTTON']['PREVIEW']}
                    </dt>
                  </div>
                  <div className="col-span-1">
                    <dt
                      onClick={() => {
                        setShowMenu(false);
                        toggleDeleteModal(true, page.id);
                      }}
                      className={`${textClass} text-red-500 hover:text-red-600`}>
                      {BUTTONS[userLanguage]['DELETE']}
                    </dt>
                  </div>
                </dl>
              }>
              <span className="h-6 w-6 flex items-center justify-center p-1 hover:bg-gray-200 transition-all cursor-pointer rounded-full">
                <BiDotsVerticalRounded
                  title="show menu"
                  className="h-full w-full text-lg text-gray-500"
                />
              </span>
            </Popover>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const LessonActivities = ({
  lessonId,
  lessonName,
  loading,
  universalLessonDetails,
}: LessonPlansListProps) => {
  const history = useHistory();
  const {clientKey, theme, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {LessonBuilderDict} = useDictionary(clientKey);
  const {
    newLessonPlanShow,
    setNewLessonPlanShow,
    setPreviewMode,
    setUniversalLessonDetails,
    setEditMode,
    updateMovableList,
    setLessonPlanFields,
  } = useULBContext();
  const [showDeleteModal, setShowDeleteModal] = useState<Boolean>(false);
  const [idToBeRemoved, setIdToBeRemoved] = useState<string>('');

  const pages = universalLessonDetails.lessonPlan;

  const addNewLessonPlan = () => {
    /**
     * Removed the áutomatic pushes to the BUILDER,
     * opening the new slide-in dialog within the 'BuilderWrapper
     */
    setNewLessonPlanShow(!newLessonPlanShow);
    setEditMode(false);
    setLessonPlanFields({
      title: '',
      label: '',
      instructions: '',
      instructionsHtml: '',
      description: '', // ignore this field
      interactionType: [],
      tags: [],
      estTime: '1 min',
      classwork: true,
    });
    // history.push(
    //   `/dashboard/lesson-builder/lesson/page-builder?lessonId=${lessonId}&pageId=open-overlay`
    // );
    // history.push(
    //   `/dashboard/lesson-builder/lesson/add/lesson-plan?lessonId=${lessonId}&isNewPage=${true}`
    // );
  };

  const lessonPagePreview = (id: string, preview: boolean = true) => {
    setPreviewMode(preview);
    history.push(
      `/dashboard/manage-institutions/institution/${universalLessonDetails.institutionID}/lessons/${lessonId}/page-builder?pageId=${id}`
    );
  };

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(pages);

    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateMovableList(items, 'page');
  };

  const toggleDeleteModal = (show: boolean, id?: string) => {
    setShowDeleteModal(show);
    setIdToBeRemoved(id || '');
  };

  const deleteLessonPlan = async (id: string) => {
    remove(universalLessonDetails.lessonPlan, (item: any) => item.id === id);
    setUniversalLessonDetails({...universalLessonDetails});
    const input = {
      id: lessonId,
      lessonPlan: [...universalLessonDetails.lessonPlan],
    };
    toggleDeleteModal(false);
    await updateLessonPageToDB(input);
    // history.goBack();
  };

  const {selectedPageID, getCurrentPage} = useULBContext();
  const pathname = window.location.pathname;

  return (
    <>
      <PageBuilderLayout
        rounded="_"
        dark={false}
        overflowHidden={false}
        width="40rem"
        open={newLessonPlanShow && !pathname.includes('page-builder')}>
        {newLessonPlanShow && !pathname.includes('page-builder') && (
          <NewLessonPlanSO
            instId={universalLessonDetails.institutionID}
            editMode={false}
            dark={false}
            setEditMode={setEditMode}
            pageDetails={selectedPageID ? getCurrentPage(selectedPageID) : {}} // don't send unwanted page details if not editing
            open={newLessonPlanShow}
            setOpen={setNewLessonPlanShow}
            activePageData={selectedPageID ? getCurrentPage(selectedPageID) : {}}
          />
        )}
      </PageBuilderLayout>
      <div className="flex m-auto justify-center">
        <div className="">
          <PageWrapper defaultClass="px-8 border-0 border-gray-200">
            {/* <h3 className="text-lg leading-6 font-bold text-gray-900 pb-8 pl-4">
            {lessonName}
          </h3> */}
            {loading ? (
              <div className="py-20 text-center mx-auto flex justify-center items-center w-full">
                <div className="items-center flex justify-center flex-col">
                  <Loader color="rgba(160, 174, 192, 1)" />
                  <p className="mt-2 text-center text-lg text-gray-500">
                    Loading Activities
                  </p>
                </div>
              </div>
            ) : true || pages.length > 0 ? (
              <Fragment>
                <div className="flex justify-between">
                  <div className="w-auto">
                    <p className="w-auto px-4 font-bold text-lg flex items-center">
                      <span className="inline-flex w-4 mr-2">
                        <FaTasks size={16} />
                      </span>
                      <span>
                        {
                          LessonBuilderDict[userLanguage][
                            'LESSON_CLASSROOM_ACTIVITY_TABLE'
                          ]['HEADING']
                        }
                      </span>
                    </p>
                  </div>
                  <span className="w-auto">
                    <Buttons
                      btnClass="mx-4"
                      label={
                        LessonBuilderDict[userLanguage][
                          'LESSON_CLASSROOM_ACTIVITY_TABLE'
                        ]['ADD_NEW_ACTIVITY']
                      }
                      onClick={addNewLessonPlan}
                    />
                  </span>
                </div>
                <div className="w-full flex justify-between border-b-0 border-gray-200 mt-8 pr-3">
                  {/* <div className="w-1/10 px-4 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>
                    {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['ID']}
                  </span>
                </div> */}
                  <div className="w-3/10 flex px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                    <span>
                      {
                        LessonBuilderDict[userLanguage][
                          'LESSON_CLASSROOM_ACTIVITY_TABLE'
                        ]['ACTIVITY_LABEL']
                      }
                    </span>
                  </div>
                  <div className="w-5/10 flex px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>
                      {
                        LessonBuilderDict[userLanguage][
                          'LESSON_CLASSROOM_ACTIVITY_TABLE'
                        ]['ACTIVITY_NAME']
                      }
                    </span>
                  </div>
                  <div className="w-3/10 px-8 py-3 flex justify-start bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>
                      {
                        LessonBuilderDict[userLanguage][
                          'LESSON_CLASSROOM_ACTIVITY_TABLE'
                        ]['INTERACTION_TYPE']
                      }
                    </span>
                  </div>
                  <div className="flex justify-start w-4/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>
                      {
                        LessonBuilderDict[userLanguage][
                          'LESSON_CLASSROOM_ACTIVITY_TABLE'
                        ]['INSTRUCTION']
                      }
                    </span>
                  </div>
                  <div className="flex justify-start w-2/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>
                      {
                        LessonBuilderDict[userLanguage][
                          'LESSON_CLASSROOM_ACTIVITY_TABLE'
                        ]['ESTIMATED_TIME']
                      }
                    </span>
                  </div>
                  <div className="w-1/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider flex justify-center">
                    <span className="text-center">
                      {
                        LessonBuilderDict[userLanguage][
                          'LESSON_CLASSROOM_ACTIVITY_TABLE'
                        ]['ACTION']
                      }
                    </span>
                  </div>
                </div>
                {pages.length ? (
                  <div
                    className={`${
                      pages.length > 4 ? 'max-h-88 overflow-y-auto' : ''
                    } mb-8 w-full m-auto`}>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                      <Droppable droppableId="partContent">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef}>
                            {pages.map((page: any, index: number) => (
                              <PageRow
                                key={page.id}
                                index={index}
                                page={page}
                                toggleDeleteModal={toggleDeleteModal}
                                lessonPagePreview={lessonPagePreview}
                              />
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                ) : (
                  <div className="text-center p-5">
                    You don't have any classroom activity yet.
                  </div>
                )}
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
            <div className={`border-b-0 pb-2 pl-2 ${theme.borderColor[themeColor]}`} />
            {loading ? (
              <div className="py-20 text-center mx-auto flex justify-center items-center w-full">
                <div className="items-center flex justify-center flex-col">
                  <Loader color="rgba(160, 174, 192, 1)" />
                  <p className="mt-2 text-center text-lg text-gray-500">
                    Loading Activities
                  </p>
                </div>
              </div>
            ) : true || pages.length > 0 ? (
              <div className="mt-8">
                <div className="flex justify-between">
                  <div className="w-auto">
                    <p className="w-auto px-4 font-bold text-lg flex items-center">
                      <span className="inline-flex w-4 mr-2">
                        <FaTasks size={16} />
                      </span>
                      <span>
                        {
                          LessonBuilderDict[userLanguage][
                            'LESSON_HOMEWORK_ACTIVITY_TABLE'
                          ]['HEADING']
                        }
                      </span>
                    </p>
                    {/* <p className="w-auto px-4 font-bold text-xs items-center text-gray-500">
                    {lessonName}
                  </p> */}
                  </div>
                  <span className="w-auto inline-flex items-center">
                    <Buttons
                      btnClass="mx-4"
                      disabled={true}
                      label={
                        LessonBuilderDict[userLanguage]['LESSON_HOMEWORK_ACTIVITY_TABLE'][
                          'ADD_NEW_ACTIVITY'
                        ]
                      }
                      // onClick={addNewLessonPlan}
                    />
                  </span>
                </div>
                <div className="w-full flex justify-between border-b-0 border-gray-200 mt-8">
                  {/* <div className="w-1/10 px-4 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>
                    {LessonBuilderDict[userLanguage]['LESSON_PLAN_COLUMN']['ID']}
                  </span>
                </div> */}
                  <div className="w-3/10 px-4 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>
                      {
                        LessonBuilderDict[userLanguage][
                          'LESSON_CLASSROOM_ACTIVITY_TABLE'
                        ]['ACTIVITY_LABEL']
                      }
                    </span>
                  </div>
                  <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>
                      {
                        LessonBuilderDict[userLanguage][
                          'LESSON_CLASSROOM_ACTIVITY_TABLE'
                        ]['ACTIVITY_NAME']
                      }
                    </span>
                  </div>
                  <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>
                      {
                        LessonBuilderDict[userLanguage][
                          'LESSON_CLASSROOM_ACTIVITY_TABLE'
                        ]['INTERACTION_TYPE']
                      }
                    </span>
                  </div>
                  <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>
                      {
                        LessonBuilderDict[userLanguage][
                          'LESSON_CLASSROOM_ACTIVITY_TABLE'
                        ]['INSTRUCTION']
                      }
                    </span>
                  </div>
                  <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>
                      {
                        LessonBuilderDict[userLanguage][
                          'LESSON_CLASSROOM_ACTIVITY_TABLE'
                        ]['ESTIMATED_TIME']
                      }
                    </span>
                  </div>
                  <div className="w-2/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>
                      {
                        LessonBuilderDict[userLanguage][
                          'LESSON_CLASSROOM_ACTIVITY_TABLE'
                        ]['ACTION']
                      }
                    </span>
                  </div>
                </div>
                <div className="text-center p-5">
                  You don't have any homework activities yet.
                </div>
                <div className="mb-8 w-full m-auto max-h-88 overflow-y-auto"></div>
              </div>
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
          {showDeleteModal && (
            <ModalPopUp
              message={
                'Are you sure you want to delete the this page? All of your data will be permanently removed. This action cannot be undone.'
              }
              closeAction={() => toggleDeleteModal(false)}
              saveLabel={LessonBuilderDict[userLanguage]['BUTTON']['DELETE']}
              saveAction={() => deleteLessonPlan(idToBeRemoved)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default LessonActivities;
