import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import CopyCloneSlideOver from '@components/Lesson/UniversalLessonBuilder/UI/SlideOvers/CopyCloneSlideOver';
import {useGlobalContext} from '@contexts/GlobalContext';
import * as customQueries from '@customGraphql/customQueries';
import React, {useEffect, useState} from 'react';
import {getImageFromS3} from '../../../utilities/services';
import RoomViewCard from './RoomView/RoomViewCard';

interface IRoomViewProps {
  roomIdList: string[];
  mainSection?: string;
  sectionRoomID?: string;
  sectionTitle?: string;
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
  handleSectionSelect
}: IRoomViewProps) => {
  // ##################################################################### //
  // ################## GET NOTEBOOK ROOMS FROM CONTEXT ################## //
  // ##################################################################### //

  // TODO: fetch list of rooms
  const [loaded, setLoaded] = useState<boolean>(false);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);

  const {state} = useGlobalContext();

  const getMultipleRooms = async () => {
    try {
      const responseData = state?.roomData?.rooms || [];

      const curriculumMap = responseData.map(async (roomObj: any) => {
        const curriculumFull: any = await API.graphql(
          graphqlOperation(customQueries.getCurriculumNotebook, {
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
      });
      Promise.all(curriculumMap)
        .then((responseArray: any[]) => {
          // console.log('curriculum first - ', responseData[0].curricula.items[0]);
          // console.log('curriculum after - ', responseArray[0].curricula.items[0]);
          setFilteredRooms(responseArray);
        })
        .then((_: void) => {
          setLoaded(true);
        });
    } catch (e) {
      console.error('getMultipleRooms - ', e);
    }
  };

  useEffect(() => {
    if (
      state &&
      state.roomData &&
      state?.roomData?.rooms &&
      state?.roomData?.rooms.length > 0
    ) {
      getMultipleRooms();
    }
  }, [state?.roomData?.rooms]);

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

  const mapNotebookRoomCards = () => {
    const mapped = filteredRooms.map(async (item, idx: number) => {
      const {curricula} = item;
      const bannerImage = await (curricula?.items[0]?.image
        ? getImageURL(curricula?.items[0]?.image)
        : null);
      const curriculumName = curricula?.items[0]?.name;

      return {...item, bannerImage, curriculumName};
    });

    Promise.all(mapped).then((output: any) => setMappedNotebookRoomCards(output));
  };

  useEffect(() => {
    if (loaded && filteredRooms.length > 0) {
      mapNotebookRoomCards();
    }
  }, [filteredRooms, loaded]);

  return (
    <>
      <div className="relative pb-4 overflow-hidden bg-white rounded-b-lg shadow mb-4">
        <div className="relative mx-auto">
          <div
            // #ts-ignores
            style={{
              transition: 'width 2s',
              transitionTimingFunction: 'cubic-bezier(0.1, 0.7, 1, 0.1)'
            }}
            className="mt-0 max-w-lg mx-auto p-6 grid gap-4 lg:max-w-none md:grid-cols-4 grid-cols-1 2xl:grid-cols-5 sm:grid-cols-2">
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

            <RoomViewCard
              roomID={'private'}
              mainSection={mainSection}
              sectionRoomID={sectionRoomID}
              sectionTitle={sectionTitle}
              handleSectionSelect={handleSectionSelect}
              type={'Private Notebook'}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(RoomView);
