import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';

import {getAsset} from 'assets';
import AddButton from 'atoms/Buttons/AddButton';
import SearchInput from 'atoms/Form/SearchInput';
import Selector from 'atoms/Form/Selector';
import Loader from 'atoms/Loader';
import Tooltip from 'atoms/Tooltip';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';

interface RoomListProps {
  instId: string;
  instName: string;
}

const RoomsList = (props: RoomListProps) => {
  const {instId} = props;
  const {
    clientKey,
    state: {
      user: {isSuperAdmin, isAdmin, isBuilder, associateInstitute}
    },
    theme,
    userLanguage
  } = useContext(GlobalContext);
  const match = useRouteMatch();
  const themeColor = getAsset(clientKey, 'themeClassName');
  const history = useHistory();
  const {CommonlyUsedDict, InstitueRomms} = useDictionary(clientKey);

  const [roomList, setRoomList] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [institutionList, setInstitutionList] = useState<any>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<any>({});
  const [selectedStaff, setSelectedStaff] = useState<any>({});

  const [messages, setMessages] = useState({
    show: false,
    message: InstitueRomms[userLanguage]['messages']['nothaveclass'],
    isError: false
  });
  const createNewRoom = () => {
    history.push(
      isSuperAdmin
        ? `/dashboard/manage-institutions/room-creation`
        : `/dashboard/manage-institutions/institution/${instId}/room-creation`
    );
  };

  const editCurrentRoom = (id: string, instId: string) => {
    history.push(
      isSuperAdmin
        ? `/dashboard/manage-institutions/room-edit/${id}`
        : `/dashboard/manage-institutions/institution/${instId}/room-edit/${id}`
    );
  };

  const fetchStaffOptions = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listStaffOptions)
      );
      setStaffList(
        list.data.listStaff.items
          ?.filter(
            ({staffMember}: any) =>
              staffMember?.role === 'TR' || staffMember?.role === 'FLW'
          )
          .map(({staffMember, staffAuthID}: any) => ({
            id: staffAuthID,
            name: [staffMember?.firstName, staffMember?.lastName]
              .filter(Boolean)
              .join(' ')
          }))
          .sort((a: any, b: any) =>
            a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
          )
      );
    } catch (error) {}
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchRoomList = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listRoomsDashboard)
      );

      const newList = list.data.listRooms.items;

      setRoomList(newList);
      setAllRooms(newList);
      setLoading(false);
    } catch {
      setMessages({
        show: true,
        message: InstitueRomms[userLanguage]['messages']['fetcherr'],
        isError: true
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (instId === associateInstitute[0]?.institution?.id) {
      fetchRoomList();
      fetchStaffOptions();
    }
  }, [instId]);

  useEffect(() => {
    if (isSuperAdmin || isAdmin || isBuilder) {
      fetchInstitutions();
      fetchRoomList();
      fetchStaffOptions();
    }
  }, [isSuperAdmin]);

  const instituteChange = (_: string, name: string, value: string) => {
    setSelectedInstitution({name, id: value});
    onSearch(searchInput, value, selectedStaff?.id);
  };

  const handleStaffChange = (_: string, name: string, value: string) => {
    setSelectedStaff({name, id: value});
    onSearch(searchInput, selectedInstitution?.id, value);
  };

  const onSearch = (
    searchValue: string,
    institutionId?: string,
    staffMemberId?: string
  ) => {
    setRoomList(
      [...allRooms].filter(
        (item: any) =>
          (searchValue
            ? item.name?.toLowerCase().includes(searchValue.toLowerCase())
            : true) &&
          (institutionId ? item.institution?.id === institutionId : true) &&
          (staffMemberId ? item.teacherAuthID === staffMemberId : true)
      )
    );
    history.push(
      `/dashboard/manage-institutions/institution/${institutionId}/class-rooms`
    );
    // if (searchValue && institutionId && staffMemberId) {
    //   setRoomList(
    //     [...allRooms].filter(
    //       (item: any) =>
    //         item.name?.toLowerCase().includes(searchValue.toLowerCase()) &&
    //         item.institution?.id === institutionId
    //     )
    //   );
    // }
    // if (searchValue && institutionId) {
    //   setRoomList(
    //     [...allRooms].filter(
    //       (item: any) =>
    //         item.name?.toLowerCase().includes(searchValue.toLowerCase()) &&
    //         item.institution?.id === institutionId
    //     )
    //   );
    // } else if (institutionId) {
    //   setRoomList(
    //     [...allRooms].filter((item: any) => item.institution?.id === institutionId)
    //   );
    // } else if (searchValue) {
    //   setRoomList(
    //     [...allRooms].filter((item: any) =>
    //       item.name?.toLowerCase().includes(searchValue.toLowerCase())
    //     )
    //   );
    // } else {
    //   setRoomList(allRooms);
    // }
  };

  const removeSearchAction = () => {
    setSearchInput('');
    onSearch('', selectedInstitution?.id, selectedStaff?.id);
  };

  const onInstitutionSelectionRemove = () => {
    setSelectedInstitution({});
    history.push(
      `/dashboard/manage-institutions/institution/${associateInstitute[0].institution.id}/class-rooms`
    );
    // onSearch(searchInput, '', '');
  };

  const onStaffSelectionRemove = () => {
    setSelectedStaff({});
    onSearch(searchInput, selectedInstitution?.id, '');
  };

  return (
    <div className="flex m-auto justify-center p-4 pt-0 pl-md-12">
      <div className="">
        <div className="flex flex-col lg:flex-row justify-start lg:justify-between items-center">
          <h3 className="text-lg leading-6 text-gray-600 w-full lg:w-auto mb-8">
            {InstitueRomms[userLanguage]['TITLE']}
          </h3>
          <div className={`flex md:justify-end flex-wrap`}>
            <div
              className={`flex justify-between w-auto ${
                isSuperAdmin || isAdmin || isBuilder ? 'lg:w-144' : ' mr-4'
              }`}>
              {(isSuperAdmin || isAdmin || isBuilder) && (
                <Selector
                  dataCy="classroom-institution"
                  placeholder={InstitueRomms[userLanguage]['SELECT_INSTITUTION']}
                  list={institutionList}
                  selectedItem={selectedInstitution?.name}
                  onChange={instituteChange}
                  arrowHidden={true}
                  additionalClass={`w-60 ${
                    isSuperAdmin || isAdmin || isBuilder ? 'mr-4 mb-8' : ''
                  }`}
                  isClearable
                  onClear={onInstitutionSelectionRemove}
                />
              )}
              <SearchInput
                dataCy="classroom-search-input"
                value={searchInput}
                onChange={(value) => setSearchInput(value)}
                onKeyDown={() =>
                  onSearch(searchInput, selectedInstitution?.id, selectedStaff?.id)
                }
                closeAction={removeSearchAction}
                style={`mr-4 w-auto md:w-40 lg:w-48 mb-8`}
              />
              {/* <Selector
                placeholder={InstitueRomms[userLanguage]['SELECT_STAFF']}
                list={staffList}
                selectedItem={selectedStaff?.name}
                onChange={handleStaffChange}
                arrowHidden={true}
                additionalClass={`w-auto md:w-52 lg:w-48 ${
                  isSuperAdmin || isAdmin || isBuilder ? 'mr-4' : ''
                }`}
                isClearable
                onClear={onStaffSelectionRemove}
              /> */}
            </div>
            {(!isSuperAdmin || !isAdmin || !isBuilder) && (
              <AddButton
                className="mb-8"
                label={InstitueRomms[userLanguage]['BUTTON']['ADD']}
                onClick={createNewRoom}
              />
            )}
          </div>
        </div>
        {loading ? (
          <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
            <div className="w-5/10">
              <Loader color="rgba(107, 114, 128, 1)" />
              <p className="mt-2 text-center text-lg text-gray-500">
                {InstitueRomms[userLanguage]['LOADING']}
              </p>
            </div>
          </div>
        ) : roomList.length ? (
          <div className="table-custom-responsive max-h-88 overflow-y-auto">
            <table className="border-collapse table-auto w-full table-hover table-striped">
              <thead className="thead-light">
                <tr>
                  <th className="bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {InstitueRomms[userLanguage]['NO']}
                  </th>
                  {(isSuperAdmin || isAdmin || isBuilder) && (
                    <th className="bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {InstitueRomms[userLanguage]['INSTITUTION_NAME']}
                    </th>
                  )}
                  <th
                    className={`bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}>
                    {InstitueRomms[userLanguage]['CLASSROOMS_NAME']}
                  </th>
                  <th className="bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {InstitueRomms[userLanguage]['TEACHER']}
                  </th>

                  <th className="bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {InstitueRomms[userLanguage]['CURRICULUM']}
                  </th>

                  <th className="bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {InstitueRomms[userLanguage]['STATUS']}
                  </th>

                  <th className="bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {InstitueRomms[userLanguage]['ACTION']}
                  </th>
                </tr>
              </thead>
              <tbody>
                {roomList.map((item: any, i: number) => {
                  return (
                    <tr key={i} className={``}>
                      <td className={''}>{i + 1}.</td>
                      {(isSuperAdmin || isAdmin || isBuilder) && (
                        <td
                          className="text-s leading-4 font-medium whitespace-normal break-normal"
                          onClick={(e) => {
                            e.stopPropagation();
                            isSuperAdmin &&
                              history.push(
                                `/dashboard/manage-institutions/institution/${item.institution?.id}/edit?back=${match.url}`
                              );
                          }}>
                          {item.institution?.name}
                        </td>
                      )}
                      <td
                        onClick={() => editCurrentRoom(item.id, item.institutionID)}
                        className={`text-s leading-4 font-medium whitespace-normal break-normal`}>
                        {item.name}
                      </td>
                      <td className="text-s leading-4 whitespace-normal break-normal">
                        {item.teacher?.firstName || ''} {item.teacher?.lastName || ''}
                      </td>
                      <td
                        onClick={() => editCurrentRoom(item.id, item.institutionID)}
                        className="text-s leading-4  whitespace-normal break-normal">
                        {item?.curricula?.items
                          ?.map((d: any) => {
                            return d?.curriculum?.name;
                          })
                          .join(',') || '-'}
                      </td>
                      <td className="text-s leading-4 whitespace-normal break-normal">
                        <div className="w-auto md:w-32 lg:w-28">
                          {item.status ? item.status : 'ACTIVE'}
                        </div>
                      </td>
                      <td
                        data-cy="edit-classroom"
                        className={`text-indigo-600 text-s leading-4 font-medium whitespace-normal break-normal h-6 flex px-4 items-center cursor-pointer text-left py-2 ${theme.textColor[themeColor]}`}
                        onClick={() => editCurrentRoom(item.id, item.institutionID)}>
                        <Tooltip
                          additionalClass="mt-9"
                          text="Click to edit class"
                          placement="left">
                          {InstitueRomms[userLanguage]['EDIT']}
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Fragment>
            {(!isSuperAdmin || !isAdmin || !isBuilder) && (
              <div className="flex justify-center mt-8">
                <AddButton
                  className="mx-4"
                  label={InstitueRomms[userLanguage]['BUTTON']['ADD']}
                  onClick={createNewRoom}
                />
              </div>
            )}

            <p className={`text-center p-16 ${messages.isError ? 'text-red-600' : ''}`}>
              {searchInput || selectedInstitution?.id || selectedStaff?.id
                ? CommonlyUsedDict[userLanguage]['NO_SEARCH_RESULT']
                : messages.message}
            </p>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default RoomsList;
