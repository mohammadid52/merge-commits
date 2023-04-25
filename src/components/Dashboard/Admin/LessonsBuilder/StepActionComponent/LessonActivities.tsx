import AddButton from '@components/Atoms/Buttons/AddButton';
import Table, {ITableProps} from '@components/Molecules/Table';
import useAuth from '@customHooks/useAuth';
import {DragEndEvent} from '@dnd-kit/core';
import {arrayMove} from '@dnd-kit/sortable';
import {UniversalLessonPage} from '@interfaces/UniversalLessonInterfaces';
import {Empty} from 'antd';

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

  const onDragEnd = ({active, over}: DragEndEvent) => {
    if (active.id !== over?.id) {
      const prev = dataList;
      const activeIndex = prev.findIndex((i) => i.id === active.id);
      const overIndex = prev.findIndex((i) => i.id === over?.id);
      const ids = arrayMove(prev, activeIndex, overIndex).map((i) => i.id);

      // update universalDetails with new order
      // pages are in universalDetails.lessonPlan
      const newPages = map(ids, (id) => {
        return pages.find((page) => page.id === id);
      });

      setUniversalLessonDetails({
        ...universalLessonDetails,
        lessonPlan: newPages
      });

      // update DB
      updateLessonPageToDB({
        id: lessonId,
        lessonPlan: newPages
      });
    }
  };

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
    estimatedTime: page.estTime ? `${page.estTime} min` : ''
    // actions: (
    //   <CommonActionsBtns

    //     button2Action={() => toggleDeleteModal(true, page.id)}
    //   />
    // )
  }));

  const dict = LessonBuilderDict[userLanguage]['LESSON_CLASSROOM_ACTIVITY_TABLE'];

  const tableConfig: ITableProps = {
    headers: [
      dict['ACTIVITY_LABEL'],
      dict['ACTIVITY_NAME'],
      isSuperAdmin && dict['INTERACTION_TYPE'],
      dict['INSTRUCTION'],
      dict['ESTIMATED_TIME']

      // dict['ACTION']
    ],
    dataList,
    config: {
      dataList: {
        sortableConfig: {
          onSort: onDragEnd
        },
        loading
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
        {/* <h3 className="text-lg leading-6 font-bold text-darkest   pb-8 pl-4">
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
          <Empty description="You don't have any pages">
            <Buttons
              label={LessonBuilderDict[userLanguage]['BUTTON']['ADD_PLAN']}
              onClick={addNewLessonPlan}
            />
          </Empty>
        ) : (
          <Fragment>
            <Table {...tableConfig} />
          </Fragment>
        )}
        <div className={`border-b-0 pb-2 pl-2 ${theme.borderColor[themeColor]}`} />

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
