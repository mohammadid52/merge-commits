import {API, graphqlOperation} from 'aws-amplify';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router';

import Buttons from 'atoms/Buttons';
import SelectorWithAvatar from 'atoms/Form/SelectorWithAvatar';
import {getUserRoleString} from 'utilities/strings';

import {getImageFromS3} from 'utilities/services';
import {createFilterToFetchSpecificItemsOnly} from 'utilities/strings';

import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';

import * as customQueries from 'customGraphql/customQueries';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';

import SearchInput from '@components/Atoms/Form/SearchInput';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import Table, {ITableProps} from '@components/Molecules/Table';
import useSearch from '@customHooks/useSearch';
import AddButton from 'atoms/Buttons/AddButton';
import Modal from 'atoms/Modal';

import Filters, {SortType} from '@components/Atoms/Filters';
import StaffBuilderName from '@components/MicroComponents/StaffBuilderName';
import UserLookupLocation from '@components/MicroComponents/UserLookupLocation';
import useAuth from '@customHooks/useAuth';
import usePagination from '@customHooks/usePagination';
import {logError} from '@graphql/functions';
import {withZoiqFilter} from '@utilities/functions';
import {Tag} from 'antd';
import Registration from 'components/Dashboard/Admin/UserManagement/Registration';
import {map} from 'lodash';
import moment from 'moment';
import {sortByName} from '../../UserManagement/UserLookup';
import {Status} from '../../UserManagement/UserStatus';
import {SEARCH_LIMIT} from '@components/Lesson/constants';

interface StaffBuilderProps {
  instituteId: String;
  serviceProviders: {items: {id: string; providerID: string}[]};
  instName: string;
}

const StaffBuilder = (props: StaffBuilderProps) => {
  const {instituteId} = props;

  // ~~~~~~~~~~ CONTEXT SPLITTING ~~~~~~~~~~ //
  const gContext = useGlobalContext();
  const zoiqFilter = gContext.zoiqFilter;
  const checkIfAdmin = gContext.checkIfAdmin;
  const userLanguage = gContext.userLanguage;

  const user = gContext.state.user;

  const {isSuperAdmin} = useAuth();

  // ~~~~~~~~~~~~~~~~ OTHER ~~~~~~~~~~~~~~~~ //

  const history = useHistory();

  const {BUTTONS, RegistrationDict, staffBuilderDict} = useDictionary();
  const dictionary = staffBuilderDict[userLanguage];

  // ~~~~~~~~~~~~~~~~ STATE ~~~~~~~~~~~~~~~~ //
  const [showSuperAdmin, setShowSuperAdmin] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newMember, setNewMember] = useState({
    id: '',
    name: '',
    value: '',
    avatar: ''
  });
  const [activeStaffList, setActiveStaffList] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const onChange = (str: string, name: string, id: string, avatar: string) => {
    setNewMember({id, name, value: str, avatar});
  };

  const getPersonsList = async (role: string) => {
    try {
      if (role === 'SUP') {
        setShowSuperAdmin(true);
      } else {
        setShowSuperAdmin(false);
      }

      const filter = role
        ? {role: {eq: role}}
        : user.role === 'SUP'
        ? {role: {eq: 'SUP'}}
        : {
            and: [{role: {ne: 'ADM'}}, {role: {ne: 'SUP'}}, {role: {ne: 'ST'}}]
          };

      const list: any = await API.graphql(
        graphqlOperation(customQueries.fetchPersons, {
          filter: withZoiqFilter(filter, zoiqFilter),
          limit: SEARCH_LIMIT
        })
      );
      let data = list.data.listPeople.items;
      const sortedList = data.sort((a: any, b: any) =>
        a.firstName?.toLowerCase() > b.firstName?.toLowerCase() ? 1 : -1
      );
      const personsList = sortedList.map((item: any) => ({
        id: item.id,
        name: `${item.firstName || ''} ${item.lastName || ''}`,
        value: `${item.firstName || ''} ${item.lastName || ''}`,
        authId: item.authId,
        email: item.email,
        avatar: item.image ? getImageFromS3(item.image) : ''
      }));
      return personsList;
    } catch (err) {
      console.log('Error while fetching staff details', err);
    }
  };
  const getStaffSequence = async () => {
    let sequence: any = await API.graphql(
      graphqlOperation(queries.getCSequences, {id: `staff_${instituteId}`})
    );
    let sequenceData = sequence?.data?.getCSequences;
    return sequenceData;
  };

  const updateStaffSequence = async (newList: any) => {
    await API.graphql(
      graphqlOperation(mutations.updateCSequences, {
        input: {id: `staff_${instituteId}`, sequence: newList}
      })
    );
  };

  const createStaffSequence = async (newList: any) => {
    await API.graphql(
      graphqlOperation(mutations.createCSequences, {
        input: {id: `staff_${instituteId}`, sequence: [...newList]}
      })
    );
  };

  const getStaff = async () => {
    try {
      // get service providers of the institute and create a list and fetch the staff
      const {instituteId} = props;
      const institutions =
        user.role === 'SUP'
          ? user.associateInstitute.length
            ? user.associateInstitute.map((institute: any) => institute.institution.id)
            : []
          : [instituteId];

      // ********
      // Hiding staff details for other institutions they will be available on dropdown only.
      // items.map((item: any) => institutions.push(item.providerID))
      // ********

      const staff: any = await API.graphql(
        graphqlOperation(queries.listStaff, {
          filter: institutions.length
            ? {
                ...createFilterToFetchSpecificItemsOnly(institutions, 'institutionID')
              }
            : {}
        })
      );

      // We are removing duplicate staff members across institution and service providers.
      // confirm with Mike. If we have to show multiple entries with institute name
      // remove this staffUserIds logic and add institute name in the oject
      const staffUserIds: Array<string> = [];
      let staffMembers: any = staff.data.listStaff.items;

      staffMembers = staffMembers.filter((member: any) => {
        if (member.staffMember && staffUserIds.indexOf(member.staffMember.id) < 0) {
          staffUserIds.push(member.staffMember.id);
          member.userId = member.staffMember.id;
          member.name = `${member.staffMember.firstName || ''} ${
            member.staffMember.lastName || ''
          }`;
          member.image = member.staffMember.image
            ? getImageFromS3(member?.staffMember?.image)
            : null;
          member.role = member.staffMember.role;
          member.email = member.staffMember.email;
          return member;
        }
      });

      staffMembers = staffMembers.filter((member: any) => {
        if (!checkIfAdmin()) {
          if (member.staffMember.isZoiq) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      });

      return staffMembers;
    } catch (err) {
      console.log(
        'Error: Get Staff, StaffBuilder: Could not get list of Institution staff members',
        err
      );
    }
  };

  const {authId, email} = useAuth();
  const addName = (data: any[]) =>
    data.map((item: any) => ({
      ...item,
      name: `${item?.staffMember.firstName} ${item?.staffMember.lastName}`,
      _sortName: `${item?.staffMember.firstName?.toLowerCase()} `
    }));
  const addStaffMember = async () => {
    try {
      if (newMember && newMember.id) {
        // get the selected user from the list
        const member = availableUsers.filter((item: any) => item.id === newMember.id)[0];
        // add user mutation
        const input = {
          institutionID: props.instituteId,
          staffAuthID: member.authId,
          staffEmail: member.email,
          status: 'ACTIVE',
          statusChangeDate: new Date().toISOString().split('T')[0]
        };
        const staff: any = await API.graphql(
          graphqlOperation(mutations.createStaff, {input: input})
        );
        // use the mutation result to add the selected user to the staff list
        const addedMember = staff.data.createStaff;
        addedMember.userId = addedMember.staffMember.id;
        addedMember.name = `${addedMember.staffMember.firstName || ''} ${
          addedMember.staffMember.lastName || ''
        }`;
        addedMember.image = addedMember.staffMember.image
          ? getImageFromS3(addedMember?.staffMember?.image)
          : null;
        addedMember.role = addedMember.staffMember.role;
        addedMember.email = addedMember.staffMember.email;
        setActiveStaffList([...activeStaffList, addedMember]);
        // remove the selected user
        setNewMember({name: '', id: '', value: '', avatar: ''});
        // remove the selected user from the available users list
        let updatedAvailableUsers = availableUsers.filter(
          (item: any) => item.id !== member.id
        );
        setAvailableUsers(updatedAvailableUsers);
      } else {
        // TODO: Add the validation msg or error msg on UI for the user.
        // or disable add button if newMember is not selected
        console.log('select a user to add.');
      }
    } catch (err) {
      logError(err, {authId, email}, 'StaffBuilder @addStaffMember');
      console.log(
        'Error: Add Staff, StaffBuilder: Could not add new staff member in institution',
        err
      );
    }
  };

  const gotoProfilePage = (profileId: string) => {
    let part1 = isSuperAdmin
      ? '/dashboard/manage-institutions'
      : `/dashboard/manage-institutions/institution/${instituteId}`;
    let part2 = `/manage-users/${profileId}/staff`;

    history.push(`${part1}${part2}`);
  };

  const postMutation = () => {
    setShowRegistrationForm(false);
    fetchStaffData();
  };

  const fetchStaffData = async () => {
    // const staffMembers = await getStaff()
    let [staffLists, sequenceData]: any = await Promise.all([
      await getStaff(),
      await getStaffSequence()
    ]);
    let staffSequence = sequenceData?.sequence || [];
    const staffMembersIds = staffLists?.map((item: any) => item.userId);
    if (sequenceData) {
      if (!sequenceData.id && staffSequence?.length === 0) {
        createStaffSequence(staffMembersIds);
      } else if (staffLists?.length !== staffSequence?.length) {
        updateStaffSequence(staffMembersIds);
      }
    }

    if (staffLists && staffLists.length > 0) {
      staffLists = staffLists
        .map((item: any) => {
          let index = staffSequence.indexOf(item.userId);
          return {...item, index};
        })
        .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

      const sortedList = sortByName(addName(staffLists));

      setActiveStaffList(sortedList);

      setCurrentList(sortedList);

      const totalListPages = Math.floor(staffLists.length / pageCount);

      setTotalPages(
        totalListPages * pageCount === staffLists.length
          ? totalListPages
          : totalListPages + 1
      );

      setFirstPage(true);
      setLastPage(!(staffLists.length > pageCount));

      setTotalList(staffLists);
      setTotalNum(staffLists.length);

      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (instituteId || user.role === 'SUP') {
      fetchStaffData();
    }
  }, [instituteId]);

  const showAddStaffSection = async (role?: string) => {
    if (role === 'SUP') {
      setShowRegistrationForm(true);
    } else {
      if (role) {
        let users = await getPersonsList(role);
        const staffMembersIds = activeStaffList.map((item: any) => item.userId);
        let availableUsersList = users.filter(
          (item: any) => staffMembersIds.indexOf(item.id) < 0
        );
        setAvailableUsers(availableUsersList);
        setShowAddSection(true);
      }
    }
  };

  const [filteredList, setFilteredList] = useState([...activeStaffList]);

  const {
    searchInput,
    setSearch,
    removeSearchAction,
    searchAndFilter,
    checkSearchQueryFromUrl,
    filterBySearchQuery,
    setSearchInput
  } = useSearch([...activeStaffList], ['name', 'email'], 'name');

  const [totalNum, setTotalNum] = useState(0);
  const [__, setTotalList] = useState<any[]>([]);

  const {
    currentList,
    setCurrentList,
    allAsProps,
    setTotalPages,
    setFirstPage,
    resetPagination,
    setLastPage,
    pageCount,
    getIndex
  } = usePagination(activeStaffList, dataLoading ? 0 : activeStaffList.length);

  // add this function to useEffect
  useEffect(() => {
    if (!dataLoading && currentList.length > 0) {
      const query = checkSearchQueryFromUrl();

      if (query) {
        const items = filterBySearchQuery(query);
        if (Boolean(items)) {
          setFilteredList(items);
        }
      }
    }
  }, [dataLoading, currentList?.length]);

  const searchStaff = () => {
    const searched = searchAndFilter(searchInput.value);

    if (Boolean(searched)) {
      setFilteredList(searched);
    } else {
      removeSearchAction();
    }
  };

  const finalList = searchInput.isActive ? filteredList : currentList;

  const dataList = map(finalList, (item: any, index) => ({
    id: item.id,
    no: getIndex(index),
    onClick: () => gotoProfilePage(item.userId),
    name: (
      <StaffBuilderName
        item={item}
        gotoProfilePage={gotoProfilePage}
        searchTerm={searchInput.value}
      />
    ),

    role: (
      <Tag color="default">
        {item.staffMember.role ? getUserRoleString(item.staffMember.role) : ''}
      </Tag>
    ),
    loginStatus: <UserLookupLocation isStaff show item={item.staffMember} idx={index} />,
    addedDate: moment(item.staffMember?.createdAt).format('ll'),
    status: <Status useDefault status={item?.status} />
  }));

  const tableConfig: ITableProps = {
    headers: [
      dictionary['NO'],
      dictionary['NAME'],

      dictionary['ROLE'],
      dictionary['STATUS'],
      'Login Status',
      'Added date'
    ],
    dataList,
    config: {
      dataList: {
        loading: dataLoading,

        pagination: {
          showPagination: !searchInput.isActive && totalNum > 0,
          config: {
            allAsProps
          }
        }
      }
    }
  };

  const [filters, setFilters] = useState<SortType | null>(null);

  const updateFilter = (filterName: SortType) => {
    if (filterName === filters) {
      setSearchInput({...searchInput, isActive: false});
      setFilters(null);
      setFilteredList([]);
    } else {
      setSearchInput({...searchInput, isActive: true});
      const filtered = activeStaffList.filter(
        (_d: any) => filterName.toLowerCase() === _d?.status?.toLowerCase()
      );
      setFilteredList(filtered);
      setFilters(filterName);
    }
  };

  return (
    <div className="mb-2">
      <div className="px-4">
        <SectionTitleV3
          title={dictionary['TITLE']}
          fontSize="xl"
          fontStyle="semibold"
          extraClass="leading-6 text-gray-900"
          borderBottom
          shadowOff
          withButton={
            <div className="flex gap-x-4 w-auto justify-end items-center flex-wrap">
              {!showAddSection ? (
                <div className="w-auto flex items-center gap-x-4">
                  <SearchInput
                    dataCy="staff-loookup-search"
                    value={searchInput.value}
                    onChange={setSearch}
                    disabled={dataLoading}
                    onKeyDown={searchStaff}
                    closeAction={removeSearchAction}
                  />
                  <AddButton
                    label={'Staff member'}
                    onClick={() => showAddStaffSection(!isSuperAdmin ? 'SUP' : '')}
                  />
                </div>
              ) : (
                <Buttons
                  label={BUTTONS[userLanguage]['CANCEL']}
                  onClick={() => setShowAddSection(false)}
                />
              )}

              {showAddSection ? (
                <div className="flex items-center w-full md:w-6/10 m-auto px-2 mb-8">
                  <SelectorWithAvatar
                    imageFromS3={false}
                    selectedItem={newMember}
                    list={availableUsers}
                    placeholder={
                      showSuperAdmin
                        ? dictionary.ADD_SUPER_ADMIN_PLACEHOLDER
                        : dictionary['ADD_PLACEHOLDER']
                    }
                    onChange={onChange}
                  />
                  <Buttons label={dictionary['ADD_BUTTON']} onClick={addStaffMember} />
                </div>
              ) : null}
            </div>
          }
        />

        <div className="">
          <Filters
            loading={dataLoading}
            list={finalList}
            resetPagination={resetPagination}
            updateFilter={updateFilter}
            filters={filters}
            showingCount={{
              currentPage: allAsProps.currentPage,
              lastPage: allAsProps.lastPage,
              totalResults: allAsProps.totalResults,
              pageCount: allAsProps.pageCount
            }}
          />
        </div>

        <Table {...tableConfig} />

        <Modal
          open={showRegistrationForm}
          showHeader={true}
          title={RegistrationDict[userLanguage]['title']}
          showHeaderBorder={true}
          showFooter={false}
          closeAction={() => setShowRegistrationForm(false)}>
          <Registration
            isInInstitute
            isInModalPopup
            postMutation={postMutation}
            instId={instituteId}
          />
        </Modal>
      </div>
    </div>
  );
};

export default StaffBuilder;
