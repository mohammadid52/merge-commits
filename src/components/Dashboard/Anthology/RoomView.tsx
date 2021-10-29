import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import * as customQueries from '@customGraphql/customQueries';
import {createFilterToFetchSpecificItemsOnly} from '@utilities/strings';
import React, {useContext, useEffect, useState, useMemo, useCallback, memo} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import usePrevious from '../../../customHooks/previousProps';
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
  roomIdList,
  mainSection,
  sectionRoomID,
  sectionTitle,
  handleSectionSelect,
  isTeacher,
}: IRoomViewProps) => {
  const {state} = useContext(GlobalContext);

  // ##################################################################### //
  // ################## GET NOTEBOOK ROOMS FROM CONTEXT ################## //
  // ##################################################################### //

  // TODO: fetch list of rooms
  const [loaded, setLoaded] = useState<boolean>(false);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);

  const getMultipleRooms = async (idList: string[]) => {
    const compoundQuery = createFilterToFetchSpecificItemsOnly(idList, 'id');

    try {
      const roomsList: any = await API.graphql(
        graphqlOperation(customQueries.listRoomsNotebook, {
          filter: {
            ...compoundQuery,
          },
        })
      );
      const responseData = roomsList.data.listRooms.items;
      const curriculumMap = responseData.map(async (roomObj: any) => {
        const curriculumFull: any = await API.graphql(
          graphqlOperation(customQueries.getCurriculumNotebook, {
            id: roomObj.curricula?.items[0]?.curriculumID,
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
                description: curriculumData?.description,
              },
            ],
          },
        };
      });
      Promise.all(curriculumMap)
        .then((responseArray: any[]) => {
          // console.log('curriculum first - ', responseData[0].curricula.items[0]);
          // console.log('curriculum after - ', responseArray[0].curricula.items[0]);
          setFilteredRooms(responseArray);
        })
        .then((_: void) => {
          console.log('loaded');
          setLoaded(true);
        });
    } catch (e) {
      console.error('getMultipleRooms - ', e);
    }
  };

  useEffect(() => {
    if (roomIdList.length > 0) {
      getMultipleRooms(roomIdList);
      // if (state.roomData.rooms.length > 0) {
      //   const reducedRooms = roomIdList.reduce((acc: any[], roomID: string) => {
      //     const searchForRoom = state.roomData.rooms.find(
      //       (roomObj: any) => roomObj.id === roomID
      //     );
      //     if (searchForRoom) {
      //       return [...acc, searchForRoom];
      //     } else {
      //       return acc;
      //     }
      //   }, []);
      //   setFilteredRooms(reducedRooms);
      // }
    }
  }, [roomIdList]);

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
      // console.log('curricula - ', curricula);

      return (
        <RoomViewCard
          key={`notebook-${idx}`}
          roomID={item.id}
          roomName={item.name}
          mainSection={mainSection}
          sectionRoomID={sectionRoomID}
          curriculumName={curriculumName}
          handleSectionSelect={handleSectionSelect}
          bannerImage={bannerImage}
          type={`Class Notebook`}
        />
      );
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
              transitionTimingFunction: 'cubic-bezier(0.1, 0.7, 1, 0.1)',
            }}
            className="mt-0 max-w-lg mx-auto p-6 grid gap-4 lg:grid-cols-5 md:grid-cols-3 lg:max-w-none">
            {mappedNotebookRoomCards &&
              mappedNotebookRoomCards.length > 0 &&
              mappedNotebookRoomCards}
            {/* {mapNotebookRoomCards()} */}

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
