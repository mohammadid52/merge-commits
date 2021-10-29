import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';

import {GlobalContext} from '../../../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../../../customHooks/dictionary';

import * as mutations from '../../../../../../../../graphql/mutations';
import * as customQueries from '../../../../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../../../../customGraphql/customMutations';

import {getLessonType, reorder} from '../../../../../../../../utilities/strings';
import Selector from '../../../../../../../Atoms/Form/Selector';
import {DeleteActionBtn} from '../../../../../../../Atoms/Buttons/DeleteActionBtn';
import AddButton from '../../../../../../../Atoms/Buttons/AddButton';
import Loader from '../../../../../../../Atoms/Loader';
import ModalPopUp from '../../../../../../../Molecules/ModalPopUp';
import {getAsset} from '../../../../../../../../assets';
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
  setLessonsIds,
}: any) => {
  const history = useHistory();

  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const {SyllabusDict} = useDictionary(clientKey);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const [loading, setLoading] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [allLessonsList, setAllLessonsList] = useState([]);
  const [dropdownLessonsList, setDropdownLessonsList] = useState([]);
  const [selectedLessonsList, setSelectedLessonsList] = useState([]);
  const [selecetedLesson, setSelectedLesson] = useState({
    id: '',
    name: '',
    value: '',
  });
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    lessonPlan: false,
    lessonEdit: false,
    message: SyllabusDict[userLanguage]['MESSAGES']['wantsave'],
  });
  const [warnModal2, setWarnModal2] = useState({
    show: false,
    message: '',
    action: () => {},
  });
  const [messages, setMessages] = useState<UIMessages>({
    show: false,
    message: '',
    isError: false,
    lessonError: false,
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
          filter: {institutionID: {eq: institutionId}},
        })
      );
      const savedData = result.data.listUniversalLessons;
      const sortedList = savedData?.items?.sort((a: any, b: any) =>
        a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
      );

      const updatedList = sortedList
        ?.filter((item: any) => (item.lessonPlan ? true : false))
        .map((item: {id: string; title: string; type: string}) => ({
          id: item.id,
          name: `${item.title} - ${item.type && getLessonType(item.type)}`,
          value: item.title,
        }));
      // setDropdownLessonsList([...updatedList]);
      setAllLessonsList([...sortedList]);
      setLoading(false);
    } catch {
      setMessages({
        show: true,
        message: SyllabusDict[userLanguage]['MESSAGES']['fetchlist'],
        isError: true,
        lessonError: true,
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
        lessonEdit: false,
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
      const selectedLesson = allLessonsList.find(
        (item) => item.id === selecetedLesson.id
      );

      const lessonComponentPlan: any =
        selectedLesson?.lessonPlan &&
        selectedLesson.lessonPlan.map((item: any) => {
          return {
            disabled: false,
            open: selectedLesson.type !== 'lesson' ? true : false,
            active: selectedLesson.type !== 'lesson' ? true : false,
            stage: `checkpoint?id=${item.LessonComponentID}`,
            type: 'survey',
            displayMode: 'SELF',
          };
        });
      const input = {
        syllabusID: syllabusId,
        lessonID: selecetedLesson.id,
        displayData: {breakdownComponent: selectedLesson?.type},
        lessonPlan: lessonComponentPlan?.length > 0 ? lessonComponentPlan : [],
        status: 'Active',
      };

      const result: any = await API.graphql(
        graphqlOperation(mutations.createUniversalSyllabusLesson, {input})
      );
      const newLesson = result.data.createUniversalSyllabusLesson;

      if (!lessonsIds.length) {
        const associatedRooms: any = await API.graphql(
          graphqlOperation(customQueries.listRoomsByActiveSyllabusId, {
            filter: {activeSyllabus: {eq: syllabusId}},
          })
        );
        associatedRooms?.data.listRooms.items?.map(async (room: any) => {
          const updatedRoomResult: any = await API.graphql(
            graphqlOperation(mutations.updateRoom, {
              input: {id: room.id, activeLessons: [selecetedLesson.id]},
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
    } catch {
      setAddingLesson(false);
      setMessages({
        show: true,
        message: SyllabusDict[userLanguage]['MESSAGES']['UPDATE_ERROR'],
        isError: true,
        lessonError: true,
      });
    }
  };

  const updateListAndDropdown = async () => {
    // To update table list and dropdown as per selected items.
    const savedLessonIds = [...savedLessonsList];
    const lessonsDetails = [...allLessonsList];
    const filteredList = lessonsDetails.filter((item) =>
      savedLessonIds.some((lesson) => lesson.lessonID === item.id)
    );
    let updatedTableList = filteredList.map((item) => {
      let tableList;
      const selectedLesson = savedLessonIds.find((lesson) => lesson.lessonID === item.id);
      tableList = {
        ...item,
        status: selectedLesson?.status || '',
        uniqlessonId: selectedLesson?.id,
        measurements: selectedLesson?.measurements,
      };
      return tableList;
    });
    const filteredDropDownList = allLessonsList
      .filter((item) =>
        updatedTableList.find((lesson) => lesson.id === item.id) ? false : true
      )
      .filter((item: any) => (item.lessonPlan ? true : false))
      .map((item: {id: string; title: string; type: string}) => ({
        id: item.id,
        name: `${item.title} - ${item.type && getLessonType(item.type)}`,
        value: item.title,
      }));

    updatedTableList = updatedTableList
      .map((t: any) => {
        let index = lessonsIds?.indexOf(t.uniqlessonId);
        return {...t, index};
      })
      .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

    setSelectedLessonsList(updatedTableList);
    setDropdownLessonsList(filteredDropDownList);
  };

  useEffect(() => {
    if (savedLessonsList?.length && !lessonsIds.length) {
      const lessonSeq = savedLessonsList.map((item: any) => item.id);
      updateLessonSequence(lessonSeq);
    }
  }, [savedLessonsList]);

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
            value: item.title,
          }));
        setDropdownLessonsList([...updatedList]);
      }
    }
  }, [savedLessonsList, allLessonsList]);

  const updateLessonSequence = async (lessonsIDs: string[]) => {
    setLessonsIds(lessonsIDs);
    await API.graphql(
      graphqlOperation(customMutations.updateUniversalSyllabusLessonSequence, {
        input: {id: syllabusId, universalLessonsSeq: lessonsIDs},
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
          let index = list.indexOf(t.uniqlessonId);
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
    action: () => {},
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

  const handleToggleDelete = (targetString?: string, lessonObj?: any) => {
    if (!deleteModal.show) {
      setDeleteModal({
        show: true,
        message: `Are you sure you want to remove "${targetString}" from unit?`,
        action: () => handleDelete(lessonObj),
      });
    } else {
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  const handleDelete = async (lesson: any) => {
    setDeleting(true);
    try {
      console.log('deleting...', lesson);
      await API.graphql(
        graphqlOperation(mutations.deleteUniversalSyllabusLesson, {
          input: {id: lesson.uniqlessonId},
        })
      );
      await updateLessonSequence(
        lessonsIds.filter((lessonId: any) => lessonId !== lesson.uniqlessonId)
      );
      setSelectedLessonsList((list: any) =>
        list.filter((_item: any) => _item.id !== lesson.id)
      );
      setSavedLessonsList((prevList: any) =>
        prevList.filter((lesson: any) => lesson.id !== lesson.uniqlessonId)
      );
    } catch (e) {
      console.error('error deleting...', e);
    } finally {
      setDeleting(false);
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  const updateLessonList = (lessonObj: any) => {
    setAllLessonsList(
      allLessonsList.filter((lessonListObj: any) => lessonListObj.id !== lessonObj.id)
    );
  };

  /*******
   * END *
   *******/
  const onDelete = (item: any) => {
    const onDrop = async () => {
      setDeleting(true);
      const result: any = await API.graphql(
        graphqlOperation(mutations.deleteUniversalSyllabusLesson, {
          input: {id: item.uniqlessonId},
        })
      );
      await updateLessonSequence(
        lessonsIds.filter((lessonId: any) => lessonId !== item.uniqlessonId)
      );
      setSelectedLessonsList((list: any) =>
        list.filter((_item: any) => _item.id !== item.id)
      );
      setSavedLessonsList((prevList: any) =>
        prevList.filter((lesson: any) => lesson.id !== item.uniqlessonId)
      );
      setDeleting(false);
      closeLessonAction();
    };
    setWarnModal2({
      show: true,
      message: `Are you sure you want to delete (${item.title})?`,
      action: onDrop,
    });
  };

  const gotoLessonBuilder = (id: string, type: string) => {
    if (unsavedChanges) {
      setWarnModal({
        ...warnModal,
        lessonPlan: false,
        show: !warnModal.show,
        lessonEdit: true,
      });
      // setEditLesson({type, id});
    } else {
      history.push(
        `/dashboard/manage-institutions/institution/${institutionId}/lessons/${id}`
      );
    }
  };

  return (
    <div className="bg-white shadow-5 mb-4">
      {/* *************** SECTION HEADER ************ */}
      <div
        className={`flex items-center justify-between p-4 ${theme.borderColor[themeColor]}`}>
        {/* <h3 className="text-lg leading-6 font-medium text-gray-900">
          {SyllabusDict[userLanguage]['LESSON_PLAN_HEADING']}
        </h3> */}
        <div className="flex justify-end">
          <AddButton
            label={SyllabusDict[userLanguage]['ADD_NEW_LESSON']}
            onClick={createNewLesson}
          />
        </div>
      </div>
      {/* *************** ADD LESSON TO SYLLABUS SECTION ************ */}
      <div className="w-full m-auto p-4">
        <div className="my-8 w-6/10 m-auto flex items-center justify-center">
          <div className="mr-4">
            <Selector
              selectedItem={selecetedLesson.value}
              list={dropdownLessonsList}
              placeholder={SyllabusDict[userLanguage]['SELECT_LESSON']}
              onChange={selectLesson}
            />
          </div>
          <div className="ml-4 w-auto">
            <AddButton
              className="ml-4 py-1"
              label={'Add'}
              onClick={addNewLesson}
              disabled={!Boolean(selecetedLesson.value) || addingLesson}
            />
          </div>
        </div>
        {messages.show && messages.lessonError ? (
          <div className="py-2 mb-4 m-auto text-center">
            <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>
              {messages.message && messages.message}
            </p>
          </div>
        ) : null}

        {/* *************** LESSONS LIST ************ */}
        <div>
          {loading ? (
            <div className="h-100 flex justify-center items-center">
              <div className="w-5/10">
                <Loader />
              </div>
            </div>
          ) : selectedLessonsList && selectedLessonsList.length > 0 ? (
            <div>
              {/* *************** LESSONS TABLE HEADERS ************ */}
              <div className="flex justify-between w-full bg-gray-50  px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
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
                <div className="w-1/10 px-8 py-3 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{SyllabusDict[userLanguage]['TABLE_HEADS']['ACTION']}</span>
                </div>
              </div>

              <div className="max-h-88 overflow-y-auto mb-10">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided1, snapshot) => (
                      <div {...provided1.droppableProps} ref={provided1.innerRef}>
                        {selectedLessonsList.map((item, index) => {
                          return (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}>
                                  <div
                                    key={index}
                                    className="flex justify-between w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                                    <LessonPlanManagerRow
                                      index={index}
                                      lessonObject={item}
                                      syllabusObject={syllabusDetails}
                                      checkIfRemovable={checkIfRemovable}
                                      handleToggleDelete={handleToggleDelete}
                                      gotoLessonBuilder={gotoLessonBuilder}
                                    />
                                  </div>
                                </div>
                              )}
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
              {SyllabusDict[userLanguage]['nolesson']}
            </div>
          )}
        </div>
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
