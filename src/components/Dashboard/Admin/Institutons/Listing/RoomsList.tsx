import React, { useEffect, useState, Fragment, useContext } from 'react';
import { useHistory } from 'react-router';
import API, { graphqlOperation } from '@aws-amplify/api';

import { getAsset } from '../../../../../assets';
import { GlobalContext } from '../../../../../contexts/GlobalContext';
import * as customQueries from '../../../../../customGraphql/customQueries';
import * as queries from '../../../../../graphql/queries';
import PageWrapper from '../../../../Atoms/PageWrapper';
import Buttons from '../../../../Atoms/Buttons';
import useDictionary from '../../../../../customHooks/dictionary';
import Loader from '../../../../Atoms/Loader';
import Tooltip from '../../../../Atoms/Tooltip';

interface RoomListProps {
  instId: string;
  instName: string;
}

const RoomsList = (props: RoomListProps) => {
  const { instId, instName } = props;
  const { clientKey, theme, userLanguage } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const history = useHistory();
  const [roomList, setRoomList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { InstitueRomms } = useDictionary(clientKey);

  const [messages, setMessages] = useState({
    show: false,
    message: InstitueRomms[userLanguage]['messages']['nothaveclass'],
    isError: false,
  });
  const createNewRoom = () => {
    history.push(`/dashboard/manage-institutions/institution/room-creation?id=${instId}`);
  };

  const editCurrentRoom = (id: string) => {
    history.push(`/dashboard/manage-institutions/room-edit?id=${id}`);
  };

  const fetchRoomList = async () => {
    setLoading(true);
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listRoomsDashboard, {
          filter: {
            institutionID: { eq: instId },
          },
        })
      );
      const newList = list.data.listRooms.items;
      console.log(newList);
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
  }, []);

  return (
    <div className="py-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">
            {instName ? instName.toUpperCase() : 'INSTITUTE'} {InstitueRomms[userLanguage]['TITLE']}
          </h3>

          {!loading && roomList.length > 0 ? (
            <Fragment>
              <div className="flex justify-end">
                <Buttons
                  btnClass="mx-4"
                  label={InstitueRomms[userLanguage]['BUTTON']['CREATE']}
                  onClick={createNewRoom}
                />
              </div>

              <div className="flex justify-between w-full mt-8  px-4 py-4 border-b-0 border-gray-200">
                <div className="w-1/10 px-4 py-2 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueRomms[userLanguage]['NO']}</span>
                </div>
                <div className="w-2/10 px-4 py-2 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueRomms[userLanguage]['CLASSROOMS_NAME']}</span>
                </div>
                <div className="w-2/10 px-4 py-2 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueRomms[userLanguage]['CLASS_NAME']}</span>
                </div>
                <div className="w-2/10 px-4 py-2 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueRomms[userLanguage]['TEACHER']}</span>
                </div>

                <div className="w-2/10 px-4 py-2 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueRomms[userLanguage]['CURRICULAM']}</span>
                </div>

                <div className="w-1/10 px-4 py-2 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueRomms[userLanguage]['ACTION']}</span>
                </div>
              </div>

              <div className="m-auto max-h-88 overflow-y-auto overflow-x-auto">
                {roomList.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between items-center w-full px-4 py-4 border-b-0 border-gray-200">
                    <div className="flex w-1/10 items-center px-4 py-2 text-left text-s leading-4">{i + 1}.</div>
                    <div className="flex w-2/10 items-center px-4 py-2 text-left text-s leading-4 font-medium whitespace-normal">
                      {item.name}
                    </div>
                    <div className="flex w-2/10 items-center px-4 py-2 text-left text-s leading-4">
                      {item.class?.name}
                    </div>
                    <div className="flex w-2/10 items-center px-4 py-2 text-left text-s leading-4">
                      {item.teacher?.firstName || ''} {item.teacher?.lastName || ''}
                    </div>
                    <div className="flex w-2/10 items-center px-4 py-2 text-left text-s leading-4">
                      {item?.curricula?.items
                        ?.map((d: any) => {
                          return d?.curriculum?.name;
                        })
                        .join(',')}
                    </div>
                    <span
                      className={`w-1/10 h-6 flex items-center cursor-pointer text-center py-2 ${theme.textColor[themeColor]}`}
                      onClick={() => editCurrentRoom(item.id)}>
                      <Tooltip text="Click to edit" placement="left">
                        {InstitueRomms[userLanguage]['EDIT']}
                      </Tooltip>
                    </span>
                  </div>
                ))}
              </div>
            </Fragment>
          ) : roomList.length < 0 ? (
            <Fragment>
              <div className="flex justify-center mt-8">
                <Buttons
                  btnClass="mx-4"
                  label={InstitueRomms[userLanguage]['BUTTON']['CREATE']}
                  onClick={createNewRoom}
                />
              </div>
              <p className={`text-center text-lg text-gray-500 ${messages.isError ? 'text-red-600' : ''}`}>
                {messages.message}
              </p>
            </Fragment>
          ) : (
            <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
              <div className="w-5/10">
                <Loader color="rgba(107, 114, 128, 1)" />
                <p className="mt-2 text-center text-lg text-gray-500">{InstitueRomms[userLanguage]['LOADING']}</p>
              </div>
            </div>
          )}
        </PageWrapper>
      </div>
    </div>
  );
};

export default RoomsList;
