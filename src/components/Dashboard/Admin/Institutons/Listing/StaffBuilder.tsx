import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';

import Buttons from 'atoms/Buttons';
import Selector from 'atoms/Form/Selector';
import SelectorWithAvatar from 'atoms/Form/SelectorWithAvatar';
import {reorder} from 'utilities/strings';

import {getImageFromS3} from 'utilities/services';
import {statusList} from 'utilities/staticData';
import {createFilterToFetchSpecificItemsOnly} from 'utilities/strings';

import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';

import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';

import SearchInput from '@components/Atoms/Form/SearchInput';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import Table from '@components/Molecules/Table';
import useSearch from '@customHooks/useSearch';
import AddButton from 'atoms/Buttons/AddButton';
import Modal from 'atoms/Modal';

import Filters, {SortType} from '@components/Atoms/Filters';
import PageWrapper from '@components/Atoms/PageWrapper';
import CommonActionsBtns from '@components/MicroComponents/CommonActionsBtns';
import StaffBuilderName from '@components/MicroComponents/StaffBuilderName';
import UserLookupLocation from '@components/MicroComponents/UserLookupLocation';
import useAuth from '@customHooks/useAuth';
import usePagination from '@customHooks/usePagination';
import {logError} from '@graphql/functions';
import Registration from 'components/Dashboard/Admin/UserManagement/Registration';
import {map} from 'lodash';
import {sortByName} from '../../UserManagement/UserLookup';
import {Status} from '../../UserManagement/UserStatus';

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

  // ~~~~~~~~~~~~~~~~ OTHER ~~~~~~~~~~~~~~~~ //

  const history = useHistory();
  const match = useRouteMatch();
  const {BUTTONS, RegistrationDict, staffBuilderDict} = useDictionary();
  const dictionary = staffBuilderDict[userLanguage];

  // ~~~~~~~~~~~~~~~~ STATE ~~~~~~~~~~~~~~~~ //
  const [showSuperAdmin, setShowSuperAdmin] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newMember, setNewMember] = useState({id: '', name: '', value: '', avatar: ''});
  const [activeStaffList, setActiveStaffList] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [statusEdit, setStatusEdit] = useState('');
  const [updateStatus, setUpdateStatus] = useState(false);

  const onChange = (str: string, name: string, id: string, avatar: string) => {
    setNewMember({id, name, value: str, avatar});
  };

  const getStaffRole = (role: string) => {
    switch (role) {
      case 'CRD':
        return 'Coordinator';
      case 'TR':
        return 'Teacher';
      case 'FLW':
        return 'Fellow';
      case 'BLD':
        return 'Builder';
      case 'ADM':
        return 'Admin';
      case 'SUP':
        return 'Super Admin';
    }
  };

  const onDragEnd = async (result: any) => {
    // Change staff sequence
    if (result.source && result.destination) {
      if (result.source.index !== result.destination.index) {
        const previousList = [...activeStaffList];
        let staffIDs = previousList?.map((item) => item.userId);
        const list = reorder(staffIDs, result.source.index, result.destination.index);
        let updatedList = previousList
          .map((t: any) => {
            let index = list.indexOf(t.userId);
            return {...t, index};
          })
          .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));
        setActiveStaffList(updatedList);
        updateStaffSequence(list);
      }
    }
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
        : {and: [{role: {ne: 'ADM'}}, {role: {ne: 'SUP'}}, {role: {ne: 'ST'}}]};

      const list: any = await API.graphql(
        graphqlOperation(customQueries.fetchPersons, {
          filter: {...filter, or: [...zoiqFilter]},
          limit: 500
        })
      );
      let data = list.data.listPeople.items;
      const sortedList = data.sort((a: any, b: any) =>
        a.firstName?.toLowerCase() > b.firstName?.toLowerCase() ? 1 : -1
      );
      const personsList = sortedList.map((item: any, i: any) => ({
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
      const {serviceProviders: {items} = {}, instituteId} = props;
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
    let part1 = user.isSuperAdmin
      ? '/dashboard/manage-institutions'
      : `/dashboard/manage-institutions/institution/${instituteId}`;
    let part2 = `/manage-users/${profileId}`;
    // console.log(`${part1}${part2}`);
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

  const onStaffStatusChange = async (
    status: string,
    staffId: string,
    currentStatus: string,
    authId: string,
    email: string
  ) => {
    if (currentStatus !== status) {
      setUpdateStatus(true);
      const updatedStaff = activeStaffList.map((staff) => {
        if (staff.id === staffId) {
          staff.staffMember.status = status;
        }
        return staff;
      });
      setActiveStaffList(updatedStaff);
      await API.graphql(
        graphqlOperation(customMutations.updateStaff, {input: {id: staffId, status}})
      );
      await API.graphql(
        graphqlOperation(customMutations.updatePerson, {
          input: {authId: authId, email: email, status}
        })
      );
      setUpdateStatus(false);
    }
    setStatusEdit('');
  };

  const showAddStaffSection = async (role?: string) => {
    if (role === 'SUP') {
      setShowRegistrationForm(true);
    } else {
      let users = await getPersonsList(role);
      const staffMembersIds = activeStaffList.map((item: any) => item.userId);
      let availableUsersList = users.filter(
        (item: any) => staffMembersIds.indexOf(item.id) < 0
      );
      setAvailableUsers(availableUsersList);
      setShowAddSection(true);
    }
  };

  const redirectToInstitution = (institutionId: string) => {
    history.push(
      `/dashboard/manage-institutions/institution/${institutionId}/edit?back=${match.url}`
    );
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
  const [totalList, setTotalList] = useState([]);

  const {
    currentList,
    setCurrentList,
    allAsProps,
    setTotalPages,
    setFirstPage,
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
  }, [dataLoading]);

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
    name: (
      <StaffBuilderName
        item={item}
        gotoProfilePage={gotoProfilePage}
        searchTerm={searchInput.value}
      />
    ),

    role: (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-200 text-gray-600 w-auto">
        {item.role ? getStaffRole(item.role) : ''}
      </span>
    ),
    loginStatus: <UserLookupLocation isStaff show item={item.staffMember} idx={index} />,
    status:
      statusEdit === item.id ? (
        <div className="">
          <Selector
            selectedItem={item?.status?.toUpperCase()}
            placeholder="Select Status"
            dropdownWidth="w-48"
            list={statusList}
            onChange={(val, name, id) =>
              onStaffStatusChange(
                val,
                item.id,
                item?.status,
                item?.staffMember?.authId,
                item?.staffMember?.email
              )
            }
          />
        </div>
      ) : (
        <Status useDefault status={item?.status} />
      ),
    actions:
      statusEdit === item.id ? (
        <CommonActionsBtns
          button1Action={() => setStatusEdit('')}
          button1Label={updateStatus ? 'updating...' : 'Cancel'}
        />
      ) : (
        <CommonActionsBtns
          button1Label="Edit"
          button1Action={() => setStatusEdit(item.id)}
        />
      )
  }));

  const tableConfig = {
    headers: [
      dictionary['NO'],
      dictionary['NAME'],

      dictionary['ROLE'],
      dictionary['STATUS'],
      'Login Status',
      dictionary['ACTION']
    ],
    dataList,
    config: {
      isFirstIndex: true,
      isLastAction: true,
      dataList: {
        loading: dataLoading,
        emptyText: 'No staff found',
        droppable: {
          isDroppable: true,
          onDragEnd: onDragEnd,
          droppableId: 'staffList'
        },
        pagination: {
          showPagination: !searchInput.isActive && totalNum > 0,
          config: {
            allAsProps
          }
        },
        customWidth: {
          name: 'w-72 -ml-8',
          no: 'w-12',
          role: 'w-36',
          loginStatus: 'w-72'
        },
        maxHeight: 'max-h-196'
      }
    }
  };

  const [filters, setFilters] = useState<SortType>();

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
                    isActive={searchInput.isActive}
                    closeAction={removeSearchAction}
                  />
                  <AddButton
                    label={'Staff member'}
                    onClick={() => showAddStaffSection(!user.isSuperAdmin ? 'SUP' : '')}
                  />
                </div>
              ) : (
                <Buttons
                  btnClass="ml-4 py-1"
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
                  <Buttons
                    btnClass="ml-4 py-1"
                    label={dictionary['ADD_BUTTON']}
                    onClick={addStaffMember}
                  />
                </div>
              ) : null}
            </div>
          }
        />

        <div className="">
          <Filters
            loading={dataLoading}
            list={finalList}
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

        {showRegistrationForm && (
          <Modal
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
        )}
      </div>
    </div>
  );
};

export default StaffBuilder;
