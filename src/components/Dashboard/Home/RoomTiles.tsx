import ContentCard from '../../Atoms/ContentCard';
import React, { useContext, useEffect, useState } from 'react';
import { uniqBy, slice } from 'lodash';
import { useHistory } from 'react-router-dom';

import { GlobalContext } from '../../../contexts/GlobalContext';
import ViewMore from '../../Atoms/ViewMore';

import { getImageFromS3 } from '../../../utilities/services';
import ImageAlternate from '../../Atoms/ImageAlternative';

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
        item.rooms.items.forEach(async (_item: any) => {
          const curriculumId = _item.curricula.items[0].curriculumID;
          const imagePath = _item.curricula.items[0].curriculum.image;

          const image = await (imagePath !== null ? getImageFromS3(imagePath) : null);
          console.log(_item.teacher.image);
          const teacherProfileImg = await (_item.teacher.image ? getImageFromS3(_item.teacher.image) : false);

          const modifiedItem = { ..._item, roomName: item.name, bannerImage: image, teacherProfileImg };
          modifiedClassList.push(modifiedItem);
        });
      });

    modifiedClassList = uniqBy(modifiedClassList, (item: any) => item.curricula.items[0].curriculum.id);

    return modifiedClassList;
  };

  const [slicedList, setSlicedList] = useState<any[]>([]);

  const modifiedList = getList();

  useEffect(() => {
    if (modifiedList && slicedList.length === 0) {
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

  const limitDesc = (str: string, len: number = 250): string => {
    if (str.length <= len) {
      return str;
    } else {
      return `${str.substring(0, len)}...`;
    }
  };

  return (
    <ContentCard>
      <div className="relative bg-gray-50 py-6 px-4 sm:px-6">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3"></div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="mt-4 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {slicedList.map((item, idx: number) => {
              const {
                teacherProfileImg,
                bannerImage,
                teacher,
                curricula,
              }: {
                teacherProfileImg: string;
                bannerImage: string;
                teacher: { email: string; firstName: string; lastName: string };
                curricula: { items: any[] };
              } = item;
              const { name, description }: { name: string; description: string } = curricula.items[0].curriculum;

              const { email, firstName, lastName } = teacher;

              return (
                <div
                  key={`homepage__classrooms-${idx}`}
                  className="flex flex-col rounded-lg shadow-lg overflow-hidden transform transition duration-200">
                  <div className="flex-shrink-0">
                    {bannerImage ? (
                      <img
                        className="cursor-pointer h-48 w-full object-cover hover:scale-105 transform transition-transform"
                        src={bannerImage}
                        alt=""
                      />
                    ) : (
                      <ImageAlternate
                        user={{ firstName, lastName }}
                        rounded={false}
                        styleClass="cursor-pointer h-48 w-full object-cover hover:scale-105 transform transition-transform"
                      />
                    )}
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
                        <p className="mt-3 text-base text-gray-500">
                          {description ? limitDesc(description, 250) : 'no description'}
                        </p>
                      </a>
                    </div>
                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0 w-auto">
                        <a href="#">
                          <span className="sr-only">{firstName + ' ' + lastName}</span>
                          {teacherProfileImg ? (
                            <img className="h-10 w-10 rounded-full" src={teacherProfileImg} alt="" />
                          ) : (
                            <ImageAlternate user={{ firstName, lastName }} styleClass="h-10 w-10 rounded-full" />
                          )}
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
            {classList && classList.length > 3 && (
              <ViewMore onClick={onViewMore} text={`${slicedList.length <= 3 ? 'View All' : 'Hide All'}`} />
            )}
          </div>
        </div>
      </div>
    </ContentCard>
  );
};

export default RoomTiles;
