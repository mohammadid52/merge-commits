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
import { ModifiedListProps } from './Home';
import Tooltip from '../../Atoms/Tooltip';

const RoomTiles = (props: { classList: ModifiedListProps[] }) => {
  const { classList: classes } = props;
  const { state, dispatch } = useContext(GlobalContext);
  const history = useHistory();
  const [showMore, setShowMore] = useState(false);

  const [classList, setClassList] = useState([]);

  useEffect(() => {
    if (classes.length > 0) {
      setClassList([...classes]);
    }
  }, [classes]);

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

  // const [slicedList, setSlicedList] = useState<ModifiedListProps[]>([]);

  // const [firstRow, setFirstRow] = useState([]);
  // const [restRow, setRestRow] = useState([]);

  useEffect(() => {
    // if (classList && classList.length > 0) {
    //   if (classList && firstRow.length === 0) {
    //     setFirstRow(slice(classList, 0, 3));
    //   }
    // }
  }, [classList]);

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

  // const debouncedViewMore: any = React.useCallback(
  //   debounce(() => setRestRow([]), 200),
  //   [classList, showMore]
  // );

  // useEffect(() => {
  //   if (classList && classList.length > 0) {
  //     if (showMore) {
  //       setRestRow(slice(classList, 3));
  //     } else {
  //       debouncedViewMore();
  //     }
  //   }
  // }, [classList, showMore]);

  return (
    <>
      <SectionTitleV3
        extraContainerClass="max-w-256 mt-8"
        title={'Your Classrooms'}
        withButton={
          classList &&
          classList.length > 3 && (
            <div className="flex justify-end">
              <Buttons
                label={!showMore ? 'Show All' : 'Show Few'}
                onClick={() => setShowMore(!showMore)}
                type="button"
              />
            </div>
          )
        }
        fontSize="lg"
        fontStyle="semibold"
        extraClass="leading-6 text-gray-900"
        borderBottom
      />
      <ContentCard hasBackground={false} additionalClass="shadow bg-white mb-6 rounded-b-lg">
        {classList.length > 0 ? (
          <div className="relative">
            <div className="relative max-w-7xl mx-auto">
              <div
                // #ts-ignores
                style={{ transition: 'width 2s', transitionTimingFunction: 'cubic-bezier(0.1, 0.7, 1, 0.1)' }}
                className="mt-0 max-w-lg mx-auto pt-4 pb-4 grid px-4 gap-5 lg:grid-cols-3 lg:max-w-none">
                {classList.slice(0, showMore ? classList.length - 1 : 3).map((item, idx: number) => {
                  const { teacherProfileImg, bannerImage, teacher, curricula } = item;
                  const { name, summary, type } = curricula?.items[0]?.curriculum;
                  const roomId = item?.id;
                  const { email, firstName, lastName } = teacher;

                  return (
                    <div
                      onClick={() => handleRoomSelection(roomId)}
                      key={`homepage__classrooms-${idx}`}
                      className="flex border-0 border-gray-300 flex-col rounded-lg overflow-hidden ">
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
                            <p className="text-lg font-semibold text-gray-900">{name}</p>
                            <p className="mt-2 text-base text-gray-500">{limitDesc(summary, 250)}</p>
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
                            <p
                              style={{ maxWidth: '99%' }}
                              className="overflow-hidden pr-2 overflow-ellipsis space-x-1 text-sm text-gray-500">
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
              {/* <div
              className={`mt-5 roomTiles ${
                showMore ? 'is-open' : 'hide'
              } max-w-lg mx-auto gap-5 px-4 pb-4 lg:grid-cols-3 lg:max-w-none grid`}
              hidden>
              {restRow.map((item, idx: number) => {
                const { teacherProfileImg, bannerImage, teacher, curricula } = item;
                const { name, summary, type } = curricula?.items[0]?.curriculum;

                const { email, firstName, lastName } = teacher;

                return (
                  <div
                    key={`homepage__classrooms-${idx}`}
                    className="flex flex-col rounded-lg  border-0 border-gray-300 overflow-hidden transition-all">
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
            </div> */}
            </div>
          </div>
        ) : (
          <div>No classes found</div>
        )}
      </ContentCard>
    </>
  );
};

export default RoomTiles;
