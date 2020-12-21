import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineUsergroupAdd, AiOutlineArrowUp } from 'react-icons/ai';
import API, { graphqlOperation } from '@aws-amplify/api';

import * as queries from '../../../../graphql/queries';
import InstitutionSearch from './InstitutionSearch';
import Actions from '../Actions/Actions';
import InstitutionRow from './InstitutionRow';
import Buttons from '../../../Atoms/Buttons';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageCountSelector from '../../../Atoms/PageCountSelector';
import SearchInput from '../../../Atoms/Form/SearchInput';
import Selector from '../../../Atoms/Form/Selector';
import { GlobalContext } from '../../../../contexts/GlobalContext';

/**
 * This component represents the bulk code of the institutions-lookup/all-institutions page
 * which lists all the available institutions
 */

const InstitutionLookup: React.FC = () => {
  const [institutionsData, setInstitutionsData] = useState([]);
  const match = useRouteMatch();
  const history = useHistory();
  const { state, theme } = useContext(GlobalContext);
  const [searchInput, setSearchInput] = useState({
    value: '',
    isActive: false
  });
  const [sortingType, setSortingType] = useState({
    value: '',
    name: '',
    asc: true
  });

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Institution Management', url: '/dashboard/manage-institutions', last: true },
  ]

  const sortByList = [
    { id: 1, name: 'Name', value: 'lastName' },
    // { id: 2, name: 'Role', value: 'role' },
    // { id: 3, name: 'Institution', value: 'institution' },
    // { id: 4, name: 'Status', value: 'status' },
  ]

  const addNewInstituion = () => {
    history.push(`${match.url}/add`);
  }

  async function getInstitutionsData() {
    try {
      const fetchInstitutionData: any = await API.graphql(
        graphqlOperation(queries.listInstitutions)
      );
      if (!fetchInstitutionData) {
        throw new Error('fail!');
      } else {
        console.log('Log institutions BEFORE: ', fetchInstitutionData);
        setInstitutionsData(fetchInstitutionData.data.listInstitutions.items);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const setSearch = (str: string) => {
    setSearchInput({
      ...searchInput,
      value: str
    })
  }

  const searchUserFromList = () => {

  }

  const toggleSortDimention = () => {
    setSortingType({
      ...sortingType,
      asc: !sortingType.asc
    })
  }

  const removeSearchAction = () => {
    // setSearchInput({ value: '', isActive: false })
    // setSortingToInitial();
    // listUsers(null)
  }

  const setSortingValue = (str: string, name: string) => {
    // setSortingType({
    // 	...sortingType,
    // 	value: str,
    // 	name: name
    // })
  }

  useEffect(() => {
    getInstitutionsData();
  }, []);

  return (
    <div className={`w-full h-full mt-4`}>

      {/* Header section */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="INSTITUTIONS MANAGEMENT" subtitle="Institutions List" />
        <div className="flex justify-end py-4 mb-4">
          <SearchInput value={searchInput.value} onChange={setSearch} onKeyDown={searchUserFromList} closeAction={removeSearchAction} style="mr-4 w-full" />
          <Selector list={sortByList} selectedItem={sortingType.name} onChange={setSortingValue} btnClass="rounded-r-none border-r-0" arrowHidden={true} />
          <button className={`w-28 bg-gray-100 mr-4 p-3 border-gray-400 border rounded ${theme.outlineNone} ${sortingType.asc ? 'border-l-0 rounded-l-none' : 'border-r-0 rounded-r-none transform rotate-180'}`} onClick={toggleSortDimention}>
            <IconContext.Provider value={{ size: '1.5rem', color: '#667eea' }}>
              <AiOutlineArrowUp />
            </IconContext.Provider>
          </button>
          <Buttons label="Add New Institution" onClick={addNewInstituion} btnClass="mr-4 w-full" Icon={AiOutlineUsergroupAdd} />
        </div>
      </div>

      {/* List / Table */}

      {/* <div className='flex flex-col'>
        <div className='-my-2 py-2'>
          <div className='white_back py-4 px-8 mt-8 align-middle rounded-lg border-b border-gray-200'>
            <div className='h-8/10 px-4'>
              <div className='w-full flex justify-between border-b border-gray-200 '>
                <div className='w-1/10 px-8 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider'>
                  <span>No.</span>
                </div>
                <div className='w-1/10 px-8 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider'>
                  <span>Institution</span>
                </div>
                <div className='w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider'>
                  <span className='w-auto'>State</span>
                </div>
                <div className='w-3/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider'>
                  <span className='w-auto'>Address</span>
                </div>
                <div className='w-2/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider'>
                  <span className='w-auto'>Website</span>
                </div>
                <div className='w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider'></div>
              </div>
              {typeof institutionsData !== 'undefined'
                ? institutionsData.map((instituteObject, i) => (
                  <InstitutionRow
                    key={`instituteRow${i}`}
                    id={instituteObject.id}
                    name={instituteObject.name}
                    state={instituteObject.state}
                    address={instituteObject.address}
                    website={instituteObject.website}
                  />
                ))
                : null}
            </div>
          </div>
        </div>
      </div> */}

      {/* --------- */}
      <div className="flex flex-col">
        <div className="-my-2 py-2">
          <div className="white_back py-4 px-8 mt-2 mb-8 align-middle rounded-lg border-b border-gray-200">
            <div className="h-8/10 px-4">
              <div className="w-full flex justify-between border-b border-gray-200 ">
                <div className="w-3.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>Institute Name</span>
                </div>
                <div className="w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-auto">State</span>
                </div>
                <div className="w-3.5/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-auto">Website</span>
                </div>
                <div className="w-1.5/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-auto">Type</span>
                </div>
                <div className="w-1/10 px-8 justify-center py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Actions
									</div>
              </div>
              {institutionsData ?
                institutionsData.map((instituteObject, i) => (
                  <InstitutionRow
                    key={`instituteRow${i}`}
                    id={instituteObject.id}
                    name={instituteObject.name}
                    state={instituteObject.state}
                    address={instituteObject.address}
                    website={instituteObject.website}
                    type={instituteObject.type}
                  />
                ))
                : (
                  <div className="flex p-12 mx-auto justify-center">
                    No Results
                  </div>)}

            </div>

            {/* Pagination And Counter */}
            <div className="flex justify-center my-8">
              {/* {!searchInput.isActive &&
									(
										<Fragment>
											<Pagination currentPage={currentPage} setNext={loadNextPage} setPrev={loadPrevPage} firstPage={firstPage} lastPage={lastPage} />
											<PageCountSelector pageSize={userCount} setPageSize={(c: number) => setUserCount(c)} />
										</Fragment>
									)} */}
            </div>
          </div>
        </div>
      </div>
      {/* --------- */}
    </div>
  );
};

export default InstitutionLookup;
