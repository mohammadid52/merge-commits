import Highlighted from '@components/Atoms/Highlighted';
import PageWrapper from '@components/Atoms/PageWrapper';
import Placeholder from '@components/Atoms/Placeholder';
import useAuth from '@customHooks/useAuth';
import useSearch from '@customHooks/useSearch';
import {Card, Divider, Empty, Tag} from 'antd';
import {fallbackUrls} from 'assets';
import Buttons from 'atoms/Buttons';
import SectionTitleV3 from 'atoms/SectionTitleV3';
import {ModifiedListProps} from 'components/Dashboard/Home/Home';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {orderBy} from 'lodash';
import {useEffect, useState} from 'react';
import {GrFormNextLink} from 'react-icons/gr';
import {DashboardProps} from '../Dashboard';

const {Meta} = Card;

const SingleRoomCard = ({
  item,
  handleRoomSelection,

  searchTerm,
  loading
}: {
  item: any;
  isTeacher: boolean;
  loading?: boolean;
  searchTerm?: string;
  idx: number;
  handleRoomSelection: DashboardProps['handleRoomSelection'];
}) => {
  const {teacherProfileImg, bannerImage, teacher, curricula} = item || {};
  const {name, summary, type} = curricula?.items[0]?.curriculum || {};

  const roomId = item?.id;
  const roomName = item?.name;
  const {firstName, lastName, preferredName} = teacher || {};

  return (
    <Card loading={loading}>
      <div className="flex">
        <img
          className="room-image h-48 w-48 min-w-[7rem] mr-4 rounded-lg bg-gray-100  object-cover"
          src={bannerImage || fallbackUrls.room}
          alt={`${roomName || ''} banner image`}
        />
        <div className="flex flex-col items-start w-full">
          <h3 className="">
            <Highlighted text={name} highlight={searchTerm} />
          </h3>
          <p className="mb-0 text-gray-600">{summary || 'No Description'}</p>
          <Tag className="mt-2" color={'orange'}>
            {type}
          </Tag>
          <Divider />
          <div className="mt-4 flex items-center justify-between w-full">
            <Meta
              avatar={
                <Placeholder
                  size="h-8 w-8"
                  image={teacherProfileImg}
                  firstName={firstName}
                  lastName={lastName}
                />
              }
              description={roomName}
              title={`${preferredName || firstName} ${lastName}`}
            />
            <Buttons
              Icon={GrFormNextLink}
              onClick={() => handleRoomSelection?.(roomId)}
              size="middle"
              variant="dashed"
              label={'Open classroom'}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

const RoomTiles = (props: {
  handleRoomSelection?: DashboardProps['handleRoomSelection'];
  roomsLoading?: boolean;
  classList: ModifiedListProps[];
}) => {
  const {classList: classes, roomsLoading, handleRoomSelection} = props;

  const {userLanguage} = useGlobalContext();
  const {DashboardDict} = useDictionary();

  const [showMore, setShowMore] = useState(false);

  const [classList, setClassList] = useState<any[]>([...classes]);

  const animateOnShowMore = () => {
    if (showMore) {
      setShowMore(false);
    } else {
      setShowMore(true);
    }
  };

  const {user, isTeacher} = useAuth();

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

  let finalList = searchInput.isActive ? filteredList : classList;

  const initShowCount = 4;

  return (
    <>
      <PageWrapper>
        <SectionTitleV3
          shadowOff
          title={DashboardDict[userLanguage]['YOUR_CLASSROOMS']}
          withButton={
            classList &&
            classList.length > 3 && (
              <div className="flex w-auto gap-x-4 justify-end">
                <Buttons
                  label={!showMore ? 'Show All' : 'Show Few'}
                  onClick={animateOnShowMore}
                  disabled={searchInput.isActive}
                  type="button"
                />
              </div>
            )
          }
          extraContainerClass="  px-4"
          fontSize="xl"
          fontStyle="semibold"
          borderBottom
        />
        {!isTeacher && isInactive ? (
          <p className="text-gray-500 text-sm text-center py-8 px-4">
            Your account is inactive. If you think this status is incorrect contact our
            administration team. Acces to your writing exercises and journal are still
            available
          </p>
        ) : roomsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2  py-6  gap-5">
            {Array.from({length: 4}).map((_d) => (
              // @ts-ignore
              <SingleRoomCard item={{}} loading={true} />
            ))}
          </div>
        ) : finalList.length > 0 ? (
          <div className="relative">
            <div className="relative max-w-7xl mx-auto  px-4 mt-4">
              {finalList.length > initShowCount && (
                <h4 className="w-auto text-gray-600">
                  Showing{' '}
                  {showMore || searchInput.isActive ? finalList.length : initShowCount}{' '}
                  out of {finalList.length}
                </h4>
              )}
              <div
                data-cy="classroom-list"
                className={`mt-0 max-w-lg mx-auto py-6 grid gap-5 lg:grid-cols-2 md:grid-cols-2`}>
                {finalList
                  .slice(
                    0,
                    showMore || searchInput.isActive ? finalList.length : initShowCount
                  )
                  .map((item, idx: number) => {
                    return (
                      <SingleRoomCard
                        item={item}
                        idx={idx}
                        searchTerm={searchInput.value}
                        key={idx}
                        isTeacher={Boolean(isTeacher)}
                        handleRoomSelection={handleRoomSelection}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        ) : (
          <Empty description={'No classrooms found'} />
        )}
      </PageWrapper>
    </>
  );
};

export default RoomTiles;
