import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import AddButton from 'atoms/Buttons/AddButton';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import * as mutations from 'graphql/mutations';
import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';

import Filters, {SortType} from '@components/Atoms/Filters';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import useSearch from '@customHooks/useSearch';
import * as customMutations from 'customGraphql/customMutations';
import {BUTTONS, InstitueRomms} from '@dictionary/dictionary.iconoclast';
import {RoomStatus} from 'API';
import SearchInput from 'atoms/Form/SearchInput';
import Selector from 'atoms/Form/Selector';
import Loader from 'atoms/Loader';
import ErrorBoundary from 'components/Error/ErrorBoundary';
import * as customQueries from 'customGraphql/customQueries';
import {orderBy} from 'lodash';
import ModalPopUp from 'molecules/ModalPopUp';
import UnitListRow from './UnitListRow';
import Modal from '@components/Atoms/Modal';
import UnitFormComponent from './UnitFormComponent';
import Buttons from '@components/Atoms/Buttons';

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
  const {
    state: {
      user: {isSuperAdmin, authId, email}
    },

    userLanguage
  } = useContext(GlobalContext);

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
            .filter(
              (_d: any) =>
                _d.lesson?.status?.toLowerCase() === item?.status?.toLowerCase()
            )
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
        selectedSyllabus.push({
          ...list.find((unit: any) => item?.syllabusID === unit?.id),
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
        graphqlOperation(customQueries.listInstitutionOptions)
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

  const redirectToInstitution = (institutionId: string) => {
    history.push(
      `/dashboard/manage-institutions/institution/${institutionId}/edit?back=${match.url}`
    );
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

  const list = isFromLesson ? assignedUnits : units;

  const finalList = orderBy(
    searchInput.isActive ? filteredList : list,
    ['name', 'institutionName'],
    ['asc']
  );

  const [filters, setFilters] = useState<SortType>();

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
        displayData: {
          breakdownComponent: lessonType
        },
        lessonPlan: lessonComponentPlan?.length > 0 ? lessonComponentPlan : [],
        status: 'Active'
      };
      setSaving(true);
      const result: any = await API.graphql(
        graphqlOperation(customMutations.createUniversalSyllabusLesson, {input: input})
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
    units?.find((_c: any) => _c.name === hoveringItem?.name);

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <div className="pt-0 flex m-auto justify-center h-full p-8">
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
                    onChange={(val, name, id) => setUnitInput({name, id})}
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
          filters={filters}
        />

        {loading ? (
          <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
            <div className="w-5/10">
              <Loader animation />
            </div>
          </div>
        ) : finalList?.length ? (
          <>
            <div className="w-full m-auto ">
              <div className="flex justify-between bg-gray-50 whitespace-nowrap">
                <div className="w-1/10 px-8 py-4 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{UnitLookupDict[userLanguage]['NO']}</span>
                </div>
                <div
                  className={`w-4/10 px-8 py-4 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}>
                  <span>{UnitLookupDict[userLanguage]['NAME']}</span>
                </div>
                {isSuperAdmin && (
                  <div className="w-2/10 px-8 py-4 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider truncate">
                    <span>{UnitLookupDict[userLanguage]['INSTITUTION_NAME']}</span>
                  </div>
                )}
                <div
                  className={`${
                    isSuperAdmin ? 'w-2/10' : 'w-4/10'
                  } px-8 py-4 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}>
                  <span>{UnitLookupDict[userLanguage]['LESSONS']}</span>
                </div>
                <span className="bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider w-1/10 flex items-center ">
                  {InstitueRomms[userLanguage]['STATUS']}
                </span>
                <div className="w-1/10 m-auto py-4 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-auto">{UnitLookupDict[userLanguage]['ACTION']}</span>
                </div>
              </div>
            </div>

            <div className="mb-8 w-full m-auto flex-1 overflow-y-auto">
              {finalList.map((unit: any, index: number) => {
                return (
                  <ErrorBoundary
                    authId={authId}
                    email={email}
                    componentName="UnitListRow"
                    key={`unit_list_row_${index}`}
                    fallback={<h1 className="hidden"> </h1>}>
                    <UnitListRow
                      key={`unit_list_row_${index}`}
                      index={index}
                      searchInput={searchInput.value}
                      hoveringItem={hoveringItem}
                      setHoveringItem={setHoveringItem}
                      currentSelectedItem={currentSelectedItem}
                      item={unit}
                      isLast={finalList.length - 5 <= index}
                      checkIfRemovable={checkIfRemovable}
                      curricular={curricular}
                      handleToggleDelete={handleToggleDelete}
                      editCurrentUnit={handleView}
                      isSuperAdmin={isSuperAdmin}
                      redirectToInstitution={() =>
                        redirectToInstitution(unit.institution?.id)
                      }
                      redirectToLesson={(lessonId: string) =>
                        redirectToLesson(unit.institution?.id, lessonId)
                      }
                    />
                  </ErrorBoundary>
                );
              })}
            </div>
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
          </>
        ) : (
          <>
            {!isSuperAdmin && (
              <div className="flex justify-center mt-8">
                <AddButton
                  className="mx-4"
                  label={UnitLookupDict[userLanguage]['NEW_UNIT']}
                  onClick={handleAdd}
                />
              </div>
            )}
            <p className="text-center p-16">
              {' '}
              {searchInput.isActive || selectedInstitution?.id
                ? CommonlyUsedDict[userLanguage]['NO_SEARCH_RESULT']
                : UnitLookupDict[userLanguage]['INFO']}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default UnitList;
