import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import AddButton from '@components/Atoms/Buttons/AddButton';
import Filters, {SortType} from '@components/Atoms/Filters';
import Highlighted from '@components/Atoms/Highlighted';
import ErrorBoundary from '@components/Error/ErrorBoundary';
import Table, {ITableProps} from '@components/Molecules/Table';
import {useGlobalContext} from '@contexts/GlobalContext';
import useAuth from '@customHooks/useAuth';
import usePagination from '@customHooks/usePagination';
import useSearch from '@customHooks/useSearch';

import {RoomStatus} from 'API';
import BreadCrums from 'atoms/BreadCrums';
import Buttons from 'atoms/Buttons';
import SearchInput from 'atoms/Form/SearchInput';
import Selector from 'atoms/Form/Selector';
import {listUniversalLessons} from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {useQuery} from 'customHooks/urlParam';
import {deleteUniversalLesson} from 'graphql/mutations';
import PageLayout from 'layout/PageLayout';
import {find, map, orderBy} from 'lodash';
import ModalPopUp from 'molecules/ModalPopUp';
import {useEffect, useState} from 'react';
import {AiOutlineArrowDown, AiOutlineArrowUp} from 'react-icons/ai';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import {useHistory, useRouteMatch} from 'react-router-dom';
import InsitutionSelector from '../InsitutionSelector';
import {Status} from '../UserManagement/UserStatus';

import CloneLesson from './CloneLesson';

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

  const {theme, state, userLanguage} = useGlobalContext();

  const {BreadcrumsTitles, InstitueRomms, LessonsListDict} = useDictionary();

  const [status, setStatus] = useState('');
  const [lessonsData, setLessonsData] = useState<any[]>([]);
  const [totalLessonNum, setTotalLessonNum] = useState(0);

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

  const {
    pageCount,
    setFirstPage,
    currentPage,
    setLastPage,
    setTotalPages,

    currentList: _currentList,
    allAsProps,
    setCurrentList,
    resetPagination,
    getIndex
  } = usePagination(
    getSortedList(lessonsData) || [],
    searchInput.isActive ? filteredList.length : totalLessonNum || 0
  );

  const currentList = getSortedList(_currentList);

  const [sortingType, setSortingType] = useState({
    value: '',
    name: '',
    asc: true
  });

  const [selectedInstitution, setSelectedInstitution] = useState<any>({});

  const breadCrumsList = [
    {
      title: BreadcrumsTitles[userLanguage]['HOME'],
      href: '/dashboard',
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['LESSONS'],
      href: '/dashboard/lesson-builder',
      last: true
    }
  ];

  const sortByList = [
    {id: 1, label: 'Title', value: 'title'},
    {id: 2, label: 'Type', value: 'type'}
  ];

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
      if (instId && !isSuperAdmin) {
        condition = {
          filter: {
            institutionID: {eq: instId}
          }
        };
      }
      const fetchUList: any = await API.graphql(
        graphqlOperation(listUniversalLessons, condition)
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
              status: lesson?.status || RoomStatus.ACTIVE
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
          item?.title?.toLowerCase().includes(searchValue.toLowerCase()) &&
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

  const instituteChange = (value: string, option: any) => {
    setSelectedInstitution({name: value, id: option.id});
    onSearch(searchInput.value, value);
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

  const setSortingValue = (name: string) => {
    setSortingType({
      ...sortingType,
      value: name,
      name: name
    });
  };

  useEffect(() => {
    getLessonsList();
  }, []);

  useEffect(() => {
    fetchSortedList();
  }, [sortingType.value, sortingType.asc]);

  const [showCloneModal, setShowCloneModal] = useState<{
    show: boolean;
    lessonId: string;
  }>({show: false, lessonId: ''});

  const getCloneLessonDetails = () => {
    if (showCloneModal.show) {
      return find(lessonsData, ['id', showCloneModal.lessonId]);
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
        graphqlOperation(deleteUniversalLesson, {
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

  const {isSuperAdmin} = useAuth();

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
  }, [status, currentList?.length]);

  const searchLesson = () => {
    const searched = searchAndFilter(searchInput.value);
    if (Boolean(searched)) {
      setFilteredList(searched);
    } else {
      removeSearchAction();
    }
  };

  const finalList = getSortedList(searchInput.isActive ? filteredList : currentList);

  const [filters, setFilters] = useState<SortType | null>(null);

  const updateFilter = (filterName: SortType) => {
    if (filterName === filters) {
      setSearchInput({...searchInput, isActive: false});
      setFilters(null);
      setFilteredList([]);
    } else {
      setSearchInput({...searchInput, isActive: true});

      const filtered = lessonsData.filter((_d: any) => filterName === _d.status);
      setFilteredList(filtered);
      setFilters(filterName);
      setSelectedInstitution({});
    }
  };

  const handleLessonsEdit = (id: string) => {
    history.push(`${match.url}/${id}`);
  };

  const onCloneLesson = (id: string) => {
    setShowCloneModal({show: true, lessonId: id});
  };

  const dataList = map(finalList, (item: any, index: number) => {
    return {
      no: getIndex(index),
      onClick: () => handleLessonsEdit(item.id),
      instituteName: isSuperAdmin && item.institution.name,
      status: <Status status={item.status} useDefault />,
      lessonTitle: (
        <div onClick={() => handleLessonsEdit(item.id)} className="w-auto cursor-pointer">
          <Highlighted text={item?.title} highlight={searchInput.value} />
        </div>
      ),
      type: item.type,
      targetAudience: item.targetAudience || '--',
      lastEditDate: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '--'
      // actions: (
      //   <CommonActionsBtns
      //     button1Label="Clone Lesson"
      //     isDeletable={checkIfRemovable(item)}
      //     button1Action={(e) => {
      //       e.stopPropagation();
      //       onCloneLesson(item.id);
      //     }}
      //     button2Action={(e) => {
      //       e.stopPropagation();
      //       handleToggleDelete(item?.title, item);
      //     }}
      //   />
      // )
    };
  });

  const tableConfig: ITableProps = {
    headers: [
      LessonsListDict[userLanguage]['NO'],
      LessonsListDict[userLanguage]['LESSONTITLE'],
      isSuperAdmin && LessonsListDict[userLanguage]['INSTITUTION_NAME'],
      LessonsListDict[userLanguage]['TYPE'],
      LessonsListDict[userLanguage]['TARGET_AUDIENCE'],
      InstitueRomms[userLanguage]['STATUS'],
      'Last Edit Date'
    ],
    dataList,
    config: {
      dataList: {
        loading: status !== 'done',
        pagination: {
          showPagination: true,
          config: {
            allAsProps
          }
        }
      }
    }
  };

  return (
    <ErrorBoundary componentName="LessonsList">
      <CloneLesson
        open={showCloneModal.show}
        setShowCloneModal={setShowCloneModal}
        getCloneLessonDetails={getCloneLessonDetails}
      />

      {!isInInstitution && <BreadCrums items={breadCrumsList} />}
      <PageLayout
        title={LessonsListDict[userLanguage][isInInstitution ? 'HEADING' : 'TITLE']}
        extra={
          <div className={`w-auto flex gap-x-4 justify-end items-center flex-wrap`}>
            {isSuperAdmin && (
              <InsitutionSelector
                selectedInstitution={selectedInstitution?.label}
                onChange={instituteChange}
              />
            )}
            {!isInInstitution && (
              <>
                <Selector
                  placeholder={LessonsListDict[userLanguage]['SORTBY']}
                  list={sortByList}
                  selectedItem={sortingType.name}
                  onChange={setSortingValue}
                />
                <button
                  className={`w-28 bg-lightest  mr-4 p-3 border-light   border-0 rounded border-l-none rounded-l-none ${theme.outlineNone} `}
                  onClick={toggleSortDimention}>
                  {sortingType.asc ? (
                    <AiOutlineArrowUp className="theme-text" size="1.5rem" />
                  ) : (
                    <AiOutlineArrowDown className="theme-text" size="1.5rem" />
                  )}
                </button>
              </>
            )}
            <SearchInput
              value={searchInput.value}
              onChange={setSearch}
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
                onClick={() => history.goBack()}
                Icon={IoArrowUndoCircleOutline}
              />
            ) : null}
          </div>
        }>
        <div className={`w-full h-full`}>
          {/* Header section */}

          <Filters
            loading={status !== 'done'}
            resetPagination={resetPagination}
            updateFilter={updateFilter}
            list={lessonsData}
            filters={filters}
          />

          {/* List / Table */}
          <div className={``}>
            <Table {...tableConfig} />

            <ModalPopUp
              open={deleteModal.show}
              closeAction={handleToggleDelete}
              saveAction={deleting ? () => {} : deleteModal.action}
              saveLabel={deleting ? 'DELETING...' : 'CONFIRM'}
              cancelLabel="CANCEL"
              message={deleteModal.message}
            />
          </div>

          {/* Pagination And Counter */}
        </div>
      </PageLayout>
    </ErrorBoundary>
  );
};

export default LessonsList;
