import {API, graphqlOperation} from 'aws-amplify';
import Loader from '@components/Atoms/Loader';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {useQuery} from '@customHooks/urlParam';
import useAuth from '@customHooks/useAuth';
import {createFilterToFetchSpecificItemsOnly} from '@utilities/strings';

import {useGlobalContext} from 'contexts/GlobalContext';
import {getCurriculumNotebook, listRoomsNotebook} from 'customGraphql/customQueries';
import React, {useEffect, useState} from 'react';

import {getImageFromS3} from 'utilities/services';
import RoomViewCard from './RoomView/RoomViewCard';

interface IRoomViewProps {
  roomIdList: string[];
  mainSection?: string;
  studentAuthId?: string;
  studentEmail?: string;
  sectionRoomID?: string;
  sectionTitle?: string;
  studentImage?: string | null;
  handleSectionSelect?: (
    section: string,
    roomIdString: string,
    roomName?: string
  ) => void;
  isTeacher?: boolean;
}

const RoomView = ({
  mainSection,
  sectionRoomID,
  sectionTitle,
  handleSectionSelect,
  studentImage,
  roomIdList,
  isTeacher
}: IRoomViewProps) => {
  // ##################################################################### //
  // ################## GET NOTEBOOK ROOMS FROM CONTEXT ################## //
  // ##################################################################### //

  // TODO: fetch list of rooms
  const [loaded, setLoaded] = useState<boolean>(roomIdList.length === 0);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);

  const {state, zoiqFilter} = useGlobalContext();

  const mapData = (responseData: any[]) => {
    const curriculumMap = responseData.map(async (roomObj: any) => {
      if (roomObj) {
        const curriculumFull: any = await API.graphql(
          graphqlOperation(getCurriculumNotebook, {
            id: roomObj.curricula?.items[0]?.curriculumID
          })
        );
        const curriculumData = curriculumFull.data.getCurriculum;

        return {
          ...roomObj,
          curricula: {
            ...roomObj.curricula,
            items: [
              {
                ...roomObj.curricula?.items[0],
                name: curriculumData?.name,
                image: curriculumData?.image,
                summary: curriculumData?.summary,
                description: curriculumData?.description
              }
            ]
          }
        };
      }
    });
    Promise.all(curriculumMap)
      .then((responseArray: any[]) => {
        setFilteredRooms(responseArray);
      })
      .finally(() => {
        setLoaded(true);
      });
  };

  const getMultipleRoomsAsAStudent = async () => {
    try {
      const responseData = state?.roomData?.rooms || [];
      mapData(responseData);
    } catch (e) {
      console.error('getMultipleRooms - ', e);
    }
  };
  const getMultipleRoomsAsATeacher = async (idList: any[]) => {
    try {
      const compoundQuery = createFilterToFetchSpecificItemsOnly(idList, 'id');

      let filter = {
        or: [...compoundQuery.or]
      };

      if (zoiqFilter.length > 0) {
        filter = {...filter, or: [...filter.or, ...zoiqFilter]};
      }

      const roomsList: any = await API.graphql(
        graphqlOperation(listRoomsNotebook, {
          filter: filter
        })
      );
      const responseData = roomsList?.data?.listRooms?.items || [];
      mapData(responseData);
    } catch (e) {
      console.error('getMultipleRooms - ', e);
    }
  };

  // if nothing works call this
  const checkFromState = () => {
    if (state?.temp?.roomData) {
      mapData(state?.temp?.roomData);
    } else {
      if (roomIdList.length > 0) {
        getMultipleRoomsAsATeacher(roomIdList);
      }
    }
  };

  const {isStudent} = useAuth();

  useEffect(() => {
    if (isStudent) {
      if (
        state &&
        state.roomData &&
        state?.roomData?.rooms &&
        state?.roomData?.rooms.length > 0
      ) {
        getMultipleRoomsAsAStudent();
      }
    } else {
      checkFromState();
    }
  }, [state?.roomData?.rooms, roomIdList, isStudent]);

  const getImageURL = async (uniqKey: string) => {
    const imageUrl: any = await getImageFromS3(uniqKey);
    if (imageUrl) {
      return imageUrl;
    } else {
      return '';
    }
  };

  // ##################################################################### //
  // ################### MAP ROOM OBJECTS TO NOTEBOOKS ################### //
  // ##################################################################### //

  const [mappedNotebookRoomCards, setMappedNotebookRoomCards] = useState<any[]>([]);

  const mapNotebookRoomCards = (onSuccess?: (output?: any[]) => void) => {
    const mapped = filteredRooms.map(async (item) => {
      const {curricula} = item;

      const bannerImage = await (curricula?.items[0]?.image
        ? getImageURL(curricula?.items[0]?.image)
        : null);
      const curriculumName = curricula?.items[0]?.name;

      return {...item, bannerImage, curriculumName};
    });

    Promise.all(mapped).then((output: any) => {
      let filtered = output.filter((item: any) =>
        Boolean(
          item?.curricula?.items[0]?.curriculum &&
            item?.curricula?.items[0]?.curriculum?.name
        )
      );

      setMappedNotebookRoomCards(filtered);
      onSuccess?.(filtered);
    });
  };

  const params = useQuery(location.search);

  const roomId = params.get('roomId');

  useEffect(() => {
    if (loaded && filteredRooms.length > 0) {
      // @ts-ignore
      mapNotebookRoomCards((output: any[]) => {
        if (roomId && loaded && output.length > 0) {
          const roomObj = output.find((room: any) => room.id === roomId);

          roomObj &&
            handleSectionSelect?.('Class Notebook', roomObj.id, roomObj.curriculumName);
        }
      });
    }
  }, [filteredRooms, loaded]);

  return (
    <>
      <div className="relative pb-4 overflow-hidden bg-white rounded-b-lg shadow mb-4">
        <div className="relative  p-6 mx-auto">
          {!loaded && (
            <div className="my-4">
              <Loader />
            </div>
          )}

          <AnimatedContainer
            delay="1s"
            animationType="opacity"
            show={sectionRoomID === ''}>
            {sectionRoomID === '' && (
              <p className="text-base inline text-medium ">
                Select a notebook to continue
              </p>
            )}
          </AnimatedContainer>

          <div
            // #ts-ignores
            style={{
              transition: 'width 2s',
              transitionTimingFunction: 'cubic-bezier(0.1, 0.7, 1, 0.1)'
            }}
            className="mt-2 max-w-lg mx-auto grid gap-4 lg:max-w-none md:grid-cols-4 grid-cols-1 2xl:grid-cols-5 sm:grid-cols-2">
            <RoomViewCard
              roomID={'private'}
              studentImage={studentImage}
              isTeacher={isTeacher}
              mainSection={mainSection}
              sectionRoomID={sectionRoomID}
              sectionTitle={sectionTitle}
              handleSectionSelect={handleSectionSelect}
              type={'Private Notebook'}
            />
            {mappedNotebookRoomCards && mappedNotebookRoomCards.length > 0
              ? mappedNotebookRoomCards.map((room, idx) => (
                  <RoomViewCard
                    key={`notebook-${idx}`}
                    roomID={room.id}
                    roomName={room.name}
                    mainSection={mainSection}
                    sectionRoomID={sectionRoomID}
                    curriculumName={room.curriculumName}
                    handleSectionSelect={handleSectionSelect}
                    bannerImage={room.bannerImage}
                    type={`Class Notebook`}
                  />
                ))
              : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(RoomView);
