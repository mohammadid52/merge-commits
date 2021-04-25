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

const RoomTiles = (props: { isTeacher?: boolean; handleRoomSelection: Function; classList: ModifiedListProps[] }) => {
  const { classList: classes, isTeacher, handleRoomSelection } = props;
  const { state, dispatch } = useContext(GlobalContext);
  const history = useHistory();
  const [showMore, setShowMore] = useState(false);

  const [classList, setClassList] = useState([]);

  useEffect(() => {
    if (classes.length > 0) {
      setClassList([...classes]);
    }
  }, [classes]);

  useEffect(() => {
    if (state.activeRoom !== '') {
      history.push('/dashboard/home');
    }
  }, [state.activeRoom]);

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

  return (
    <>
      <SectionTitleV3
        extraContainerClass="max-w-256 mt-8 px-6"
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
        fontSize="xl"
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
                className="mt-0 max-w-lg mx-auto pt-6 pb-6 grid px-6 gap-5 lg:grid-cols-3 lg:max-w-none">
                {classList.slice(0, showMore ? classList.length - 1 : 3).map((item, idx: number) => {
                  const { teacherProfileImg, bannerImage, teacher, curricula, roomIndex } = item;
                  const { name, summary, type } = curricula?.items[0]?.curriculum;
                  const roomId = item?.id;
                  const roomName = item?.name;
                  const { email, firstName, lastName } = teacher;

                  return (
                    <div
                      onClick={() => handleRoomSelection(roomId, roomName, roomIndex)}
                      key={`homepage__classrooms-${idx}`}
                      className="flex shadow flex-col rounded-lg overflow-hidden ">
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
                            <a className="hover:underline">{type}</a>
                          </p>
                          <a href="#" className="block mt-2">
                            <p className="text-lg font-semibold text-gray-900">
                              {name} {isTeacher && `(${item.roomName})`}
                            </p>
                            <p className="mt-2 text-base text-gray-500">{limitDesc(summary, 250)}</p>
                          </a>
                        </div>
                        <div className="mt-6 flex items-center">
                          <div className="flex-shrink-0 w-auto">
                            <a>
                              <span className="sr-only">{firstName + ' ' + lastName}</span>
                              {teacherProfileImg ? (
                                <img className="h-10 w-10 rounded-full" src={teacherProfileImg} alt="" />
                              ) : (
                                <ImageAlternate user={{ firstName, lastName }} styleClass="h-10 w-10 rounded-full" />
                              )}
                            </a>
                          </div>
                          <div className="ml-3 w-auto">
                            <p className="text-sm font-medium text-gray-900">
                              <a className="hover:underline">{firstName + ' ' + lastName}</a>
                            </p>
                            <p
                              style={{ maxWidth: '99%' }}
                              className="overflow-hidden pr-2 overflow-ellipsis space-x-1 text-sm text-gray-500">
                              <a>{email}</a>
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
        ) : (
          <div>No classes found</div>
        )}
      </ContentCard>
    </>
  );
};

export default RoomTiles;
