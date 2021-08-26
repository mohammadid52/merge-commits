import React, {useContext, useEffect, useState} from 'react';
import {IoImage} from 'react-icons/io5';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {getImageFromS3} from '../../../utilities/services';
import ContentCard from '../../Atoms/ContentCard';
import ImageAlternate from '../../Atoms/ImageAlternative';
import RoomViewCard from './RoomView/RoomViewCard';

interface IRoomViewProps {
  roomIdList: string[];
  sectionRoomID?: string;
  handleSectionSelect?: (
    section: string,
    roomIdString: string,
    roomName?: string
  ) => void;
}

const RoomView = ({roomIdList, sectionRoomID, handleSectionSelect}: IRoomViewProps) => {
  const {state} = useContext(GlobalContext);

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

  const [mappedNotebookRoomCards, setMappedNotebookRoomCards] = useState<any[]>([]);

  const mapNotebookRoomCards = async () => {
    const mapped =
      filteredRooms && filteredRooms.length > 0
        ? Promise.all(
            filteredRooms.map(async (item, idx: number) => {
              const {teacher, curricula} = item;
              const bannerImage = await (curricula?.items[0]?.curriculum.image
                ? getImageURL(curricula?.items[0]?.curriculum.image)
                : null);
              const roomName = item?.name;

              return (
                <RoomViewCard
                  key={`notebook-${idx}`}
                  roomID={item.id}
                  sectionRoomID={sectionRoomID}
                  handleSectionSelect={handleSectionSelect}
                  roomName={roomName}
                  bannerImage={bannerImage}
                  type={`Class Notebook`}
                />
              );
            })
          )
        : null;

    return await mapped;
  };

  useEffect(() => {
    const mappedCardsOutput = mapNotebookRoomCards();
    mappedCardsOutput.then((roomCards: any) => setMappedNotebookRoomCards(roomCards));
  }, [filteredRooms, sectionRoomID]);

  return (
    <>
      <div className="relative">
        <div className="relative mx-auto">
          <div
            // #ts-ignores
            style={{
              transition: 'width 2s',
              transitionTimingFunction: 'cubic-bezier(0.1, 0.7, 1, 0.1)',
            }}
            className="mt-0 max-w-lg mx-auto pt-6 pb-6 grid gap-5 lg:grid-cols-5 md:grid-cols-4 lg:max-w-none">
            {mappedNotebookRoomCards &&
              mappedNotebookRoomCards.length > 0 &&
              mappedNotebookRoomCards}
            <RoomViewCard
              roomID={'private'}
              sectionRoomID={sectionRoomID}
              roomName={'Journal & Emotions'}
              handleSectionSelect={handleSectionSelect}
              type={'Private Notebook'}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomView;
