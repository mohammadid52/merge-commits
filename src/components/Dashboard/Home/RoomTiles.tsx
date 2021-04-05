import ContentCard from '../../Atoms/ContentCard';
import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import ViewMore from '../../Atoms/ViewMore';

import uniqBy from 'lodash/uniqBy';
import slice from 'lodash/slice';
// import { getImageFromS3, getImageFromS3 } from '../../../utilities/services';

const RoomTiles = (props: { classList: any; handleRoomSelection: any }) => {
  const { classList, handleRoomSelection } = props;
  const { state, dispatch } = useContext(GlobalContext);
  const history = useHistory();

  // // Select room on roomtile click
  // const handleRoomSelection = (e: React.MouseEvent)=> {
  //   const t = e.target as HTMLElement;
  //   dispatch({ type: 'UPDATE_ACTIVEROOM', payload: { data: t.id } });
  // }
  // Push user to classroom on room change

  useEffect(() => {
    if (state.activeRoom !== '') {
      history.push('/dashboard/classroom');
    }
  }, [state.activeRoom]);

  const getList = (): any[] => {
    let modifiedClassList: object[] = [];

    classList &&
      classList.length > 0 &&
      classList.forEach((item: { rooms: { items: any[] }; name: string }) => {
        item.rooms.items.forEach((_item: object) => {
          const modifiedItem = { ..._item, roomName: item.name };
          modifiedClassList.push(modifiedItem);
        });
      });

    modifiedClassList = uniqBy(modifiedClassList, (item: any) => item.curricula.items[0].curriculum.id);

    return modifiedClassList;
  };

  const [slicedList, setSlicedList] = useState<any[]>([]);

  const modifiedList = getList();

  useEffect(() => {
    if (modifiedList && modifiedList.length > 0 && slicedList.length === 0) {
      setSlicedList(slice(modifiedList, 0, 3));
    }
  }, [modifiedList]);

  const onViewMore = (): void => {
    if (slicedList.length <= 3) {
      setSlicedList(modifiedList);
    } else {
      setSlicedList(slice(modifiedList, 0, 3));
    }
  };

  // const getImageURL = async (uniqKey: string) => {
  //   const imageUrl: any = await getImageFromS3(uniqKey);
  //   if (imageUrl) {
  //     return imageUrl;
  //   } else {
  //     return '';
  //   }
  // };

  return (
    <ContentCard>
      <div className="relative bg-gray-50 py-6 px-4 sm:px-6">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3"></div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="mt-4 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {slicedList.map((item) => {
              const { name, description }: { name: string; description: string } = item.curricula.items[0].curriculum;
              const { email, firstName, lastName, image } = item.teacher;

              return (
                <div className="flex flex-col rounded-lg shadow-lg overflow-hidden transform transition duration-200">
                  <div className="flex-shrink-0">
                    <img
                      className="cursor-pointer h-48 w-full object-cover hover:scale-105 transform transition-transform"
                      src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&ixqx=5od8bulhcw&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"
                      alt=""
                    />
                  </div>
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      {/* <p className="text-sm font-medium text-indigo-600">
                        <a href="#" className="hover:underline">
                          Case Study
                        </a>
                      </p> */}
                      <a href="#" className="block mt-2">
                        <p className="text-xl font-semibold text-gray-900">{name}</p>
                        <p className="mt-3 text-base text-gray-500">{description || 'no description'}</p>
                      </a>
                    </div>
                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0 w-auto">
                        <a href="#">
                          <span className="sr-only">{firstName + ' ' + lastName}</span>
                          <img
                            className="h-10 w-10 rounded-full"
                            src={
                              'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixqx=5od8bulhcw&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                            }
                            alt=""
                          />
                        </a>
                      </div>
                      <div className="ml-3 w-auto">
                        <p className="text-sm font-semibold text-gray-900">
                          <a href="#" className="hover:underline">
                            {firstName + ' ' + lastName}
                          </a>
                        </p>
                        <p className="space-x-1 text-sm text-gray-500">
                          <a href="#">{email}</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="my-3 mt-8">
            {modifiedList && modifiedList.length > 3 && (
              <ViewMore onClick={onViewMore} text={`${slicedList.length <= 3 ? 'View All' : 'Hide All'}`} />
            )}
          </div>
        </div>
      </div>
    </ContentCard>
  );
};

export default RoomTiles;
