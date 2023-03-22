import AddButton from '@components/Atoms/Buttons/AddButton';
import PageWrapper from '@components/Atoms/PageWrapper';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import InstituteName from '@components/MicroComponents/InstituteName';
import Table, {ITableProps} from '@components/Molecules/Table';
import usePagination from '@customHooks/usePagination';
import {logError} from '@graphql/functions';
import {XIcon} from '@heroicons/react/outline';
import {withZoiqFilter} from '@utilities/functions';
import {formatPhoneNumber, getHostNameFromUrl} from '@utilities/strings';
import {getAsset} from 'assets';
import BreadcrumbsWithBanner from 'atoms/BreadcrumbsWithBanner';
import SearchInput from 'atoms/Form/SearchInput';
import {API, graphqlOperation} from 'aws-amplify';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {useQuery} from 'customHooks/urlParam';
import {map, orderBy} from 'lodash';
import React, {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';

/**
 * This component represents the bulk code of the institutions-lookup/all-institutions page
 * which lists all the available institutions
 */

const InstitutionLookup: React.FC = () => {
  const match = useRouteMatch();
  const history = useHistory();

  const params = useQuery(location.search);
  const alert = params.get('alert');

  const {clientKey, userLanguage, state} = useGlobalContext();
  const {InstitutionDict, BreadcrumsTitles} = useDictionary();
  const bannerImage = getAsset(clientKey, 'dashboardBanner1');
  const [status, setStatus] = useState('');
  const [institutionsData, setInstitutionsData] = useState<any[]>([]);

  const [totalInstNum, setTotalInstNum] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const {
    currentList,
    allAsProps,
    setTotalPages,
    setCurrentList,
    resetPagination,
    setFirstPage,
    setLastPage,
    getIndex,
    pageCount
  } = usePagination(institutionsData || [], totalInstNum || 0);

  const [searchInput, setSearchInput] = useState({
    value: '',
    isActive: false
  });
  const [sortingType] = useState({
    value: '',
    name: '',
    asc: true
  });

  const breadCrumbsList = [
    {
      title: BreadcrumsTitles[userLanguage]['HOME'],
      href: '/dashboard',
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      href: `${match.url}`,
      last: true
    }
  ];

  const addNewInstitution = () => {
    history.push(`${match.url}/add`);
  };

  const isTeacher = state.user.role === 'TR' || state.user.role === 'FLW';

  async function fetchInstListForAdmin() {
    const fetchInstitutionData: any = await API.graphql(
      graphqlOperation(customQueries.getInstListForAdmin, {
        filter: withZoiqFilter({})
      })
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
      const totalListPages = Math.floor(instituteList.length / pageCount);

      setTotalPages(
        totalListPages * pageCount === instituteList.length
          ? totalListPages
          : totalListPages + 1
      );

      setFirstPage(true);
      setLastPage(!(instituteList.length > pageCount));

      setTotalNum(instituteList.length);

      setTotalInstNum(instituteList.length);

      instituteList = instituteList.map((inst: any) => ({
        ...inst,
        name: inst.name
      }));

      setInstitutionsData(orderBy(instituteList, ['name'], 'asc'));
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

  const [totalNum, setTotalNum] = useState(0);

  const handleInstitutionView = (id: string) => {
    history.push(`${match.url}/institution/${id}/edit`);
  };

  const dictionary = InstitutionDict[userLanguage]['TABLE'];

  const dataList = map(currentList, (instituteObject, idx) => ({
    markRed: Boolean(instituteObject?.isZoiq),
    onClick: () => handleInstitutionView(instituteObject.id),
    no: getIndex(idx),
    instituteName: (
      <InstituteName
        searchTerm={searchInput.value}
        name={instituteObject.name}
        image={instituteObject.image}
        id={instituteObject.id}
      />
    ),
    name: instituteObject.name,
    type: instituteObject.type || '--',
    website: instituteObject.website ? getHostNameFromUrl(instituteObject.website) : '--',
    contactNo: instituteObject.phone ? formatPhoneNumber(instituteObject.phone) : '--'
    // actions: (
    //   <CommonActionsBtns
    //     button1Label="Edit"
    //     button1Action={() => hand∏leInstitutionView(instituteObject.id)}
    //   />
    // )
  }));

  const tableConfig: ITableProps = {
    headers: [
      'No',
      dictionary['NAME'],
      dictionary['TYPE'],
      dictionary['WEBSITE'],
      dictionary['CONTACT']
      // dictionary['ACTION']
    ],
    dataList,
    config: {
      dataList: {
        loading: status !== 'done',

        pagination: {
          showPagination: !searchInput.isActive && totalNum > 0,
          config: {
            allAsProps
          }
        }
      }
    }
  };

  return (
    <div className={`w-full h-full`}>
      {/* Header section */}
      <BreadcrumbsWithBanner
        items={breadCrumbsList}
        bannerImage={bannerImage}
        title={'Institutions'}
      />
      {/* <BreadCrums items={breadCrumsList} /> */}

      <div className="flex m-auto justify-center p-8">
        <PageWrapper>
          <div className="px-4">
            <SectionTitleV3
              title={InstitutionDict[userLanguage]['TITLE']}
              subtitle={InstitutionDict[userLanguage]['SUBTITLE']}
              withButton={
                <div className="flex w-auto justify-end mb-2">
                  <SearchInput
                    value={searchInput.value}
                    onChange={setSearch}
                    onKeyDown={searchUserFromList}
                    closeAction={removeSearchAction}
                  />

                  {state.user.role === 'SUP' && (
                    <AddButton
                      label={InstitutionDict[userLanguage]['BUTTON']['Add']}
                      onClick={addNewInstitution}
                    />
                  )}
                </div>
              }
            />

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
            <Table {...tableConfig} />
          </div>
        </PageWrapper>
      </div>
    </div>
  );
};

export default InstitutionLookup;
