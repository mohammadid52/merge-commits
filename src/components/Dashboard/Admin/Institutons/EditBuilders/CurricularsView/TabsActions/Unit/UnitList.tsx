import AddButton from 'atoms/Buttons/AddButton';
import {API, graphqlOperation} from 'aws-amplify';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import * as mutations from 'graphql/mutations';
import {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';

import Buttons from '@components/Atoms/Buttons';
import Filters, {SortType} from '@components/Atoms/Filters';
import Modal from '@components/Atoms/Modal';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import Tooltip from '@components/Atoms/Tooltip';
import {Status} from '@components/Dashboard/Admin/UserManagement/UserStatus';
import CommonActionsBtns from '@components/MicroComponents/CommonActionsBtns';
import UnitName from '@components/MicroComponents/UnitName';
import Table from '@components/Molecules/Table';
import useAuth from '@customHooks/useAuth';
import usePagination from '@customHooks/usePagination';
import useSearch from '@customHooks/useSearch';
import {BUTTONS, InstitueRomms} from '@dictionary/dictionary.iconoclast';
import {withZoiqFilter} from '@utilities/functions';
import {RoomStatus} from 'API';
import SearchInput from 'atoms/Form/SearchInput';
import Selector from 'atoms/Form/Selector';
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import {isEmpty, map, orderBy} from 'lodash';
import ModalPopUp from 'molecules/ModalPopUp';
import UnitFormComponent from './UnitFormComponent';

export const UnitList = ({
  instId,
  curricular,
  addedSyllabus,
  lessonPlans,
  lessonType,
  lessonId,
  isFromLesson,
  setAddedSyllabus
}: any) => {
  const history = useHistory();
  const match = useRouteMatch();
  const {userLanguage} = useGlobalContext();

  const {isSuperAdmin} = useAuth();

  const {CommonlyUsedDict, UnitLookupDict} = useDictionary();
  // ~~~~~~~~~~~~~~ UNIT LIST ~~~~~~~~~~~~~~ //
  const [loading, setLoading] = useState(true);
  const [institutionList, setInstitutionList] = useState<any>([]);
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
    getIndex
  } = usePagination(units, loading ? 0 : totalNum);

  useEffect(() => {
    fetchSyllabusList();
    fetchInstitutions();
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
        graphqlOperation(customQueries.listUniversalSyllabuss, {
          filter: isSuperAdmin
            ? undefined
            : {
                institutionID: {eq: instId}
              }
        })
      );

      const items = result.data?.listUniversalSyllabi.items;
      setAllUnits(items);

      if (isFromLesson) {
        if (addedSyllabus && addedSyllabus.length > 0) {
          const assignedUnits = getAssignedUnits(items);

          setAssignedUnits(assignedUnits);

          const filtered = items.filter(
            (unit: any) =>
              !addedSyllabus.find((_d: {syllabusID: any}) => _d.syllabusID === unit.id)
          );

          setUnits([...filtered]);
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

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

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

  const checkIfRemovable = (unitObj: any) => {
    if (
      unitObj.lessons?.items?.length > 0 ||
      (unitObj.lessonHistory && unitObj.lessonHistory?.length > 0) ||
      unitObj?.isUsed
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
        graphqlOperation(mutations.deleteUniversalSyllabus, {
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

  const fetchInstitutions = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listInstitutionOptions, {
          filter: withZoiqFilter({})
        })
      );
      setInstitutionList(
        list.data?.listInstitutions?.items.sort((a: any, b: any) =>
          a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
        )
      );
    } catch (error) {}
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

  const instituteChange = (_: string, name: string, value: string) => {
    setSelectedInstitution({name, id: value});
    updateRoomList(value);
  };

  const onInstitutionSelectionRemove = () => {
    setSelectedInstitution({});
    // onSearch(searchInput, '');
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
  }, [loading]);

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
      graphqlOperation(customMutations.updateUniversalSyllabusLessonSequence, {
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
        graphqlOperation(customMutations.createUniversalSyllabusLesson, {
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

  const [hoveringItem, setHoveringItem] = useState<{name?: string}>({});

  const currentSelectedItem =
    hoveringItem &&
    hoveringItem?.name &&
    allUnits?.find((_c: any) => _c.name === hoveringItem?.name);

  const dataList = map(finalList, (item: any, index: number) => ({
    no: getIndex(index),
    instituteName: isSuperAdmin && item.institution.name,
    status: <Status status={item.status} useDefault />,
    unitName: (
      <UnitName
        currentSelectedItem={currentSelectedItem}
        hoveringItem={hoveringItem}
        searchTerm={searchInput.value}
        editCurrentUnit={handleView}
        isLast={finalList.length - 5 <= index}
        curricular={curricular}
        setHoveringItem={setHoveringItem}
        isSuperAdmin={isSuperAdmin}
        item={item}
      />
    ),

    lessonPlan: (
      <div>
        {item.lessons?.items?.length > 0 ? (
          <ol className="list-decimal">
            {item.lessons?.items?.map(
              (lesson: {id: string; lesson: {id: string; title: string}}) => {
                if (lesson) {
                  return (
                    <Tooltip
                      text={`Go to ${lesson.lesson.title}`}
                      placement="left"
                      key={lesson.id}>
                      <li
                        className="mb-2 cursor-pointer hover:underline hover:theme-text:400"
                        key={lesson.lesson.id}
                        onClick={() =>
                          redirectToLesson(item.institution.id, lesson.lesson.id)
                        }>
                        {lesson.lesson.title}
                      </li>
                    </Tooltip>
                  );
                }
                return <div className="hidden w-auto" />;
              }
            )}
          </ol>
        ) : (
          <p className="">No lesson plan</p>
        )}
      </div>
    ),
    action: (
      <CommonActionsBtns
        button1Label="View"
        isDeletable={checkIfRemovable(item)}
        button1Action={() => handleView(item.id)}
        button2Action={() => handleToggleDelete(item.name, item)}
      />
    )
  }));

  const tableConfig = {
    headers: [
      UnitLookupDict[userLanguage]['NO'],
      UnitLookupDict[userLanguage]['NAME'],
      isSuperAdmin && UnitLookupDict[userLanguage]['INSTITUTION_NAME'],
      UnitLookupDict[userLanguage]['LESSONS'],
      InstitueRomms[userLanguage]['STATUS'],
      UnitLookupDict[userLanguage]['ACTION']
    ],
    dataList,
    config: {
      dark: false,

      isFirstIndex: true,
      headers: {textColor: 'text-white'},
      dataList: {
        loading,
        pagination: {
          showPagination:
            !isFromLesson && !searchInput.isActive && totalNum > 0 && isEmpty(filters),
          config: {
            allAsProps
          }
        },
        emptyText:
          searchInput.isActive || selectedInstitution?.id
            ? CommonlyUsedDict[userLanguage]['NO_SEARCH_RESULT']
            : UnitLookupDict[userLanguage]['INFO'],
        customWidth: {
          no: 'w-12',
          unitName: 'w-96',
          lessonPlan: 'w-96',
          action: 'w-auto'
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

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <div className="pt-0 flex m-auto justify-center h-full p-4">
      <div className="flex flex-col">
        <SectionTitleV3
          title={'Unit List'}
          fontSize="xl"
          fontStyle="semibold"
          extraClass="leading-6 text-gray-900"
          borderBottom
          shadowOff
          withButton={
            <div className={`w-auto flex gap-x-4 justify-end items-center`}>
              {isSuperAdmin && (
                <Selector
                  placeholder={UnitLookupDict[userLanguage]['SELECT_INSTITUTION']}
                  list={institutionList}
                  selectedItem={selectedInstitution?.name}
                  onChange={instituteChange}
                  arrowHidden={true}
                  additionalClass={'w-auto lg:w-48'}
                  isClearable
                  onClear={onInstitutionSelectionRemove}
                />
              )}

              {showAddSection ? (
                <div className="flex items-center w-auto m-auto px-2 gap-x-4">
                  <Selector
                    selectedItem={unitInput.name}
                    list={units}
                    placeholder="Select Unit"
                    onChange={(_, name, id) => setUnitInput({name, id})}
                  />
                  <Buttons
                    label={BUTTONS[userLanguage]['ADD']}
                    disabled={saving || !unitInput.id}
                    onClick={() => addLessonToSyllabusLesson(unitInput.id)}
                  />
                  <Buttons
                    label={BUTTONS[userLanguage]['CANCEL']}
                    onClick={() => setShowAddSection(false)}
                  />
                </div>
              ) : null}
              {!showAddSection && (
                <SearchInput
                  dataCy="unit-search-input"
                  value={searchInput.value}
                  onChange={setSearch}
                  isActive={searchInput.isActive}
                  disabled={loading}
                  onKeyDown={searchRoom}
                  closeAction={removeSearchAction}
                />
              )}
              {isFromLesson && !isSuperAdmin && !showAddSection && (
                <Buttons
                  label={'Add Lesson to Unit'}
                  onClick={() => setShowAddSection(true)}
                />
              )}

              {!isSuperAdmin && (
                <AddButton
                  label={UnitLookupDict[userLanguage]['NEW_UNIT']}
                  onClick={isFromLesson ? () => setAddModalShow(true) : handleAdd}
                />
              )}
            </div>
          }
        />

        <Filters
          loading={loading}
          list={units}
          updateFilter={updateFilter}
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

        {addModalShow && (
          <Modal
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
        )}
        {deleteModal.show && (
          <ModalPopUp
            closeAction={handleToggleDelete}
            saveAction={deleting ? () => {} : deleteModal.action}
            saveLabel={deleting ? 'DELETING...' : 'CONFIRM'}
            cancelLabel="CANCEL"
            loading={deleting}
            message={deleteModal.message}
          />
        )}
      </div>
    </div>
  );
};

export default UnitList;
