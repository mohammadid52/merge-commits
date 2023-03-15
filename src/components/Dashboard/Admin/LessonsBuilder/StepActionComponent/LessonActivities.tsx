import AddButton from '@components/Atoms/Buttons/AddButton';
import LessonActivitiesAction from '@components/MicroComponents/LessonActivitiesAction';
import Table from '@components/Molecules/Table';
import useAuth from '@customHooks/useAuth';
import {UniversalLessonPage} from '@interfaces/UniversalLessonInterfaces';

import {getAsset} from 'assets';
import Buttons from 'atoms/Buttons';
import Loader from 'atoms/Loader';
import PageWrapper from 'atoms/PageWrapper';
import NewLessonPlanSO from 'components/Lesson/UniversalLessonBuilder/UI/SlideOvers/NewLessonPlanSO';
import PageBuilderLayout from 'components/Lesson/UniversalLessonBuilder/views/PageBuilderLayout';
import {useGlobalContext} from 'contexts/GlobalContext';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import useDictionary from 'customHooks/dictionary';

import {map, remove} from 'lodash';
import ModalPopUp from 'molecules/ModalPopUp';
import {Fragment, useState} from 'react';
import {FaTasks} from 'react-icons/fa';
import {useHistory} from 'react-router';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';

interface LessonPlansListProps {
  lessonId: string;
  lessonName: string;
  loading: boolean;
  universalLessonDetails: {
    institutionID?: string;
    lessonPlan: UniversalLessonPage[];
  };
}

const LessonActivities = ({
  lessonId,

  loading,
  universalLessonDetails
}: LessonPlansListProps) => {
  const history = useHistory();
  const {clientKey, theme, userLanguage} = useGlobalContext();

  const {isSuperAdmin} = useAuth();
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {LessonBuilderDict} = useDictionary();
  const {
    newLessonPlanShow,
    setNewLessonPlanShow,
    setPreviewMode,
    setUniversalLessonDetails,
    setEditMode,
    updateMovableList,
    setLessonPlanFields
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
      classwork: true
    });
  };

  const lessonPagePreview = (id: string, preview: boolean = true) => {
    setPreviewMode(preview);
    history.push(
      isSuperAdmin
        ? `/dashboard/manage-institutions/lessons/${lessonId}/page-builder?pageId=${id}`
        : `/dashboard/manage-institutions/institution/${universalLessonDetails.institutionID}/lessons/${lessonId}/page-builder?pageId=${id}`
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
      lessonPlan: [...universalLessonDetails.lessonPlan]
    };
    toggleDeleteModal(false);
    await updateLessonPageToDB(input);
  };

  const {selectedPageID, getCurrentPage} = useULBContext();
  const pathname = window.location.pathname;

  const dataList = map(pages, (page: any) => ({
    id: page.id,
    onClick: () => lessonPagePreview(page.id, false),
    pageLabel: page.label || '-',
    pageName: page.title || '-',
    interactionType: page?.interactionType ? page.interactionType.join(', ') : '-',
    instructions: page.description ? (
      <div
        className="custom-editor-description"
        dangerouslySetInnerHTML={{__html: page.description}}
      />
    ) : (
      '-'
    ),
    estimatedTime: page.estTime ? `${page.estTime} min` : '',
    actions: (
      <LessonActivitiesAction
        id={page.id}
        lessonPagePreview={lessonPagePreview}
        toggleDeleteModal={toggleDeleteModal}
      />
    )
  }));

  const tableConfig = {
    headers: [
      LessonBuilderDict[userLanguage]['LESSON_CLASSROOM_ACTIVITY_TABLE'][
        'ACTIVITY_LABEL'
      ],
      LessonBuilderDict[userLanguage]['LESSON_CLASSROOM_ACTIVITY_TABLE']['ACTIVITY_NAME'],
      isSuperAdmin &&
        LessonBuilderDict[userLanguage]['LESSON_CLASSROOM_ACTIVITY_TABLE'][
          'INTERACTION_TYPE'
        ],
      LessonBuilderDict[userLanguage]['LESSON_CLASSROOM_ACTIVITY_TABLE']['INSTRUCTION'],
      LessonBuilderDict[userLanguage]['LESSON_CLASSROOM_ACTIVITY_TABLE'][
        'ESTIMATED_TIME'
      ],

      LessonBuilderDict[userLanguage]['LESSON_CLASSROOM_ACTIVITY_TABLE']['ACTION']
    ],
    dataList,
    config: {
      dark: false,
      isLastAction: true,
      headers: {textColor: 'text-white'},
      dataList: {
        emptyText: "You don't have any classroom activity yet.",
        loading,
        droppable: {
          isDroppable: true,
          onDragEnd: handleOnDragEnd,
          droppableId: 'partContent'
        },
        customWidth: {
          activityName: 'w-72',
          activityLabel: 'w-40'
        },
        maxHeight: 'max-h-196',
        pattern: 'striped',
        patternConfig: {
          firstColor: 'bg-gray-100',
          secondColor: 'bg-gray-200'
        }
      }
    }
  };

  return (
    <>
      <PageBuilderLayout
        rounded="_"
        dark={false}
        overflowHidden={false}
        open={newLessonPlanShow && !pathname.includes('page-builder')}>
        {newLessonPlanShow && !pathname.includes('page-builder') && (
          <NewLessonPlanSO
            instId={universalLessonDetails?.institutionID || ''}
            dark={false}
            pageDetails={selectedPageID ? getCurrentPage(selectedPageID) : {}} // don't send unwanted page details if not editing
            open={newLessonPlanShow}
            setOpen={setNewLessonPlanShow}
          />
        )}
      </PageBuilderLayout>
      <div className="flex m-auto justify-center">
        <div className="">
          <PageWrapper defaultClass="overflow-x-auto px-8 border-0 border-gray-200">
            {/* <h3 className="text-lg leading-6 font-bold text-gray-900 pb-8 pl-4">
            {lessonName}
          </h3> */}
            <div className="flex justify-between">
              <div className="w-auto">
                <p className="w-auto px-4 font-bold text-lg flex items-center">
                  <span className="inline-flex w-4 mr-2">
                    <FaTasks size={16} />
                  </span>
                  <span>
                    {
                      LessonBuilderDict[userLanguage]['LESSON_CLASSROOM_ACTIVITY_TABLE'][
                        'HEADING'
                      ]
                    }
                  </span>
                </p>
              </div>
              <span className="w-auto">
                <AddButton
                  label={
                    LessonBuilderDict[userLanguage]['LESSON_CLASSROOM_ACTIVITY_TABLE'][
                      'ADD_NEW_ACTIVITY'
                    ]
                  }
                  transparent
                  onClick={addNewLessonPlan}
                />
              </span>
            </div>

            {pages.length === 0 ? (
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
            ) : (
              <Fragment>
                <Table {...tableConfig} />
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
                    />
                  </span>
                </div>
                <div className="w-full flex justify-between border-b-0 border-gray-200 mt-8">
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
