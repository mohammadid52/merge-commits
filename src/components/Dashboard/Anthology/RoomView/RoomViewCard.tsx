import React, {memo} from 'react';
import {IoImage, IoKeyOutline} from 'react-icons/io5';
import {stringToHslColor} from '../../../../utilities/strings';

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
}

const RoomViewCard = ({
  handleSectionSelect,
  roomID,
  mainSection,
  sectionRoomID,
  sectionTitle,
  roomName,
  curriculumName,
  bannerImage,
  type,
  name
}: IRoomViewCardProps) => {
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
        className={`relative z-50 md:h-50 lg:h-60 md:w-32 lg:w-40 flex flex-row rounded-r-lg transition-all transform origin-left ease-in-out duration-250  ${
          roomID === 'private' ? 'h-56 md:h-auto' : ''
        }
      ${
        noneSelected
          ? 'shadow-lg scale-90'
          : roomID !== '' && sectionRoomID !== '' && roomID === sectionRoomID
          ? 'scale-90 -skew-y-6 shadow-xl'
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
          onClick={() => handleSectionSelect(type, roomID, curriculumName)}
          className={`flex flex-col rounded-r-lg cursor-pointer md:h-50 lg:h-60 md:w-32 lg:w-40 overflow-hidden`}>
          {/* START - IMAGE AND LABEL */}

          <div className="flex h-full w-full items-center align-center flex-shrink-0 relative">
            {/* START- LABEL WRAPPER */}
            <div className="absolute flex items-center  h-full w-full max-w-48 px-2 z-50 ">
              {/* OVERLAY LABEL */}
              <div className="border-2 border-white">
                <div className="flex flex-col md:h-1/2 lg:h-2/3 justify-center text-center bg-white bg-opacity-90 flex-1 border-0 border-gray-900 p-2">
                  <p className="text-sm font-medium text-indigo-600">
                    <a className="hover:underline">{type}</a>
                  </p>
                  {name ||
                    (curriculumName && (
                      <p className="text-sm font-medium text-gray-900">
                        {name && <span className="">{name} </span>}
                        {curriculumName && <span className="">{curriculumName}</span>}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            {/* BANNER IMAGE */}
            {roomID !== 'private' && bannerImage ? (
              <img
                className="h-full w-full object-cover hover:scale-105 transform transition-transform duration-500 z-40"
                src={bannerImage}
                alt="banner_notebook_cover"
              />
            ) : roomID !== 'private' && !bannerImage ? (
              <img
                className="h-full w-full object-cover hover:scale-105 transform transition-transform duration-500 z-40"
                src={`https://selready.s3.us-east-2.amazonaws.com/card_texture.jpg`}
                alt="default_notebook_cover"
              />
            ) : (
              roomID === 'private' && (
                <div
                  className={`h-full w-full relative profile justify-center items-center content-center  bg-gray-800 flex border-gray-400 z-40`}>
                  <IoKeyOutline
                    className="absolute w-auto h-auto top-1 right-1 fill-current text-blue-500"
                    size={32}
                  />
                </div>
              )
            )}
          </div>
          {/* END - IMAGE AND LABEL */}
        </div>
      </div>

      {/* BACK PAGE */}
      <div
        className={`absolute h-72 md:h-auto z-40 top-0 md:h-50 lg:h-60 md:w-32 lg:w-40 flex flex-row rounded-r-lg bg-gray-200 transition-all transform origin-left ease-in-out duration-250 
      ${
        noneSelected
          ? 'shadow-lg scale-90'
          : roomID !== '' && sectionRoomID !== '' && roomID === sectionRoomID
          ? ' scale-90 skew-y-6 shadow-xl'
          : 'shadow-lg scale-90'
      }
      `}></div>
    </div>
  );
};

export default React.memo(RoomViewCard);
