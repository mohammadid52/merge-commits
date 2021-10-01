import React, {useContext, useEffect, useState} from 'react';
import {IoImage} from 'react-icons/io5';
import {GlobalContext} from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';
import Buttons from '../../Atoms/Buttons';
import ContentCard from '../../Atoms/ContentCard';
import ImageAlternate from '../../Atoms/ImageAlternative';
import SectionTitleV3 from '../../Atoms/SectionTitleV3';
import {ModifiedListProps} from './Home';

const RoomTiles = (props: {
  isTeacher?: boolean;
  handleRoomSelection: Function;
  classList: ModifiedListProps[];
}) => {
  const {classList: classes, isTeacher, handleRoomSelection} = props;
  const {userLanguage, clientKey} = useContext(GlobalContext);
  const {DashboardDict} = useDictionary(clientKey);

  const [showMore, setShowMore] = useState(false);

  const [classList, setClassList] = useState([]);

  useEffect(() => {
    if (classes.length > 0) {
      setClassList([...classes]);
    }
  }, [classes]);

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
        extraContainerClass="lg:max-w-192 md:max-w-none 2xl:max-w-256 my-8 px-6"
        title={DashboardDict[userLanguage]['YOUR_CLASSROOMS']}
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
      <ContentCard hasBackground={false} additionalClass="shadow bg-white rounded-b-lg">
        {classList.length > 0 ? (
          <div className="relative">
            <div className="relative max-w-7xl mx-auto">
              <div
                // #ts-ignores
                style={{
                  transition: 'width 2s',
                  transitionTimingFunction: 'cubic-bezier(0.1, 0.7, 1, 0.1)',
                }}
                className="mt-0 max-w-lg mx-auto pt-6 pb-6 grid px-6 gap-5 lg:grid-cols-3 md:grid-cols-2 lg:max-w-none">
                {classList
                  .slice(0, showMore ? classList.length : 3)
                  .map((item, idx: number) => {
                    const {
                      teacherProfileImg,
                      bannerImage,
                      teacher,
                      curricula,
                      roomIndex,
                    } = item;
                    const {name, summary, type} = curricula?.items[0]?.curriculum;
                    const roomId = item?.id;
                    const roomName = item?.name;
                    const {email, firstName, lastName, preferredName} = teacher;

                    return (
                      <div
                        onClick={() =>
                          handleRoomSelection(
                            roomId,
                            roomName,
                            roomIndex,
                            !isTeacher ? 'classroom' : 'lesson-planner'
                          )
                        }
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
                              <p className="text-base 2xl:text-lg text-gray-900">
                                <span className="font-semibold">{name}</span>{' '}
                                {/* <span className="text-base 2xl:text-lg text-semibold text-gray-900">
                                  {isTeacher && `${roomName}`}
                                </span> */}
                              </p>
                              <p className="mt-2 text-xs 2xl:text-sm text-gray-800">
                                {limitDesc(summary, 250)}
                              </p>
                            </a>
                          </div>
                          <div className="mt-6 flex items-center">
                            <div className="flex-shrink-0 w-auto">
                              <a>
                                <span className="sr-only">
                                  {(preferredName || firstName) + ' ' + lastName}
                                </span>
                                {teacherProfileImg ? (
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={teacherProfileImg}
                                    alt=""
                                  />
                                ) : (
                                  <ImageAlternate
                                    user={{firstName, lastName}}
                                    styleClass="h-10 w-10 rounded-full"
                                  />
                                )}
                              </a>
                            </div>
                            <div className="ml-3 w-auto">
                              <p className="text-xs 2xl:text-sm font-medium text-gray-900">
                                <a className="hover:underline">
                                {(preferredName || firstName) + ' ' + lastName}
                                </a>
                              </p>
                              <p
                                style={{maxWidth: '99%'}}
                                className="overflow-hidden pr-2 overflow-ellipsis space-x-1 text-xs 2xl:text-sm text-gray-500">
                                {roomName}
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
          <div className="flex justify-center items-center p-12">No classes found</div>
        )}
      </ContentCard>
    </>
  );
};

export default RoomTiles;
