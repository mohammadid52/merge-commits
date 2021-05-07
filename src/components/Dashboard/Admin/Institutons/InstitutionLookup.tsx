import React, {useState, useEffect, useContext, Fragment} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {IoBusinessSharp} from 'react-icons/io5';
import {AiOutlineArrowUp, AiOutlineArrowDown} from 'react-icons/ai';

import {GlobalContext} from '../../../../contexts/GlobalContext';
import * as queries from '../../../../graphql/queries';
import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import InstitutionRow from './InstitutionRow';
import Buttons from '../../../Atoms/Buttons';
import Selector from '../../../Atoms/Form/Selector';
import BreadCrums from '../../../Atoms/BreadCrums';
import Pagination from '../../../Atoms/Pagination';
import SearchInput from '../../../Atoms/Form/SearchInput';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageCountSelector from '../../../Atoms/PageCountSelector';
import {getAsset} from '../../../../assets';
import useDictionary from '../../../../customHooks/dictionary';

/**
 * This component represents the bulk code of the institutions-lookup/all-institutions page
 * which lists all the available institutions
 */

const InstitutionLookup: React.FC = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const {theme, clientKey, userLanguage, state} = useContext(GlobalContext);
  const {InstitutionDict, BreadcrumsTitles} = useDictionary(clientKey);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const [status, setStatus] = useState('');
  const [institutionsData, setInstitutionsData] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [userCount, setUserCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [firstPage, setFirstPage] = useState(false);
  const [totalInstNum, setTotalInstNum] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      url: `${match.url}`,
      last: true,
    },
  ];

  const sortByList = [
    {id: 1, name: `${InstitutionDict[userLanguage]['TABLE']['NAME']}`, value: 'name'},
    {id: 2, name: `${InstitutionDict[userLanguage]['TABLE']['TYPE']}`, value: 'type'},
    {
      id: 3,
      name: `${InstitutionDict[userLanguage]['TABLE']['WEBSITE']}`,
      value: 'website',
    },
    {id: 4, name: `${InstitutionDict[userLanguage]['TABLE']['CONTACT']}`, value: 'phone'},
  ];

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

  const currentPageInstitutes = () => {
    const initialItem = currentPage * userCount;
    const updatedList = institutionsData.slice(initialItem, initialItem + userCount);
    setCurrentList(updatedList);
  };

  const backToInitials = () => {
    setCurrentPage(0);
    currentPageInstitutes();
    setFirstPage(true);
    if (totalPages === 1) {
      setLastPage(true);
    } else {
      setLastPage(false);
    }
  };

  const addNewInstituion = () => {
    history.push(`${match.url}/add`);
  };

  // show institution where the teacher{current authId} is associated
  const getFilteredInstitution = (
    data: [{staff: {items: [{staffAuthID: string}]}}],
    target: string
  ) => {
    const list: any[] = [];
    data.forEach((institution) => {
      institution.staff.items.forEach((staff) => {
        if (staff.staffAuthID === target) {
          list.push(institution);
        }
      });
    });

    return list;
  };

  async function getInstitutionsData() {
    try {
      const fetchInstitutionData: any = await API.graphql(
        graphqlOperation(queries.listInstitutions)
      );
      if (!fetchInstitutionData) {
        throw new Error('fail!');
      } else {
        const instituteList = fetchInstitutionData.data?.listInstitutions?.items;

        const totalListPages = Math.floor(instituteList.length / userCount);
        if (totalListPages * userCount === instituteList.length) {
          setTotalPages(totalListPages);
        } else {
          setTotalPages(totalListPages + 1);
        }
        const filteredInstitution = getFilteredInstitution(
          instituteList,
          state.user.authId
        );

        setInstitutionsData(() => {
          if (state.user.role === 'TR') {
            return filteredInstitution;
          } else {
            return instituteList;
          }
        });

        setTotalInstNum(instituteList.length);
        setStatus('done');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const setSearch = (str: string) => {
    setSearchInput({
      ...searchInput,
      value: str,
    });
  };

  const searchUserFromList = () => {
    if (searchInput.value) {
      const currentInstList = [...institutionsData];
      const newList = currentInstList.filter((item) => {
        // Search on name for match.
        return item.name?.toLowerCase().includes(searchInput.value);
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
    const newInstList = [...institutionsData].sort((a, b) =>
      a[sortingType.value]?.toLowerCase() > b[sortingType.value]?.toLowerCase() &&
      sortingType.asc
        ? 1
        : -1
    );
    setInstitutionsData(newInstList);
  };

  const setSortingValue = (str: string, name: string) => {
    setSortingType({
      ...sortingType,
      value: str,
      name: name,
    });
  };

  useEffect(() => {
    getInstitutionsData();
  }, []);

  useEffect(() => {
    backToInitials();
  }, [institutionsData]);

  useEffect(() => {
    setCurrentPage(0);
    setFirstPage(true);
    setLastPage(false);
    const totalListPages = Math.floor(totalInstNum / userCount);
    if (userCount * totalListPages === totalInstNum) {
      setTotalPages(totalListPages);
    } else {
      setTotalPages(totalListPages + 1);
    }
    if (totalPages === 1 && totalListPages === 0) {
      setFirstPage(true);
      setLastPage(true);
    }
  }, [userCount]);

  useEffect(() => {
    currentPageInstitutes();
  }, [currentPage, totalInstNum, userCount]);

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
            title={InstitutionDict[userLanguage]['TITLE']}
            subtitle={InstitutionDict[userLanguage]['SUBTITLE']}
          />
          <div className="flex justify-end py-4 mb-4">
            <SearchInput
              value={searchInput.value}
              onChange={setSearch}
              onKeyDown={searchUserFromList}
              closeAction={removeSearchAction}
              style="mr-4 w-full"
            />
            <Selector
              placeholder={InstitutionDict[userLanguage]['SORTBY']}
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
              label={InstitutionDict[userLanguage]['BUTTON']['Add']}
              onClick={addNewInstituion}
              btnClass="mr-4 w-full"
              Icon={IoBusinessSharp}
            />
          </div>
        </div>

        {/* List / Table */}
        <div className="flex flex-col">
          <div className="-my-2 py-2">
            <div className="white_back py-4 px-8 mt-2 mb-8 align-middle rounded-lg border-b-0 border-gray-200">
              <div className="h-8/10 px-4">
                <div className="w-full flex justify-between border-b-0 border-gray-200 ">
                  <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>{InstitutionDict[userLanguage]['TABLE']['NAME']}</span>
                  </div>
                  <div className="w-1.5/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">
                      {InstitutionDict[userLanguage]['TABLE']['TYPE']}
                    </span>
                  </div>
                  <div className="w-3.5/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">
                      {InstitutionDict[userLanguage]['TABLE']['WEBSITE']}
                    </span>
                  </div>
                  <div className="w-1.5/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">
                      {InstitutionDict[userLanguage]['TABLE']['CONTACT']}
                    </span>
                  </div>
                  <div className="w-1/10 px-8 justify-center py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {InstitutionDict[userLanguage]['TABLE']['ACTION']}
                  </div>
                </div>
                {currentList && currentList.length ? (
                  currentList.map((instituteObject, i) => (
                    <InstitutionRow
                      key={`instituteRow${i}`}
                      id={instituteObject.id}
                      name={instituteObject.name}
                      image={instituteObject.image}
                      website={instituteObject.website}
                      type={instituteObject.type}
                      phone={instituteObject.phone}
                    />
                  ))
                ) : (
                  <div className="flex p-12 mx-auto justify-center">
                    {InstitutionDict[userLanguage]['TABLE']['NORESULT']}
                  </div>
                )}
              </div>

              {/* Pagination And Counter */}
              <div className="flex justify-center my-4">
                {!searchInput.isActive && (
                  <Fragment>
                    <span className="py-3 px-5 w-auto flex-shrink-0 my-5 text-md leading-5 font-medium text-gray-900">
                      {InstitutionDict[userLanguage]['SHOWPAGE']} {currentPage + 1}{' '}
                      {InstitutionDict[userLanguage]['OF']} {totalPages}{' '}
                      {InstitutionDict[userLanguage]['PAGES']}
                    </span>
                    <Pagination
                      currentPage={currentPage + 1}
                      setNext={goNextPage}
                      setPrev={goPrevPage}
                      firstPage={firstPage}
                      lastPage={lastPage}
                    />
                    <PageCountSelector
                      pageSize={userCount}
                      setPageSize={(c: number) => setUserCount(c)}
                    />
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default InstitutionLookup;
