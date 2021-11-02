import {
  communityTypes,
  COMMUNITY_UPLOAD_KEY,
} from '@components/Community/constants.community';
import * as mutations from '@graphql/mutations';
import {IChat, ICommunityCard, IPerson} from '@interfaces/Community.interfaces';
import {getImageFromS3Static} from '@utilities/services';
import useAuth from '@customHooks/useAuth';
import * as queries from '@graphql/queries';
import moment from 'moment';
import {API, graphqlOperation} from 'aws-amplify';
import React, {useEffect, useState} from 'react';
import {AiOutlineHeart, AiOutlineLike} from 'react-icons/ai';
import {v4 as uuidV4} from 'uuid';
import {orderBy, remove} from 'lodash';
import Loader from '@components/Atoms/Loader';
import Popover from '@components/Atoms/Popover';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import useGraphqlMutation from '@graphql/useGraphqlMutation';

const Comment = ({
  chat,
  person,
  onChatDelete,
  authId,
  email,
}: {
  chat: IChat;
  person: IPerson;
  authId: string;
  email: string;
  onChatDelete: (chatId: string) => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const iAmOwnerOfTheChat = authId === chat.personAuthID || email === chat.personEmail;

  return (
    <div className="antialiased rela mx-auto sm:max-w-screen">
      <div className="space-y-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0 mr-3 w-auto">
            <img
              className="mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10"
              src={getImageFromS3Static(person.image)}
              alt=""
            />
          </div>
          <div className="flex-1 border-0 rounded-lg relative border-gray-300 px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
            <strong>{person.firstName}</strong>{' '}
            <span className="text-xs text-gray-500">
              {moment(chat.createdAt).format('LT')}
            </span>
            <p className="text-sm w-auto whitespace-pre-line">{chat.msg}</p>
            {iAmOwnerOfTheChat && (
              <div className="w-auto absolute inset-y-0 right-0 p-4">
                <Popover
                  show={showMenu}
                  bottom={0.6}
                  dir={'top'}
                  minWidth={32}
                  minHeight={11}
                  // containerClass="min-h-8 min-w-24"
                  rounded="lg"
                  setShow={setShowMenu}
                  content={
                    <dl className="grid grid-cols-1  gap-y-3">
                      <div className="col-span-1">
                        <dt
                          onClick={() => {
                            onChatDelete(chat.id);
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
  person,
  isLoading,
  onChatDelete,
  authId,
  email,
}: {
  chats: IChat[];
  person: IPerson;
  isLoading: boolean;
  onChatDelete: (chatId: string) => void;
  authId: string;
  email: string;
}) => {
  const orderedList = orderBy(chats, ['createdAt'], ['desc']);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-auto">
        <Loader withText="Loading comments..." className=" text-gray-400" />
      </div>
    );
  }
  return (
    <div className="w-auto mx-5">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Comments</h3>

      {orderedList.map((chat, idx) => (
        <Comment
          email={email}
          authId={authId}
          key={idx}
          onChatDelete={onChatDelete}
          chat={chat}
          person={person}
        />
      ))}
    </div>
  );
};

const BottomSection = ({
  setShowComments,
  showComments,
  chatsLen,
}: {
  chatsLen: number;
  showComments: boolean;
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <div className="flex justify-start mb-4 border-t-0 border-gray-200">
        <div className="flex w-full mt-1 pt-2 space-x-4 pl-5">
          <div className="rounded-full p-4 bg-pink-100 hover:bg-pink-200 w-auto cursor-pointer z-100 transition-all">
            <AiOutlineHeart className="text-pink-500 text-xl " />
          </div>
          <div className="rounded-full p-4 bg-blue-100 hover:bg-blue-200 w-auto cursor-pointer z-100 transition-all">
            <AiOutlineLike className="text-blue-500 text-xl " />
          </div>
          {/* <div
                  onClick={onDelete}
                  className="rounded-full p-4 bg-blue-100 hover:bg-blue-200 w-auto cursor-pointer z-100 transition-all">
                  <AiOutlineLike className="text-blue-500 text-xl " />
                </div> */}
        </div>
      </div>
      <div className="flex w-full border-t border-gray-100">
        <div className="mt-3 mx-5 flex flex-row w-auto">
          <div className="flex text-gray-700 font-normal text-sm rounded-md mb-2 mr-4 items-center">
            Comments:
            <div className="ml-1 text-gray-400 font-thin text-ms"> {chatsLen || 0}</div>
          </div>
        </div>

        <div className="mt-3 mx-5 w-full flex justify-end">
          <div className="flex text-gray-700 font-normal w-auto text-sm rounded-md mb-2 mr-4 items-center">
            Likes: <div className="ml-1 text-gray-400 font-thin text-ms"> 120k</div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowComments(!showComments)}
        className={`text-blue-500 hover:underline text-sm w-auto mx-5`}>
        {showComments ? 'hide' : 'show'} comments
      </button>
    </>
  );
};

const PostComment = ({
  cardDetails,
  chats,
  setChats,
  setShowComments,
}: {
  cardDetails: ICommunityCard;
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>;
  chats: IChat[];
  setChats: React.Dispatch<React.SetStateAction<IChat[]>>;
}) => {
  const [postText, setPostText] = useState('');
  const {authId: personAuthID, email: personEmail} = useAuth();

  const onPost = async () => {
    setPostText('');
    const chatObject = {
      id: uuidV4(),
      communityId: cardDetails.id,
      personAuthID: personAuthID,
      msg: postText,
      personEmail: personEmail,
    };
    chats.push(chatObject);
    setChats([...chats]);
    setShowComments(true);

    try {
      const res: any = await API.graphql(
        graphqlOperation(mutations.createCommunityChat, {
          input: {...chatObject},
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    cardDetails.cardType === communityTypes.CHECK_IT_OUT && (
      <div className="relative flex items-center self-center w-full max-w-xl p-4 overflow-hidden text-gray-600 focus-within:text-gray-400">
        <img
          className="w-10 h-10 object-cover rounded-full shadow mr-2 cursor-pointer"
          alt="User avatar"
          src={getImageFromS3Static(cardDetails.person.image)}
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-6 w-auto">
          <button
            type="submit"
            className="p-1 focus:outline-none focus:shadow-none hover:text-blue-500">
            <svg
              className="w-6 h-6 transition ease-out duration-300 hover:text-blue-500 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </span>
        <input
          type="search"
          className="w-full py-2 pl-4 pr-10 text-sm border-gray-400 bg-gray-100 border border-transparent appearance-none rounded-tg placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:text-gray-900 focus:shadow-outline-blue rounded-full"
          placeholder="Post a comment..."
          autoComplete="off"
          value={postText}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onPost();
            }
          }}
          onChange={(e) => setPostText(e.target.value)}
        />
      </div>
    )
  );
};

const Menu = ({
  showMenu,
  setShowMenu,
  onDelete,
  cardId,
  fileKey,
}: {
  showMenu: boolean;
  cardId: string;
  fileKey: string;
  onDelete?: (cardId: string, fileKey?: string) => void;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const textClass = `text-sm leading-5 text-gray-800 hover:iconoclast:text-500 transition-all duration-50 hover:curate:text-500`;
  const onEdit = (cardId: string) => {};
  return (
    <div className="w-auto absolute top-0 right-0 p-4">
      <Popover
        show={showMenu}
        bottom={0.6}
        dir={'top'}
        minWidth={48}
        minHeight={16}
        rounded="lg"
        setShow={setShowMenu}
        content={
          <dl className="grid grid-cols-1 gap-y-3">
            <div className="col-span-1">
              <dt
                onClick={() => onEdit(cardId)}
                className={`cursor-pointer text-gray-900 hover:text-white  transition-all hover:iconoclast:bg-main hover:curate:bg-main`}>
                Edit
              </dt>
            </div>
            <div className="col-span-1">
              <dt
                onClick={() => onDelete(cardId, fileKey)}
                className={`cursor-pointer text-red-500 hover:text-white hover:bg-red-500 transition-all`}>
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
  );
};

const Card = ({
  cardDetails,
  onDelete,
}: {
  cardDetails: ICommunityCard;
  onDelete: (cardId: string, fileKey: string) => void;
}): JSX.Element => {
  const media = getImageFromS3Static(COMMUNITY_UPLOAD_KEY + cardDetails.cardImageLink);
  const person = cardDetails.person;
  const [chats, setChats] = useState([]);

  const {mutate} = useGraphqlMutation('deleteCommunityChat');

  const onChatDelete = (chatId: string) => {
    remove(chats, ['id', chatId]);
    setChats([...chats]);
    mutate({input: {id: chatId}});
  };

  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const [error, setError] = useState('');

  const fetchChats = async () => {
    try {
      setIsLoading(true);

      const res: any = await API.graphql(
        graphqlOperation(queries.listCommunityChats, {
          filter: {communityId: {eq: cardDetails.id}},
        })
      );
      const data = res.data.listCommunityChats.items;
      if (data.length > 0) {
        const orderedList = orderBy(data, ['createdAt'], 'desc');
        setChats([...orderedList]);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
      setIsFetched(true);
    }
  };

  useEffect(() => {
    if (
      !isFetched &&
      showComments &&
      cardDetails.cardType === communityTypes.CHECK_IT_OUT
    ) {
      fetchChats();
    }
  }, [isFetched, showComments]);

  const [showMenu, setShowMenu] = useState(false);
  const {authId, email} = useAuth();
  const iAmOwnerOfTheCard = cardDetails.personAuthID === authId;

  const MenuOptions = iAmOwnerOfTheCard && (
    <Menu
      fileKey={cardDetails.cardImageLink}
      onDelete={onDelete}
      cardId={cardDetails.id}
      showMenu={showMenu}
      setShowMenu={setShowMenu}
    />
  );

  if (cardDetails.cardType === communityTypes.ANNOUNCEMENTS) {
    return (
      <div className="relative">
        {MenuOptions}

        <div className="flex max-w-xl bg-gray-100 shadow-md rounded-lg overflow-hidden mx-auto">
          <div className="flex items-center w-full">
            <div className="w-full">
              <div className="border-b-0 bg-red-600 text-white p-4 border-gray-200">
                <div className="text-white font-semibold text-lg  px-2">
                  Announcement: {cardDetails.summary}
                </div>
              </div>
              {cardDetails.cardName ? (
                <div className="mb-7 mt-3 px-2">
                  <div className="content">
                    <div className="content-overlay"></div>
                    <img className="content-image" src={media} />
                    <div className="content-details fadeIn-bottom">
                      <h3 className="content-title text-xl">{cardDetails.cardName}</h3>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 font-medium text-sm mb-7 mt-3 px-2">
                  <img style={{maxHeight: '40rem'}} className="rounded" src={media} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (cardDetails.cardType === communityTypes.EVENT) {
    const date = cardDetails.additionalInfo.split(' || ')[0];
    const addres = cardDetails.additionalInfo.split(' || ')[1];
    return (
      <div className="flex-col relative max-w-xl bg-gray-100 shadow-md rounded-lg overflow-hidden mx-auto">
        {MenuOptions}

        <div className=" w-full lg:max-w-full lg:flex">
          <div
            className="h-48 bg-center lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
            style={{backgroundImage: `url(${media})`}}></div>
          <div className="border-r-0 border-b-0 border-l-0 border-gray-400 lg:border-l-none lg:border-t-0 lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
            <div className="mb-8">
              <div className="text-gray-900 font-bold text-xl mb-2">
                {cardDetails.cardName}
              </div>
              <p className="text-gray-700 text-base">{cardDetails.summary}</p>
            </div>
            <div className="flex items-center">
              <div className="text-sm">
                <p className="text-gray-900 leading-none">
                  {moment(date).format('DD MMM')}
                </p>
                <p className="text-gray-600">{addres}</p>
              </div>
            </div>
          </div>
        </div>
        {cardDetails.cardType === communityTypes.CHECK_IT_OUT && (
          <BottomSection
            showComments={showComments}
            setShowComments={setShowComments}
            chatsLen={chats.length}
          />
        )}
      </div>
    );
  } else
    return (
      <div className="relative">
        {MenuOptions}

        <div className="flex max-w-xl bg-gray-100 shadow-md rounded-lg overflow-hidden mx-auto">
          <div className="flex items-center w-full">
            <div className="w-full">
              {cardDetails.cardType === communityTypes.CHECK_IT_OUT && (
                <div className="flex flex-row mt-2 px-2 py-3 mx-3">
                  <div className="w-auto h-auto rounded-full">
                    <img
                      className="w-12 h-12 object-cover rounded-full shadow cursor-pointer"
                      alt="User avatar"
                      src={getImageFromS3Static(person.image)}
                    />
                  </div>
                  <div className="flex flex-col mb-2 ml-4 mt-1">
                    <div className="text-gray-600 text-sm font-semibold">
                      {person.firstName} {person.lastName}
                    </div>
                    <div className="flex  mt-1">
                      <div className="text-blue-700 w-auto font-base text-xs mr-1 cursor-pointer">
                        {person.role}
                      </div>
                      <div className="text-gray-500 font-thin w-auto text-xs">
                        • {moment(cardDetails.cardDate).fromNow()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="border-b-0 border-gray-200"></div>
              <div className="text-gray-600 font-semibold text-lg my-2 mx-3 px-2">
                {cardDetails.cardType === communityTypes.SPOTLIGHT ? 'Spotlight' : ''}
              </div>
              {cardDetails.cardName ? (
                <div className="mb-7 mt-3 px-2">
                  <div className="content">
                    <div className="content-overlay"></div>
                    <img className="content-image" src={media} />
                    <div className="content-details fadeIn-bottom">
                      <h3 className="content-title text-xl">{cardDetails.cardName}</h3>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 font-medium text-sm mb-7 mt-3 px-2">
                  <img style={{maxHeight: '40rem'}} className="rounded" src={media} />
                </div>
              )}

              <div className="text-gray-500 font-thin text-sm mb-6 mx-3 px-2">
                {cardDetails.summary}
              </div>
              {cardDetails.cardType === communityTypes.CHECK_IT_OUT && (
                <div className="w-auto">
                  <BottomSection
                    showComments={showComments}
                    setShowComments={setShowComments}
                    chatsLen={chats.length}
                  />
                  <PostComment
                    chats={chats}
                    setChats={setChats}
                    setShowComments={setShowComments}
                    cardDetails={cardDetails}
                  />
                  {showComments && (
                    <Comments
                      email={email}
                      authId={authId}
                      onChatDelete={onChatDelete}
                      isLoading={isLoading}
                      person={cardDetails.person}
                      chats={chats}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
};

export default Card;
