import React from 'react';
import {IoImage} from 'react-icons/io5';

interface IRoomViewCardProps {
  handleSectionSelect?: (section: string, roomIdString: string) => void;
  roomID?: string;
  roomName?: string;
  bannerImage?: string;
  type?: string;
  name?: string;
}

const RoomViewCard = ({
  handleSectionSelect,
  roomID,
  roomName,
  bannerImage,
  type,
  name,
}: IRoomViewCardProps) => {
  return (
    <div
      onClick={() => handleSectionSelect(type, roomID)}
      className="flex shadow flex-col rounded-lg overflow-hidden ">
      <div className="flex-shrink-0">
        {bannerImage ? (
          <img
            className="cursor-pointer h-48 w-full object-cover hover:scale-105 transform transition-transform duration-500"
            src={bannerImage}
            alt=""
          />
        ) : (
          <div
            className={`profile justify-center items-center content-center h-48 w-full bg-gray-100 flex border-gray-400`}>
            <IoImage className="fill-current text-gray-80" size={32} />
          </div>
        )}
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
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
        <div className="mt-6 flex items-center">
          {/* <div className="flex-shrink-0 w-auto">
            <a>
              <span className="sr-only">{firstName + ' ' + lastName}</span>
              {teacherProfileImg ? (
                <img className="h-10 w-10 rounded-full" src={teacherProfileImg} alt="" />
              ) : (
                <ImageAlternate
                  user={{firstName, lastName}}
                  styleClass="h-10 w-10 rounded-full"
                />
              )}
            </a>
          </div> */}
          {/* <div className="ml-3 w-auto">
            <p className="text-xs 2xl:text-sm font-medium text-gray-900">
              <a className="hover:underline">{firstName + ' ' + lastName}</a>
            </p>
            <p
              style={{maxWidth: '99%'}}
              className="overflow-hidden pr-2 overflow-ellipsis space-x-1 text-xs 2xl:text-sm text-gray-500">
              {roomName}
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default RoomViewCard;
