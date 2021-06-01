import React from 'react';
import {BsFillTrashFill} from 'react-icons/bs';

import {getImageFromS3Static} from '../../../../utilities/services';
import {initials, stringToHslColor} from '../../../../utilities/strings';
import AudioMedia from './AudioMedia';
import ImageMedia from './ImageMedia';
import OtherMedia from './OtherMedia';
import VideoMedia from './VideoMedia';
const getRole = (role: string) => {
  switch (role) {
    case 'CRD':
      return 'Coordinator';
    case 'TR':
      return 'Teacher';
    case 'FLW':
      return 'Fellow';
    case 'BLD':
      return 'Builder';
    case 'ADM':
      return 'Admin';
    case 'ST':
      return 'Student';
  }
};

const getFormattedDate = (todayTime: any) => {
  const date = new Date(todayTime);
  var hours = date.getHours();
  var min = date.getMinutes();
  return `${hours > 9 ? hours : `0${hours}`}:${min > 9 ? min : `0${min}`}`;
};

interface FeedbackProps {
  feedback: {
    id: string;
    createdAt: string;
    text: string;
    edited: boolean;

    person: {
      image: string;
      firstName?: string;
      lastName: string;
      preferredName?: string;
      role: string;
      authId: string;
    };
    attachments: {
      type: string;
      url: string;
      filename: string;
      size: number;
    }[];
  };
  setAttModal: React.Dispatch<
    React.SetStateAction<{show: boolean; url: string; type: string}>
  >;
  setDeleteModal: React.Dispatch<React.SetStateAction<{show: boolean; id: string}>>;
  deleteModal: {show: boolean; id: string};
  uploadingAttachment: boolean;
  authId: string;
  role: string;
  fileObject: {type: string};
}

const Feedback = ({
  feedback,
  setAttModal,
  setDeleteModal,
  deleteModal,
  uploadingAttachment,
  authId,
  role,
  fileObject,
}: FeedbackProps) => {
  const {person} = feedback;
  const {firstName, lastName, preferredName} = person;

  return (
    <div
      key={feedback.id}
      className="relative comment-main flex items-center justify-between px-6 w-auto py-3 my-2">
      <div className="text-sm text-gray-900 flex items-start">
        {person.image ? (
          <img
            className="h-10 w-10 rounded-md bg-gray-400 flex items-center justify-center"
            src={getImageFromS3Static(person.image)}
            alt=""
          />
        ) : (
          <div
            className={`h-10 w-10 flex justify-center items-center rounded-md  bg-gray-400`}>
            <div
              className="h-full w-full flex justify-center items-center text-sm text-semibold text-white rounded-md"
              style={{
                /* stylelint-disable */
                background: `${stringToHslColor(
                  preferredName ? preferredName : firstName + ' ' + lastName
                )}`,
                textShadow: '0.2rem 0.2rem 3px #423939b3',
              }}>
              {initials(preferredName ? preferredName : firstName, lastName)}
            </div>
          </div>
        )}
        <div className="ml-2 w-auto">
          <h5 className="font-semibold hover:text-underline">
            {(preferredName ? preferredName : firstName) + ' ' + lastName}

            <span className="text-xs text-gray-600 font-normal ml-2">
              {getFormattedDate(feedback.createdAt)}
            </span>
            <p
              className={`${
                person.role === role
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              } ml-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium w-auto`}>
              {getRole(person.role)}
            </p>
            {feedback.edited && (
              <span className="italic text-gray-600 font-light">(edited)</span>
            )}
          </h5>
          <p style={{whiteSpace: 'break-spaces'}}>{feedback.text}</p>

          {/* ------------------------- @key:A1 Attachments Section Start -------------------------------- */}

          {feedback.attachments &&
            feedback.attachments.length > 0 &&
            feedback.attachments.map((attachment) => {
              const {type, url} = attachment;
              const isImage = type.includes('image');
              const isVideo = type.includes('video');
              const isAudio = type.includes('audio');
              const isOther = !isImage && !isVideo && !isAudio;
              return (
                <div
                  className="mt-2"
                  onClick={() => {
                    isImage && setAttModal({show: true, url, type});
                  }}>
                  {isImage && <ImageMedia attachment={attachment} />}
                  {isVideo && (
                    <VideoMedia type={fileObject.type} attachment={attachment} />
                  )}
                  {isAudio && <AudioMedia attachment={attachment} />}
                  {isOther && <OtherMedia attachment={attachment} />}
                </div>
              );
            })}
          {/* ------------------------- Attachments Section End -------------------------------- */}
        </div>
      </div>
      {feedback.person.authId === authId && !uploadingAttachment && (
        <div
          onClick={() => {
            setDeleteModal({show: !deleteModal.show, id: feedback.id});
          }}
          className="delete-comment hover:bg-red-400 hover:text-white transition-all duration-150 rounded text-red-400 w-auto self-start p-1 cursor-pointer">
          <BsFillTrashFill />
        </div>
      )}
    </div>
  );
};

export default Feedback;
