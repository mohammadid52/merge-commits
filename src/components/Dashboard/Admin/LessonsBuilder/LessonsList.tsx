import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import AddButton from '@components/Atoms/Buttons/AddButton';
import Filters, {SortType} from '@components/Atoms/Filters';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import ErrorBoundary from '@components/Error/ErrorBoundary';
import ListBottomBar from '@components/Molecules/ListBottomBar';
import useAuth from '@customHooks/useAuth';
import usePagination from '@customHooks/usePagination';
import useSearch from '@customHooks/useSearch';
import {RoomStatus} from 'API';
import {getAsset} from 'assets';
import BreadCrums from 'atoms/BreadCrums';
import Buttons from 'atoms/Buttons';
import SearchInput from 'atoms/Form/SearchInput';
import Selector from 'atoms/Form/Selector';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {useQuery} from 'customHooks/urlParam';
import * as mutations from 'graphql/mutations';
import {find, orderBy} from 'lodash';
import ModalPopUp from 'molecules/ModalPopUp';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {AiOutlineArrowDown, AiOutlineArrowUp} from 'react-icons/ai';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {getLanguageString} from 'utilities/strings';

import CloneLesson from './CloneLesson';
import LessonListLoader from './LessonListLoader';
import LessonsListRow from './LessonsListRow';

interface LessonListProps {
  isInInstitution?: boolean; // props for managing lesson tab inside institution
  title?: string;
  instId?: string;
}
const getSortedList = (list: any[]) => orderBy(list, ['title'], ['asc']);

const LessonsList = ({isInInstitution, instId}: LessonListProps) => {
  const match = useRouteMatch();
  const history = useHistory();
  const params = useQuery(location.search);

  const {theme, clientKey, state, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {BreadcrumsTitles, CommonlyUsedDict, LessonsListDict} = useDictionary(clientKey);

  const [status, setStatus] = useState('');
  const [lessonsData, setLessonsData] = useState([]);
  const [totalLessonNum, setTotalLessonNum] = useState(0);

  const {
    currentPage,
    pageCount,
    setFirstPage,
    setLastPage,
    setTotalPages,

    currentList: _currentList,
    allAsProps,
    setCurrentList
  } = usePagination(getSortedList(lessonsData) || [], totalLessonNum || 0);

  const currentList = getSortedList(_currentList);

  const [sortingType, setSortingType] = useState({
    value: '',
    name: '',
    asc: true
  });

  const [institutionList, setInstitutionList] = useState<any>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<any>({});

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['LESSONS'],
      url: '/dashboard/lesson-builder',
      last: true
    }
  ];

  const sortByList = [
    {id: 1, name: 'Title', value: 'title'},
    {id: 2, name: 'Type', value: 'type'}
  ];

  const getType = (type: string) => {
    switch (type) {
      case 'lesson':
        return 'Lesson';
      case 'survey':
        return 'Survey';
      case 'assessment':
        return 'Assessment';
    }
  };

  const buildLesson = () => {
    history.push(`${match.url}/add`);
  };

  const getFilteredList = (data: [{designers: string[]}], target: string) => {
    const list: any[] = [];
    data.forEach((lesson) => {
      if (
        lesson.designers &&
        Array.isArray(lesson.designers) &&
        lesson.designers.length > 0
      ) {
        lesson?.designers?.forEach((designerId) => {
          if (designerId === target) {
            list.push(lesson);
          }
        });
      }
    });
    return list;
  };

  const isTeacher = state.user.role === 'TR';

  const getLessonsList = async () => {
    try {
      let condition = {};
      if (instId && !state.user.isSuperAdmin) {
        condition = {
          filter: {
            institutionID: {eq: instId}
          }
        };
      }
      const fetchUList: any = await API.graphql(
        graphqlOperation(customQueries.listUniversalLessons, condition)
      );
      if (!fetchUList) {
        throw new Error('fail!');
      } else {
        let data = fetchUList?.data?.listUniversalLessons.items;

        let filteredList = getFilteredList(data, state.user.id);
        filteredList = filteredList.map((lesson) => {
          return {
            ...lesson,
            institutionName: lesson?.institution?.name,
            institutionId: lesson?.institution?.id,
            status: lesson?.status || RoomStatus.ACTIVE
          };
        });
        data = data.map(
          (lesson: {status: RoomStatus; institution: {name: any; id: any}}) => {
            return {
              ...lesson,
              institutionName: lesson?.institution?.name,
              institutionId: lesson?.institution?.id,
              status: status || RoomStatus.ACTIVE
            };
          }
        );

        setLessonsData(getSortedList(data));
        const totalListPages = Math.floor(
          (isTeacher ? filteredList.length : data.length) / pageCount
        );
        setTotalPages(
          isTeacher
            ? totalListPages * pageCount === filteredList.length
              ? totalListPages
              : totalListPages + 1
            : totalListPages * pageCount === data.length
            ? totalListPages
            : totalListPages + 1
        );

        setTotalLessonNum(isTeacher ? filteredList.length : data.length);

        setStatus('done');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSortDimention = () => {
    setSortingType({
      ...sortingType,
      asc: !sortingType.asc
    });
  };

  const onSearch = (searchValue: string, institutionId?: string) => {
    let filteredData;
    if (searchValue && institutionId) {
      filteredData = [...lessonsData].filter(
        (item: any) =>
          item.title?.toLowerCase().includes(searchValue.toLowerCase()) &&
          item.institution?.id === institutionId
      );
    } else if (institutionId && !searchValue) {
      filteredData = [...lessonsData].filter(
        (item: any) => item.institution?.id === institutionId
      );
    } else if (searchValue && !institutionId) {
      searchValue = searchValue.toLowerCase();

      filteredData = [...lessonsData].filter((item: any) => {
        return item?.title?.toLowerCase().includes(searchValue);
      });
    } else {
      filteredData = lessonsData;
    }

    setCurrentList(getSortedList(filteredData));
    setTotalPages(Math.floor(filteredData.length / pageCount));
    setFirstPage(true);
    setLastPage(!(filteredData.length > pageCount));
  };

  const instituteChange = (_: string, name: string, value: string) => {
    setSelectedInstitution({name, id: value});
    onSearch(searchInput.value, value);
  };

  const onInstitutionSelectionRemove = () => {
    setSelectedInstitution({});
    onSearch(searchInput.value, '');
  };

  const fetchSortedList = () => {
    const newLessonsList = [...lessonsData].sort((a, b) =>
      a[sortingType.value]?.toLowerCase() > b[sortingType.value]?.toLowerCase() &&
      sortingType.asc
        ? 1
        : -1
    );
    setLessonsData(newLessonsList);
  };

  const setSortingValue = (str: string, name: string) => {
    setSortingType({
      ...sortingType,
      value: str,
      name: name
    });
  };

  useEffect(() => {
    fetchInstitutions();
    getLessonsList();
  }, []);

  useEffect(() => {
    fetchSortedList();
  }, [sortingType.value, sortingType.asc]);

  // if (status !== 'done') {
  //   return <LessonLoading />;
  // }

  const [showCloneModal, setShowCloneModal] = useState<{show: boolean; lessonId: string}>(
    {show: false, lessonId: ''}
  );

  const getCloneLessonDetails = () => {
    if (showCloneModal.show) {
      return find(currentList, ['id', showCloneModal.lessonId]);
    }
  };

  //  CHECK TO SEE IF LESSON CAN BE DELETED  //

  /*************************************
   * IF LESSON HAS EVER BEEN ACTIVATED *
   *  AND HAS THE 'ISUSED' PROPERTY,   *
   *       IT CAN NOT BE DELETED       *
   *************************************/
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<any>({
    show: false,
    message: '',
    action: () => {}
  });

  const checkIfRemovable = (lessonObj: any) => !lessonObj?.isUsed;

  const fetchInstitutions = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listInstitutionOptions)
      );
      setInstitutionList(
        list.data?.listInstitutions?.items?.sort((a: any, b: any) =>
          a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleDelete = (targetString?: string, itemObj?: any) => {
    if (!deleteModal.show) {
      setDeleteModal({
        show: true,
        message: `Are you sure you want to delete the lesson "${targetString}"?`,
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
        graphqlOperation(mutations.deleteUniversalLesson, {
          input: {id: item.id}
        })
      );
      updateLessonList(item);
    } catch (e) {
      console.error('error deleting...', e);
    } finally {
      setDeleting(false);
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  const updateLessonList = (lessonObj: any) => {
    setCurrentList(
      getSortedList(
        currentList.filter((lessonListObj: any) => lessonListObj.id !== lessonObj.id)
      )
    );
  };

  const redirectToInstitution = (institutionId: string) => {
    history.push(
      `/dashboard/manage-institutions/institution/${institutionId}/edit?back=${match.url}`
    );
  };

  const {isSuperAdmin} = useAuth();

  const {
    searchInput,
    setSearch,
    checkSearchQueryFromUrl,
    filterBySearchQuery,
    removeSearchAction,
    setSearchInput,
    searchAndFilter
  } = useSearch([...(lessonsData || [])], ['title']);

  const [filteredList, setFilteredList] = useState([...lessonsData]);

  useEffect(() => {
    if (status === 'done' && currentList?.length > 0) {
      const query = checkSearchQueryFromUrl();
      if (query) {
        const items = filterBySearchQuery(query);
        if (Boolean(items)) {
          setFilteredList(items);
        }
      }
    }
  }, [status]);

  const searchLesson = () => {
    const searched = searchAndFilter(searchInput.value);
    if (Boolean(searched)) {
      setFilteredList(searched);
    } else {
      removeSearchAction();
    }
  };

  const finalList = getSortedList(searchInput.isActive ? filteredList : currentList);

  const [filters, setFilters] = useState<SortType>();

  const updateFilter = (filterName: SortType) => {
    if (filterName === filters) {
      setSearchInput({...searchInput, isActive: false});
      setFilters(null);
      setFilteredList([]);
    } else {
      setSearchInput({...searchInput, isActive: true});
      const filtered = currentList.filter((_d: any) => filterName === _d.status);
      setFilteredList(filtered);
      setFilters(filterName);
      setSelectedInstitution({});
    }
  };

  {
    return (
      <div className={`w-full h-full`}>
        {showCloneModal.show && (
          <CloneLesson
            setShowCloneModal={setShowCloneModal}
            getCloneLessonDetails={getCloneLessonDetails}
          />
        )}
        {/* Header section */}
        {!isInInstitution && <BreadCrums items={breadCrumsList} />}
        <div
          className={`flex flex-col lg:flex-row justify-start lg:justify-between ${
            isInInstitution ? 'lg:items-center px-8' : ''
          }`}>
          <SectionTitleV3
            title={LessonsListDict[userLanguage][isInInstitution ? 'HEADING' : 'TITLE']}
            fontSize="xl"
            fontStyle="semibold"
            extraClass="leading-6 text-gray-900"
            borderBottom
            shadowOff
            withButton={
              <div className={`w-auto flex gap-x-4 justify-end items-center flex-wrap`}>
                {isSuperAdmin && (
                  <Selector
                    placeholder={LessonsListDict[userLanguage]['SELECT_INSTITUTION']}
                    list={institutionList}
                    selectedItem={selectedInstitution?.name}
                    onChange={instituteChange}
                    arrowHidden={true}
                    additionalClass={'w-auto lg:w-48'}
                    isClearable
                    onClear={onInstitutionSelectionRemove}
                  />
                )}
                {!isInInstitution && (
                  <>
                    <Selector
                      placeholder={LessonsListDict[userLanguage]['SORTBY']}
                      list={sortByList}
                      selectedItem={sortingType.name}
                      onChange={setSortingValue}
                      btnClass="rounded-r-none  border-r-none "
                      arrowHidden={true}
                    />
                    <button
                      className={`w-28 bg-gray-100 mr-4 p-3 border-gray-400  border-0 rounded border-l-none rounded-l-none ${theme.outlineNone} `}
                      onClick={toggleSortDimention}>
                      <IconContext.Provider
                        value={{size: '1.5rem', color: theme.iconColor[themeColor]}}>
                        {sortingType.asc ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
                      </IconContext.Provider>
                    </button>
                  </>
                )}
                <SearchInput
                  dataCy="unit-search-input"
                  value={searchInput.value}
                  onChange={setSearch}
                  isActive={searchInput.isActive}
                  disabled={status !== 'done'}
                  onKeyDown={searchLesson}
                  closeAction={removeSearchAction}
                />

                {!isSuperAdmin && (
                  <AddButton
                    label={LessonsListDict[userLanguage]['BUTTON']['ADD']}
                    onClick={buildLesson}
                  />
                )}
                {params.get('from') ? (
                  <Buttons
                    label="Go back"
                    btnClass="mr-4"
                    onClick={() => history.goBack()}
                    Icon={IoArrowUndoCircleOutline}
                  />
                ) : null}
              </div>
            }
          />
        </div>
        <div className="px-8">
          <Filters
            loading={status !== 'done'}
            list={currentList}
            updateFilter={updateFilter}
            filters={filters}
          />
        </div>

        {/* List / Table */}
        <div className={`flex flex-col ${isInInstitution ? 'px-8' : ''}`}>
          <div className="">
            <div
              className={`${
                isInInstitution ? '' : 'white_back px-8'
              } py-4 mt-2 mb-8 align-middle rounded-lg `}>
              <div className={``}>
                <div className="w-full flex justify-between border-b-0 border-gray-200 ">
                  <div className="w-.5/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>{LessonsListDict[userLanguage]['NO']}</span>
                  </div>
                  <div
                    className={`${
                      state.user.isSuperAdmin ? 'w-1.5/10' : 'w-3/10'
                    } px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}>
                    <span>{LessonsListDict[userLanguage]['LESSONTITLE']}</span>
                  </div>
                  {state.user.isSuperAdmin && (
                    <div className="w-1.5/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>{LessonsListDict[userLanguage]['INSTITUTION_NAME']}</span>
                    </div>
                  )}
                  {/* <div className="w-1.5/10 flex px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">Label</span>
                  </div> */}
                  <div className="w-1/10 flex justify-left px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">
                      {LessonsListDict[userLanguage]['TYPE']}
                    </span>
                  </div>
                  <div className="w-1.5/10 flex justify-left px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">
                      {LessonsListDict[userLanguage]['TARGET_AUDIENCE']}
                    </span>
                  </div>
                  <div className="w-1.5/10 flex justify-center px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">Status</span>
                  </div>
                  <div className="w-1.5/10 flex justify-center px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">Last Edit Date</span>
                  </div>
                  {/* <div className="w-1.5/10 flex justify-left px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">
                      {LessonsListDict[userLanguage]['LANGUAGE']}
                    </span>
                  </div> */}
                  <div className="w-1/10 px-8 flex justify-center py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {LessonsListDict[userLanguage]['ACTION']}
                  </div>
                </div>
                {status !== 'done' ? (
                  Array(10)
                    .fill(' ')
                    .map((_: any, index: number) => (
                      <Fragment key={index}>
                        <LessonListLoader isSuperAdmin={state.user.isSuperAdmin} />
                      </Fragment>
                    ))
                ) : finalList?.length ? (
                  finalList.map((lessonsObject, i) => (
                    <ErrorBoundary
                      authId={state.user.authId}
                      email={state.user.email}
                      key={lessonsObject.id}
                      componentName="LessonsListRow"
                      fallback={<h1>Oops with the LessonsListRow</h1>}>
                      <LessonsListRow
                        searchTerm={searchInput.value}
                        setShowCloneModal={setShowCloneModal}
                        key={`lessonsRows${i}`}
                        index={currentPage * pageCount + i}
                        id={lessonsObject.id}
                        status={lessonsObject?.status || RoomStatus.ACTIVE}
                        title={lessonsObject.title}
                        institution={lessonsObject.institution}
                        type={lessonsObject.type && getType(lessonsObject.type)}
                        languages={
                          lessonsObject?.language &&
                          lessonsObject?.language.map((item: string) =>
                            getLanguageString(item)
                          )
                        }
                        targetAudience={lessonsObject.targetAudience}
                        lessonObject={lessonsObject}
                        checkIfRemovable={checkIfRemovable}
                        handleToggleDelete={handleToggleDelete}
                        createdAt={lessonsObject.createdAt}
                        updatedAt={lessonsObject.updatedAt}
                        zebraStripping={isInInstitution}
                        isSuperAdmin={state.user.isSuperAdmin}
                        redirectToInstitution={() =>
                          redirectToInstitution(lessonsObject.institution?.id)
                        }
                      />
                    </ErrorBoundary>
                  ))
                ) : (
                  <div className="flex p-12 mx-auto text-gray-400 justify-center">
                    {searchInput?.value || selectedInstitution?.id
                      ? CommonlyUsedDict[userLanguage]['NO_SEARCH_RESULT']
                      : LessonsListDict[userLanguage]['NORESULT']}
                  </div>
                )}
                {deleteModal.show && (
                  <ModalPopUp
                    closeAction={handleToggleDelete}
                    saveAction={deleting ? () => {} : deleteModal.action}
                    saveLabel={deleting ? 'DELETING...' : 'CONFIRM'}
                    cancelLabel="CANCEL"
                    message={deleteModal.message}
                  />
                )}
              </div>

              {/* Pagination And Counter */}
              {!searchInput.isActive && totalLessonNum > 0 && (
                <ListBottomBar {...allAsProps} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default LessonsList;
