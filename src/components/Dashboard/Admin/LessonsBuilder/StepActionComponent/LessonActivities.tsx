import AddButton from '@components/Atoms/Buttons/AddButton';
import CommonActionsBtns from '@components/MicroComponents/CommonActionsBtns';
import Table from '@components/Molecules/Table';
import useAuth from '@customHooks/useAuth';
import {UniversalLessonPage} from '@interfaces/UniversalLessonInterfaces';

import {getAsset} from 'assets';
import Buttons from 'atoms/Buttons';
import Loader from 'atoms/Loader';
import NewLessonPlanSO from 'components/Lesson/UniversalLessonBuilder/UI/SlideOvers/NewLessonPlanSO';
import {useGlobalContext} from 'contexts/GlobalContext';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import useDictionary from 'customHooks/dictionary';

import {map, remove} from 'lodash';
import ModalPopUp from 'molecules/ModalPopUp';
import {Fragment, useState} from 'react';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
      <CommonActionsBtns
        button1Label="View"
        button1Action={() => lessonPagePreview(page.id)}
        button2Action={() => toggleDeleteModal(true, page.id)}
      />
    )
  }));

  const dict = LessonBuilderDict[userLanguage]['LESSON_CLASSROOM_ACTIVITY_TABLE'];

  const tableConfig = {
    headers: [
      dict['ACTIVITY_LABEL'],
      dict['ACTIVITY_NAME'],
      isSuperAdmin && dict['INTERACTION_TYPE'],
      dict['INSTRUCTION'],
      dict['ESTIMATED_TIME'],

      dict['ACTION']
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
      <NewLessonPlanSO
        instId={universalLessonDetails?.institutionID || ''}
        dark={false}
        pageDetails={selectedPageID ? getCurrentPage(selectedPageID) : {}} // don't send unwanted page details if not editing
        open={newLessonPlanShow}
        setOpen={setNewLessonPlanShow}
      />

      <div className=" m-auto justify-center">
        {/* <h3 className="text-lg leading-6 font-bold text-gray-900 pb-8 pl-4">
            {lessonName}
          </h3> */}
        <div className="flex justify-between">
          <p className="w-auto font-bold text-lg flex items-center">{dict['HEADING']}</p>

          <span className="w-auto">
            <AddButton
              label={dict['ADD_NEW_ACTIVITY']}
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
              <p className="mt-2 text-center text-lg text-gray-500">Loading Activities</p>
            </div>
          </div>
        ) : pages.length > 0 ? (
          <div className="mt-8">
            <div className="flex justify-between">
              <p className="w-auto  font-semibold text-lg flex items-center">
                {
                  LessonBuilderDict[userLanguage]['LESSON_HOMEWORK_ACTIVITY_TABLE'][
                    'HEADING'
                  ]
                }
              </p>

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
                <span>{dict['ACTIVITY_LABEL']}</span>
              </div>
              <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{dict['ACTIVITY_NAME']}</span>
              </div>
              <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{dict['INTERACTION_TYPE']}</span>
              </div>
              <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{dict['INSTRUCTION']}</span>
              </div>
              <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{dict['ESTIMATED_TIME']}</span>
              </div>
              <div className="w-2/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{dict['ACTION']}</span>
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

        <ModalPopUp
          open={showDeleteModal}
          message={
            'Are you sure you want to delete the this page? All of your data will be permanently removed. This action cannot be undone.'
          }
          closeAction={() => toggleDeleteModal(false)}
          saveLabel={LessonBuilderDict[userLanguage]['BUTTON']['DELETE']}
          saveAction={() => deleteLessonPlan(idToBeRemoved)}
        />
      </div>
    </>
  );
};

export default LessonActivities;
