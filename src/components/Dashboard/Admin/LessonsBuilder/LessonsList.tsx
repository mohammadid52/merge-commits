import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import ModalPopUp from '@components/Molecules/ModalPopUp';
import {useQuery} from '@customHooks/urlParam';
import * as mutations from '@graphql/mutations';
import {find} from 'lodash';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {AiOutlineArrowDown, AiOutlineArrowUp} from 'react-icons/ai';
import {IoMdAddCircleOutline} from 'react-icons/io';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {getAsset} from '../../../../assets';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import * as customQueries from '../../../../customGraphql/customQueries';
import useDictionary from '../../../../customHooks/dictionary';
import {getLanguageString} from '../../../../utilities/strings';
import BreadCrums from '../../../Atoms/BreadCrums';
import Buttons from '../../../Atoms/Buttons';
import SearchInput from '../../../Atoms/Form/SearchInput';
import Selector from '../../../Atoms/Form/Selector';
import PageCountSelector from '../../../Atoms/PageCountSelector';
import Pagination from '../../../Atoms/Pagination';
import SectionTitle from '../../../Atoms/SectionTitle';
import CloneLesson from './CloneLesson';
import LessonListLoader from './LessonListLoader';
import LessonsListRow from './LessonsListRow';

interface LessonListProps {
  isInInstitution?: boolean; // props for managing lesson tab inside institution
  title?: string;
  instId?: string;
}

const LessonsList = ({isInInstitution, title, instId}: LessonListProps) => {
  const match = useRouteMatch();
  const history = useHistory();
  const params = useQuery(location.search);

  const {theme, clientKey, state, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {BreadcrumsTitles, LessonsListDict, paginationPage} = useDictionary(clientKey);

  const [status, setStatus] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [lessonsData, setLessonsData] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [lastPage, setLastPage] = useState(false);
  const [firstPage, setFirstPage] = useState(false);
  const [pageCount, setPageCount] = useState(10);
  const [totalLessonNum, setTotalLessonNum] = useState(0);
  const [searchInput, setSearchInput] = useState({
    value: '',
    isActive: false,
  });
  const [sortingType, setSortingType] = useState({
    value: '',
    name: '',
    asc: true,
  });
  const [institutionList, setInstitutionList] = useState<any>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<any>({});

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['LESSONS'],
      url: '/dashboard/lesson-builder',
      last: true,
    },
  ];

  const sortByList = [
    {id: 1, name: 'Title', value: 'title'},
    {id: 2, name: 'Type', value: 'type'},
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

  const goNextPage = () => {
    const pageHigherLimit = totalPages - 1;
    if (firstPage) {
      setFirstPage(false);
    }
    if (currentPage < pageHigherLimit - 1) {
      setCurrentPage(currentPage + 1);
    } else if (currentPage === pageHigherLimit - 1) {
      setCurrentPage(currentPage + 1);
      setLastPage(true);
    }
  };

  const goPrevPage = () => {
    if (lastPage) {
      setLastPage(false);
    }
    if (currentPage > 0) setCurrentPage(currentPage - 1);
    else {
      setFirstPage(true);
    }
  };

  const currentPageLessons = () => {
    const initialItem = currentPage * pageCount;
    const updatedList = lessonsData.slice(initialItem, initialItem + pageCount);
    setCurrentList(updatedList);
  };

  const backToInitials = () => {
    setCurrentPage(0);
    currentPageLessons();
    setFirstPage(true);
    if (totalPages === 1) {
      setLastPage(true);
    } else {
      setLastPage(false);
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
            institutionID: {eq: instId},
          },
        };
      }
      const fetchUList: any = await API.graphql(
        graphqlOperation(customQueries.listUniversalLessons, condition)
      );
      if (!fetchUList) {
        throw new Error('fail!');
      } else {
        const data = fetchUList?.data?.listUniversalLessons.items;

        const filteredList = getFilteredList(data, state.user.id);

        // setLessonsData(isTeacher ? filteredList : data);
        setLessonsData(data);
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

  const setSearch = (str: string) => {
    setSearchInput({
      ...searchInput,
      value: str,
    });
  };

  const searchLessonsFromList = () => {
    if (searchInput.value) {
      const currentLessonsList = [...lessonsData];
      const newList = currentLessonsList.filter((item) => {
        // Search on lesson title for match.
        return item.title?.toLowerCase().includes(searchInput.value.toLowerCase());
      });
      setSearchInput({
        ...searchInput,
        isActive: true,
      });
      setCurrentList(newList);
    } else {
      removeSearchAction();
    }
  };
  const toggleSortDimention = () => {
    setSortingType({
      ...sortingType,
      asc: !sortingType.asc,
    });
  };
  const removeSearchAction = () => {
    backToInitials();
    onSearch('',selectedInstitution?.id)
    setSearchInput({value: '', isActive: false});
  };

  const onSearch = (searchValue: string, institutionId?: string) => {
    let filteredData;
    if (searchValue && institutionId) {
      filteredData = [...lessonsData].filter(
        (item: any) =>
          item.title?.toLowerCase().includes(searchValue.toLowerCase()) &&
          item.institution?.id === institutionId
      );
    } else if (institutionId) {
      filteredData = [...lessonsData].filter(
        (item: any) => item.institution?.id === institutionId
      );
    } else if (searchValue) {
      filteredData = [...lessonsData].filter((item: any) =>
        item.name?.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else {
      filteredData = lessonsData;
    }
    setCurrentList(filteredData);
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
      name: name,
    });
  };

  useEffect(() => {
    fetchInstitutions();
    getLessonsList();
  }, []);

  useEffect(() => {
    backToInitials();
  }, [lessonsData]);

  useEffect(() => {
    setCurrentPage(0);
    setFirstPage(true);
    setLastPage(false);
    const totalListPages = Math.floor(totalLessonNum / pageCount);
    if (pageCount * totalListPages === totalLessonNum) {
      setTotalPages(totalListPages);
    } else {
      setTotalPages(totalListPages + 1);
    }
    if (totalPages === 1 && totalListPages === 0) {
      setFirstPage(true);
      setLastPage(true);
    }
  }, [pageCount]);

  useEffect(() => {
    currentPageLessons();
  }, [currentPage, totalLessonNum, pageCount]);

  useEffect(() => {
    if (totalPages === 1) {
      setFirstPage(true);
      setLastPage(true);
    }
  }, [totalPages]);

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
    action: () => {},
  });

  const checkIfRemovable = (lessonObj: any) => {
    if (lessonObj?.isUsed) {
      return false;
    } else {
      return true;
    }
  };

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
    } catch (error) {}
  };

  const handleToggleDelete = (targetString?: string, itemObj?: any) => {
    if (!deleteModal.show) {
      setDeleteModal({
        show: true,
        message: `Are you sure you want to delete the lesson "${targetString}"?`,
        action: () => handleDelete(itemObj),
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
          input: {id: item.id},
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
      currentList.filter((lessonListObj: any) => lessonListObj.id !== lessonObj.id)
    );
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
          {isInInstitution ? (
            <h3 className="text-lg leading-6 uppercase text-gray-600 w-auto my-4 lg:mb-0">
              {LessonsListDict[userLanguage]['HEADING']}
            </h3>
          ) : (
            <SectionTitle
              title={LessonsListDict[userLanguage]['TITLE']}
              subtitle={LessonsListDict[userLanguage]['SUBTITLE']}
            />
          )}
          <div className={`flex justify-end ${isInInstitution ? 'w-auto' : 'py-4 mb-4'}`}>
            <SearchInput
              value={searchInput.value}
              onChange={setSearch}
              onKeyDown={() => onSearch(searchInput.value, selectedInstitution?.id)}
              closeAction={removeSearchAction}
              style={`mr-4 ${isInInstitution ? 'w-auto' : 'w-full'}`}
            />
            {state.user.isSuperAdmin && (
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
            {!state.user.isSuperAdmin && (
              <Buttons
                label={LessonsListDict[userLanguage]['BUTTON']['ADD']}
                onClick={buildLesson}
                btnClass={isInInstitution ? '' : 'mr-4 w-full'}
                Icon={IoMdAddCircleOutline}
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
        </div>

        {/* List / Table */}
        <div className={`flex flex-col ${isInInstitution ? 'px-8' : ''}`}>
          <div className="-my-2 py-2">
            <div
              className={`${
                isInInstitution ? '' : 'white_back px-8'
              } py-4 mt-2 mb-8 align-middle rounded-lg border-b-0 border-gray-200`}>
              <div
                className={`h-8/10 ${isInInstitution ? '' : 'px-4'} w-screen lg:w-auto`}>
                <div className="w-full flex justify-between border-b-0 border-gray-200 ">
                  <div className="w-.5/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>{LessonsListDict[userLanguage]['NO']}</span>
                  </div>
                  <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>{LessonsListDict[userLanguage]['LESSONTITLE']}</span>
                  </div>
                  {state.user.isSuperAdmin && (
                    <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
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
                  <div className="w-1.5/10 flex justify-center px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">Created Date</span>
                  </div>
                  <div className="w-1.5/10 flex justify-center px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">Last Edit Date</span>
                  </div>
                  <div className="w-1.5/10 flex justify-left px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">
                      {LessonsListDict[userLanguage]['LANGUAGE']}
                    </span>
                  </div>
                  <div className="w-1/10 px-8 flex justify-center py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {LessonsListDict[userLanguage]['ACTION']}
                  </div>
                </div>
                {status !== 'done' ? (
                  Array(10)
                    .fill(' ')
                    .map((_: any, index: number) => (
                      <Fragment key={index}>
                        <LessonListLoader />
                      </Fragment>
                    ))
                ) : currentList?.length ? (
                  currentList.map((lessonsObject, i) => (
                    <LessonsListRow
                      setShowCloneModal={setShowCloneModal}
                      key={`lessonsRows${i}`}
                      index={currentPage * pageCount + i}
                      id={lessonsObject.id}
                      title={lessonsObject.title}
                      institution={lessonsObject.institution}
                      type={lessonsObject.type && getType(lessonsObject.type)}
                      languages={
                        lessonsObject?.language &&
                        lessonsObject?.language.map((item: string) =>
                          getLanguageString(item)
                        )
                      }
                      lessonObject={lessonsObject}
                      checkIfRemovable={checkIfRemovable}
                      handleToggleDelete={handleToggleDelete}
                      createdAt={lessonsObject.createdAt}
                      updatedAt={lessonsObject.updatedAt}
                      zebraStripping={isInInstitution}
                      isSuperAdmin={state.user.isSuperAdmin}
                    />
                  ))
                ) : (
                  <div className="flex p-12 mx-auto text-gray-400 justify-center">
                    {LessonsListDict[userLanguage]['NORESULT']}
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
                <div className="flex justify-center my-4">
                  <Fragment>
                    <div className="flex justify-between flex-col lg:flex-row">
                      <span className="py-3 px-5 w-auto flex-shrink-0 my-5 text-md leading-5 font-medium text-gray-900">
                        {' '}
                        {paginationPage(userLanguage, currentPage, totalPages)}
                      </span>
                      <Pagination
                        currentPage={currentPage + 1}
                        setNext={goNextPage}
                        setPrev={goPrevPage}
                        firstPage={firstPage}
                        lastPage={lastPage}
                      />
                    </div>
                    <PageCountSelector
                      pageSize={pageCount}
                      setPageSize={(c: number) => setPageCount(c)}
                    />
                  </Fragment>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default LessonsList;
