import React, {Fragment, useContext, useEffect, useState} from 'react';
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
import CurriculumList from '@components/Dashboard/Admin/Institutons/Listing/CurriculumList';
import UnitManagerRow from './UnitManagerRow';

interface UIMessages {
  show: boolean;
  message: string;
  isError: boolean;
  lessonError?: boolean;
}

const UnitManager = ({
  courseId,
  courseData,
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

  // ~~~~~~~~~~~~~~~~ STATE ~~~~~~~~~~~~~~~~ //
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

  // ~~~~~~~~~~~~ FUnCTIONALITY ~~~~~~~~~~~~ //
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

  // ~~~~~ CHECK IF UNIT CAN BE DELETED ~~~~ //

  /********************************************************
   * BASICALLY CHECK IF THIS UNIT HAS EVER BEEN ACTIVATED *
   *       IN THE PARENT CURRICULUM, AND IF IT HAS,       *
   *          THIS UNIT SHOULD NOT BE REMOVABLE           *
   ********************************************************/
  const [deleteModal, setDeleteModal] = useState<any>({
    show: false,
    message: '',
    action: () => {},
  });

  const checkIfRemovable = (unitObj: any, curriculumObj: any) => {
    if (
      curriculumObj?.syllabiHistory &&
      curriculumObj?.syllabiHistory?.length > 0 &&
      curriculumObj?.syllabiHistory.includes(unitObj.unitId)
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleToggleDelete = (targetString?: string, itemObj?: any) => {
    if (!deleteModal.show) {
      setDeleteModal({
        show: true,
        message: `Are you sure you want to remove "${targetString}" from course?`,
        action: () => handleDelete(itemObj),
      });
    } else {
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  const handleDelete = async (item: any) => {
    try {
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
    } catch (e) {
      console.error('Problem deleting Unit from UnitManager - ', e);
    } finally {
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  // const onDelete = (item: any) => {
  //   const onDrop = async () => {
  //     setDeleting(true);
  //     await API.graphql(
  //       graphqlOperation(customMutations.deleteCurriculumUnits, {
  //         input: {id: item.id},
  //       })
  //     );
  //     await updateSyllabusSequence(
  //       syllabusIds.filter((unitId: any) => unitId !== item.unitId)
  //     );
  //     setSelectedSyllabusList((list: any) =>
  //       list.filter((_item: any) => _item.id !== item.id)
  //     );
  //     setSavedSyllabusList((prevList: any) =>
  //       prevList.filter((syllabus: any) => syllabus.id !== item.id)
  //     );
  //     setDeleting(false);
  //     closeLessonAction();
  //   };
  //   setWarnModal2({
  //     show: true,
  //     message: `Are you sure you want to remove ${item.name} from course?`,
  //     action: onDrop,
  //   });
  // };

  // ~~~~~~~~~~~~~~ DRAG & NAV ~~~~~~~~~~~~~ //
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
          let index = list.indexOf(t.unitId);
          return {...t, index};
        })
        .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

      setSelectedSyllabusList(syllabusList);
      // Graphql mutation to update syllabus lesson seq
      updateSyllabusSequence(list);
    }
  };

  const closeLessonAction = () => {
    setWarnModal2({...warnModal2, show: false});
  };

  const goToUnitBuilder = (id: string, type: string) => {
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
        `/dashboard/manage-institutions/institution/${institutionId}/units/${id}/edit`
      );
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
            <Fragment>
              {/* *************** SYLLABUS TABLE HEADERS ************ */}
              <div className="flex justify-between w-full bg-gray-50  px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                <div className="w-1/10 px-8 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{CourseBuilderDict[userLanguage]['TABLE_HEADS']['NUMBER']}</span>
                </div>
                <div className="w-8/10 px-8 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>
                    {CourseBuilderDict[userLanguage]['TABLE_HEADS']['UNIT_NAME']}
                  </span>
                </div>
                <div className="w-1/10 m-auto py-3 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
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
                                  <UnitManagerRow
                                    index={index}
                                    item={item}
                                    checkIfRemovable={checkIfRemovable}
                                    handleToggleDelete={handleToggleDelete}
                                    goToUnitBuilder={goToUnitBuilder}
                                    courseObj={courseData}
                                  />
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
              {deleteModal.show && (
                <ModalPopUp
                  closeAction={handleToggleDelete}
                  saveAction={deleting ? () => {} : deleteModal.action}
                  saveLabel={deleting ? 'DELETING...' : 'CONFIRM'}
                  cancelLabel="CANCEL"
                  message={deleteModal.message}
                />
              )}
            </Fragment>
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
