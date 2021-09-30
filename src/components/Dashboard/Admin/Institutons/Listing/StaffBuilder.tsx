import React, {useEffect, useState, Fragment, useContext} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import {useHistory} from 'react-router';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

import SelectorWithAvatar from '../../../../Atoms/Form/SelectorWithAvatar';
import Selector from '../../../../Atoms/Form/Selector';
import Buttons from '../../../../Atoms/Buttons';
import PageWrapper from '../../../../Atoms/PageWrapper';
import {reorder} from '../../../../../utilities/strings';

import {
  getInitialsFromString,
  initials,
  stringToHslColor,
  createFilterToFetchSpecificItemsOnly,
} from '../../../../../utilities/strings';
import {getImageFromS3} from '../../../../../utilities/services';
import {statusList} from '../../../../../utilities/staticData';
import {getAsset} from '../../../../../assets';

import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';

import * as customQueries from '../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../customGraphql/customMutations';
import * as queries from '../../../../../graphql/queries';
import * as mutations from '../../../../../graphql/mutations';
import Loader from '../../../../Atoms/Loader';
import Tooltip from '../../../../Atoms/Tooltip';
import Status from '../../../../Atoms/Status';
import AddButton from '../../../../Atoms/Buttons/AddButton';

interface StaffBuilderProps {
  instituteId: String;
  serviceProviders: {items: {id: string; providerID: string}[]};
  instName: string;
}

const StaffBuilder = (props: StaffBuilderProps) => {
  const {instName, instituteId} = props;
  const {
    userLanguage,
    clientKey,
    state: {user},
    theme,
  } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const history = useHistory();
  const {BUTTONS, staffBuilderDict} = useDictionary(clientKey);
  const dictionary = staffBuilderDict[userLanguage];
  const [showSuperAdmin, setShowSuperAdmin] = useState(false);
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

  const redirectToRegistrationPage = () => {
    history.push(`/dashboard/manage-institutions/institution/${instituteId}/register-user`)
  }

  const getPersonsList = async (role: string) => {
    try {
      if(role === 'SUP'){
        setShowSuperAdmin(true);
      }else{
        setShowSuperAdmin(false);
      }
      const list: any = await API.graphql(
        graphqlOperation(customQueries.fetchPersons, {
          filter: role
            ? {role: {eq: role}}
            : user.role === 'SUP'
            ? {or: [{role: {eq: 'ADM'}}, {role: {eq: 'SUP'}}]}
            : {and: [{role: {ne: 'ADM'}}, {role: {ne: 'SUP'}}, {role: {ne: 'ST'}}]},
          limit: 500,
        })
      );
      let data = list.data.listPersons.items;
      const sortedList = data.sort((a: any, b: any) =>
        a.firstName?.toLowerCase() > b.firstName?.toLowerCase() ? 1 : -1
      );
      const personsList = sortedList.map((item: any, i: any) => ({
        id: item.id,
        name: `${item.firstName || ''} ${item.lastName || ''}`,
        value: `${item.firstName || ''} ${item.lastName || ''}`,
        authId: item.authId,
        email: item.email,
        avatar: item.image ? getImageFromS3(item.image) : '',
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
    let seqItem: any = await API.graphql(
      graphqlOperation(mutations.updateCSequences, {
        input: {id: `staff_${instituteId}`, sequence: newList},
      })
    );
  };

  const createStaffSequence = async (newList: any) => {
    let seqItem: any = await API.graphql(
      graphqlOperation(mutations.createCSequences, {
        input: {id: `staff_${instituteId}`, sequence: [...newList]},
      })
    );
  };

  const getStaff = async () => {
    try {
      // get service providers of the institute and create a list and fetch the staff
      const {
        serviceProviders: {items},
        instituteId,
      } = props;
      const institutions = [instituteId];

      // ********
      // Hiding staff details for other institutions they will be available on dropdown only.
      // items.map((item: any) => institutions.push(item.providerID))
      // ********

      const staff: any = await API.graphql(
        graphqlOperation(queries.listStaffs, {
          filter: {
            ...createFilterToFetchSpecificItemsOnly(institutions, 'institutionID'),
          },
        })
      );
      // We are removing duplicate staff memebers across institution and service providers.
      // confirm with Mike. If we have to show multiple entries with institute name
      // remove this staffUserIds logic and add institute name in the oject
      const staffUserIds: Array<string> = [];
      let staffMembers: any = staff.data.listStaffs.items;
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
      return staffMembers;
    } catch (err) {
      console.log(
        'Error: Get Staff, StaffBuilder: Could not get list of Institution staff members',
        err
      );
    }
  };

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
          status: 'Active',
          statusChangeDate: new Date().toISOString().split('T')[0],
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
      console.log(
        'Error: Add Staff, StaffBuilder: Could not add new staff member in institution',
        err
      );
    }
  };

  const gotoProfilePage = (profileId: string) => {
    history.push(`/dashboard/manage-users/user?id=${profileId}`);
  };

  const fetchStaffData = async () => {
    // const staffMembers = await getStaff()
    let [staffLists, sequenceData]: any = await Promise.all([
      await getStaff(),
      await getStaffSequence(),
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
    staffLists = staffLists
      .map((item: any) => {
        let index = staffSequence.indexOf(item.userId);
        return {...item, index};
      })
      .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));
    setActiveStaffList(staffLists);
    setDataLoading(false);
  };

  useEffect(() => {
    if (instituteId) {
      fetchStaffData();
    }
  }, [instituteId]);

  const onStaffStatusChange = async (
    status: string,
    staffId: string,
    currentStatus: string
  ) => {
    if (currentStatus !== status) {
      setUpdateStatus(true);
      await API.graphql(
        graphqlOperation(customMutations.updateStaff, {input: {id: staffId, status}})
      );
      const updatedStaff = activeStaffList.map((staff) => {
        if (staff.id === staffId) {
          staff.status = status;
        }
        return staff;
      });
      setActiveStaffList(updatedStaff);
      setUpdateStatus(false);
    }
    setStatusEdit('');
  };

  const showAddStaffSection = async (role?: string) => {
    if(user.role === 'SUP'){
      redirectToRegistrationPage()
    }else{
      let users = await getPersonsList(role);
      const staffMembersIds = activeStaffList.map((item: any) => item.userId);
      let availableUsersList = users.filter(
        (item: any) => staffMembersIds.indexOf(item.id) < 0
      );
      setAvailableUsers(availableUsersList);
      setShowAddSection(true);
    }
  };

  return (
    <div className="pt-0 flex m-auto justify-center p-8">
      <div className="">
        <PageWrapper defaultClass="">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 w-auto">
              {dictionary['TITLE']}
            </h3>
            {!showAddSection ? (
              <div className="w-auto">
                <AddButton
                  className="ml-4 py-1"
                  label={'Staff member'}
                  onClick={() => showAddStaffSection('')}
                />
                {user.role === 'SUP' && <div
                  className="text-sm text-right text-gray-400 cursor-pointer mt-1"
                  onClick={() => showAddStaffSection('SUP')}>
                  + {dictionary.ADD_SUPER_ADMIN}
                </div>}
              </div>
            ) : (
              <Buttons
                btnClass="ml-4 py-1"
                label={BUTTONS[userLanguage]['CANCEL']}
                onClick={() => setShowAddSection(false)}
              />
            )}
          </div>

          {showAddSection ? (
            <div className="flex items-center w-full md:w-6/10 m-auto px-2 mb-8">
              <SelectorWithAvatar
                imageFromS3={false}
                selectedItem={newMember}
                list={availableUsers}
                placeholder={showSuperAdmin ? dictionary.ADD_SUPER_ADMIN_PLACEHOLDER : dictionary['ADD_PLACEHOLDER']}
                onChange={onChange}
              />
              <Buttons
                btnClass="ml-4 py-1"
                label={dictionary['ADD_BUTTON']}
                onClick={addStaffMember}
              />
            </div>
          ) : null}
          {!dataLoading ? (
            <>
              {activeStaffList?.length > 0 ? (
                <Fragment>
                  <div className="w-full pt-8 m-auto border-b-0 border-gray-200">
                    <div className="flex justify-between bg-gray-50 pr-2 whitespace-nowrap">
                      <div className="w-.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>{dictionary['NO']}</span>
                      </div>
                      <div className="w-4.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>{dictionary['NAME']}</span>
                      </div>
                      <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>{dictionary['ROLE']}</span>
                      </div>
                      <div className="w-2.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>{dictionary['STATUS']}</span>
                      </div>
                      <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>{dictionary['ACTION']}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-auto m-auto max-h-88 overflow-y-auto">
                    {/* Drag and drop listing */}
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                          <div {...provided.droppableProps} ref={provided.innerRef}>
                            {activeStaffList.map((item, index) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}>
                                    <div
                                      key={index}
                                      className={`flex justify-between w-auto py-1 whitespace-nowrap border-b-0 border-gray-200 ${
                                        index % 2 !== 0 ? 'bg-gray-50' : ''
                                      }`}>
                                      <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4">
                                        {index + 1}.
                                      </div>

                                      <div
                                        className="flex w-4.5/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal cursor-pointer "
                                        onClick={() => gotoProfilePage(item.userId)}>
                                        <div className="flex-shrink-0 h-10 w-10 flex items-center">
                                          {!item.image ? (
                                            <div
                                              className="h-8 w-8 rounded-full flex justify-center items-center text-white text-sm text-bold"
                                              style={{
                                                /* stylelint-disable */
                                                background: `${stringToHslColor(
                                                  getInitialsFromString(item.name)[0] +
                                                    ' ' +
                                                    getInitialsFromString(item.name)[1]
                                                )}`,
                                                textShadow: '0.1rem 0.1rem 2px #423939b3',
                                              }}>
                                              {item.name
                                                ? initials(
                                                    getInitialsFromString(item.name)[0],
                                                    getInitialsFromString(item.name)[1]
                                                  )
                                                : initials('N', 'A')}
                                            </div>
                                          ) : (
                                            <div className="h-8 w-8 rounded-full flex justify-center items-center">
                                              <img
                                                src={item.image}
                                                className="rounded-full"
                                              />
                                            </div>
                                          )}
                                        </div>
                                        <div className="ml-2">
                                          <div className="hover:text-gray-600 text-sm leading-5 font-medium text-gray-900">
                                            {item.name}
                                          </div>
                                          <div className="text-sm leading-5 text-gray-500">
                                            {item.email}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center">
                                        <p className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800 w-auto">
                                          {item.role ? getStaffRole(item.role) : ''}
                                        </p>
                                      </div>
                                      {statusEdit === item.id ? (
                                        <div className="flex w-2.5/10 px-8 py-3 text-left text-s leading-4 items-center">
                                          <Selector
                                            selectedItem={item.status}
                                            placeholder="Select Status"
                                            list={statusList}
                                            onChange={(val, name, id) =>
                                              onStaffStatusChange(
                                                val,
                                                item.id,
                                                item.status
                                              )
                                            }
                                          />
                                        </div>
                                      ) : (
                                        <div className="flex w-2.5/10 px-8 py-3 text-left text-s leading-4 items-center">
                                          <Status status={item.status} />
                                        </div>
                                      )}
                                      <div className="flex w-1/10 px-8 py-3 text-left text-s leading-4 items-center">
                                        {statusEdit === item.id ? (
                                          <span
                                            className={`w-6 h-6 flex items-center cursor-pointer ${theme.textColor[themeColor]}`}
                                            onClick={() => setStatusEdit('')}>
                                            {updateStatus ? 'updating...' : 'Cancel'}
                                          </span>
                                        ) : (
                                          <span
                                            className={`w-6 h-6 flex items-center cursor-pointer ${theme.textColor[themeColor]}`}
                                            onClick={() => setStatusEdit(item.id)}>
                                            <Tooltip
                                              text="Click to edit status"
                                              placement="left">
                                              Edit
                                            </Tooltip>
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                </Fragment>
              ) : (
                <div className="text-center p-16">
                  <p> {dictionary['INFO']}</p>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
              <div className="w-5/10">
                <Loader color="rgba(107, 114, 128, 1)" />
                <p className="mt-2 text-center text-lg text-gray-500">Loading Staff...</p>
              </div>
            </div>
          )}
        </PageWrapper>
      </div>
    </div>
  );
};

export default StaffBuilder;
