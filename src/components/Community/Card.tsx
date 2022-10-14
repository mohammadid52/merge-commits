import FormInput from '@atoms/Form/FormInput';
import Buttons from '@components/Atoms/Buttons';
import Modal from '@components/Atoms/Modal';
import Popover from '@components/Atoms/Popover';
import Comments from '@components/Community/Components/Comments';
import HandleMedia from '@components/Community/Components/HandleMedia';
import {
  communityTypes,
  COMMUNITY_UPLOAD_KEY
} from '@components/Community/constants.community';
import * as customQueries from '@customGraphql/customQueries';
import useAuth from '@customHooks/useAuth';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import * as queries from '@graphql/queries';
import {IChat, ICommunityCard} from '@interfaces/Community.interfaces';
import {getImageFromS3Static} from '@utilities/services';
import {API, graphqlOperation} from 'aws-amplify';

import {orderBy, remove, update} from 'lodash';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {AiOutlineHeart} from 'react-icons/ai';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {v4 as uuidV4} from 'uuid';

const BottomSection = ({
  setShowComments,
  showComments,
  cardDetails,
  chatCount
}: {
  cardDetails: ICommunityCard;
  showComments: boolean;
  chatCount: number;
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  let copyLikes = cardDetails.likes || [];
  const {authId} = useAuth();
  const likeIdx = copyLikes?.findIndex((d) => d === authId);
  const isLiked = likeIdx !== -1;

  const community = useGraphqlMutation('updateCommunity');
  const likeAction = () => {
    let payload: any = {id: cardDetails.id};
    if (isLiked) {
      // dislike
      copyLikes.splice(likeIdx, 1);
      payload = {...payload, likes: copyLikes};
    } else {
      // like
      copyLikes.push(authId);
      payload = {...payload, likes: copyLikes};
    }
    update(cardDetails, `likes`, () => copyLikes);
    community.mutate({input: payload});
  };

  return (
    <>
      <div className="flex w-full border-t-0 border-gray-100">
        <div className="mt-3 mx-5 flex flex-row w-auto">
          <div className="flex text-gray-700 font-normal text-sm rounded-md mb-2 mr-4 items-center">
            Comments:
            <div className="ml-1 text-gray-500 font-medium text-sm">
              {' '}
              {chatCount || 0}
            </div>
          </div>
        </div>

        <div className="mt-3 mx-5 w-full flex justify-end">
          <div className="flex text-gray-700 font-normal w-auto text-sm rounded-md mb-2 mr-4 items-center">
            <div
              data-cy="like-button"
              onClick={() => likeAction()}
              className={`${
                isLiked
                  ? 'bg-pink-500 text-white'
                  : 'bg-pink-100 hover:bg-pink-200 text-pink-500'
              } rounded-full p-2 mr-2 w-auto cursor-pointer z-100 transition-all`}>
              <AiOutlineHeart className=" text-xl " />
            </div>
            Likes:{' '}
            <div
              data-cy="likes-count"
              className="ml-1 text-gray-500 w-auto font-medium text-sm">
              {' '}
              {cardDetails?.likes?.length || 0}
            </div>
          </div>
        </div>
      </div>

      <button
        data-cy="show-comments-button"
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
  chatCount,
  setChatCount
}: {
  cardDetails: ICommunityCard;
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>;
  chats: IChat[];
  setChats: React.Dispatch<React.SetStateAction<IChat[]>>;
  chatCount: number;
  setChatCount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [postText, setPostText] = useState('');
  const {authId: personAuthID, email: personEmail, user} = useAuth();

  const community = useGraphqlMutation('updateCommunity');

  const {mutate} = useGraphqlMutation('createCommunityChat', {
    onSuccess: () => {
      let updatedCount = chatCount + 1;
      community.mutate({
        input: {id: cardDetails.id, chatCount: updatedCount}
      });
      setChatCount(updatedCount);
    }
  });

  const onPost = async () => {
    setPostText('');
    const chatObject = {
      id: uuidV4(),
      communityId: cardDetails.id,
      personAuthID: personAuthID,
      msg: postText,
      personEmail: personEmail,
      person: user
    };
    chats.push(chatObject);
    setChats([...chats]);
    setShowComments(true);

    let payload = {...chatObject};
    delete payload.person;
    mutate({
      input: {...payload}
    });
  };

  const {image, Placeholder} = useAuth();

  return (
    <div className="relative flex items-center self-center w-full max-w-xl p-4 overflow-hidden text-gray-600 focus-within:text-gray-400">
      {image ? (
        <img
          className="w-10 h-10 object-cover rounded-full shadow mr-2 cursor-pointer"
          alt="User avatar"
          src={getImageFromS3Static(image)}
        />
      ) : (
        <Placeholder className="mr-4" size="w-10 h-10" />
      )}
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
        data-cy="comment-input"
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
  );
};

const Menu = ({
  showMenu,
  setShowMenu,
  onDelete,
  cardId,
  fileKey,
  onCardEdit,
  cardDetails
}: {
  showMenu: boolean;
  cardId: string;
  fileKey: string;
  cardDetails: ICommunityCard;
  onCardEdit?: (cardDetails: ICommunityCard) => void;
  onDelete?: (cardId: string, fileKey?: string) => void;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="w-auto absolute top-0 right-0 p-4 z-1000">
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
                onClick={() => onCardEdit(cardDetails)}
                className={`cursor-pointer text-gray-900  transition-all `}>
                Edit
              </dt>
            </div>
            <div className="col-span-1">
              <dt
                data-cy="card-delete-button"
                onClick={() => onDelete(cardId, fileKey)}
                className={`cursor-pointer text-red-500 transition-all`}>
                Delete
              </dt>
            </div>
          </dl>
        }>
        <span
          data-cy="popover-button"
          className="h-6 w-6 flex items-center justify-center p-1 hover:bg-gray-200 transition-all cursor-pointer rounded-full">
          <BiDotsVerticalRounded
            title="show menu"
            className="h-full w-full text-lg text-gray-500"
          />
        </span>
      </Popover>
    </div>
  );
};

const MainCard = ({cardDetails}: {cardDetails: ICommunityCard}) => {
  const person = cardDetails?.person;

  const UploadDate = () => {
    return (
      <span className="text-gray-600 font-thin w-auto text-xs ml-2">
        • {moment(cardDetails.cardDate).fromNow()}
      </span>
    );
  };

  const media = React.useMemo(
    () =>
      cardDetails?.cardImageLink
        ? getImageFromS3Static(COMMUNITY_UPLOAD_KEY + cardDetails?.cardImageLink)
        : null,
    [cardDetails?.cardImageLink]
  );

  if (cardDetails.cardType === communityTypes.ANNOUNCEMENTS) {
    return (
      <div className="relative">
        <div className="text-gray-600 font-semibold text-lg my-2 mx-3 px-2">
          Announcement <UploadDate />
        </div>
        <div className="flex max-w-xl  mx-auto">
          <div className="flex items-center w-full">
            <div className="w-full">
              <div className="text-gray-400 font-medium text-sm mb-7 mt-3 px-2">
                <HandleMedia cardDetails={cardDetails} />
              </div>
            </div>
          </div>
        </div>
        {cardDetails?.cardName && (
          <h1 className=" text-lg text-gray-800  font-semibold mb-2 mx-5">
            {cardDetails.cardName}
          </h1>
        )}
        <div
          dangerouslySetInnerHTML={{
            __html: cardDetails.summaryHtml ? cardDetails?.summaryHtml : '<p></p>'
          }}
          className=" text-sm mb-2 mx-3 px-2"></div>
      </div>
    );
  } else if (cardDetails.cardType === communityTypes.EVENT) {
    const [date, address] = cardDetails?.additionalInfo.split(' || ');

    return (
      <div className="flex-col relative max-w-xl bg-gray-100 rounded-lg  mx-auto">
        <div className="text-gray-600 font-semibold flex items-center text-lg my-2 mx-3 px-2">
          Event <UploadDate />
        </div>
        <div className=" w-full lg:max-w-full lg:flex">
          <div
            className="h-48 bg-center lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
            style={{backgroundImage: `url(${media})`}}></div>
          <div className="border-r-0 border-b-0 border-l-0 border-gray-400 lg:border-l-none lg:border-t-0 lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
            <div className="mb-8">
              {cardDetails?.cardName && (
                <h1 className=" text-lg text-gray-800  font-semibold mb-2">
                  {cardDetails.cardName}
                </h1>
              )}
              <div
                dangerouslySetInnerHTML={{
                  __html: cardDetails.summaryHtml ? cardDetails?.summaryHtml : '<p></p>'
                }}
                className=" text-base"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm w-auto">
                <p className="text-gray-600 leading-none">
                  Date:{' '}
                  <span className="w-auto text-gray-700 font-medium">
                    {moment(date).format('DD MMM')}
                  </span>
                </p>
                <p className="text-gray-600">
                  Address:{' '}
                  <span className="w-auto text-gray-700 font-medium">
                    {address || '--'}
                  </span>
                </p>
              </div>
              <div className="text-sm w-auto">
                <p className="text-gray-600 leading-none">
                  Start time:{' '}
                  <span className="w-auto text-gray-700 font-medium">
                    {moment(cardDetails.startTime).format('LT')}
                  </span>
                </p>
                <p className="text-gray-600">
                  End time:{' '}
                  <span className="w-auto text-gray-700 font-medium">
                    {moment(cardDetails.endTime).format('LT')}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else
    return (
      <div className="relative">
        <div className="flex">
          <div className="flex items-center w-full">
            <div className="w-full">
              <div className="text-gray-600 font-semibold flex items-center text-lg my-2 mx-3 px-2">
                {cardDetails.cardType === communityTypes.SPOTLIGHT
                  ? 'Spotlight'
                  : 'Check It Out'}
                <UploadDate />
              </div>
              {cardDetails.cardType === communityTypes.CHECK_IT_OUT && (
                <div className="flex flex-row mt-2 px-2 py-3 mx-3">
                  <div className="w-auto h-auto rounded-full">
                    <img
                      className="w-12 h-12 object-cover rounded-full shadow cursor-pointer"
                      alt="User avatar"
                      src={getImageFromS3Static(person?.image)}
                    />
                  </div>
                  <div className="flex flex-col mb-2 ml-4 mt-1">
                    <div className="text-gray-600 text-sm font-semibold">
                      {person.firstName} {person.lastName}
                    </div>
                    <div className="flex  mt-1">
                      <div className="text-gray-500 font-thin w-auto text-xs">
                        {moment(cardDetails.cardDate).fromNow()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-gray-400 font-medium text-sm mb-7 mt-3 px-2">
                <HandleMedia cardDetails={cardDetails} />
              </div>

              <div className="mb-2 mx-3 px-2">
                {cardDetails?.cardName && (
                  <h1 className=" text-lg  text-gray-800 font-semibold mb-2">
                    {cardDetails.cardName}
                  </h1>
                )}
                <div
                  dangerouslySetInnerHTML={{
                    __html: cardDetails.summaryHtml ? cardDetails?.summaryHtml : '<p></p>'
                  }}
                  className="text-gray-600 text-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

const Card = ({
  cardDetails,
  onDelete,
  onCardEdit
}: {
  cardDetails: ICommunityCard;
  onDelete: (cardId: string, fileKey: string) => void;
  onCardEdit?: (cardDetails: ICommunityCard) => void;
}): JSX.Element => {
  const [chats, setChats] = useState([]);

  const {mutate} = useGraphqlMutation('deleteCommunityChat');
  const community = useGraphqlMutation('updateCommunity');

  const onChatDelete = (chatId: string) => {
    remove(chats, ['id', chatId]);
    setChats([...chats]);
    mutate({input: {id: chatId}});
    community.mutate({input: {id: cardDetails.id, chatCount: chatCount - 1}});
    setChatCount((prev) => prev - 1);
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
          filter: {communityId: {eq: cardDetails.id}}
        })
      );
      const data = res.data.listCommunityChats.items;
      if (data.length > 0) {
        let orderedList = orderBy(data, ['createdAt'], 'desc');
        const filterArray = orderedList.map((item) => ({
          authId: {
            eq: item.personAuthID
          }
        }));

        const _res: any = await API.graphql(
          graphqlOperation(customQueries.listPersons, {
            filter: {or: filterArray}
          })
        );
        const persons = _res.data.listPeople.items;
        orderedList = orderedList.map((d) => ({
          ...d,
          person: persons.find((p: any) => p.authId === d.personAuthID)
        }));
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
    if (!isFetched && showComments) {
      fetchChats();
    }
  }, [isFetched, showComments]);

  const [showMenu, setShowMenu] = useState(false);
  const {authId, email} = useAuth();
  const iAmOwnerOfTheCard = cardDetails.personAuthID === authId;

  const [chatConfig, setChatConfig] = useState({chatId: '', chatValue: ''});

  const [chatEditModal, setChatEditModal] = useState(false);
  const onEditChat = (chatId: string, chatValue: string) => {
    setChatEditModal(true);
    setChatConfig({...chatConfig, chatId, chatValue});
  };

  const MenuOptions = iAmOwnerOfTheCard && (
    <Menu
      cardDetails={cardDetails}
      fileKey={cardDetails?.cardImageLink}
      onDelete={onDelete}
      onCardEdit={onCardEdit}
      cardId={cardDetails.id}
      showMenu={showMenu}
      setShowMenu={setShowMenu}
    />
  );

  const EditChatModal = () => {
    const closeAction = () => {
      setChatEditModal(false);
      setValue('');
    };
    const [value, setValue] = useState(chatConfig.chatValue ? chatConfig.chatValue : '');

    const onEditedChatSave = () => {
      mutate({input: {id: chatConfig.chatId, msg: value, isEditedChat: true}});
    };

    const {mutate, isLoading} = useGraphqlMutation('updateCommunityChat', {
      onSuccess: () => {
        const idx = chats.findIndex((c) => c.id === chatConfig.chatId);
        update(chats[idx], `msg`, () => value);
        update(chats[idx], `isEditedChat`, () => true);
        setChats([...chats]);
        closeAction();
      }
    });

    const disableSaveBtn =
      chatConfig.chatValue === value || value.length === 0 || isLoading;

    return (
      chatEditModal && (
        <Modal title="Edit Chat" showHeader showFooter={false} closeAction={closeAction}>
          <div className="min-w-132">
            <FormInput
              label="Comment"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div className="flex mt-8 justify-end">
            <Buttons
              btnClass="py-1 px-8 text-xs ml-2"
              disabled={disableSaveBtn}
              label={'Save'}
              onClick={onEditedChatSave}
            />
          </div>
        </Modal>
      )
    );
  };

  const [chatCount, setChatCount] = useState(cardDetails.chatCount);

  return (
    <div className="relative max-w-xl bg-gray-100 shadow-md rounded-lg overflow-hidden mx-auto">
      {MenuOptions}
      <EditChatModal />
      <MainCard cardDetails={cardDetails} />
      <div className="w-auto">
        <BottomSection
          cardDetails={cardDetails}
          chatCount={chatCount}
          showComments={showComments}
          setShowComments={setShowComments}
        />
        <PostComment
          chats={chats}
          setChats={setChats}
          setChatCount={setChatCount}
          chatCount={chatCount}
          setShowComments={setShowComments}
          cardDetails={cardDetails}
        />
        {showComments && (
          <Comments
            email={email}
            onEdit={onEditChat}
            authId={authId}
            onChatDelete={onChatDelete}
            isLoading={isLoading}
            chats={chats}
          />
        )}
      </div>
    </div>
  );
};

export default Card;
