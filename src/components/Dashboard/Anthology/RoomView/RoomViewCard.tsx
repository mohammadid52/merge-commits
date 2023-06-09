import useAuth from '@customHooks/useAuth';
import {getImageFromS3} from '@utilities/services';
import {fallbackUrls} from 'assets';
import React from 'react';
import {IoKeyOutline} from 'react-icons/io5';
import {stringToHslColor} from 'utilities/strings';

interface IRoomViewCardProps {
  handleSectionSelect?: (
    section: string,
    roomIdString: string,
    roomName?: string
  ) => void;
  roomID?: string;
  mainSection?: string;
  sectionRoomID?: string;
  sectionTitle?: string;
  roomName?: string;
  curriculumName?: string;
  bannerImage?: string;
  type?: string;
  name?: string;
  studentImage?: string | null;
  isTeacher?: boolean;
}

const RoomViewCard = ({
  handleSectionSelect,
  roomID = '',
  mainSection,
  isTeacher,
  sectionRoomID,
  sectionTitle,
  curriculumName,
  bannerImage,
  studentImage,
  type = '',
  name
}: IRoomViewCardProps) => {
  const {image} = useAuth();
  const noneSelected = mainSection === '' && sectionRoomID === '' && sectionTitle === '';
  return (
    <div
      className={`relative animate-fadeIn ${
        noneSelected
          ? 'z-50'
          : roomID !== '' && sectionRoomID !== '' && roomID === sectionRoomID
          ? 'z-50'
          : 'z-40'
      }`}>
      {/* FRONT PAGE */}
      <div
        data-cy="room-view-card"
        className={`relative z-50 md:h-56 lg:h-60 lg:w-40 flex flex-row rounded-r-lg transition-all transform origin-left ease-in-out duration-250 sm:h-full
      ${
        noneSelected
          ? 'customShadow scale-90'
          : roomID !== '' && sectionRoomID !== '' && roomID === sectionRoomID
          ? 'scale-90 -skew-y-6 theme-card-shadow'
          : 'shadow-lg  scale-90'
      }
      `}>
        {/* SIDE BORDER */}
        <div
          style={{backgroundColor: stringToHslColor(roomID)}}
          className={`h-full w-3`}
        />
        {/* BOOK COVER */}
        <div
          data-cy={roomID}
          onClick={() => handleSectionSelect?.(type, roomID, curriculumName)}
          className={`flex flex-col rounded-r-lg cursor-pointer md:h-56 lg:h-60  lg:w-40 overflow-hidden`}>
          {/* START - IMAGE AND LABEL */}

          <div className="flex h-full w-full items-center align-center flex-shrink-0 relative">
            {/* START- LABEL WRAPPER */}
            <div className="absolute flex items-end md:items-center  h-full w-full mb-4 md:mb-0 md:max-w-48 px-2 z-50 ">
              {/* OVERLAY LABEL */}
              <div className="border-2 border-white">
                <div className="flex flex-col md:h-1/2 lg:h-2/3 justify-center text-center bg-white bg-opacity-80 flex-1 border-0 border-darkest   p-2">
                  <h1 className="text-sm font-medium theme-text:600">{type}</h1>
                  {(name || curriculumName) && (
                    <p className="text-sm font-medium text-darkest">
                      {name && <span className="">{name}</span>}
                      {curriculumName && <span className="">{curriculumName}</span>}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* BANNER IMAGE */}
            {roomID !== 'private' ? (
              <img
                className="h-full w-full object-cover hover:scale-105 transform transition-transform duration-500 z-40"
                src={bannerImage || fallbackUrls.room}
                alt={bannerImage ? 'notebook cover' : 'default notebook cover'}
              />
            ) : (
              roomID === 'private' && (
                <div
                  className={`h-full w-full relative profile justify-center items-center content-center  bg-darkest    flex border-light  z-40`}>
                  <IoKeyOutline
                    className="absolute z-100 w-auto h-auto top-1 right-1 fill-current text-white"
                    size={32}
                  />
                  {(studentImage || image) && (
                    <img
                      className="h-full  w-full object-cover hover:scale-105 transform transition-transform duration-500 z-40"
                      src={
                        getImageFromS3(
                          studentImage && isTeacher ? studentImage : image
                        ) as string
                      }
                      alt={'notebook cover'}
                    />
                  )}
                </div>
              )
            )}
          </div>
          {/* END - IMAGE AND LABEL */}
        </div>
      </div>

      {roomID !== '' && sectionRoomID !== '' && roomID === sectionRoomID && (
        <div
          className="dynamicShadow"
          style={{
            backgroundImage: `url('${bannerImage || fallbackUrls.room}')`
          }}></div>
      )}
      {/* BACK PAGE */}
      <div
        className={`absolute h-72  z-40 top-0 md:h-56 lg:h-60  lg:w-40 flex flex-row rounded-r-lg bg-lightest transition-all transform origin-left ease-in-out duration-250 
      ${
        noneSelected
          ? 'shadow-lg scale-90'
          : roomID !== '' && sectionRoomID !== '' && roomID === sectionRoomID
          ? ' scale-90 skew-y-6 shadow-lg'
          : 'shadow-lg scale-90'
      }
      `}></div>
    </div>
  );
};

export default React.memo(RoomViewCard);
