import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {useContext, useEffect, useState} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {useHistory} from 'react-router';

import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';

import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import * as mutations from 'graphql/mutations';

import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import {Empty} from '@components/Dashboard/Admin/LessonsBuilder/StepActionComponent/LearningEvidence/CourseMeasurementsCard';
import useAuth from '@customHooks/useAuth';
import {logError} from '@graphql/functions';
import {RoomStatus} from 'API';
import AddButton from 'atoms/Buttons/AddButton';
import Selector from 'atoms/Form/Selector';
import Loader from 'atoms/Loader';
import ModalPopUp from 'molecules/ModalPopUp';
import {getLessonType, reorder} from 'utilities/strings';
import LessonPlanManagerRow from './LessonPlanManagerRow';

interface UIMessages {
  show: boolean;
  message: string;
  isError: boolean;
  lessonError?: boolean;
}

const LessonPlanManager = ({
  syllabusId,
  syllabusDetails,
  institutionId,
  savedLessonsList,
  setSavedLessonsList,
  lessonsIds,
  setLessonsIds
}: any) => {
  const history = useHistory();

  const {
    state: {
      user: {isSuperAdmin}
    },

    userLanguage
  } = useContext(GlobalContext);
  const {SyllabusDict} = useDictionary();

  const [loading, setLoading] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [allLessonsList, setAllLessonsList] = useState([]);
  const [dropdownLessonsList, setDropdownLessonsList] = useState([]);
  const [selectedLessonsList, setSelectedLessonsList] = useState([]);

  const [selectedLesson, setSelectedLesson] = useState({
    id: '',
    name: '',
    value: ''
  });
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    lessonPlan: false,
    lessonEdit: false,
    message: SyllabusDict[userLanguage]['MESSAGES']['wantsave']
  });
  const [warnModal2, setWarnModal2] = useState({
    show: false,
    message: '',
    action: () => {}
  });
  const [messages, setMessages] = useState<UIMessages>({
    show: false,
    message: '',
    isError: false,
    lessonError: false
  });

  // ##################################################################### //
  // ################################ CRUD ############################### //
  // ##################################################################### //

  // ~~~~~~~~~~~~~~~~ FETCH ~~~~~~~~~~~~~~~~ //
  useEffect(() => {
    fetchLessonsList();
  }, [institutionId]);

  const fetchLessonsList = async () => {
    try {
      setLoading(true);
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listUniversalLessonsOptions, {
          filter: {
            institutionID: {eq: institutionId},
            status: {eq: syllabusDetails.status || RoomStatus.ACTIVE}
          }
        })
      );
      const savedData = result.data.listUniversalLessons;
      const sortedList = savedData?.items?.sort((a: any, b: any) =>
        a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
      );

      setAllLessonsList([...sortedList]);
      setLoading(false);
    } catch {
      setMessages({
        show: true,
        message: SyllabusDict[userLanguage]['MESSAGES']['fetchlist'],
        isError: true,
        lessonError: true
      });
    }
  };

  useEffect(() => {
    if (savedLessonsList?.length && !lessonsIds.length) {
      const lessonSeq = savedLessonsList.map((item: any) => item.id);

      updateLessonSequence(lessonSeq);
    }
  }, [savedLessonsList]);

  // ~~~~~~~~~~~~~~~~~ CRUD ~~~~~~~~~~~~~~~~ //
  const createNewLesson = () => {
    if (unsavedChanges) {
      setWarnModal({
        ...warnModal,
        lessonPlan: true,
        show: !warnModal.show,
        lessonEdit: false
      });
      return;
    }
    history.push(
      `/dashboard/manage-institutions/institution/${institutionId}/lessons/add`
    );
  };

  const selectLesson = (value: string, name: string, id: string) => {
    setSelectedLesson({id, name, value});
  };

  const closeLessonAction = () => {
    setWarnModal2({...warnModal2, show: false});
  };

  const addNewLesson = async () => {
    try {
      setAddingLesson(true);
      const _selectedLesson: any = allLessonsList.find(
        (item) => item.id === selectedLesson.id
      );

      const lessonComponentPlan: any =
        _selectedLesson?.lessonPlan &&
        _selectedLesson.lessonPlan.map((item: any) => {
          return {
            disabled: false,
            open: _selectedLesson.type !== 'lesson' ? true : false,
            active: _selectedLesson.type !== 'lesson' ? true : false,
            stage: `checkpoint?id=${item.LessonComponentID}`,
            type: 'survey',
            displayMode: 'SELF'
          };
        });
      const input = {
        syllabusID: syllabusId,
        lessonID: _selectedLesson.id,
        displayData: {breakdownComponent: _selectedLesson?.type},
        lessonPlan: lessonComponentPlan?.length > 0 ? lessonComponentPlan : [],
        status: RoomStatus.ACTIVE
      };

      const result: any = await API.graphql(
        graphqlOperation(mutations.createUniversalSyllabusLesson, {input})
      );
      const newLesson = result.data.createUniversalSyllabusLesson;

      if (!lessonsIds.length) {
        const associatedRooms: any = await API.graphql(
          graphqlOperation(customQueries.listRoomsByActiveSyllabusId, {
            filter: {activeSyllabus: {eq: syllabusId}}
          })
        );
        associatedRooms?.data.listRooms.items?.map(async (room: any) => {
          const updatedRoomResult: any = await API.graphql(
            graphqlOperation(mutations.updateRoom, {
              input: {id: room.id, activeLessons: [selectedLesson.id]}
            })
          );
        });
        await updateLessonSequence([newLesson.id]);
      } else {
        await updateLessonSequence([...lessonsIds, newLesson.id]);
      }
      setSelectedLesson({id: '', name: '', value: ''});
      setSavedLessonsList([...savedLessonsList, newLesson]);
      setAddingLesson(false);
    } catch (e) {
      setAddingLesson(false);
      logError(e, {authId, email}, 'LessonPlanManager @addNewLesson');
      setMessages({
        show: true,
        message: SyllabusDict[userLanguage]['MESSAGES']['UPDATE_ERROR'],
        isError: true,
        lessonError: true
      });
    }
  };

  const updateListAndDropdown = async () => {
    // To update table list and dropdown as per selected items.
    const savedLessonIds = [...savedLessonsList];
    const lessonsDetails = [...allLessonsList];
    const filteredList = savedLessonIds;
    let updatedTableList = filteredList.map((item) => {
      let tableList;
      const selectedLesson = savedLessonIds.find((lesson) => lesson.lessonID === item.id);
      tableList = {
        ...item,
        status: selectedLesson?.status || '',
        uniqlessonId: selectedLesson?.id,
        measurements: selectedLesson?.measurements
      };
      return tableList;
    });

    const filteredDropDownList = allLessonsList
      .filter((item) =>
        updatedTableList.find((lesson) => lesson.id === item.id) ? false : true
      )
      .filter((item: any) => (item.lessonPlan ? true : false))
      .map((item: {id: string; title: string; type: string; targetAudience: string}) => ({
        id: item.id,
        // name: `${item.title} - ${item.type && getLessonType(item.type)}`,
        name: `${item.title} - ${item.targetAudience || 'All'}`,
        value: item.title
      }));

    updatedTableList = updatedTableList
      .filter(
        (_d) => _d.lesson.status.toLowerCase() === syllabusDetails.status.toLowerCase()
      )
      .map((t: any) => {
        let index = lessonsIds?.indexOf(t.id);
        return {...t, index};
      })
      .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

    setSelectedLessonsList(updatedTableList);
    setDropdownLessonsList(filteredDropDownList);
  };

  useEffect(() => {
    if (Array.isArray(savedLessonsList) && savedLessonsList.length) {
      updateListAndDropdown();
    } else {
      if (allLessonsList.length) {
        const updatedList = allLessonsList
          ?.filter((item: any) => (item.lessonPlan ? true : false))
          .map((item: {id: string; title: string; type: string}) => ({
            id: item.id,
            name: `${item.title} - ${item.type && getLessonType(item.type)}`,
            value: item.title
          }));
        setDropdownLessonsList([...updatedList]);
      }
    }
  }, [savedLessonsList, allLessonsList]);

  const updateLessonSequence = async (lessonsIDs: string[]) => {
    setLessonsIds(lessonsIDs);
    await API.graphql(
      graphqlOperation(customMutations.updateUniversalSyllabusLessonSequence, {
        input: {id: syllabusId, universalLessonsSeq: lessonsIDs}
      })
    );
  };

  const onDragEnd = async (result: any) => {
    if (result.source.index !== result.destination.index) {
      const list: any = reorder(
        lessonsIds,
        result.source.index,
        result.destination.index
      );

      setLessonsIds(list);
      let lessonsList = selectedLessonsList
        .map((t: any) => {
          let index = list.indexOf(t.id);
          return {...t, index};
        })
        .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

      setSelectedLessonsList(lessonsList);
      updateLessonSequence(list);
      // Graphql mutation to update syllabus lesson seq
    }
  };

  // ~~~~ CHECK IF LESSON CAN BE DELETED ~~~ //

  /***********************************************
   * CHECK IF LESSON HAS EVER BEEN ACTIVATED, IT *
   *    WILL BE ON THE UNIT --> LESSONHISTORY    *
   ***********************************************/
  const [deleteModal, setDeleteModal] = useState<any>({
    show: false,
    message: '',
    action: () => {}
  });

  const checkIfRemovable = (lessonObj: any, unitObj: any) => {
    if (
      unitObj?.lessonHistory &&
      unitObj?.lessonHistory?.length > 0 &&
      unitObj?.lessonHistory.includes(lessonObj.id)
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleToggleDelete = (targetString?: string, lessonObj?: any, idx?: number) => {
    if (!deleteModal.show) {
      setDeleteModal({
        show: true,
        message: `Are you sure you want to remove "${targetString}" from unit?`,
        action: () => handleDelete(lessonObj, idx)
      });
    } else {
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  const {authId, email} = useAuth();

  const handleDelete = async (lesson: any, idx: number) => {
    setDeleting(true);
    try {
      await API.graphql(
        graphqlOperation(mutations.deleteUniversalSyllabusLesson, {
          input: {id: lesson.id}
        })
      );
      await updateLessonSequence(
        lessonsIds.filter((lessonId: any) => lessonId !== lesson.id)
      );
      selectedLessonsList.splice(idx, 1);
      setSelectedLessonsList([...selectedLessonsList]);
      setSelectedLessonsList((list: any) =>
        list.filter((_item: any) => _item.id !== lesson.id)
      );
      setSavedLessonsList((prevList: any) =>
        prevList.filter((item: any) => item.id !== lesson.id)
      );
    } catch (e) {
      logError(e, {authId, email}, 'LessonPlanManager @handleDelete');
      console.error('error deleting...', e);
    } finally {
      setDeleting(false);
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  const gotoLessonBuilder = (id: string, type: string) => {
    if (unsavedChanges) {
      setWarnModal({
        ...warnModal,
        lessonPlan: false,
        show: !warnModal.show,
        lessonEdit: true
      });
      // setEditLesson({type, id});
    } else {
      history.push(
        isSuperAdmin
          ? `/dashboard/manage-institutions/lessons/${id}`
          : `/dashboard/manage-institutions/institution/${institutionId}/lessons/${id}`
      );
    }
  };

  return (
    <div className="">
      {/* *************** SECTION HEADER ************ */}

      <SectionTitleV3
        title={'Lesson Plan Manager'}
        fontSize="xl"
        fontStyle="semibold"
        extraClass="leading-6 text-gray-900  mb-2 lg:mb-0"
        extraContainerClass="flex-col lg:flex-row "
        borderBottom
        withButton={
          <div className="lg:w-7/10 w-full flex gap-x-4 justify-end items-center">
            <Selector
              selectedItem={selectedLesson.name}
              list={dropdownLessonsList}
              placeholder={SyllabusDict[userLanguage]['SELECT_LESSON']}
              onChange={selectLesson}
              additionalClass="w-auto "
              width="w-96"
            />

            <AddButton
              className="ml-4 py-1"
              label={'Add'}
              onClick={addNewLesson}
              disabled={!Boolean(selectedLesson.value) || addingLesson}
            />

            {!isSuperAdmin && (
              <div className="w-auto">
                <AddButton
                  transparent
                  label={SyllabusDict[userLanguage]['ADD_NEW_LESSON']}
                  onClick={createNewLesson}
                />
              </div>
            )}
          </div>
        }
        shadowOff
      />

      <div className="mt-4">
        {loading ? (
          <div className="h-100 flex justify-center items-center">
            <div className="w-5/10">
              <Loader animation withText="Fetching lessons..." />
            </div>
          </div>
        ) : selectedLessonsList && selectedLessonsList.length > 0 ? (
          <div>
            {/* *************** LESSONS TABLE HEADERS ************ */}
            <div className="flex justify-between bg-gray-50  px-8 whitespace-nowrap border-b-0 border-gray-200  lg:w-full">
              <div className="w-.5/10 px-8 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{SyllabusDict[userLanguage]['TABLE_HEADS']['NUMBER']}</span>
              </div>
              <div className="w-2/10 px-8 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{SyllabusDict[userLanguage]['TABLE_HEADS']['LESSON_NAME']}</span>
              </div>
              <div className="w-1/10 px-8 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{SyllabusDict[userLanguage]['TABLE_HEADS']['TYPE']}</span>
              </div>
              <div className="w-3/10 px-8 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{SyllabusDict[userLanguage]['TABLE_HEADS']['MEASUREMENTS']}</span>
              </div>
              <div className="w-2.5/10 px-8 py-3 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{SyllabusDict[userLanguage]['TABLE_HEADS']['ACTION']}</span>
              </div>
            </div>

            <div className="max-h-132  lg:w-full overflow-y-auto overflow-x-hidden mb-10">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided1, snapshot) => (
                    <div {...provided1.droppableProps} ref={provided1.innerRef}>
                      {selectedLessonsList.map((item, index) => {
                        return (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => {
                              return (
                                <div
                                  className={`${
                                    snapshot.isDragging
                                      ? 'theme-bg:100 transition-all isDragging'
                                      : ''
                                  } w-auto`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}>
                                  <div
                                    key={index}
                                    className="flex justify-between w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                                    <LessonPlanManagerRow
                                      index={index}
                                      lessonObject={item.lesson}
                                      syllabusObject={syllabusDetails}
                                      checkIfRemovable={checkIfRemovable}
                                      handleToggleDelete={handleToggleDelete}
                                      gotoLessonBuilder={gotoLessonBuilder}
                                    />
                                  </div>
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided1.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        ) : (
          <div className="text-center p-16 mt-4">
            <Empty
              text={`No lesson found - current unit status is ${syllabusDetails.status}`}
            />
          </div>
        )}
      </div>

      {deleteModal.show && (
        <ModalPopUp
          closeAction={handleToggleDelete}
          saveAction={deleting ? () => {} : deleteModal.action}
          saveLabel={deleting ? 'DELETING...' : 'CONFIRM'}
          cancelLabel="CANCEL"
          message={deleteModal.message}
        />
      )}
      {warnModal2.show && (
        <ModalPopUp
          closeAction={closeLessonAction}
          saveAction={warnModal2.action}
          saveLabel="Yes"
          message={warnModal2.message}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default LessonPlanManager;
