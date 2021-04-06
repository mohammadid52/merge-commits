import React, { useState, useEffect, useContext, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import API, { graphqlOperation } from '@aws-amplify/api';
import { AiOutlineUsergroupAdd, AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { IconContext } from 'react-icons/lib/esm/iconContext';

import { GlobalContext } from '../../../../contexts/GlobalContext';
import * as queries from '../../../../graphql/queries';
import { getAsset } from '../../../../assets';

import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import ListStudents from './ListStudents';
import List from './List';
import Pagination from '../../../Atoms/Pagination';
import Buttons from '../../../Atoms/Buttons';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageCountSelector from '../../../Atoms/PageCountSelector';
import SearchInput from '../../../Atoms/Form/SearchInput';
import Selector from '../../../Atoms/Form/Selector';
import useDictionary from '../../../../customHooks/dictionary';

const UserLookup = () => {
  const { state, theme, userLanguage, clientKey } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const history = useHistory();
  const [status, setStatus] = useState('');
  const [userList, setUserList] = useState([]);
  const [userCount, setUserCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [firstPage, setFirstPage] = useState(false);
  const { UserLookupDict, paginationPage, BreadcrumsTitles } = useDictionary(clientKey);
  const [searchInput, setSearchInput] = useState({
    value: '',
    isActive: false,
  });
  const [sortingType, setSortingType] = useState({
    value: '',
    name: '',
    asc: true,
  });

  // Below changes are for fetching entire list on client side.
  const [totalUserList, setTotalUserList] = useState([]);
  const [totalUserNum, setTotalUserNum] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // ...End.

  const breadCrumsList = [
    { title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false },
    { title: BreadcrumsTitles[userLanguage]['PEOPLE'], url: '/dashboard/manage-users', last: true },
  ];

  const sortByList = [
    { id: 1, name: 'Name', value: 'lastName' },
    { id: 2, name: 'Role', value: 'role' },
    // { id: 3, name: 'Institution', value: 'institution' },
    { id: 4, name: 'Status', value: 'status' },
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

  const handleLink = () => {
    history.push(`/dashboard/registration`);
  };

  const searchUserFromList = async () => {
    if (searchInput.value) {
      const currentUsersList = [...totalUserList];
      const newList = currentUsersList.filter((item) => {
        // Search on firstName, lastName, email, and prefferred name for match.
        return (
          item.firstName?.toLowerCase().includes(searchInput.value) ||
          item.email?.toLowerCase().includes(searchInput.value) ||
          item.preferredName?.toLowerCase().includes(searchInput.value) ||
          item.lastName?.toLowerCase().includes(searchInput.value)
        );
      });
      setSearchInput({
        ...searchInput,
        isActive: true,
      });
      setUserList(newList);
    } else {
      removeSearchAction();
    }
  };

  const setSearch = (str: string) => {
    setSearchInput({
      ...searchInput,
      value: str,
    });
  };

  const setSortingValue = (str: string, name: string) => {
    setSortingType({
      ...sortingType,
      value: str,
      name: name,
    });
  };

  const backToInitials = () => {
    setCurrentPage(0);
    currenPageUsers();
    setFirstPage(true);
    if (totalPages === 1) {
      setLastPage(true);
    } else {
      setLastPage(false);
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
    setSearchInput({ value: '', isActive: false });
  };

  const fetchSortedList = () => {
    const newUserList = [...totalUserList].sort((a, b) =>
      a[sortingType.value]?.toLowerCase() > b[sortingType.value]?.toLowerCase() && sortingType.asc ? 1 : -1
    );
    setTotalUserList(newUserList);
  };

  const currenPageUsers = () => {
    const initialItem = currentPage * userCount;
    const updatedList = totalUserList.slice(initialItem, initialItem + userCount);
    setUserList(updatedList);
  };

  const fetchAllUsersList = async () => {
    try {
      const users: any = await API.graphql(graphqlOperation(queries.listPersons));
      const response = users?.data?.listPersons?.items;

      const usersList =
        state.user.role === 'FLW' ? response.filter((user: any) => user.role === 'ST' || user.role === 'TR') : response;

      const totalListPages = Math.floor(usersList.length / userCount);
      if (totalListPages * userCount === usersList.length) {
        setTotalPages(totalListPages);
      } else {
        setTotalPages(totalListPages + 1);
      }

      setTotalUserList(usersList);
      setTotalUserNum(usersList.length);
      setStatus('done');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllUsersList();
  }, []);

  useEffect(() => {
    backToInitials();
  }, [totalUserList]);

  useEffect(() => {
    setCurrentPage(0);
    setFirstPage(true);
    setLastPage(false);
    const totalListPages = Math.floor(totalUserNum / userCount);
    if (userCount * totalListPages === totalUserNum) {
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
    currenPageUsers();
  }, [currentPage, totalUserNum, userCount]);

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

  return (
    <div className={`w-full h-full`}>
      {/* Header Section */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle
          title={UserLookupDict[userLanguage]['title']}
          subtitle={UserLookupDict[userLanguage]['subtitle']}
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
            placeholder={UserLookupDict[userLanguage]['sortby']}
            list={sortByList}
            selectedItem={sortingType.name}
            onChange={setSortingValue}
            btnClass="rounded-r-none  border-r-none "
            arrowHidden={true}
          />
          <button
            className={`w-28 bg-gray-100 mr-4 p-3 border-gray-400  border-0 rounded border-l-none rounded-l-none ${theme.outlineNone} `}
            onClick={toggleSortDimention}>
            <IconContext.Provider value={{ size: '1.5rem', color: theme.iconColor[themeColor] }}>
              {sortingType.asc ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
            </IconContext.Provider>
          </button>
          <Buttons
            label={UserLookupDict[userLanguage]['button']['add']}
            onClick={handleLink}
            btnClass="mr-4 w-full"
            Icon={AiOutlineUsergroupAdd}
          />
        </div>
      </div>

      {/* List / Table */}
      <div className="flex flex-col">
        <div className="-my-2 py-2">
          <div className="white_back py-4 px-8 mt-2 mb-8 align-middle rounded-lg border-b-0 border-gray-200">
            <div className="h-8/10 px-4">
              <div className="w-full flex justify-between border-b-0 border-gray-200 ">
                <div className="w-4/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{UserLookupDict[userLanguage]['name']}</span>
                </div>
                <div className="w-2/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-auto">{UserLookupDict[userLanguage]['role']}</span>
                </div>

                {/* hide institution column for now. */}
                {/* <div className="w-3.5/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										<span className="w-auto">Institution</span>
									</div> */}
                <div className="w-2/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-auto">{UserLookupDict[userLanguage]['status']}</span>
                </div>
                <div className="w-2/10 px-8 justify-center py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  {UserLookupDict[userLanguage]['action']}
                </div>
              </div>
              {userList.length > 0 ? (
                userList.map((item: any, key: number) => (
                  <div key={key}>
                    {state.user.role === 'FLW' ? <ListStudents item={item} /> : <List item={item} key={key} />}
                  </div>
                ))
              ) : (
                <div className="flex p-12 mx-auto justify-center">{UserLookupDict[userLanguage]['noresult']}</div>
              )}
            </div>

            {/* Pagination And Counter */}
            <div className="flex justify-center my-8">
              {!searchInput.isActive && (
                <Fragment>
                  <span className="py-3 px-5 w-auto flex-shrink-0 my-5 text-md leading-5 font-medium text-gray-900">
                    {paginationPage(userLanguage, currentPage, totalPages)}{' '}
                  </span>
                  <Pagination
                    currentPage={currentPage + 1}
                    setNext={goNextPage}
                    setPrev={goPrevPage}
                    firstPage={firstPage}
                    lastPage={lastPage}
                  />
                  <PageCountSelector pageSize={userCount} setPageSize={(c: number) => setUserCount(c)} />
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLookup;
