import React from 'react';
import {IoImage} from 'react-icons/io5';

interface IRoomViewCardProps {
  handleSectionSelect?: (
    section: string,
    roomIdString: string,
    roomName?: string
  ) => void;
  roomID?: string;
  sectionRoomID?: string;
  roomName?: string;
  bannerImage?: string;
  type?: string;
  name?: string;
}

const RoomViewCard = ({
  handleSectionSelect,
  roomID,
  sectionRoomID,
  roomName,
  bannerImage,
  type,
  name,
}: IRoomViewCardProps) => {
  return (
    <>
      <div
        onClick={() => handleSectionSelect(type, roomID, roomName)}
        className={`flex ${
          roomID !== '' && sectionRoomID !== '' && roomID === sectionRoomID
            ? 'border-0 border-indigo-600 shadow-lg'
            : 'shadow'
        } flex-col rounded-lg overflow-hidden cursor-pointer`}>
        <div className="flex-shrink-0 relative">
          {/* OVERLAY */}
          <div className="absolute flex flex-col h-2/3 justify-between bg-white bg-opacity-90 p-6 bottom-0 z-10">
            <div className="flex-1">
              <p className="text-sm font-medium text-indigo-600">
                <a className="hover:underline">{type}</a>
              </p>
              <a href="#" className="block mt-2">
                <p className="text-base 2xl:text-lg text-gray-900">
                  <span className="font-semibold">{name}</span>{' '}
                  <span className="text-base 2xl:text-lg text-semibold text-gray-900">
                    {roomName}
                  </span>
                </p>
              </a>
            </div>
          </div>

          {/* BANNER IMAGE */}
          {bannerImage ? (
            <img
              className="h-48 w-full object-cover hover:scale-105 transform transition-transform duration-500 z-40"
              src={bannerImage}
              alt=""
            />
          ) : (
            <div
              className={`profile justify-center items-center content-center h-48 w-full bg-gray-100 flex border-gray-400 z-40`}>
              <IoImage className="fill-current text-gray-80" size={32} />
            </div>
          )}
        </div>
      </div>

      <div className={`absolute bottom-0 flex-1 h-1 bg-white`}></div>
    </>
  );
};

export default RoomViewCard;
