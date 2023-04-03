import Placeholder from '@components/Atoms/Placeholder';
import UserRole from '@components/Dashboard/Admin/UserManagement/UserRole';
import DotMenu from '@components/TeacherView/ClassRoster/RosterRow/DotMenu';
import {Divider, List} from 'antd';
import {IChat} from 'interfaces/Community.interfaces';
import {orderBy} from 'lodash';
import moment from 'moment';

const Comment = ({
  chat,
  onChatDelete,
  authId,
  email,
  onEdit
}: {
  chat: IChat;

  authId: string;
  email: string;
  onChatDelete: (chatId: string) => void;
  onEdit: (chatId: string, chatValue: string) => void;
}) => {
  const iAmOwnerOfTheChat = authId === chat?.personAuthID || email === chat?.personEmail;

  return (
    <List.Item
      extra={
        iAmOwnerOfTheChat && (
          <DotMenu
            menuItems={[
              {
                label: 'Edit',
                action: () => onEdit(chat?.id || '', chat?.msg || '')
              },
              {
                label: 'Delete',
                action: () => {
                  onChatDelete(chat?.id || '');
                },
                danger: true
              }
            ]}
          />
        )
      }>
      <List.Item.Meta
        avatar={
          <Placeholder
            image={chat?.person?.image}
            firstName={chat?.person?.firstName}
            lastName={chat?.person?.lastName}
            size={' w-8 h-8 sm:w-10 sm:h-10'}
          />
        }
        title={
          <div className="flex">
            <strong>{chat?.person?.firstName || '[deleted]'}</strong>{' '}
            <span className="text-xs ml-2 text-medium ">
              {moment(chat?.createdAt).format('LT')}
            </span>
            {chat?.isEditedChat && (
              <span className="text-xs text-medium  ml-2">(edited)</span>
            )}
            {/* <span className="text-blue-700 w-auto font-base text-xs ml-2 cursor-pointer">
              {chat?.person?.role}
            </span> */}
            <div className="ml-2">
              <UserRole role={chat?.person?.role || 'ST'} />
            </div>
          </div>
        }
        description={chat?.msg}
      />
    </List.Item>
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

  const showList = orderedList && orderedList.length > 0;

  return (
    <>
      <Divider />
      <List loading={isLoading}>
        {showList &&
          orderedList.map((chat) => (
            <Comment
              email={email}
              authId={authId}
              key={chat.id}
              onChatDelete={onChatDelete}
              onEdit={onEdit}
              chat={chat}
            />
          ))}
      </List>
    </>
  );
};

export default Comments;
