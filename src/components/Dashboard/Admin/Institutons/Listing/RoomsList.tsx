import React, {useEffect, useState, Fragment, useContext} from 'react';
import {useHistory} from 'react-router';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';

import {getAsset} from '../../../../../assets';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import * as customQueries from '../../../../../customGraphql/customQueries';
import useDictionary from '../../../../../customHooks/dictionary';
import Loader from '../../../../Atoms/Loader';
import Tooltip from '../../../../Atoms/Tooltip';
import AddButton from '../../../../Atoms/Buttons/AddButton';

interface RoomListProps {
  instId: string;
  instName: string;
}

const RoomsList = (props: RoomListProps) => {
  const {instId, instName} = props;
  const {clientKey, theme, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const history = useHistory();
  const [roomList, setRoomList] = useState([]);
  const [loading, setLoading] = useState(true);
  const {InstitueRomms} = useDictionary(clientKey);

  const [messages, setMessages] = useState({
    show: false,
    message: InstitueRomms[userLanguage]['messages']['nothaveclass'],
    isError: false,
  });
  const createNewRoom = () => {
    history.push(`/dashboard/manage-institutions/institution/${instId}/room-creation`);
  };

  const editCurrentRoom = (id: string) => {
    history.push(`/dashboard/manage-institutions/institution/${instId}/room-edit/${id}`);
  };

  const fetchRoomList = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listRoomsDashboard, {
          filter: {
            institutionID: {eq: instId},
          },
        })
      );
      const newList = list.data.listRooms.items;
      setRoomList(newList);
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
  }, [instId]);

  return (
    <div className="flex m-auto justify-center p-4 pt-0 pl-12">
      <div className="">
        {loading ? (
          <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
            <div className="w-5/10">
              <Loader color="rgba(107, 114, 128, 1)" />
              <p className="mt-2 text-center text-lg text-gray-500">
                {InstitueRomms[userLanguage]['LOADING']}
              </p>
            </div>
          </div>
        ) : roomList.length > 0 ? (
          <Fragment>
            <div className="flex justify-between items-center">
              <div className="flex w-auto">
                {/* <span className="w-auto inline-flex items-center mr-2">
                  <SiGoogleclassroom className="w-6 h-6" />
                </span> */}
                <h3 className="text-lg leading-6 text-gray-600 w-auto">
                  {InstitueRomms[userLanguage]['TITLE']}
                </h3>
              </div>
              <AddButton
                label={InstitueRomms[userLanguage]['BUTTON']['ADD']}
                onClick={createNewRoom}
              />
            </div>

            <div className="w-full pt-8 m-auto border-b-0 border-gray-200">
              <div className={`flex justify-between bg-gray-50 pl-4 ${roomList.length > 4 ? 'pr-6' : 'pr-4'} py-2 whitespace-nowrap`}>
                <div className="w-1/10 px-4 py-2 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueRomms[userLanguage]['NO']}</span>
                </div>
                <div className="w-3/10 px-4 py-2 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
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
                  className={`flex justify-between items-center w-full px-4 py-2 border-b-0 border-gray-200 ${
                    i % 2 !== 0 ? 'bg-gray-50' : ''
                  }`}>
                  <div className={"flex w-1/10 items-center justify-left px-4 py-2 text-left text-s leading-4"}>
                    {i + 1}.
                  </div>
                  <div className="flex w-3/10 items-center justify-left px-4 py-2 text-left text-s leading-4 font-medium whitespace-normal">
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
                      .join(',')}
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
          </Fragment>
        ) : (
          <Fragment>
            <div className="flex justify-center mt-8">
              <AddButton
                className="mx-4"
                label={InstitueRomms[userLanguage]['BUTTON']['ADD']}
                onClick={createNewRoom}
              />
            </div>

            <p className={`text-center p-16 ${messages.isError ? 'text-red-600' : ''}`}>
              {messages.message}
            </p>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default RoomsList;
