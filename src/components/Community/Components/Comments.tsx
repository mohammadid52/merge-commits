import Loader from 'atoms/Loader';
import Popover from 'atoms/Popover';
import {IChat} from 'interfaces/Community.interfaces';
import {getImageFromS3Static} from 'utilities/services';
import {orderBy} from 'lodash';
import moment from 'moment';
import React, {useState} from 'react';
import {BiDotsVerticalRounded} from 'react-icons/bi';

const Comment = ({
  chat,

  onChatDelete,
  authId,
  email,
  onEdit,
  isLast
}: {
  chat: IChat;
  isLast: boolean;
  authId: string;
  email: string;
  onChatDelete: (chatId: string) => void;
  onEdit: (chatId: string, chatValue: string) => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const iAmOwnerOfTheChat = authId === chat?.personAuthID || email === chat?.personEmail;

  return (
    <div className="antialiased rela mx-auto sm:max-w-screen">
      <div className="space-y-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0 mr-3 w-auto">
            <img
              className="mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10"
              src={getImageFromS3Static(chat?.person?.image)}
              alt=""
            />
          </div>
          <div className="flex-1 border-0 rounded-lg relative border-gray-300 px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
            <strong>{chat?.person?.firstName || '[deleted]'}</strong>{' '}
            <span className="text-xs text-gray-600">
              {moment(chat?.createdAt).format('LT')}
            </span>
            {chat?.isEditedChat && (
              <span className="text-xs text-gray-500 ml-2">(edited)</span>
            )}
            <span className="text-blue-700 w-auto font-base text-xs ml-2 cursor-pointer">
              {chat?.person?.role}
            </span>
            <p data-cy="comment-text" className="text-sm w-auto whitespace-pre-line">
              {chat?.msg}
            </p>
            {iAmOwnerOfTheChat && (
              <div className="w-auto absolute inset-y-0 right-0 p-4">
                <Popover
                  show={showMenu}
                  bottom={0.6}
                  dir={isLast ? 'bottom' : 'top'}
                  minWidth={32}
                  minHeight={11}
                  // containerClass="min-h-8 min-w-24"
                  rounded="lg"
                  setShow={setShowMenu}
                  content={
                    <dl className="grid grid-cols-1  gap-y-3">
                      <div className="col-span-1">
                        <dt
                          onClick={() => onEdit(chat?.id, chat?.msg)}
                          className={`cursor-pointer text-gray-800 hover:text-gray-900`}>
                          Edit
                        </dt>
                      </div>
                      <div className="col-span-1">
                        <dt
                          onClick={() => {
                            onChatDelete(chat?.id);
                            setShowMenu(false);
                          }}
                          className={`cursor-pointer text-red-500 hover:text-red-600`}>
                          Delete
                        </dt>
                      </div>
                    </dl>
                  }>
                  <span className="h-6 w-6 flex items-center justify-center p-1 hover:bg-gray-200 transition-all cursor-pointer rounded-full">
                    <BiDotsVerticalRounded
                      title="show menu"
                      className="h-full w-full text-lg text-gray-500"
                    />
                  </span>
                </Popover>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Comments = ({
  chats,

  isLoading,
  onChatDelete,
  onEdit,
  authId,
  email
}: {
  chats: IChat[];

  isLoading: boolean;
  onChatDelete: (chatId: string) => void;
  onEdit: (chatId: string, chatValue: string) => void;
  authId: string;
  email: string;
}) => {
  const orderedList = orderBy(chats, ['createdAt'], ['desc']);
  if (isLoading) {
    return (
      <div className="flex my-4 items-center justify-center w-auto">
        <Loader withText="Loading comments..." className=" text-gray-400" />
      </div>
    );
  }
  return (
    <div className="w-auto mx-5">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Comments</h3>

      {orderedList &&
        orderedList.length > 0 &&
        orderedList.map((chat, idx) => (
          <Comment
            email={email}
            authId={authId}
            key={idx}
            isLast={orderedList.length - 1 === idx}
            onChatDelete={onChatDelete}
            onEdit={onEdit}
            chat={chat}
          />
        ))}
    </div>
  );
};

export default Comments;
