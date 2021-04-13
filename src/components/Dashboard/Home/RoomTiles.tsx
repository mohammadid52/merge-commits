import ContentCard from '../../Atoms/ContentCard';
import React, { useContext, useEffect, useRef, useState } from 'react';
import slice from 'lodash/slice';
import debounce from 'lodash/debounce';

import { useHistory } from 'react-router-dom';
import { IoImage } from 'react-icons/io5';

import { GlobalContext } from '../../../contexts/GlobalContext';

import { getImageFromS3 } from '../../../utilities/services';
import ImageAlternate from '../../Atoms/ImageAlternative';
import Buttons from '../../Atoms/Buttons';
import SectionTitleV3 from '../../Atoms/SectionTitleV3';

const RoomTiles = (props: { classList: [] }) => {
  const { classList } = props;
  const { state, dispatch } = useContext(GlobalContext);
  const history = useHistory();

  // Select room on roomtile click
  const handleRoomSelection = (id: string) => {
    dispatch({ type: 'UPDATE_ACTIVEROOM', payload: { data: id } });
    history.push('/dashboard/classroom');
  };
  // Push user to classroom on room change

  useEffect(() => {
    if (state.activeRoom !== '') {
      history.push('/dashboard/home');
    }
  }, [state.activeRoom]);

  const getList = () => {
    let modifiedClassList: ModifiedListProps[] = [];
    let uniqIds: string[] = [];

    classList &&
      classList.length > 0 &&
      classList.forEach((item: { rooms: { items: any[] }; name: string; id: string }) => {
        item.rooms.items.forEach(async (_item: any) => {
          const curriculum = _item.curricula.items[0].curriculum;
          const imagePath = curriculum.image;

          const image = await (imagePath !== null ? getImageFromS3(imagePath) : null);
          const teacherProfileImg = await (_item.teacher.image ? getImageFromS3(_item.teacher.image) : false);

          const modifiedItem = { ..._item, roomName: item.name, bannerImage: image, teacherProfileImg };

          if (!uniqIds.includes(curriculum.id)) {
            modifiedClassList.push(modifiedItem);
            uniqIds.push(curriculum.id);
          }
        });
      });

    return modifiedClassList;
  };

  const [slicedList, setSlicedList] = useState<ModifiedListProps[]>([]);
  interface ModifiedListProps {
    id: any;
    name: any;
    teacherProfileImg: string;
    bannerImage: string;
    teacher: { email: string; firstName: string; lastName: string; image: string };
    curricula: {
      items: { curriculum: { name: string; description?: string; id: string; summary?: string; type?: string } }[];
    };
  }

  const modifiedList: ModifiedListProps[] = getList();

  const [firstRow, setFirstRow] = useState([]);
  const [restRow, setRestRow] = useState([]);

  useEffect(() => {
    if (classList && classList.length > 0) {
      if (modifiedList && firstRow.length === 0) {
        setFirstRow(slice(modifiedList, 0, 3));
      }
    }
  }, [modifiedList]);

  const limitDesc = (str: string, len: number = 250): string => {
    if (str) {
      if (str.length <= len) {
        return str;
      } else {
        return `${str.substring(0, len)}...`;
      }
    } else {
      return 'no summary';
    }
  };

  const [showMore, setShowMore] = useState(false);
  const debouncedViewMore: any = React.useCallback(
    debounce(() => setRestRow([]), 200),
    [modifiedList, showMore]
  );

  useEffect(() => {
    if (modifiedList && modifiedList.length > 0) {
      if (showMore) {
        setRestRow(slice(modifiedList, 3));
      } else {
        debouncedViewMore();
      }
    }
  }, [modifiedList, showMore]);

  return (
    <>
      <SectionTitleV3
        extraContainerClass="max-w-256"
        title={'Your Classrooms'}
        withButton={
          <div className="flex justify-end">
            <Buttons label={!showMore ? 'Show All' : 'Show Few'} onClick={() => setShowMore(!showMore)} type="button" />
          </div>
        }
        fontSize="lg"
        fontStyle="semibold"
        extraClass="leading-6 text-gray-900"
        borderBottom={false}
      />
      <ContentCard hasBackground={false}>
        <div className="relative">
          <div className="relative max-w-7xl mx-auto">
            <div className="mt-0 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
              {firstRow.map((item, idx: number) => {
                const { teacherProfileImg, bannerImage, teacher, curricula } = item;
                const { name, summary, type } = curricula.items[0].curriculum;
                const roomName = item.name;
                const roomId = item.id;
                const { email, firstName, lastName } = teacher;

                return (
                  <div
                    onClick={() => handleRoomSelection(roomId)}
                    key={`homepage__classrooms-${idx}`}
                    className="flex flex-col rounded-b-lg shadow overflow-hidden ">
                    <div className="flex-shrink-0">
                      {bannerImage ? (
                        <img
                          className="cursor-pointer h-48 w-full object-cover hover:scale-105 transform transition-transform duration-500"
                          src={bannerImage}
                          alt=""
                        />
                      ) : (
                        <div
                          className={`profile justify-center items-center content-center h-48 w-full bg-gray-100 flex border-gray-400`}>
                          <IoImage className="fill-current text-gray-80" size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-indigo-600">
                          <a href="#" className="hover:underline">
                            {type}
                          </a>
                        </p>
                        <a href="#" className="block mt-2">
                          <p className="text-xl font-semibold text-gray-900">
                            {name} ({roomName})
                          </p>
                          <p className="mt-3 text-base text-gray-500">{limitDesc(summary, 250)}</p>
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

            {/* Second Row */}
            <div
              className={`mt-5 roomTiles ${
                showMore ? 'is-open' : 'hide'
              } max-w-lg mx-auto gap-5 lg:grid-cols-3 lg:max-w-none grid`}
              hidden>
              {restRow.map((item, idx: number) => {
                const { teacherProfileImg, bannerImage, teacher, curricula } = item;
                const { name, summary, type } = curricula.items[0].curriculum;

                const { email, firstName, lastName } = teacher;

                return (
                  <div
                    key={`homepage__classrooms-${idx}`}
                    className="flex flex-col rounded-b-lg shadow overflow-hidden transition-all">
                    <div className="flex-shrink-0">
                      {bannerImage ? (
                        <img
                          className="cursor-pointer h-48 w-full object-cover hover:scale-105 transform transition-transform duration-500"
                          src={bannerImage}
                          alt=""
                        />
                      ) : (
                        <div
                          className={`profile justify-center items-center content-center h-48 w-full bg-gray-100 flex border-gray-400`}>
                          <IoImage className="fill-current text-gray-80" size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-indigo-600">
                          <a href="#" className="hover:underline">
                            {type}
                          </a>
                        </p>
                        <a href="#" className="block mt-2">
                          <p className="text-xl font-semibold text-gray-900">{name}</p>
                          <p className="mt-3 text-base text-gray-500">{limitDesc(summary, 250)}</p>
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
          </div>
        </div>
      </ContentCard>
    </>
  );
};

export default RoomTiles;
