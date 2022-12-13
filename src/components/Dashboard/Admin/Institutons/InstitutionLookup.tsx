import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import BreadcrumbsWithBanner from 'atoms/BreadcrumbsWithBanner';
import {useQuery} from 'customHooks/urlParam';
import {XIcon} from '@heroicons/react/outline';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {AiOutlineArrowDown, AiOutlineArrowUp} from 'react-icons/ai';
import {IoBusinessSharp} from 'react-icons/io5';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {getAsset} from 'assets';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import Buttons from 'atoms/Buttons';
import SearchInput from 'atoms/Form/SearchInput';
import Selector from 'atoms/Form/Selector';
import PageCountSelector from 'atoms/PageCountSelector';
import Pagination from 'atoms/Pagination';
import InstitutionRow from './InstitutionRow';
import InstitutionRowLoader from './InstitutionRowLoader';
import {logError} from '@graphql/functions';
import ListBottomBar from '@components/Molecules/ListBottomBar';
import usePagination from '@customHooks/usePagination';

/**
 * This component represents the bulk code of the institutions-lookup/all-institutions page
 * which lists all the available institutions
 */

const InstitutionLookup: React.FC = () => {
  const match = useRouteMatch();
  const history = useHistory();

  const params = useQuery(location.search);
  const alert = params.get('alert');

  const {theme, clientKey, userLanguage, state} = useContext(GlobalContext);
  const {InstitutionDict, BreadcrumsTitles} = useDictionary(clientKey);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const bannerImage = getAsset(clientKey, 'dashboardBanner1');
  const [status, setStatus] = useState('');
  const [institutionsData, setInstitutionsData] = useState([]);

  const [userCount, setUserCount] = useState(10);
  const [totalInstNum, setTotalInstNum] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const {
    currentList,
    allAsProps,
    setTotalPages,
    setCurrentList,
    resetPagination
  } = usePagination(institutionsData || [], totalInstNum || 0);

  const [searchInput, setSearchInput] = useState({
    value: '',
    isActive: false
  });
  const [sortingType, setSortingType] = useState({
    value: '',
    name: '',
    asc: true
  });

  const breadCrumbsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      url: `${match.url}`,
      last: true
    }
  ];

  const sortByList = [
    {id: 1, name: `${InstitutionDict[userLanguage]['TABLE']['NAME']}`, value: 'name'},
    {id: 2, name: `${InstitutionDict[userLanguage]['TABLE']['TYPE']}`, value: 'type'},
    {
      id: 3,
      name: `${InstitutionDict[userLanguage]['TABLE']['WEBSITE']}`,
      value: 'website'
    },
    {id: 4, name: `${InstitutionDict[userLanguage]['TABLE']['CONTACT']}`, value: 'phone'}
  ];

  const addNewInstitution = () => {
    history.push(`${match.url}/add`);
  };

  const isTeacher = state.user.role === 'TR' || state.user.role === 'FLW';

  async function fetchInstListForAdmin() {
    const fetchInstitutionData: any = await API.graphql(
      graphqlOperation(customQueries.getInstListForAdmin)
    );
    return fetchInstitutionData.data?.listInstitutions?.items || [];
  }

  async function fetchInstListForNonAdmin() {
    const fetchInstitutionData: any = await API.graphql(
      graphqlOperation(customQueries.getInstListForNonAdmin, {
        filter: {
          staffAuthID: {eq: state.user.authId},
          staffEmail: {eq: state.user.email},
          status: {eq: 'Active'}
        }
      })
    );
    let userInstitutes: any = fetchInstitutionData.data?.listStaff?.items;
    return userInstitutes
      .filter((inst: any) => inst.institution)
      .map((inst: any) => inst.institution);
  }

  async function getInstitutionsData() {
    try {
      let instituteList: any;
      if (isTeacher) {
        instituteList = await fetchInstListForNonAdmin();
      } else {
        instituteList = await fetchInstListForAdmin();
      }
      const totalListPages = Math.floor(instituteList.length / userCount);
      setTotalPages(
        totalListPages * userCount === instituteList.length
          ? totalListPages
          : totalListPages + 1
      );
      setTotalInstNum(instituteList.length);
      setInstitutionsData(instituteList);
      setStatus('done');
    } catch (error) {
      console.error(error);
      logError(
        error,
        {authId: state.user.authId, email: state.user.email},
        'InstitutionLookup'
      );
    }
  }

  const setSearch = (str: string) => {
    setSearchInput({
      ...searchInput,
      value: str
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
        isActive: true
      });
      setCurrentList(newList);
    } else {
      removeSearchAction();
    }
  };

  const toggleSortDimension = () => {
    setSortingType({
      ...sortingType,
      asc: !sortingType.asc
    });
  };

  const removeSearchAction = () => {
    resetPagination();
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
      name: name
    });
  };

  useEffect(() => {
    if (alert) {
      setShowAlert(true);
    }
  }, [alert]);

  useEffect(() => {
    getInstitutionsData();
  }, []);

  useEffect(() => {
    fetchSortedList();
  }, [sortingType.value, sortingType.asc]);

  // if (status !== 'done') {
  //   return <LessonLoading />;
  // }
  {
    return (
      <div className={`w-full h-full`}>
        {/* Header section */}
        <BreadcrumbsWithBanner
          items={breadCrumbsList}
          bannerImage={bannerImage}
          title={'Institutions'}
        />
        {/* <BreadCrums items={breadCrumsList} /> */}
        <div className="px-2 py-8 md:p-8">
          {/* <div className="flex justify-between"> */}
          {/* <SectionTitle
              title={InstitutionDict[userLanguage]['TITLE']}
              subtitle={InstitutionDict[userLanguage]['SUBTITLE']}
            /> */}
          <div className="flex justify-end py-4 mb-2">
            <SearchInput
              value={searchInput.value}
              onChange={setSearch}
              onKeyDown={searchUserFromList}
              closeAction={removeSearchAction}
              style="mr-4 w-auto"
            />
            <Selector
              placeholder={InstitutionDict[userLanguage]['SORTBY']}
              list={sortByList}
              selectedItem={sortingType.name}
              onChange={setSortingValue}
              btnClass="rounded-r-none border-r-none"
              additionalClass="w-80"
              arrowHidden={true}
            />
            <button
              className={`w-16 bg-gray-100 mr-4 p-3 border-gray-400 border-0 rounded border-l-none rounded-l-none ${theme.outlineNone} `}
              onClick={toggleSortDimension}>
              <IconContext.Provider
                value={{size: '1.5rem', color: theme.iconColor[themeColor]}}>
                {sortingType.asc ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
              </IconContext.Provider>
            </button>
            {state.user.role === 'SUP' && (
              <Buttons
                label={InstitutionDict[userLanguage]['BUTTON']['Add']}
                onClick={addNewInstitution}
                btnClass="mr-4"
                Icon={IoBusinessSharp}
              />
            )}
          </div>
          {/* </div> */}
          {showAlert && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert">
              <span className="block sm:inline">
                {'Click on institution to see information'}
              </span>
              <span
                className="absolute top-0 bottom-0 right-0 px-4 py-3 w-auto cursor-pointer"
                onClick={() => setShowAlert(false)}>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
          )}
          {/* List / Table */}
          <div className="flex flex-col">
            <div className="-my-2 py-2">
              <div className="white_back py-4 px-2 lg:px-8 mt-2 mb-8 align-middle rounded-lg border-b-0 border-gray-200 lg:w-full w-screen">
                <div className="h-8/10 px-4 lg:w-full w-screen overflow-scroll lg:overflow-hidden">
                  <div className="w-full flex justify-between border-b-0 border-gray-200 bg-gray-50">
                    <div className="w-3/10 px-2 lg:px-8 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>{InstitutionDict[userLanguage]['TABLE']['NAME']}</span>
                    </div>
                    <div className="w-1.5/10 flex justify-left px-4 lg:px-8 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span className="w-auto">
                        {InstitutionDict[userLanguage]['TABLE']['TYPE']}
                      </span>
                    </div>
                    <div className="w-3.5/10 flex justify-left px-4 lg:px-8 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span className="w-auto">
                        {InstitutionDict[userLanguage]['TABLE']['WEBSITE']}
                      </span>
                    </div>
                    <div className="w-1.5/10 flex justify-left px-4 lg:px-8 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span className="w-auto">
                        {InstitutionDict[userLanguage]['TABLE']['CONTACT']}
                      </span>
                    </div>
                    <div className="w-1/10 px-4 lg:px-8 flex justify-left py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {InstitutionDict[userLanguage]['TABLE']['ACTION']}
                    </div>
                  </div>
                  {status !== 'done' ? (
                    Array(10)
                      .fill(' ')
                      .map((_: any, index: number) => (
                        <Fragment key={index}>
                          <InstitutionRowLoader />
                        </Fragment>
                      ))
                  ) : currentList?.length ? (
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
                  {!searchInput.isActive && Boolean(currentList?.length) && (
                    <ListBottomBar {...allAsProps} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default InstitutionLookup;
