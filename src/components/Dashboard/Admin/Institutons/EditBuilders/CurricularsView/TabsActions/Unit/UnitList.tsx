import AddButton from 'atoms/Buttons/AddButton';
import {API, graphqlOperation} from 'aws-amplify';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {deleteUniversalSyllabus} from 'graphql/mutations';
import {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';

import Buttons from 'components/Atoms/Buttons';
import Filters, {SortType} from 'components/Atoms/Filters';
import Modal from 'components/Atoms/Modal';

import InsitutionSelector from '@components/Dashboard/Admin/InsitutionSelector';
import {useQuery} from '@tanstack/react-query';
import {RoomStatus} from 'API';
import {Descriptions, List, Tooltip} from 'antd';
import SearchInput from 'atoms/Form/SearchInput';
import Selector from 'atoms/Form/Selector';
import {Status} from 'components/Dashboard/Admin/UserManagement/UserStatus';
import UnitName from 'components/MicroComponents/UnitName';
import Table, {ITableProps} from 'components/Molecules/Table';
import {
  createUniversalSyllabusLesson,
  updateUniversalSyllabusLessonSequence
} from 'customGraphql/customMutations';
import {listUniversalSyllabuss} from 'customGraphql/customQueries';
import useAuth from 'customHooks/useAuth';
import usePagination from 'customHooks/usePagination';
import useSearch from 'customHooks/useSearch';
import {BUTTONS, InstitueRomms} from 'dictionary/dictionary.iconoclast';
import PageLayout from 'layout/PageLayout';
import {isEmpty, map, orderBy} from 'lodash';
import ModalPopUp from 'molecules/ModalPopUp';
import moment from 'moment';
import AttachedCourses from './AttachedCourses';
import UnitFormComponent from './UnitFormComponent';

const UnitList = ({
  instId,
  curricular,
  addedSyllabus,
  lessonPlans,
  lessonType,
  lessonId,
  isFromLesson,
  setAddedSyllabus,
  inner
}: any) => {
  const history = useHistory();
  const match = useRouteMatch();
  const {userLanguage} = useGlobalContext();

  const {isSuperAdmin} = useAuth();

  const {UnitLookupDict} = useDictionary();
  // ~~~~~~~~~~~~~~ UNIT LIST ~~~~~~~~~~~~~~ //
  const [loading, setLoading] = useState(true);

  const [units, setUnits] = useState<any>([]);

  const [addModalShow, setAddModalShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);

  const [allUnits, setAllUnits] = useState<any>([]);

  const [unitInput, setUnitInput] = useState<any>({});
  const [assignedUnits, setAssignedUnits] = useState<any>([]);

  const [selectedInstitution, setSelectedInstitution] = useState<any>({});

  const [totalNum, setTotalNum] = useState(0);

  const {
    pageCount,
    setFirstPage,
    setLastPage,
    setTotalPages,
    currentList,
    allAsProps,
    setCurrentList,
    getIndex,
    resetPagination
  } = usePagination(units, loading ? 0 : totalNum);

  useEffect(() => {
    fetchSyllabusList();
  }, [addedSyllabus]);

  const getUpdatedList = (items: any[]) => {
    const updatedList = items.map((item: any) => {
      return {
        ...item,
        status: item?.status || RoomStatus.ACTIVE,

        institutionId: item.institution.id,
        institutionName: item.institution.name,
        lessons: {
          ...(item.lessons || {}),
          items: item.lessons?.items
            // .filter(
            //   (_d: any) =>
            //     _d.lesson?.status?.toLowerCase() === item?.status?.toLowerCase()
            // )
            .map((lesson: any) => {
              if (lesson?.lesson?.id) {
                return {
                  ...lesson,
                  index: item?.universalLessonsSeq?.indexOf(lesson?.id)
                };
              }
            })
            .sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
        }
      };
    });

    return updatedList;
  };

  const getAssignedUnits = (list: any[]) => {
    let selectedSyllabus: any = [];
    addedSyllabus &&
      addedSyllabus.length > 0 &&
      addedSyllabus.forEach((item: any) => {
        const _item = list.find((unit: any) => item?.syllabusID === unit?.id);
        _item &&
          selectedSyllabus.push({
            ..._item,
            id: item?.id,
            syllabusId: item?.syllabusID
          });
      });

    return selectedSyllabus;
  };

  const fetchSyllabusList = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(listUniversalSyllabuss, {
          filter: isSuperAdmin
            ? undefined
            : {
                institutionID: {eq: instId}
              }
        })
      );

      const items = result.data?.listUniversalSyllabi.items;
      setLoading(false);
      return items;
    } catch (error) {
      setLoading(false);
    }
  };

  useQuery({
    queryKey: ['listUnits'],
    queryFn: fetchSyllabusList,
    onSuccess(data) {
      const items = data;
      setAllUnits(items);

      if (isFromLesson) {
        if (addedSyllabus && addedSyllabus.length > 0) {
          const assignedUnits = getAssignedUnits(items);

          setAssignedUnits(assignedUnits);

          const filtered = items.filter(
            (unit: any) =>
              !addedSyllabus.find((_d: {syllabusID: any}) => _d.syllabusID === unit.id)
          );

          // add label to the unit

          const updatedList = filtered
            ? filtered?.map((d: {name: any}) => ({...d, label: d.name}))
            : [];

          setUnits([...updatedList]);
        }
      } else {
        const updatedList = getUpdatedList(items);

        const totalListPages = Math.floor(updatedList.length / pageCount);

        setTotalPages(
          totalListPages * pageCount === updatedList.length
            ? totalListPages
            : totalListPages + 1
        );

        setTotalNum(updatedList.length);

        setCurrentList(updatedList);

        setFirstPage(true);
        setLastPage(!(updatedList.length > pageCount));
        setUnits(updatedList);
      }
    }
  });

  const updateUnitList = (inputObj: any) => {
    setUnits(units.filter((unitObj: any) => unitObj.id !== inputObj.id));
  };

  // ~ CHECK TO SEE IF UNIT CAN BE DELETED ~ //

  /****************************************************
   *   IF UNIT HAS ANY AMOUNT OF SYLLABI ATTACHED,    *
   * OR IF THIS UNIT HAS EVER HAD ANY ACTIVE LESSONS, *
   *            THEN DO NOT ALLOW A DELETE            *
   ****************************************************/
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<any>({
    show: false,
    message: '',
    action: () => {}
  });

  const handleToggleDelete = (targetString?: string, itemObj?: any) => {
    if (!deleteModal.show) {
      setDeleteModal({
        show: true,
        message: `Are you sure you want to delete the unit "${targetString}"?`,
        action: () => handleDelete(itemObj)
      });
    } else {
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  const handleDelete = async (item: any) => {
    setDeleting(true);
    try {
      console.log('deleting...');
      await API.graphql(
        graphqlOperation(deleteUniversalSyllabus, {
          input: {id: item.id}
        })
      );
      updateUnitList(item);
    } catch (e) {
      console.error('error deleting...', e);
    } finally {
      setDeleting(false);
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  // ~~~~~~~~~~~~ FUNCTIONALITY ~~~~~~~~~~~~ //

  const handleAdd = () => {
    history.push(`${match.url}/add`);
  };
  const handleView = (unitId: string) => {
    history.push(`${match.url}/${unitId}/edit`);
  };

  const updateRoomList = (institutionId: string) => {
    const filteredByInstitution = filterBySearchQuery(institutionId, ['institutionId']);

    if (Boolean(filteredByInstitution)) {
      setFilteredList(filteredByInstitution);
      setSearchInput({...searchInput, isActive: true});
    } else {
      removeSearchAction();
    }
  };

  const instituteChange = (value: string, option: any) => {
    setSelectedInstitution({name: value, id: option.id});
    updateRoomList(value);
  };

  const redirectToLesson = (institutionId: string, lessonId: string) => {
    const baseUrl = '/dashboard/manage-institutions';
    history.push(
      isSuperAdmin
        ? `${baseUrl}/lessons/${lessonId}`
        : `${baseUrl}/institution/${institutionId}/lessons/${lessonId}`
    );
  };

  const {
    searchInput,
    setSearch,
    checkSearchQueryFromUrl,
    filterBySearchQuery,
    removeSearchAction,
    searchAndFilter,
    setSearchInput
  } = useSearch([...(units || [])], ['name', 'institutionName']);

  const [filteredList, setFilteredList] = useState([...units]);

  useEffect(() => {
    if (!loading && units?.length > 0) {
      const query = checkSearchQueryFromUrl();
      if (query) {
        const items = filterBySearchQuery(query);
        if (Boolean(items)) {
          setFilteredList(items);
        }
      }
    }
  }, [loading, units?.length]);

  const searchRoom = () => {
    const searched = searchAndFilter(searchInput.value);
    if (Boolean(searched)) {
      setFilteredList(searched);
    } else {
      removeSearchAction();
    }
  };

  const list = isFromLesson ? assignedUnits : currentList;

  const finalList = orderBy(
    searchInput.isActive ? filteredList : list,
    ['name', 'institutionName'],
    ['asc']
  );

  const [filters, setFilters] = useState<SortType | null>(null);

  const updateFilter = (filterName: SortType) => {
    if (filterName === filters) {
      setSearchInput({...searchInput, isActive: false});
      setFilters(null);
      setFilteredList([]);
    } else {
      setSearchInput({...searchInput, isActive: true});
      const filtered = units.filter((_d: any) => filterName === _d.status);
      setFilteredList(filtered);
      setFilters(filterName);
      setSelectedInstitution({});
    }
  };
  const updateLessonSequence = async (unitId: string) => {
    const selectedItem = allUnits?.find((unit: any) => unit.id === unitId);
    const existingLessonSeq = selectedItem?.universalLessonsSeq || [];
    setUnits((prevUnits: any) => [...prevUnits, selectedItem]);
    await API.graphql(
      graphqlOperation(updateUniversalSyllabusLessonSequence, {
        input: {
          id: unitId,
          universalLessonsSeq: [...existingLessonSeq, lessonId]
        }
      })
    );
  };

  const addLessonToSyllabusLesson = async (unitId: string) => {
    try {
      const lessonComponentPlan: any =
        lessonPlans &&
        lessonPlans.map((item: any) => {
          return {
            disabled: false,
            open: lessonType !== 'lesson' ? true : false,
            active: lessonType !== 'lesson' ? true : false,
            stage: `checkpoint?id=${item.LessonComponentID}`,
            type: 'survey',
            displayMode: 'SELF'
          };
        });
      const input = {
        syllabusID: unitId,
        lessonID: lessonId,

        lessonPlan: lessonComponentPlan?.length > 0 ? lessonComponentPlan : [],
        status: 'ACTIVE'
      };
      setSaving(true);
      const result: any = await API.graphql(
        graphqlOperation(createUniversalSyllabusLesson, {
          input: input
        })
      );
      const newLesson = result.data?.createUniversalSyllabusLesson;
      if (newLesson?.id) {
        updateLessonSequence(unitId);
        setAddedSyllabus((prevValue: any) => [
          ...prevValue,
          {
            id: newLesson.id,
            syllabusID: input.syllabusID,
            lessonID: lessonId
          }
        ]);
        setUnits((prevUnits: any) =>
          prevUnits.filter((unit: any) => unit?.id !== input.syllabusID)
        );
        const selectedUnitData: any =
          allUnits.find((unit: any) => unit?.id === input.syllabusID) || {};
        setAssignedUnits((prevList: any) => [
          ...prevList,
          {
            ...selectedUnitData,
            id: newLesson?.id,
            syllabusId: input.syllabusID,
            lessons: {
              items: [
                ...(selectedUnitData.lessons.items || []),
                {
                  id: newLesson.id,
                  lesson: newLesson.lesson
                }
              ]
            }
          }
        ]);

        setUnitInput({
          id: '',
          name: ''
        });

        setSaving(false);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const postAddSyllabus = async (unitId: string) => {
    await addLessonToSyllabusLesson(unitId);
    onAddModalClose();
  };

  const onAddModalClose = () => {
    setAddModalShow(false);
  };

  const currentSelectedItem = (name: string) =>
    allUnits?.find((_c: any) => _c.name === name);

  const dataList = map(finalList, (item: any, index: number) => {
    return {
      no: getIndex(index),
      onClick: () => handleView(item.id),
      instituteName: isSuperAdmin && item.institution.name,
      status: <Status status={item.status} useDefault />,
      content: (
        <>
          <Descriptions title="Unit Details">
            <Descriptions.Item label="Status">
              {<Status status={currentSelectedItem(item.name).status} useDefault />}
            </Descriptions.Item>
            <Descriptions.Item label="Created date">
              {moment(item.createdAt).format('ll')}
            </Descriptions.Item>
            <Descriptions.Item label="Last update">
              {moment(item.updatedAt).format('ll')}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {currentSelectedItem(item.name)?.description || 'n/a'}
            </Descriptions.Item>
            <Descriptions.Item label="Attached courses">
              <AttachedCourses curricular={curricular} unitId={item.id} />
            </Descriptions.Item>
          </Descriptions>
        </>
      ),
      unitName: (
        <UnitName
          searchTerm={searchInput.value}
          editCurrentUnit={handleView}
          item={item}
        />
      ),

      lessonPlan: (
        <List
          size="small"
          className="table-list"
          dataSource={item.lessons?.items?.filter(Boolean)}
          renderItem={(lesson: any, index: number) => (
            <Tooltip
              key={lesson.lesson.id}
              title={`Go to ${lesson.lesson.title}`}
              placement="left">
              <List.Item
                className="cursor-pointer hover:underline hover:theme-text:400"
                onClick={() => redirectToLesson(item.institution.id, lesson.lesson.id)}>
                {index + 1}. {lesson.lesson.title}
              </List.Item>
            </Tooltip>
          )}
        />
      )
      // action: (
      //   <CommonActionsBtns
      //     button1Label="View"
      //     isDeletable={checkIfRemovable(item)}
      //     button1Action={() => handleView(item.id)}
      //     button2Action={() => handleToggleDelete(item.name, item)}
      //   />
      // )
    };
  });

  const tableConfig: ITableProps = {
    headers: [
      UnitLookupDict[userLanguage].NO,
      UnitLookupDict[userLanguage]['NAME'],
      isSuperAdmin && UnitLookupDict[userLanguage]['INSTITUTION_NAME'],
      UnitLookupDict[userLanguage]['LESSONS'],
      InstitueRomms[userLanguage]['STATUS']
      // UnitLookupDict[userLanguage]['ACTION']
    ],
    dataList,
    config: {
      dataList: {
        expandable: true,
        loading,
        pagination: {
          showPagination:
            !isFromLesson && !searchInput.isActive && totalNum > 0 && isEmpty(filters),
          config: {
            allAsProps
          }
        }
      }
    }
  };

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <PageLayout
      type={inner ? 'inner' : undefined}
      title={'Unit List'}
      extra={
        <div className={`w-auto flex gap-x-4 justify-end items-center`}>
          {isSuperAdmin && (
            <InsitutionSelector
              selectedInstitution={selectedInstitution?.label}
              onChange={instituteChange}
            />
          )}

          {showAddSection ? (
            <div className="flex items-center w-auto m-auto px-2 gap-x-4">
              <Selector
                selectedItem={unitInput.name}
                list={units}
                width={300}
                size="middle"
                showSearch
                placeholder="Select Unit"
                onChange={(name: string, option: any) =>
                  setUnitInput({name, id: option.id})
                }
              />
              <Buttons
                label={BUTTONS[userLanguage]['ADD']}
                disabled={saving || !unitInput.id}
                transparent={Boolean(inner)}
                onClick={() => addLessonToSyllabusLesson(unitInput.id)}
              />
              <Buttons
                label={BUTTONS[userLanguage]['CANCEL']}
                transparent={Boolean(inner)}
                onClick={() => setShowAddSection(false)}
              />
            </div>
          ) : null}
          {!showAddSection && (
            <SearchInput
              value={searchInput.value}
              onChange={setSearch}
              disabled={loading}
              onKeyDown={searchRoom}
              closeAction={removeSearchAction}
            />
          )}
          {isFromLesson && !isSuperAdmin && !showAddSection && (
            <Buttons
              label={'Add Lesson to Unit'}
              transparent={Boolean(inner)}
              onClick={() => setShowAddSection(true)}
            />
          )}

          {!isSuperAdmin && (
            <AddButton
              transparent={Boolean(inner)}
              label={UnitLookupDict[userLanguage]['NEW_UNIT']}
              onClick={isFromLesson ? () => setAddModalShow(true) : handleAdd}
            />
          )}
        </div>
      }>
      <div className="flex flex-col w-full">
        <Filters
          loading={loading}
          list={units}
          updateFilter={updateFilter}
          resetPagination={resetPagination}
          showingCount={
            isFromLesson
              ? null
              : {
                  currentPage: allAsProps.currentPage,
                  lastPage: allAsProps.lastPage,
                  totalResults: allAsProps.totalResults,
                  pageCount: allAsProps.pageCount
                }
          }
          filters={filters}
        />

        <Table {...tableConfig} />

        <Modal
          open={addModalShow}
          showHeader
          showFooter={false}
          showHeaderBorder
          title={'Add Lesson to Syllabus'}
          closeOnBackdrop
          closeAction={onAddModalClose}>
          <div
            className="min-w-180 lg:min-w-256"
            style={{
              height: 'calc(100vh - 150px)'
            }}>
            <UnitFormComponent
              isInModal={true}
              instId={instId}
              postAddSyllabus={postAddSyllabus}
              onCancel={() => setAddModalShow(false)}
            />
          </div>
        </Modal>

        <ModalPopUp
          open={deleteModal.show}
          closeAction={handleToggleDelete}
          saveAction={deleting ? () => {} : deleteModal.action}
          saveLabel={deleting ? 'DELETING...' : 'CONFIRM'}
          cancelLabel="CANCEL"
          loading={deleting}
          message={deleteModal.message}
        />
      </div>
    </PageLayout>
  );
};

export default UnitList;
