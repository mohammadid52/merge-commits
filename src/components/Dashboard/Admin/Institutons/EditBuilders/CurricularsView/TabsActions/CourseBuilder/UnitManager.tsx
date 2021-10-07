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
  courseId,
  institutionId,
  savedSyllabusList,
  setSavedSyllabusList,
  syllabusIds,
  setSyllabusIds,
}: any) => {
  const history = useHistory();

  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const {CourseBuilderDict} = useDictionary(clientKey);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const [loading, setLoading] = useState(false);
  const [addingSyllabus, setAddingSyllabus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [allSyllabusList, setAllSyllabusList] = useState([]);
  const [dropdownSyllabusList, setDropdownSyllabusList] = useState([]);
  const [selectedSyllabusList, setSelectedSyllabusList] = useState([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState({
    id: '',
    name: '',
    value: '',
  });
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    lessonPlan: false,
    lessonEdit: false,
    message: CourseBuilderDict[userLanguage]['MESSAGES']['wantsave'],
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
    if (savedSyllabusList?.length && !syllabusIds.length) {
      const syllabusSeq = savedSyllabusList.map((item: any) => item.unitId);
      updateSyllabusSequence(syllabusSeq);
    }
  }, [savedSyllabusList]);

  const createNewUnit = () => {
    if (unsavedChanges) {
      setWarnModal({
        ...warnModal,
        lessonPlan: true,
        show: !warnModal.show,
        lessonEdit: false,
      });
      return;
    }
    history.push(`/dashboard/manage-institutions/institution/${institutionId}/units/add`);
  };

  const handleSelectSyllabus = (value: string, name: string, id: string) => {
    setSelectedSyllabus({id, name, value});
  };

  const addNewSyllabusToCourse = async () => {
    try {
      setAddingSyllabus(true);

      const input = {
        unitId: selectedSyllabus.id,
        curriculumId: courseId,
      };

      const result: any = await API.graphql(
        graphqlOperation(mutations.createCurriculumUnits, {input})
      );
      const newSyllabus = result.data.createCurriculumUnits;

      if (!syllabusIds.length) {
        await updateSyllabusSequence([newSyllabus.unitId]);
      } else {
        await updateSyllabusSequence([...syllabusIds, newSyllabus.unitId]);
      }
      setSelectedSyllabus({id: '', name: '', value: ''});
      setSavedSyllabusList([...savedSyllabusList, newSyllabus]);
      setAddingSyllabus(false);
    } catch {
      setAddingSyllabus(false);
      setMessages({
        show: true,
        message: CourseBuilderDict[userLanguage]['MESSAGES']['UPDATE_ERROR'],
        isError: true,
        lessonError: true,
      });
    }
  };

  const updateListAndDropdown = async () => {
    // To update table list and dropdown as per selected items.
    const savedSyllabusIds = [...savedSyllabusList];
    let filteredList = savedSyllabusIds.map((assignedSyllabus) => ({
      ...assignedSyllabus.unit,
      id: assignedSyllabus.id,
      unitId: assignedSyllabus.unitId,
    }));
    const filteredDropDownList = allSyllabusList.filter((item) =>
      filteredList.find((unit) => unit.unitId === item.id) ? false : true
    );

    filteredList = filteredList
      .map((t: any) => {
        let index = syllabusIds?.indexOf(t.unitId);
        return {...t, index};
      })
      .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

    setSelectedSyllabusList(filteredList);
    setDropdownSyllabusList(
      filteredDropDownList.map((item: {id: string; name: string}) => ({
        id: item.id,
        name: item.name,
        value: item.name,
      }))
    );
  };

  useEffect(() => {
    if (savedSyllabusList?.length && !syllabusIds.length) {
      const lessonSeq = savedSyllabusList.map((item: any) => item.id);
      updateSyllabusSequence(lessonSeq);
    }
  }, [savedSyllabusList]);

  useEffect(() => {
    if (Array.isArray(savedSyllabusList) && savedSyllabusList.length) {
      updateListAndDropdown();
    } else {
      if (allSyllabusList.length) {
        const updatedList = allSyllabusList.map((item: {id: string; name: string}) => ({
          id: item.id,
          name: item.name,
          value: item.name,
        }));
        setDropdownSyllabusList([...updatedList]);
      }
    }
  }, [savedSyllabusList, allSyllabusList]);

  const closeLessonAction = () => {
    setWarnModal2({...warnModal2, show: false});
  };

  useEffect(() => {
    fetchSyllabusList();
  }, [institutionId]);

  const fetchSyllabusList = async () => {
    try {
      setLoading(true);
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listUniversalSyllabusOptions, {
          filter: {institutionID: {eq: institutionId}},
        })
      );
      const savedData = result.data.listUniversalSyllabuss;
      const sortedList = savedData?.items?.sort((a: any, b: any) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      );
      // setDropdownSyllabusList([...updatedList]);
      setAllSyllabusList([...sortedList]);
      setLoading(false);
    } catch {
      setMessages({
        show: true,
        message: CourseBuilderDict[userLanguage]['MESSAGES']['fetchlist'],
        isError: true,
        lessonError: true,
      });
    }
  };

  const onDelete = (item: any) => {
    const onDrop = async () => {
      setDeleting(true);
      await API.graphql(
        graphqlOperation(customMutations.deleteCurriculumUnits, {
          input: {id: item.id},
        })
      );
      await updateSyllabusSequence(
        syllabusIds.filter((unitId: any) => unitId !== item.unitId)
      );
      setSelectedSyllabusList((list: any) =>
        list.filter((_item: any) => _item.id !== item.id)
      );
      setSavedSyllabusList((prevList: any) =>
        prevList.filter((syllabus: any) => syllabus.id !== item.id)
      );
      setDeleting(false);
      closeLessonAction();
    };
    setWarnModal2({
      show: true,
      message: `Are you sure you want to remove ${item.name} from course?`,
      action: onDrop,
    });
  };

  const updateSyllabusSequence = async (syllabusIDs: string[]) => {
    setSyllabusIds(syllabusIDs);
    await API.graphql(
      graphqlOperation(customMutations.updateCurriculumSyllabusSequence, {
        input: {
          id: courseId,
          universalSyllabusSeq: syllabusIDs,
        },
      })
    );
  };

  const onDragEnd = async (result: any) => {
    if (result.source.index !== result.destination.index) {
      const list: any = reorder(
        syllabusIds,
        result.source.index,
        result.destination.index
      );
      setSyllabusIds(list);
      let syllabusList = selectedSyllabusList
        .map((t: any) => {
          let index = list.indexOf(t.id);
          return {...t, index};
        })
        .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

      setSelectedSyllabusList(syllabusList);
      // Graphql mutation to update syllabus lesson seq
      updateSyllabusSequence(list);
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
          {CourseBuilderDict[userLanguage]['LESSON_PLAN_HEADING']}
        </h3> */}
        <div className="flex justify-end">
          <AddButton
            label={CourseBuilderDict[userLanguage]['ADD_NEW_UNIT']}
            onClick={createNewUnit}
          />
        </div>
      </div>
      {/* *************** ADD LESSON TO SYLLABUS SECTION ************ */}
      <div className="w-full m-auto p-4">
        <div className="my-8 w-6/10 m-auto flex items-center justify-center">
          <div className="mr-4">
            <Selector
              selectedItem={selectedSyllabus.value}
              list={dropdownSyllabusList}
              placeholder={CourseBuilderDict[userLanguage]['SELECT_UNIT']}
              onChange={handleSelectSyllabus}
            />
          </div>
          <div className="ml-4 w-auto">
            <AddButton
              className="ml-4 py-1"
              label={'Add'}
              onClick={addNewSyllabusToCourse}
              disabled={!Boolean(selectedSyllabus.value) || addingSyllabus}
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

        {/* *************** SYLLABUS LIST ************ */}
        <div>
          {loading ? (
            <div className="h-100 flex justify-center items-center">
              <div className="w-5/10">
                <Loader />
              </div>
            </div>
          ) : selectedSyllabusList?.length > 0 ? (
            <div>
              {/* *************** SYLLABUS TABLE HEADERS ************ */}
              <div className="flex justify-between w-full bg-gray-50  px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                <div className="w-.5/10 px-8 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{CourseBuilderDict[userLanguage]['TABLE_HEADS']['NUMBER']}</span>
                </div>
                <div className="w-2/10 px-8 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>
                    {CourseBuilderDict[userLanguage]['TABLE_HEADS']['UNIT_NAME']}
                  </span>
                </div>
                <div className="w-1/10 px-8 py-3 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{CourseBuilderDict[userLanguage]['TABLE_HEADS']['ACTION']}</span>
                </div>
              </div>

              <div className="max-h-88 overflow-y-auto mb-10">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided1, snapshot) => (
                      <div {...provided1.droppableProps} ref={provided1.innerRef}>
                        {selectedSyllabusList.map((item, index) => {
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
                                      {item.name || '--'}
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
              {CourseBuilderDict[userLanguage]['NO_UNIT']}
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
