import React, {useEffect, useState, Fragment, useContext} from 'react';
import {useHistory, useRouteMatch} from 'react-router';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';

import {getAsset} from '../../../../../assets';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import * as customQueries from '../../../../../customGraphql/customQueries';
import useDictionary from '../../../../../customHooks/dictionary';
import Loader from '../../../../Atoms/Loader';
import Tooltip from '../../../../Atoms/Tooltip';
import AddButton from '../../../../Atoms/Buttons/AddButton';
import SearchInput from '@components/Atoms/Form/SearchInput';
import Selector from '@components/Atoms/Form/Selector';

interface RoomListProps {
  instId: string;
  instName: string;
}

const RoomsList = (props: RoomListProps) => {
  const {instId} = props;
  const {
    clientKey,
    state: {
      user: {isSuperAdmin},
    },
    theme,
    userLanguage,
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
    isError: false,
  });
  const createNewRoom = () => {
    history.push(
      isSuperAdmin
        ? `/dashboard/manage-institutions/room-creation`
        : `/dashboard/manage-institutions/institution/${instId}/room-creation`
    );
  };

  const editCurrentRoom = (id: string) => {
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
        list.data.listStaffs.items
          ?.filter(
            ({staffMember}: any) =>
              staffMember?.role === 'TR' || staffMember?.role === 'FLW'
          )
          .map(({staffMember, staffAuthID}: any) => ({
            id: staffAuthID,
            name: [staffMember?.firstName, staffMember?.lastName]
              .filter(Boolean)
              .join(' '),
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
        graphqlOperation(
          customQueries.listRoomsDashboard,
          !isSuperAdmin
            ? {
                filter: {
                  institutionID: {eq: instId},
                },
              }
            : {}
        )
      );
      const newList = list.data.listRooms.items;
      setRoomList(newList);
      setAllRooms(newList);
      setLoading(false);
    } catch {
      setMessages({
        show: true,
        message: InstitueRomms[userLanguage]['messages']['fetcherr'],
        isError: true,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomList();
    fetchStaffOptions();
  }, [instId]);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchInstitutions();
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
    onSearch(searchInput, '', '');
  };

  const onStaffSelectionRemove = () => {
    setSelectedStaff({});
    onSearch(searchInput, selectedInstitution?.id, '');
  };

  return (
    <div className="flex m-auto justify-center p-4 pt-0 pl-12">
      <div className="">
        <div className="flex flex-col lg:flex-row justify-start lg:justify-between items-center">
          <h3 className="text-lg leading-6 text-gray-600 w-full lg:w-auto mb-4 lg:mb-0">
            {InstitueRomms[userLanguage]['TITLE']}
          </h3>
          <div className={`flex justify-end`}>
            <div
              className={`flex justify-between w-auto ${
                isSuperAdmin ? 'lg:w-144' : 'lg:w-96 mr-4'
              }`}>
              <SearchInput
                value={searchInput}
                onChange={(value) => setSearchInput(value)}
                onKeyDown={() =>
                  onSearch(searchInput, selectedInstitution?.id, selectedStaff?.id)
                }
                closeAction={removeSearchAction}
                style={`mr-4 w-auto md:w-40 lg:w-48`}
              />
              <Selector
                placeholder={InstitueRomms[userLanguage]['SELECT_STAFF']}
                list={staffList}
                selectedItem={selectedStaff?.name}
                onChange={handleStaffChange}
                arrowHidden={true}
                additionalClass={`w-auto md:w-52 lg:w-48 ${isSuperAdmin ? 'mr-4' : ''}`}
                isClearable
                onClear={onStaffSelectionRemove}
              />
              {isSuperAdmin && (
                <Selector
                  placeholder={InstitueRomms[userLanguage]['SELECT_INSTITUTION']}
                  list={institutionList}
                  selectedItem={selectedInstitution?.name}
                  onChange={instituteChange}
                  arrowHidden={true}
                  additionalClass={'w-auto md:w-52 lg:w-48'}
                  isClearable
                  onClear={onInstitutionSelectionRemove}
                />
              )}
            </div>
            {!isSuperAdmin && (
              <AddButton
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
          <>
            <div className="w-full pt-8 m-auto border-b-0 border-gray-200">
              <div
                className={`flex justify-between bg-gray-50 pl-4 ${
                  roomList.length > 4 ? 'pr-6' : 'pr-4'
                } py-2 whitespace-nowrap`}>
                <div className="w-1/10 px-4 py-2 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueRomms[userLanguage]['NO']}</span>
                </div>
                {isSuperAdmin && (
                  <div className="w-1.5/10 px-4 py-2 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>{InstitueRomms[userLanguage]['INSTITUTION_NAME']}</span>
                  </div>
                )}
                <div
                  className={`${
                    isSuperAdmin ? 'w-1.5/10' : 'w-3/10'
                  } px-4 py-2 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}>
                  <span>{InstitueRomms[userLanguage]['CLASSROOMS_NAME']}</span>
                </div>
                {/* <div className="w-2/10 px-4 py-2 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueRomms[userLanguage]['CLASS_NAME']}</span>
                </div> */}
                <div className="w-2/10 px-4 py-2 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueRomms[userLanguage]['TEACHER']}</span>
                </div>

                <div className="w-3/10 px-4 py-2 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueRomms[userLanguage]['CURRICULUM']}</span>
                </div>

                <div className="w-1/10 px-4 py-2 bg-gray-50 flex text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-auto">{InstitueRomms[userLanguage]['ACTION']}</span>
                </div>
              </div>
            </div>

            <div className="m-auto max-h-88 overflow-y-auto overflow-x-auto">
              {roomList.map((item: any, i: number) => (
                <div
                  key={i}
                  className={`flex justify-between items-center w-full px-4 py-2 border-b-0 border-gray-200 cursor-pointer ${
                    i % 2 !== 0 ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => editCurrentRoom(item.id)}>
                  <div
                    className={
                      'flex w-1/10 items-center justify-left px-4 py-2 text-left text-s leading-4'
                    }>
                    {i + 1}.
                  </div>
                  {isSuperAdmin && (
                    <div
                      className="flex w-1.5/10 items-center justify-left px-4 py-2 text-left text-s leading-4 font-medium whitespace-normal break-normal md:break-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        history.push(
                          `/dashboard/manage-institutions/institution/${item.institution?.id}/edit?back=${match.url}`
                        );
                      }}>
                      {item.institution?.name}
                    </div>
                  )}
                  <div
                    className={`flex ${
                      isSuperAdmin ? 'w-1.5/10' : 'w-3/10'
                    } items-center justify-left px-4 py-2 text-left text-s leading-4 font-medium whitespace-normal break-normal md:break-all`}>
                    {item.name}
                  </div>
                  {/* <div className="flex w-2/10 items-center justify-left px-4 py-2 text-left text-s leading-4">
                    {item.class?.name}
                  </div> */}
                  <div className="flex w-2/10 items-center justify-left px-4 py-2 text-left text-s leading-4">
                    {item.teacher?.firstName || ''} {item.teacher?.lastName || ''}
                  </div>
                  <div className="flex w-3/10 items-center px-4 py-2 text-left text-s leading-4">
                    {item?.curricula?.items
                      ?.map((d: any) => {
                        return d?.curriculum?.name;
                      })
                      .join(',') || '-'}
                  </div>
                  <span
                    className={`w-1/10 h-6 flex px-4 items-center text-left cursor-pointer text-left py-2 ${theme.textColor[themeColor]}`}
                    onClick={() => editCurrentRoom(item.id)}>
                    <Tooltip text="Click to edit class" placement="left">
                      {InstitueRomms[userLanguage]['EDIT']}
                    </Tooltip>
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <Fragment>
            {!isSuperAdmin && (
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
