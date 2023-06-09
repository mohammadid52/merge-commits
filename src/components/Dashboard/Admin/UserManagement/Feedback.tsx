import {getAsset} from 'assets';
import {useGlobalContext} from 'contexts/GlobalContext';
import React from 'react';
import {AiOutlineEdit} from 'react-icons/ai';
import {BsFillTrashFill} from 'react-icons/bs';

import Placeholder from '@components/Atoms/Placeholder';
import {getUserRoleString} from '@utilities/strings';
import moment from 'moment';
import {getImageFromS3Static} from 'utilities/services';
import AudioMedia from './AudioMedia';
import ImageMedia from './ImageMedia';
import OtherMedia from './OtherMedia';
import VideoMedia from './VideoMedia';

const getFormattedDate = (todayTime: any) => {
  const date = moment(todayTime).format('lll');

  return date;
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

  setEditModal?: React.Dispatch<
    React.SetStateAction<{show: boolean; id: string; content: string}>
  >;
  setEditCommentInput?: React.Dispatch<React.SetStateAction<string>>;
  deleteModal: {show: boolean; id: string};
  uploadingAttachment: boolean;
  authId: string;
  role: string;
  fileObject: {type: string};
}

const deletedUserInfo: FeedbackProps['feedback']['person'] = {
  image: '',
  firstName: 'Deleted',
  lastName: 'User',
  preferredName: 'Deleted',
  role: 'none',
  authId: ''
};

const Feedback = ({
  feedback,
  setAttModal,
  setDeleteModal,
  deleteModal,
  uploadingAttachment,
  authId,
  setEditCommentInput,
  setEditModal,
  role,
  fileObject
}: FeedbackProps) => {
  const {person} = feedback;

  const user = person || deletedUserInfo;

  const {clientKey} = useGlobalContext();
  const themeColor = getAsset(clientKey, 'themeClassName');

  const getColorBG = (theme = 'indigo') => {
    return `hover:bg-${theme}-500 active:bg-${theme}-500 focus:bg-${theme}-500 text-${theme}-400`;
  };

  const handleEdit = () => {
    setEditCommentInput?.(feedback.text);
    setEditModal?.((prevState: any) => ({
      show: !prevState.show,
      id: feedback.id,
      content: feedback.text
    }));
  };

  return (
    <div
      key={feedback.id}
      className="relative comment-main flex items-center justify-between px-6 w-auto py-3 my-2">
      <div className="text-sm text-darkest   flex items-start">
        {user.image ? (
          <img
            className="h-10 w-10 rounded-md bg-light  flex items-center justify-center"
            src={getImageFromS3Static(user.image)}
            alt=""
          />
        ) : (
          <Placeholder
            firstName={user?.preferredName || user?.firstName || ''}
            lastName={user?.lastName || ''}
            size="h-10 w-10"
          />
        )}
        <div className="ml-2 w-auto">
          <h5 className="font-semibold hover:text-underline">
            {(user.preferredName ? user.preferredName : user.firstName) +
              ' ' +
              user.lastName}

            <span className="text-xs text-medium  font-normal ml-2">
              {getFormattedDate(feedback.createdAt)}
            </span>
            <p
              className={`${
                user.role === role
                  ? 'bg-green-100 text-green-800'
                  : 'bg-lightest  text-darkest   '
              } ml-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium w-auto`}>
              {getUserRoleString(user.role)}
            </p>
            {feedback.edited && (
              <span className="text-medium  font-light text-xs ml-2">(edited)</span>
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
                  key={url}
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
      {user.authId === authId && !uploadingAttachment && (
        <div className="flex items-center justify-center w-auto">
          {feedback.text && (
            <div
              onClick={handleEdit}
              className={`mr-2 delete-comment ${getColorBG(
                themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
              )} hover:text-white transition-all duration-150 rounded  w-auto self-start p-1 cursor-pointer`}>
              <AiOutlineEdit />
            </div>
          )}
          <div
            onClick={() => {
              setDeleteModal({show: !deleteModal.show, id: feedback.id});
            }}
            className="delete-comment hover:bg-red-400 hover:text-white transition-all duration-150 rounded text-red-400 w-auto self-start p-1 cursor-pointer">
            <BsFillTrashFill />
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
