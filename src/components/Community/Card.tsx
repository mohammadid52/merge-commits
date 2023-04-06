import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import Modal from 'atoms/Modal';
import {API, graphqlOperation} from 'aws-amplify';
import Comments from 'components/Community/Components/Comments';
import HandleMedia from 'components/Community/Components/HandleMedia';
import {
  communityTypes,
  COMMUNITY_UPLOAD_KEY
} from 'components/Community/constants.community';
import {listCommunityChats} from 'customGraphql/customQueries';
import useAuth from 'customHooks/useAuth';
import useGraphqlMutation from 'customHooks/useGraphqlMutation';
import {IChat, ICommunityCard} from 'interfaces/Community.interfaces';
import {getImageFromS3Static} from 'utilities/services';

import Placeholder from '@components/Atoms/Placeholder';
import DotMenu from '@components/TeacherView/ClassRoster/RosterRow/DotMenu';
import {logError} from 'graphql-functions/functions';
import {Button, Card as AntdCard, Divider} from 'antd';
import {orderBy, remove, update} from 'lodash';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {v4 as uuidV4} from 'uuid';
import {
  createCommunityChat,
  deleteCommunityChat,
  updateCommunity,
  updateCommunityChat
} from '@graphql/mutations';

const getType = (cardType: string) => {
  switch (cardType) {
    case communityTypes.ANNOUNCEMENTS:
      return 'Announcement';

    case communityTypes.CHECK_IT_OUT:
      return 'Check it out';

    case communityTypes.SPOTLIGHT:
      return 'Spotlight';

    case communityTypes.EVENT:
      return 'Event';

    default:
      return 'Announcement';
  }
};

const CardTitle = ({cardType, cardDate}: {cardType?: string; cardDate?: string}) => {
  return (
    <div className="">
      {cardType && getType(cardType)} <UploadDate cardDate={cardDate} />
    </div>
  );
};

const EditChatModal = ({
  chatConfig,
  chatEditModal,
  setChatEditModal,
  chats,
  setChats
}: {
  chatConfig: {
    chatId: string;
    chatValue: string;
  };
  chatEditModal: boolean;
  setChatEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  setChats: React.Dispatch<React.SetStateAction<IChat[]>>;
  chats: IChat[];
}) => {
  const closeAction = () => {
    setChatEditModal(false);
    setValue('');
  };
  const [value, setValue] = useState(chatConfig.chatValue ? chatConfig.chatValue : '');

  const onEditedChatSave = () => {
    mutate({
      input: {id: chatConfig.chatId, msg: value, isEditedChat: true}
    });
  };

  const {mutate, isLoading} = useGraphqlMutation(
    'updateCommunityChat',
    updateCommunityChat,
    {
      onSuccess: () => {
        const idx = chats.findIndex((c) => c.id === chatConfig.chatId);
        update(chats[idx], `msg`, () => value);
        update(chats[idx], `isEditedChat`, () => true);
        setChats([...chats]);
        closeAction();
      }
    }
  );

  const disableSaveBtn =
    chatConfig.chatValue === value || value.length === 0 || isLoading;

  return (
    <Modal
      open={chatEditModal}
      title="Edit Chat"
      showHeader
      showFooter={false}
      closeAction={closeAction}>
      <div className="min-w-132">
        <FormInput
          label="Comment"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="flex mt-8 justify-end">
        <Buttons disabled={disableSaveBtn} label={'Save'} onClick={onEditedChatSave} />
      </div>
    </Modal>
  );
};

const BottomSection = ({
  setShowComments,
  showComments,
  cardDetails,
  chatCount,
  authId
}: {
  cardDetails: ICommunityCard;
  showComments: boolean;
  chatCount: number;
  authId: string;
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  let copyLikes = cardDetails.likes || [];
  const likeIdx = copyLikes?.findIndex((d) => d === authId);
  const isLiked = likeIdx !== -1;

  const community = useGraphqlMutation('updateCommunity', updateCommunity);
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
      <Divider />
      <div className="flex w-full  justify-end border-t-0 border-lightest ">
        <Button.Group>
          <Buttons
            onClick={() => likeAction()}
            size="small"
            tooltip={isLiked ? 'Undo like' : 'Like'}
            transparent={!isLiked}
            label={`${cardDetails?.likes?.length || 0} Like`}
          />
          <Buttons
            tooltip={showComments ? 'Hide Comments' : `Show Comments (${chatCount || 0})`}
            onClick={() => setShowComments(!showComments)}
            size="small"
            transparent
            label={`${chatCount || 0} Comments`}
          />
        </Button.Group>
      </div>
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

  const community = useGraphqlMutation('updateCommunity', updateCommunity);

  const {mutate} = useGraphqlMutation('createCommunityChat', createCommunityChat, {
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
    // @ts-ignore
    delete payload?.person;
    mutate({
      input: {...payload}
    });
  };

  const {image, firstName, lastName} = useAuth();

  return (
    <div className="w-full gap-4 mt-4 flex items-center">
      <Placeholder
        image={image}
        firstName={firstName}
        lastName={lastName}
        className="mr-4"
        size="w-10 h-10"
      />
      {/* <span className="absolute inset-y-0 right-0 flex items-center pr-6 w-auto">
        <button
          type="submit"
          className="p-1 focus:outline-none focus:shadow-none hover:text-blue-500">
          <svg
            className="w-6 h-6 transition ease-out duration-300 hover:text-blue-500 text-light "
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
      </span> */}

      <FormInput
        placeHolder="Post a comment..."
        value={postText}
        className="w-full"
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
  onDelete = () => {},
  cardId,
  fileKey = '',
  onCardEdit,
  cardDetails
}: {
  showMenu: boolean;
  cardId: string;
  fileKey?: string;
  cardDetails: ICommunityCard;
  onCardEdit?: (cardDetails: ICommunityCard) => void;
  onDelete: (cardId: string, fileKey?: string) => void;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <DotMenu
      menuItems={[
        {
          label: 'Edit',
          action: () => onCardEdit?.(cardDetails)
        },
        {
          label: 'Delete',
          action: () => onDelete(cardId, fileKey),
          danger: true
        }
      ]}
    />
  );
};

const UploadDate = ({cardDate}: {cardDate?: string}) => {
  return (
    <span className="text-medium  font-thin w-auto text-xs ml-2">
      • {moment(cardDate).fromNow()}
    </span>
  );
};

const MainCard = ({cardDetails}: {cardDetails: ICommunityCard}) => {
  const person = cardDetails?.person;

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
        {/* <div className="text-medium  font-semibold text-lg my-2 mx-3 px-0">
          Announcement <UploadDate cardDate={cardDetails.cardDate} />
        </div> */}
        <div className="flex max-w-xl  mx-auto">
          <div className="flex items-center w-full">
            <div className="w-full">
              <div className="text-light  community-media font-medium text-sm mb-7 mt-0 px-0">
                <HandleMedia cardDetails={cardDetails} />
              </div>
            </div>
          </div>
        </div>
        {cardDetails?.cardName && (
          <h1 className=" text-lg text-darkest     font-semibold mb-2 mx-0">
            {cardDetails.cardName}
          </h1>
        )}
        <div
          dangerouslySetInnerHTML={{
            __html: cardDetails.summaryHtml ? cardDetails?.summaryHtml : '<p></p>'
          }}
          className=" text-sm mb-0 mx-0 px-0"></div>
      </div>
    );
  } else if (cardDetails.cardType === communityTypes.EVENT) {
    const info = cardDetails?.additionalInfo?.split(' || ');
    const date = info && info[0] ? info[0] : new Date();
    const address = info && info[1] ? info[1] : '';

    return (
      <div className="flex-col relative max-w-xl bg-lightest  rounded-lg  mx-auto">
        {/* <div className="text-medium  font-semibold flex items-center text-lg my-2 mx-3 px-0">
          Event <UploadDate />
        </div> */}
        <div className=" w-full lg:max-w-full lg:flex">
          <div
            className="h-48 bg-center lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
            style={{backgroundImage: `url(${media})`}}></div>
          <div className="border-r-0 border-b-0 border-l-0 border-light  lg:border-l-none lg:border-t-0 lg:border-light  bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
            <div className="mb-8">
              {cardDetails?.cardName && (
                <h1 className=" text-lg text-darkest     font-semibold mb-2">
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
                <p className="text-medium  leading-none">
                  Date:{' '}
                  <span className="w-auto text-dark   font-medium">
                    {moment(date).format('DD MMM')}
                  </span>
                </p>
                <p className="text-medium ">
                  Address:{' '}
                  <span className="w-auto text-dark   font-medium">
                    {address || '--'}
                  </span>
                </p>
              </div>
              <div className="text-sm w-auto">
                <p className="text-medium  leading-none">
                  Start time:{' '}
                  <span className="w-auto text-dark   font-medium">
                    {moment(cardDetails.startTime).format('LT')}
                  </span>
                </p>
                <p className="text-medium ">
                  End time:{' '}
                  <span className="w-auto text-dark   font-medium">
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
              {/* <div className="text-medium  font-semibold flex items-center text-lg my-2 mx-3 px-0">
                {cardDetails.cardType === communityTypes.SPOTLIGHT
                  ? 'Spotlight'
                  : 'Check It Out'}
                <UploadDate />
                
              </div> */}

              {cardDetails.cardType === communityTypes.CHECK_IT_OUT && (
                <div className="flex flex-row mt-2 px-0 py-3 mx-3">
                  <div className="w-auto h-auto rounded-full">
                    <img
                      className="w-12 h-12 object-cover rounded-full shadow cursor-pointer"
                      alt="User avatar"
                      src={person?.image ? getImageFromS3Static(person?.image) : ''}
                    />
                  </div>
                  <div className="flex flex-col mb-2 ml-4 mt-1">
                    <div className="text-medium  text-sm font-semibold">
                      {person?.firstName} {person?.lastName}
                    </div>
                    <div className="flex  mt-1">
                      <div className="text-medium  font-thin w-auto text-xs">
                        {moment(cardDetails.cardDate).fromNow()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-light  font-medium community-media text-sm mb-7 mt-0 px-0">
                <HandleMedia cardDetails={cardDetails} />
              </div>

              <div className="mb-0 mx-0 px-0">
                {cardDetails?.cardName && (
                  <h1 className=" text-lg  text-darkest    font-semibold mb-2">
                    {cardDetails.cardName}
                  </h1>
                )}
                <div
                  dangerouslySetInnerHTML={{
                    __html: cardDetails.summaryHtml ? cardDetails?.summaryHtml : '<p></p>'
                  }}
                  className="text-medium  text-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

const Card = ({
  cardDetails,
  onDelete = () => {},
  onCardEdit
}: {
  cardDetails: ICommunityCard;
  onDelete: (cardId: string, fileKey: string) => void;
  onCardEdit?: (cardDetails: ICommunityCard) => void;
}): JSX.Element => {
  const [chats, setChats] = useState<any[]>([]);

  const {mutate} = useGraphqlMutation('deleteCommunityChat', deleteCommunityChat);
  const community = useGraphqlMutation('updateCommunity', updateCommunity);

  const onChatDelete = (chatId: string) => {
    remove(chats, ['id', chatId]);
    setChats([...chats]);
    mutate({input: {id: chatId}});
    community.mutate({
      input: {id: cardDetails.id, chatCount: chatCount - 1}
    });
    setChatCount((prev) => prev - 1);
  };

  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const [_, setError] = useState('');

  const fetchChats = async () => {
    try {
      setIsLoading(true);

      const res: any = await API.graphql(
        graphqlOperation(listCommunityChats, {
          filter: {communityId: {eq: cardDetails.id}}
        })
      );
      const data = res.data.listCommunityChats.items;
      if (data.length > 0) {
        let orderedList = orderBy(data, ['createdAt'], 'desc');

        setChats([...orderedList]);
      }
    } catch (error) {
      logError(error, {authId: authId, email: email}, 'Card @fetchChats');
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
      // @ts-ignore
      onDelete={onDelete}
      onCardEdit={onCardEdit}
      cardId={cardDetails.id}
    />
  );
  const [chatCount, setChatCount] = useState<number>(cardDetails?.chatCount || 0);

  return (
    <AntdCard
      type="inner"
      title={
        <CardTitle cardDate={cardDetails.cardDate} cardType={cardDetails.cardType} />
      }
      extra={MenuOptions}>
      <EditChatModal
        chatConfig={chatConfig}
        setChatEditModal={setChatEditModal}
        chatEditModal={chatEditModal}
        setChats={setChats}
        chats={chats}
      />
      <MainCard cardDetails={cardDetails} />
      <div className="w-auto">
        <BottomSection
          cardDetails={cardDetails}
          authId={authId}
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
    </AntdCard>
  );
};

export default Card;
