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
}

const RoomView = ({
  roomIdList,
  mainSection,
  sectionRoomID,
  sectionTitle,
  handleSectionSelect,
}: IRoomViewProps) => {
  const {state} = useContext(GlobalContext);

  // ##################################################################### //
  // ################## GET NOTEBOOK ROOMS FROM CONTEXT ################## //
  // ##################################################################### //

  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);

  useEffect(() => {
    if (roomIdList.length > 0) {
      if (state.roomData.rooms.length > 0) {
        const reducedRooms = roomIdList.reduce((acc: any[], roomID: string) => {
          const searchForRoom = state.roomData.rooms.find(
            (roomObj: any) => roomObj.id === roomID
          );
          if (searchForRoom) {
            return [...acc, searchForRoom];
          } else {
            return acc;
          }
        }, []);
        setFilteredRooms(reducedRooms);
      }
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

  const mapNotebookRoomCards = useCallback(async () => {
    const mapped =
      filteredRooms && filteredRooms.length > 0
        ? Promise.all(
            filteredRooms.map(async (item, idx: number) => {
              const {curricula} = item;
              const bannerImage = await (curricula?.items[0]?.curriculum.image
                ? getImageURL(curricula?.items[0]?.curriculum.image)
                : null);
              const curriculumName = curricula?.items[0]?.curriculum.name;

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
            })
          )
        : null;

    return await mapped;
  }, [filteredRooms, sectionRoomID]);

  const roomsRef = usePrevious(filteredRooms);
  const sectionIDRef = usePrevious(sectionRoomID);

  useEffect(() => {
    if (sectionRoomID !== sectionIDRef || filteredRooms !== roomsRef) {
      const mappedCardsOutput = mapNotebookRoomCards();
      mappedCardsOutput.then((roomCards: any) => setMappedNotebookRoomCards(roomCards));
    } else {
      console.log('avoided resetting statea to same');
    }
  }, [filteredRooms, sectionRoomID]);

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
