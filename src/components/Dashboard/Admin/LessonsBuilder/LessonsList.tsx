import React, {useState, useEffect, useContext, Fragment} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {AiOutlineArrowUp, AiOutlineArrowDown} from 'react-icons/ai';
import {IoMdAddCircleOutline} from 'react-icons/io';

import Buttons from '../../../Atoms/Buttons';
import Selector from '../../../Atoms/Form/Selector';
import BreadCrums from '../../../Atoms/BreadCrums';
import Pagination from '../../../Atoms/Pagination';
import SearchInput from '../../../Atoms/Form/SearchInput';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageCountSelector from '../../../Atoms/PageCountSelector';

import {GlobalContext} from '../../../../contexts/GlobalContext';
import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import * as customQueries from '../../../../customGraphql/customQueries';
import LessonsListRow from './LessonsListRow';
import {getLanguageString} from '../../../../utilities/strings';
import {getAsset} from '../../../../assets';
import useDictionary from '../../../../customHooks/dictionary';
import {times} from 'lodash';

const LessonsList = () => {
  const match = useRouteMatch();
  const history = useHistory();

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
    history.push(`${match.url}/lesson/add`);
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
      const fetchLessonsData: any = await API.graphql(
        graphqlOperation(customQueries.listLessonsTitles)
      );
      if (!fetchLessonsData) {
        throw new Error('fail!');
      } else {
        const LessonsListData = fetchLessonsData.data?.listLessons?.items;
        const filteredList = getFilteredList(LessonsListData, state.user.id);

        setLessonsData(isTeacher ? filteredList : LessonsListData);
        const totalListPages = Math.floor(
          (isTeacher ? filteredList.length : LessonsListData.length) / pageCount
        );

        setTotalPages(
          isTeacher
            ? totalListPages * pageCount === filteredList.length
              ? totalListPages
              : totalListPages + 1
            : totalListPages * pageCount === LessonsListData.length
            ? totalListPages
            : totalListPages + 1
        );

        setTotalLessonNum(isTeacher ? filteredList.length : LessonsListData.length);

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
        return item.title?.toLowerCase().includes(searchInput.value);
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
    setSearchInput({value: '', isActive: false});
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

  if (status !== 'done') {
    return <LessonLoading />;
  }
  {
    return (
      <div className={`w-full h-full`}>
        {/* Header section */}
        <BreadCrums items={breadCrumsList} />
        <div className="flex justify-between">
          <SectionTitle
            title={LessonsListDict[userLanguage]['TITLE']}
            subtitle={LessonsListDict[userLanguage]['SUBTITLE']}
          />
          <div className="flex justify-end py-4 mb-4">
            <SearchInput
              value={searchInput.value}
              onChange={setSearch}
              onKeyDown={searchLessonsFromList}
              closeAction={removeSearchAction}
              style="mr-4 w-full"
            />
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
            <Buttons
              label={LessonsListDict[userLanguage]['BUTTON']['ADD']}
              onClick={buildLesson}
              btnClass="mr-4 w-full"
              Icon={IoMdAddCircleOutline}
            />
          </div>
        </div>

        {/* List / Table */}
        <div className="flex flex-col">
          <div className="-my-2 py-2">
            <div className="white_back py-4 px-8 mt-2 mb-8 align-middle rounded-lg border-b-0 border-gray-200">
              <div className="h-8/10 px-4">
                {totalLessonNum > 0 && (
                  <div className="w-full flex justify-between border-b-0 border-gray-200 ">
                    <div className="w-.5/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>{LessonsListDict[userLanguage]['NO']}</span>
                    </div>
                    <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>{LessonsListDict[userLanguage]['LESSONTITLE']}</span>
                    </div>
                    {/* <div className="w-1.5/10 flex px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">Label</span>
                  </div> */}
                    <div className="w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
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
                    <div className="w-1.5/10 flex justify-center px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span className="w-auto">
                        {LessonsListDict[userLanguage]['LANGUAGE']}
                      </span>
                    </div>
                    <div className="w-1/10 px-8 flex justify-center py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {LessonsListDict[userLanguage]['ACTION']}
                    </div>
                  </div>
                )}
                {currentList && currentList.length ? (
                  currentList.map((lessonsObject, i) => (
                    <LessonsListRow
                      key={`lessonsRows${i}`}
                      index={currentPage * pageCount + i}
                      id={lessonsObject.id}
                      title={lessonsObject.title}
                      type={lessonsObject.type && getType(lessonsObject.type)}
                      languages={
                        lessonsObject?.language &&
                        lessonsObject?.language.map((item: string) =>
                          getLanguageString(item)
                        )
                      }
                      createdAt={lessonsObject.createdAt}
                      updatedAt={lessonsObject.updatedAt}
                    />
                  ))
                ) : (
                  <div className="flex p-12 mx-auto text-gray-400 justify-center">
                    {LessonsListDict[userLanguage]['NORESULT']}
                  </div>
                )}
              </div>

              {/* Pagination And Counter */}
              {!searchInput.isActive && totalLessonNum > 0 && (
                <div className="flex justify-center my-4">
                  <Fragment>
                    <span className="py-3 px-5 w-auto flex-shrink-0 my-5 text-md leading-5 font-medium text-gray-900">
                      {' '}
                      {paginationPage(userLanguage, currentPage + 1, totalPages)}
                    </span>
                    <Pagination
                      currentPage={currentPage + 1}
                      setNext={goNextPage}
                      setPrev={goPrevPage}
                      firstPage={firstPage}
                      lastPage={lastPage}
                    />
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
