import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import useAuth from '@customHooks/useAuth';
import useSearch from '@customHooks/useSearch';
import {InstitueRomms} from '@dictionary/dictionary.iconoclast';
import {logError} from '@graphql/functions';
import {RoomStatus} from 'API';
import AddButton from 'atoms/Buttons/AddButton';
import SearchInput from 'atoms/Form/SearchInput';
import Selector from 'atoms/Form/Selector';
import Loader from 'atoms/Loader';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import * as mutations from 'graphql/mutations';
import {orderBy, update} from 'lodash';
import ModalPopUp from 'molecules/ModalPopUp';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';
import CurriculumListRow from './CurriculumListRow';
import {Filters, SortType} from './RoomsList';

interface CurriculumListProps {
  curricular?: {items: ICurricular[]};
  updateCurricularList?: any;
  instId: string;
  instName: string;
}

interface ICurricular {
  name?: string;
  status?: string;
  id: string;
  institutionID: string;
  institution?: {name?: string; id: string};
  universalSyllabusSeq: Array<string>;
  universalSyllabus: {items: Array<any>};
}

const CurriculumList = ({
  curricular,
  updateCurricularList,
  instId
}: CurriculumListProps) => {
  const match = useRouteMatch();
  const history = useHistory();
  // ~~~~~~~~~~ CONTEXT_SPLITTING ~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const clientKey = gContext.clientKey;
  const userLanguage = gContext.userLanguage;
  const {CommonlyUsedDict, InstitueCurriculum} = useDictionary(clientKey);

  const [courseList, setCourseList] = useState<Array<ICurricular>>([]);

  const [institutionList, setInstitutionList] = useState<any>([]);

  const isSuperAdmin: boolean = gContext.state.user.isSuperAdmin;

  const [loading, setLoading] = useState(false);

  const {authId, email} = useAuth();

  const [selectedInstitution, setSelectedInstitution] = useState<any>({});

  //  CHECK TO SEE IF CURRICULUM CAN BE DELETED  //

  /**********************************************************
   *   IF CURRICULUM HAS ANY AMOUNT OF SYLLABI ATTACHED,    *
   * OR IF THIS CURRICULUM HAS EVER HAD ANY ACTIVE SYLLABI, *
   *               THEN DO NOT ALLOW A DELETE               *
   **********************************************************/
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<any>({
    show: false,
    message: '',
    action: () => {}
  });

  useEffect(() => {
    fetchCurriculums();
    if (isSuperAdmin) {
      fetchInstitutions();
    }
  }, [isSuperAdmin]);

  const instituteChange = (_: string, name: string, value: string) => {
    setSelectedInstitution({name, id: value});
    // onSearch(searchInput, value);
    updateRoomList(value);
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

  useEffect(() => {
    if (curricular?.items?.length) {
      const updatedList: ICurricular[] = curricular.items?.map((item: ICurricular) => ({
        ...item,
        status: item?.status || RoomStatus.ACTIVE,
        universalSyllabus: {
          ...(item.universalSyllabus || {}),
          items: item.universalSyllabus?.items
            ?.map((syllabus) => ({
              ...syllabus,
              index: item?.universalSyllabusSeq?.indexOf(syllabus.unit.id)
            }))
            .sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
        }
      }));
      setCourseList(updatedList);
    }
  }, [curricular?.items?.length]);

  const fetchCurriculums = async () => {
    try {
      setLoading(true);
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listCurriculumsForSuperAdmin)
      );
      const updatedList: ICurricular[] = list.data?.listCurricula?.items?.map(
        (item: ICurricular) => ({
          ...item,
          institutionName: item?.institution?.name,
          status: item?.status || RoomStatus.ACTIVE,
          institutionId: item?.institution?.id,
          universalSyllabus: {
            ...(item.universalSyllabus || {}),
            items: item.universalSyllabus?.items
              ?.map((syllabus) => ({
                ...syllabus,
                index: item?.universalSyllabusSeq?.indexOf(syllabus.unit.id)
              }))
              .sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
          }
        })
      );

      setCourseList(updatedList);
    } catch (error) {
      logError(error, {authId, email}, 'CurriculumList @fetchCurriculums');
    } finally {
      setLoading(false);
    }
  };

  const onInstitutionSelectionRemove = () => {
    setSelectedInstitution({});
  };

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listInstitutionOptions)
      );
      setInstitutionList(
        list.data?.listInstitutions?.items?.sort((a: any, b: any) =>
          a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
        )
      );
    } catch (error) {
      logError(error, {authId, email}, 'CurriculumList @fetchInstitutions');
    } finally {
      setLoading(false);
    }
  };

  const checkIfRemovable = (curriculumObj: any) => {
    if (
      curriculumObj.syllabi?.length > 0 ||
      (curriculumObj.syllabiHistory && curriculumObj.syllabiHistory?.length > 0)
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
        message: `Are you sure you want to delete the course "${targetString}"?`,
        action: () => handleDelete(itemObj)
      });
    } else {
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  const handleDelete = async (item: any) => {
    setDeleting(true);
    try {
      await API.graphql(
        graphqlOperation(mutations.deleteCurriculum, {
          input: {id: item.id}
        })
      );
      updateCurricularList(item);
    } catch (e) {
      logError(e, {authId, email}, 'CurriculumList @handleDelete');
    } finally {
      setDeleting(false);
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  // ~~~~~~~~~~~~ FUNCTIONALITY ~~~~~~~~~~~~ //

  const createNewCurricular = () => {
    history.push(
      isSuperAdmin
        ? `/dashboard/manage-institutions/course-builder`
        : `/dashboard/manage-institutions/institution/${instId}/course-builder`
    );
  };

  const editCurrentCurricular = (id: string) => {
    history.push(
      isSuperAdmin
        ? `/dashboard/manage-institutions/course-builder/${id}`
        : `/dashboard/manage-institutions/institution/${instId}/course-builder/${id}`
    );
  };

  const redirectToInstitution = (institutionId: string) => {
    history.push(
      `/dashboard/manage-institutions/institution/${institutionId}/edit?back=${match.url}`
    );
  };

  const redirectToUnit = (institutionId: string, unitId: string) => {
    const baseUrl = '/dashboard/manage-institutions';
    history.push(
      isSuperAdmin
        ? `${baseUrl}/units/${unitId}/edit`
        : `${baseUrl}/institution/${institutionId}/units/${unitId}/edit`
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
  } = useSearch([...(courseList || [])], ['name', 'institutionName']);

  const [filteredList, setFilteredList] = useState([...courseList]);

  useEffect(() => {
    if (!loading && courseList?.length > 0) {
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

  const finalList = orderBy(
    searchInput.isActive ? filteredList : courseList,
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
      const filtered = courseList.filter((_d: any) => filterName === _d.status);
      setFilteredList(filtered);
      setFilters(filterName);
      setSelectedInstitution({});
    }
  };

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //
  return (
    <div className="pt-0 flex m-auto justify-center h-full p-8">
      <div className="flex flex-col">
        <SectionTitleV3
          title={InstitueCurriculum[userLanguage]['TITLE']}
          fontSize="xl"
          fontStyle="semibold"
          extraClass="leading-6 text-gray-900"
          borderBottom
          shadowOff
          withButton={
            <div className={`w-auto flex gap-x-4 justify-end items-center flex-wrap`}>
              {isSuperAdmin && (
                <Selector
                  placeholder={InstitueCurriculum[userLanguage]['SELECT_INSTITUTION']}
                  list={institutionList}
                  selectedItem={selectedInstitution?.name}
                  onChange={instituteChange}
                  arrowHidden={true}
                  additionalClass={'w-auto lg:w-48'}
                  isClearable
                  onClear={onInstitutionSelectionRemove}
                />
              )}
              <SearchInput
                dataCy="curriculum-search-input"
                value={searchInput.value}
                onChange={setSearch}
                isActive={searchInput.isActive}
                disabled={loading}
                onKeyDown={searchRoom}
                closeAction={removeSearchAction}
              />

              {!isSuperAdmin && (
                <AddButton
                  label={InstitueCurriculum[userLanguage]['BUTTON']['ADD']}
                  onClick={createNewCurricular}
                />
              )}
            </div>
          }
        />

        <Filters updateFilter={updateFilter} filters={filters} />

        {loading ? (
          <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
            <div className="w-5/10">
              <Loader
                withText={InstitueCurriculum[userLanguage]['LOADING']}
                animation
                color="rgba(107, 114, 128, 1)"
              />
            </div>
          </div>
        ) : finalList?.length > 0 ? (
          <table>
            <thead className="w-full pt-8 m-auto border-b-0 border-gray-200">
              <tr className="flex justify-between bg-gray-50  whitespace-nowrap">
                <th className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueCurriculum[userLanguage]['NO']}</span>
                </th>
                <th
                  className={`${
                    isSuperAdmin ? 'w-1.5/10' : 'w-3/10'
                  } px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider truncate`}>
                  <span>{InstitueCurriculum[userLanguage]['NAME']}</span>
                </th>
                {isSuperAdmin && (
                  <th className="w-1.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                    <span>{InstitueCurriculum[userLanguage]['INSTITUTION_NAME']}</span>
                  </th>
                )}
                <th
                  className={`w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider truncate`}>
                  <span>{InstitueCurriculum[userLanguage]['COURSE_TYPE']}</span>
                </th>
                <th
                  className={`w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider truncate`}>
                  <span>{InstitueCurriculum[userLanguage]['UNITS']}</span>
                </th>
                <th className="bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider w-1/10 flex items-center ">
                  {InstitueRomms[userLanguage]['STATUS']}
                </th>
                <th className="w-1/10 m-auto py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-auto">
                    {InstitueCurriculum[userLanguage]['ACTION']}
                  </span>
                </th>
              </tr>
            </thead>

            <tbody className="mb-8 w-full m-auto flex-1 overflow-y-auto">
              {finalList.map(
                (item, index) =>
                  item && (
                    <CurriculumListRow
                      key={`curr_list_row_${index}`}
                      index={index}
                      searchInput={searchInput.value}
                      isSuperAdmin={isSuperAdmin}
                      item={item}
                      checkIfRemovable={checkIfRemovable}
                      handleToggleDelete={handleToggleDelete}
                      editCurrentCurricular={editCurrentCurricular}
                      redirectToInstitution={() =>
                        redirectToInstitution(item.institutionID)
                      }
                      redirectToUnit={(unitId: string) =>
                        redirectToUnit(item.institutionID, unitId)
                      }
                    />
                  )
              )}
            </tbody>
            {deleteModal.show && (
              <ModalPopUp
                closeAction={handleToggleDelete}
                saveAction={deleting ? () => {} : deleteModal.action}
                saveLabel={deleting ? 'DELETING...' : 'CONFIRM'}
                cancelLabel="CANCEL"
                message={deleteModal.message}
              />
            )}
          </table>
        ) : (
          <Fragment>
            {!isSuperAdmin && (
              <div className="flex justify-center mt-8">
                <AddButton
                  className="mx-4"
                  label={InstitueCurriculum[userLanguage]['BUTTON']['ADD']}
                  onClick={createNewCurricular}
                />
              </div>
            )}
            <p className="text-center p-16">
              {searchInput || selectedInstitution?.id
                ? CommonlyUsedDict[userLanguage]['NO_SEARCH_RESULT']
                : InstitueCurriculum[userLanguage]['INFO']}
            </p>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default CurriculumList;
