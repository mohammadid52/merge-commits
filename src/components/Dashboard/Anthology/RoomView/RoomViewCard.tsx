import React from 'react';
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
  bannerImage,
  type,
  name,
}: IRoomViewCardProps) => {
  const noneSelected = mainSection === '' && sectionRoomID === '' && sectionTitle === '';

  return (
    <div
      className={`relative ${
        noneSelected
          ? 'z-50'
          : roomID !== '' && sectionRoomID !== '' && roomID === sectionRoomID
          ? 'z-50'
          : 'z-40'
      }`}>
      {/* FRONT PAGE */}
      <div
        className={`relative z-50 md:h-50 lg:h-60 md:w-32 lg:w-40 flex flex-row rounded-r-lg transition-all transform origin-left ease-in-out duration-250 
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
          onClick={() => handleSectionSelect(type, roomID, roomName)}
          className={`flex flex-col rounded-r-lg cursor-pointer md:h-50 lg:h-60 md:w-32 lg:w-40 overflow-hidden`}>
          {/* START - IMAGE AND LABEL */}
          <div className="flex h-full w-full items-center align-center flex-shrink-0 relative">
            {/* OVERLAY */}
            <div className="absolute flex items-center  h-full w-full max-w-48 px-4 z-50">
              <div className="flex flex-col md:h-1/2 lg:h-2/3 justify-center text-center bg-white bg-opacity-90 flex-1">
                <p className="text-sm font-medium text-indigo-600">
                  <a className="hover:underline">{type}</a>
                </p>
                <p className="text-base text-gray-900">
                  <span className="font-semibold">{name}</span>{' '}
                  <span className="text-base text-semibold text-gray-900">
                    {roomName}
                  </span>
                </p>
              </div>
            </div>

            {/* BANNER IMAGE */}
            {bannerImage ? (
              <img
                className="h-full w-full object-cover hover:scale-105 transform transition-transform duration-500 z-40"
                src={bannerImage}
                alt=""
              />
            ) : (
              <div
                className={`h-full w-full relative profile justify-center items-center content-center  bg-gray-800 flex border-gray-400 z-40`}>
                <IoKeyOutline
                  className="absolute w-auto h-auto top-1 right-1 fill-current text-white text-opacity-80"
                  size={32}
                />
              </div>
            )}
          </div>
          {/* END - IMAGE AND LABEL */}
        </div>
      </div>

      {/* BACK PAGE */}
      <div
        className={`absolute z-40 top-0 md:h-50 lg:h-60 md:w-32 lg:w-40 flex flex-row rounded-r-lg bg-gray-200 transition-all transform origin-left ease-in-out duration-250 
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

export default RoomViewCard;
