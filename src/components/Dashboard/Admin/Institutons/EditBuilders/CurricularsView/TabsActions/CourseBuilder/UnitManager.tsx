import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router';
import API, {graphqlOperation} from '@aws-amplify/api';
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

interface UIMessages {
  show: boolean;
  message: string;
  isError: boolean;
  lessonError?: boolean;
}

const UnitManager = ({
  syllabusId,
  institutionId,
  savedLessonsList,
  setSavedLessonsList,
  lessonsIds,
  setLessonsIds,
}: any) => {
  const history = useHistory();

  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const {CourseBuilderdict} = useDictionary(clientKey);
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
    message: CourseBuilderdict[userLanguage]['MESSAGES']['wantsave'],
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

  useEffect(() => {
    if (savedLessonsList?.length && !lessonsIds.length) {
      const lessonSeq = savedLessonsList.map((item: any) => item.id);
      updateLessonSequence(lessonSeq);
    }
  }, [savedLessonsList]);

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
    history.push('/dashboard/lesson-builder/lesson/add');
  };

  const selectLesson = (value: string, name: string, id: string) => {
    setSelectedLesson({id, name, value});
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
        message: CourseBuilderdict[userLanguage]['MESSAGES']['UPDATE_ERROR'],
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
    const filteredDropDownList = dropdownLessonsList.filter((item) =>
      updatedTableList.find((lesson) => lesson.id === item.id) ? false : true
    );

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
    }
  }, [savedLessonsList, allLessonsList]);

  const closeLessonAction = () => {
    setWarnModal2({...warnModal2, show: false});
  };

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
      setAllLessonsList([...sortedList]);
      setDropdownLessonsList([...updatedList]);
      setLoading(false);
    } catch {
      setMessages({
        show: true,
        message: CourseBuilderdict[userLanguage]['MESSAGES']['fetchlist'],
        isError: true,
        lessonError: true,
      });
    }
  };

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
      setDeleting(false);
      closeLessonAction();
    };
    setWarnModal2({
      show: true,
      message: `Are you sure you want to delete (${item.title})?`,
      action: onDrop,
    });
  };

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
      if (type === 'lesson') {
        history.push(
          `/dashboard/lesson-builder/lesson/edit?lessonId=${id}&from=lesson-planner`
        );
      } else {
        history.push(
          `/dashboard/lesson-builder/lesson/edit?assessmentId=${id}&from=lesson-planner`
        );
      }
    }
  };

  return (
    <div className="">
      {/* *************** SECTION HEADER ************ */}
      <div
        className={`flex items-center justify-between p-4 ${theme.borderColor[themeColor]}`}>
        {/* <h3 className="text-lg leading-6 font-medium text-gray-900">
          {CourseBuilderdict[userLanguage]['LESSON_PLAN_HEADING']}
        </h3> */}
        <div className="flex justify-end">
          <AddButton
            label={CourseBuilderdict[userLanguage]['ADD_NEW_UNIT']}
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
              placeholder={CourseBuilderdict[userLanguage]['SELECT_UNIT']}
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
                  <span>{CourseBuilderdict[userLanguage]['TABLE_HEADS']['NUMBER']}</span>
                </div>
                <div className="w-2/10 px-8 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{CourseBuilderdict[userLanguage]['TABLE_HEADS']['UNIT_NAME']}</span>
                </div>
                <div className="w-1/10 px-8 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{CourseBuilderdict[userLanguage]['TABLE_HEADS']['OBJECTIVES']}</span>
                </div>
                <div className="w-3/10 px-8 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{CourseBuilderdict[userLanguage]['TABLE_HEADS']['LESSONS']}</span>
                </div>
                <div className="w-1/10 px-8 py-3 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{CourseBuilderdict[userLanguage]['TABLE_HEADS']['ACTION']}</span>
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
                                    <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4">
                                      {index + 1}.
                                    </div>
                                    <div
                                      className="flex w-2/10 items-center px-8 py-3 text-left text-s leading-4 font-medium whitespace-normal cursor-pointer"
                                      onClick={() =>
                                        gotoLessonBuilder(item.id, item.type)
                                      }>
                                      {item.title || '--'}
                                    </div>
                                    <div className="flex w-1/10 items-center px-8 py-3 text-left text-s text-gray-500 leading-4 font-medium whitespace-normal cursor-pointer">
                                      {item.type || '--'}
                                    </div>
                                    <div className="flex w-3/10 items-center px-8 py-3 text-left text-s leading-4 font-medium whitespace-normal text-gray-500">
                                      {item?.measurements?.length > 0
                                        ? item?.measurements?.map(
                                            (rubric: any, index: number) =>
                                              index === item?.measurements?.length - 1
                                                ? rubric?.rubric?.name + '.'
                                                : rubric?.rubric?.name + ', '
                                          )
                                        : '-'}
                                    </div>
                                    {/* <div className="flex w-2.5/10 items-center px-8 py-3 text-center justify-center text-s text-gray-500 leading-4 font-medium ">
                                              {editState.id !== item.id ? (
                                                <span
                                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium  w-auto ${
                                                    item.status === 'Inactive'
                                                      ? 'bg-yellow-100 text-yellow-800'
                                                      : item.status === 'Dropped'
                                                      ? 'bg-red-100 text-red-800'
                                                      : 'bg-green-100 text-green-800'
                                                  }`}>
                                                  {item.status}
                                                </span>
                                              ) : (
                                                <div className="text-gray-900">
                                                  <Selector
                                                    selectedItem={item.status}
                                                    placeholder="Select Status"
                                                    list={statusList}
                                                    onChange={(val, name, id) =>
                                                      onStatusChange(val, name, id, item)
                                                    }
                                                  />
                                                </div>
                                              )}
                                            </div>
                                             */}
                                    <span
                                      className={`w-1/10 flex items-center justify-center text-left px-8 py-3 cursor-pointer`}
                                      onClick={() => onDelete(item)}>
                                      <DeleteActionBtn
                                        handleClick={() => onDelete(item)}
                                      />
                                    </span>
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
              {CourseBuilderdict[userLanguage]['nolesson']}
            </div>
          )}
        </div>
      </div>
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

export default UnitManager;
