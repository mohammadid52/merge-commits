import {API, graphqlOperation} from 'aws-amplify';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router';

import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';

import {updateUniversalSyllabusLessonSequence} from 'customGraphql/customMutations';
import {
  listRoomsByActiveSyllabusId,
  listUniversalLessonsOptions
} from 'customGraphql/customQueries';
import {
  createUniversalSyllabusLesson,
  updateRoom,
  deleteUniversalSyllabusLesson
} from 'graphql/mutations';

import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import Table, {ITableProps} from '@components/Molecules/Table';
import useAuth from '@customHooks/useAuth';
import {logError} from 'graphql-functions/functions';
import {RoomStatus} from 'API';
import AddButton from 'atoms/Buttons/AddButton';
import Selector from 'atoms/Form/Selector';
import {map} from 'lodash';
import ModalPopUp from 'molecules/ModalPopUp';
import {getLessonType} from 'utilities/strings';
import {DragEndEvent} from '@dnd-kit/core';
import {arrayMove} from '@dnd-kit/sortable';

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

  const {userLanguage} = useGlobalContext();

  const {SyllabusDict} = useDictionary();

  const [loading, setLoading] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [allLessonsList, setAllLessonsList] = useState<any[]>([]);
  const [dropdownLessonsList, setDropdownLessonsList] = useState<any[]>([]);
  const [selectedLessonsList, setSelectedLessonsList] = useState<any[]>([]);

  const [selectedLesson, setSelectedLesson] = useState({
    id: '',
    name: '',
    value: ''
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
        graphqlOperation(listUniversalLessonsOptions, {
          filter: {
            institutionID: {eq: institutionId},
            status: {
              eq: syllabusDetails.status || RoomStatus.ACTIVE
            }
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
  }, []);

  // ~~~~~~~~~~~~~~~~~ CRUD ~~~~~~~~~~~~~~~~ //
  const createNewLesson = () => {
    history.push(
      `/dashboard/manage-institutions/institution/${institutionId}/lessons/add`
    );
  };

  const selectLesson = (value: string, option: any) => {
    setSelectedLesson({id: option.id, name: value, value});
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

        lessonPlan: lessonComponentPlan?.length > 0 ? lessonComponentPlan : [],
        status: RoomStatus.ACTIVE
      };

      const result: any = await API.graphql(
        graphqlOperation(createUniversalSyllabusLesson, {input})
      );
      const newLesson = result.data.createUniversalSyllabusLesson;

      if (!lessonsIds.length) {
        const associatedRooms: any = await API.graphql(
          graphqlOperation(listRoomsByActiveSyllabusId, {
            filter: {activeSyllabus: {eq: syllabusId}}
          })
        );
        associatedRooms?.data.listRooms.items?.map(async (room: any) => {
          await API.graphql(
            graphqlOperation(updateRoom, {
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

    let updatedTableList = filteredList
      .filter((d) => d.lesson !== null)
      .map((item) => {
        let tableList;
        const selectedLesson = savedLessonIds.find(
          (lesson) => lesson.lessonID === item.id
        );
        tableList = {
          ...item,
          status: selectedLesson?.status || RoomStatus.ACTIVE,
          uniqlessonId: selectedLesson?.id,
          measurements: selectedLesson?.measurements
        };
        return tableList;
      });

    const filteredDropDownList = lessonsDetails
      .filter(
        (item) =>
          !Boolean(
            updatedTableList.find(
              (lesson) => lesson.lesson && lesson.lesson.id === item.id
            )
          ) && Boolean(item.lessonPlan)
      )
      .map((item: {id: string; title: string; type: string; targetAudience: string}) => ({
        id: item.id,
        name: `${item.title} - ${item.targetAudience || 'All'}`,
        value: item.title
      }));

    updatedTableList = updatedTableList

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
  }, [allLessonsList]);

  const updateLessonSequence = async (lessonsIDs: string[]) => {
    setLessonsIds([...lessonsIDs]);
    await API.graphql(
      graphqlOperation(updateUniversalSyllabusLessonSequence, {
        input: {id: syllabusId, universalLessonsSeq: lessonsIDs}
      })
    );
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

  const handleToggleDelete = (targetString?: string, id?: any) => {
    if (!deleteModal.show) {
      setDeleteModal({
        show: true,
        message: `Are you sure you want to remove "${targetString}" from unit?`,
        action: () => handleDelete(id)
      });
    } else {
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  const {authId, email, isSuperAdmin} = useAuth();

  const handleDelete = async (id: any) => {
    setDeleting(true);
    try {
      setSelectedLessonsList((list: any) => list.filter((_item: any) => _item.id !== id));
      setSavedLessonsList((prevList: any) =>
        prevList.filter((item: any) => item.id !== id)
      );
      updateListAndDropdown();
      setDeleting(false);
      setDeleteModal({show: false, message: '', action: () => {}});
      await API.graphql(
        graphqlOperation(deleteUniversalSyllabusLesson, {
          input: {id: id}
        })
      );

      await updateLessonSequence(lessonsIds.filter((lessonId: any) => lessonId !== id));
    } catch (e) {
      logError(e, {authId, email}, 'LessonPlanManager @handleDelete');
      console.error('error deleting...', e);
    } finally {
      setDeleting(false);
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  const gotoLessonBuilder = (id: string, _: string) => {
    history.push(
      isSuperAdmin
        ? `/dashboard/manage-institutions/lessons/${id}`
        : `/dashboard/manage-institutions/institution/${institutionId}/lessons/${id}`
    );
  };

  const dict = SyllabusDict[userLanguage]['TABLE_HEADS'];

  const dataList = map(selectedLessonsList, (item, idx) => {
    const lessonObj = item.lesson;
    return {
      no: idx + 1,
      id: item.id,
      onClick: () => {
        gotoLessonBuilder(lessonObj.id, lessonObj.type);
      },
      lessonName: <div className="cursor-pointer">{lessonObj.title || '--'}</div>,
      type: lessonObj.type || '--',
      measurements:
        lessonObj?.measurements?.length > 0
          ? lessonObj?.measurements?.map((rubric: any, index: number) =>
              index === lessonObj?.measurements?.length - 1
                ? rubric?.rubric?.name + '.'
                : rubric?.rubric?.name + ', '
            )
          : '-'
      // actions: (
      //   <CommonActionsBtns
      //     button1Label="View"
      //     isDeletable={checkIfRemovable(lessonObj, syllabusDetails)}
      //     button1Action={() => gotoLessonBuilder(lessonObj.id, lessonObj.type)}
      //     button2Action={() => handleToggleDelete(lessonObj.title, item.id)}
      //   />
      // )
    };
  });

  const updateSortedListToUI = (updatedIds: string[]) => {
    let sorted = selectedLessonsList
      .map((t: any) => {
        let index = updatedIds?.indexOf(t.id);
        return {...t, index};
      })
      .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

    setSelectedLessonsList(sorted);
  };

  const onDragEnd = ({active, over}: DragEndEvent) => {
    if (active.id !== over?.id) {
      const prev = dataList;
      const activeIndex = prev.findIndex((i) => i.id === active.id);
      const overIndex = prev.findIndex((i) => i.id === over?.id);
      const ids = arrayMove(prev, activeIndex, overIndex).map((i) => i.id);

      updateSortedListToUI(ids);
      updateLessonSequence(ids);
    }
  };

  const tableConfig: ITableProps = {
    headers: [dict['NUMBER'], dict['LESSON_NAME'], dict['TYPE'], dict['MEASUREMENTS']],
    dataList,
    config: {
      dataList: {
        loading,
        sortableConfig: {
          onSort: onDragEnd
        }
      }
    }
  };

  return (
    <div className="">
      {/* *************** SECTION HEADER ************ */}

      <SectionTitleV3
        title={'Lesson Plan Manager'}
        withButton={
          <div className="flex gap-x-4 justify-end items-center">
            <Selector
              selectedItem={selectedLesson.name}
              list={dropdownLessonsList}
              placeholder={SyllabusDict[userLanguage]['SELECT_LESSON']}
              onChange={selectLesson}
              width={250}
              showSearch
              size="middle"
            />

            <AddButton
              // className="ml-4 py-1"
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

      <Table {...tableConfig} />

      {messages.show && <p className="text-sm text-red-500">{messages.message}</p>}

      <ModalPopUp
        open={deleteModal.show}
        closeAction={handleToggleDelete}
        saveAction={deleting ? () => {} : deleteModal.action}
        saveLabel={deleting ? 'DELETING...' : 'CONFIRM'}
        cancelLabel="CANCEL"
        message={deleteModal.message}
      />

      <ModalPopUp
        open={warnModal2.show}
        closeAction={closeLessonAction}
        saveAction={warnModal2.action}
        saveLabel="Yes"
        message={warnModal2.message}
        loading={deleting}
      />
    </div>
  );
};

export default LessonPlanManager;
