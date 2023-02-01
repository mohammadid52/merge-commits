import SearchInput from '@components/Atoms/Form/SearchInput';
import Highlighted from '@components/Atoms/Highlighted';
import Loader from '@components/Atoms/Loader';
import useAuth from '@customHooks/useAuth';
import useSearch from '@customHooks/useSearch';
import {fallbackUrls} from 'assets';
import Buttons from 'atoms/Buttons';
import ContentCard from 'atoms/ContentCard';
import ImageAlternate from 'atoms/ImageAlternative';
import SectionTitleV3 from 'atoms/SectionTitleV3';
import {ModifiedListProps} from 'components/Dashboard/Home/Home';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {orderBy} from 'lodash';
import React, {useEffect, useState} from 'react';

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

const SingleRoomCard = ({
  item,
  handleRoomSelection,
  idx,
  isTeacher,
  searchTerm
}: {
  item: any;
  isTeacher: boolean;
  searchTerm?: string;
  idx: number;
  handleRoomSelection: any;
}) => {
  const {teacherProfileImg, bannerImage, teacher, curricula, roomIndex} = item;
  const {name, summary, type} = curricula?.items[0]?.curriculum;
  const roomId = item?.id;
  const roomName = item?.name;
  const {firstName, lastName, preferredName} = teacher;

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
      data-cy={`homepage__classrooms-${idx}`}
      className="flex customShadow  transition-all room_card flex-col cursor-pointer rounded-lg overflow-hidden ">
      <div className="flex-shrink-0 bg-gray-500">
        <img
          className="room-image h-56 w-full object-cover hover:scale-105 transform transition-transform duration-300"
          src={bannerImage || fallbackUrls.room}
          alt={`${roomName || ''} banner image`}
        />
      </div>
      <div className="flex-1 bg-white room_card-body p-6 flex flex-col justify-between">
        <div className="flex-1">
          <p className="room-type  text-xs tracking-wide uppercase font-medium text-gray-500">
            {type}
          </p>
          <div data-cy="classroom-cards" className="block mt-2">
            <h4 className="text-base room-name tracking-wider font-medium 2xl:text-lg theme-text">
              <Highlighted text={name} highlight={searchTerm} />
            </h4>
            <p className="mt-2 room-summary text-xs 2xl:text-sm text-gray-600">
              {limitDesc(summary, 50)}
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0 w-auto">
            <span className="sr-only">
              {(preferredName || firstName) + ' ' + lastName}
            </span>
            {teacherProfileImg ? (
              <img className="h-8 w-8 rounded-full" src={teacherProfileImg} alt="" />
            ) : (
              <ImageAlternate
                user={{firstName, lastName}}
                styleClass="h-8 w-8 rounded-full"
              />
            )}
          </div>
          <div className="ml-3 w-auto">
            <p className="text-xs room-teacher-name 2xl:text-sm font-medium text-gray-900">
              {(preferredName || firstName) + ' ' + lastName}
            </p>
            <p
              title={roomName}
              className="overflow-hidden room-desc pr-2 overflow-ellipsis space-x-1 text-xs 2xl:text-sm text-gray-500">
              {limitDesc(roomName, 30)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoomTiles = (props: {
  isTeacher?: boolean;
  handleRoomSelection: Function;
  roomsLoading?: boolean;
  classList: ModifiedListProps[];
}) => {
  const {classList: classes, roomsLoading, isTeacher, handleRoomSelection} = props;
  const {userLanguage} = useGlobalContext();
  const {DashboardDict} = useDictionary();

  const [showMore, setShowMore] = useState(false);

  const [classList, setClassList] = useState([]);

  const animateOnShowMore = () => {
    if (showMore) {
      setShowMore(false);
    } else {
      setShowMore(true);
    }
  };

  const {user} = useAuth();

  const isInactive = user?.status === 'INACTIVE';

  useEffect(() => {
    if (classes.length > 0) {
      const orderedList = orderBy(classes, ['curriculumName'], 'asc');
      setClassList([...orderedList]);
    }
  }, [classes]);

  const [filteredList, setFilteredList] = useState([...classList]);

  const {
    searchInput,
    setSearch,
    removeSearchAction,
    searchAndFilter,
    checkSearchQueryFromUrl,
    filterBySearchQuery
  } = useSearch([...classList], ['curriculumName']);

  useEffect(() => {
    if (!roomsLoading && classList.length > 0) {
      const query = checkSearchQueryFromUrl();
      if (query) {
        const items = filterBySearchQuery(query);
        if (Boolean(items)) {
          setFilteredList(items);
        }
      }
    }
  }, [roomsLoading]);

  const searchClass = () => {
    const searched = searchAndFilter(searchInput.value, false);

    if (Boolean(searched)) {
      setFilteredList(searched);
    } else {
      removeSearchAction();
    }
  };

  let finalList = searchInput.isActive ? filteredList : classList;

  const {isStudent} = useAuth();

  return (
    <>
      <SectionTitleV3
        extraContainerClass="lg:max-w-192 md:max-w-none 2xl:max-w-256 my-8 px-6"
        title={DashboardDict[userLanguage]['YOUR_CLASSROOMS']}
        withButton={
          classList &&
          classList.length > 3 && (
            <div className="flex w-auto gap-x-4 justify-end">
              {!isStudent && (
                <SearchInput
                  dataCy="staff-loookup-search"
                  value={searchInput.value}
                  onChange={setSearch}
                  disabled={roomsLoading}
                  onKeyDown={searchClass}
                  isActive={searchInput.isActive}
                  closeAction={removeSearchAction}
                />
              )}

              <Buttons
                label={!showMore ? 'Show All' : 'Show Few'}
                onClick={animateOnShowMore}
                disabled={searchInput.isActive}
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
      <ContentCard hasBackground={false}>
        {!isTeacher && isInactive ? (
          <p className="text-gray-500 text-sm text-center py-8 px-4">
            Your account is inactive. If you think this status is incorrect contact our
            administration team. Acces to your writing exercises and journal are still
            available
          </p>
        ) : roomsLoading ? (
          <div className="min-h-56 flex items-center justify-center ">
            <Loader className="w-auto text-gray-400" withText="Loading classrooms..." />
          </div>
        ) : finalList.length > 0 ? (
          <div className="relative">
            <div className="relative max-w-7xl mx-auto">
              <div
                data-cy="classroom-list"
                className={`mt-0 max-w-lg mx-auto pt-6 pb-6 grid px-6 gap-5 lg:grid-cols-3 md:grid-cols-2`}>
                {finalList
                  .slice(0, showMore || searchInput.isActive ? finalList.length : 5)
                  .map((item, idx: number) => {
                    return (
                      <SingleRoomCard
                        item={item}
                        idx={idx}
                        searchTerm={searchInput.value}
                        key={idx}
                        isTeacher={isTeacher}
                        handleRoomSelection={handleRoomSelection}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center text-gray-500 items-center p-12">
            No classrooms found
          </div>
        )}
      </ContentCard>
    </>
  );
};

export default RoomTiles;
