import React, {useEffect, useState, useContext} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as customQueries from '../../customGraphql/customQueries';
import * as customMutations from '../../customGraphql/customMutations';
import * as customSubscriptions from '../../customGraphql/customSubscriptions';
import {GlobalContext} from '../../contexts/GlobalContext';
import {IconContext} from 'react-icons';
import {AiOutlineSend, GrClose} from 'react-icons/all';
import isEmpty from 'lodash/isEmpty';
import MessageGroupWrapper from './MessageGroupWrapper';
import MessageWrapper from './MessageWrapper';

interface RoomChatProps {
  selectedRoom: any;
  focusSection?: string;
}

const RoomChat = (props: RoomChatProps) => {
  const {selectedRoom, focusSection} = props;
  const {state, dispatch} = useContext(GlobalContext);
  const [msgs, setMsgs] = useState(null);
  const [loading, setLoading] = useState(false);

  const [msg, setMsg] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const getDate = (before: number) => {
    let date = new Date();
    date.setDate(date.getDate() - before);
    return date;
  };

  const fetchRoomChat = async () => {
    setLoading(true);
    let yesterday = getDate(1);
    let msgs: any = await API.graphql(
      graphqlOperation(customQueries.messagesByRoomId, {
        roomID: selectedRoom.id,
        createdAt: {gt: yesterday.toISOString()},
      })
    );
    msgs = msgs?.data.messagesByRoomID?.items || [];
    setMsgs(msgs);
    setLoading(false);
  };

  useEffect(() => {
    if (Object.keys(selectedRoom).length > 0) {
      fetchRoomChat();
    }
  }, [selectedRoom]);

  const showLoader = () => {
    return (
      <div className={`absolute inset-0 flex  items-center justify-center p-2`}>
        <p className="w-min text-center text-lg font-light text-charcoal">
          Loading chat...
        </p>
      </div>
    );
  };

  const showNomsgs = () => {
    return (
      <div className={`absolute inset-0 flex  items-center justify-center p-2`}>
        <p className="w-min text-center text-lg font-light text-charcoal">
          No recent messages.
        </p>
      </div>
    );
  };

  const groupMessages = (msgArray: any[], tmpArray: any[], outArray: any[]): any[] => {
    const [head, ...tail] = msgArray;
    if (typeof head === 'undefined') {
      if (tmpArray.length === 0) {
        return outArray;
      } else if (tmpArray.length > 0) {
        return [...outArray, tmpArray];
      }
    } else {
      if (tmpArray.length === 0) {
        return groupMessages(tail, [head], outArray);
      } else if (tmpArray.length > 0) {
        if (head.sender.email === tmpArray[0].sender.email) {
          return groupMessages(tail, [...tmpArray, head], outArray);
        } else {
          return groupMessages([head, ...tail], [], [...outArray, tmpArray]);
        }
      }
    }
  };

  useEffect(() => {
    if (msgs) {
      const groupedMessages = groupMessages(msgs, [], []);
      console.log('groupedMessages - ', groupedMessages);
    }
  }, [msgs]);

  const userEmail = !isEmpty(state) ? state.user.email : null;

  const listMsgs = (messageArray: any[]) => {
    const groupedMessages = groupMessages(messageArray, [], []);
    if (groupedMessages) {
      const mappedMessageGroups = groupedMessages.map(
        (messageGroup: any[], idx: number) => {
          const senderWholeName = `${messageGroup[0].sender.firstName}`;
          const senderIsMe = messageGroup[0].sender.email === userEmail;
          return (
            <MessageGroupWrapper
              key={`messageGroup_${idx}`}
              senderIsMe={senderIsMe}
              senderName={senderWholeName}>
              {messageGroup &&
                messageGroup.map((msg: any, index: any) => {
                  const hour = new Date(msg.createdAt).getHours();
                  const minute = new Date(msg.createdAt).getMinutes();
                  return (
                    <MessageWrapper
                      key={`singlemessage_${idx}_${index}`}
                      senderIsMe={senderIsMe}
                      deleteMessage={senderIsMe ? () => deleteMsg(msg) : undefined}>
                      <span>{msg.body}</span>
                      <span
                        className={`float-right w-auto pl-4 ml-auto mr-0 text-xs text-gray-800 transform translate-y-0.5`}>{`${hour}:${minute}`}</span>
                      {/*{msg.sender.id === state.user.id ? (*/}
                      {/*  <div>*/}
                      {/*    <button onClick={() => editMsg(msg)}>Edit</button>*/}
                      {/*    <button onClick={() => deleteMsg(msg)}>Delete</button>*/}
                      {/*  </div>*/}
                      {/*) : null}*/}
                    </MessageWrapper>
                  );
                })}
            </MessageGroupWrapper>
          );
        }
      );
      return mappedMessageGroups;
    }
  };

  const showRoomMsgs = () => {
    if (Array.isArray(msgs) && !msgs.length) {
      return showNomsgs();
    }
    if (Array.isArray(msgs) && msgs.length) {
      return listMsgs(msgs);
    }
  };

  const msgInputBox = () => {
    return (
      <form className={`flex flex-row px-2`} onSubmit={(e) => sendMsg(e)}>
        <input
          className={`rounded-full px-2 mr-2 text-sm flex-1 border-2 border-gray-400 shadow-sm `}
          type="text"
          name="message"
          placeholder="Type your message here..."
          onChange={handleChange}
          value={msg}
        />
        <div
          id={`sendMsg-button-container`}
          onClick={(e) => sendMsg(e)}
          className={`
            w-10 h-10 
            flex items-center content-center justify-center flex-none 
            cursor-pointer`}>
          <div
            className={`
            w-10 h-10 flex items-center content-center justify-center 
            rounded-full bg-indigo-600
            shadow hover:shadow-lg`}>
            <IconContext.Provider
              value={{
                className: 'w-auto h-auto mx-auto my-auto text-white pointer-events-none',
              }}>
              <AiOutlineSend size={24} />
            </IconContext.Provider>
          </div>
        </div>
      </form>
    );
  };

  const handleChange = (e: any) => {
    let text = e.target.value;
    setMsg(text);
    // if while edit msg clear all text, remove the edit mode
    if (isEdit && !text.length) setIsEdit(false);
  };

  const sendMsg = async (e: any) => {
    try {
      e.preventDefault();
      if (msg.length) {
        if (isEdit) sendUpdatedMsg();
        else sendNewMsg();
      }
    } catch (err) {
      console.log('Send msg error:', err);
    }
  };

  const sendNewMsg = async () => {
    try {
      let msgDate = new Date().toISOString();
      const input = {
        roomID: selectedRoom.id,
        senderAuthID: state.user.authId,
        senderEmail: state.user.email,
        body: msg,
        createdAt: msgDate,
      };
      let key = msgs.length;
      let chatMsgs = [
        ...msgs,
        {
          id: key,
          body: msg,
          sender: {...state.user},
          createdAt: msgDate,
          updatedAt: msgDate,
        },
      ];
      setMsgs(chatMsgs);
      setMsg('');
      let msgItem: any = await API.graphql(
        graphqlOperation(customMutations.createRoomMsgs, {input})
      );
      msgItem = msgItem?.data.createRoomMsgs;
      chatMsgs = chatMsgs.map((m) => {
        if (m.id === key) m.id = msgItem.id;
        return m;
      });
      setMsgs(chatMsgs);
    } catch (err) {
      console.log('Send new msg error', err);
    }
  };

  const sendUpdatedMsg = async () => {
    try {
      let messages = msgs.map((m: any) => {
        if (m.id === isEdit) {
          m.body = msg;
        }
        return m;
      });
      setMsgs([...messages]);
      setIsEdit(false);
      setMsg('');
      await API.graphql(
        graphqlOperation(customMutations.updateRoomMsgs, {input: {id: isEdit, body: msg}})
      );
    } catch (err) {
      console.log('Update message text error', err);
    }
  };

  const deleteMsg = async (message: any) => {
    try {
      let messages = msgs.filter((m: any) => m.id !== message.id);
      setMsgs([...messages]);
      await API.graphql(
        graphqlOperation(customMutations.deleteRoomMsgs, {input: {id: message.id}})
      );
    } catch (err) {
      console.log('could not delete the msg');
    }
  };

  const editMsg = (message: any) => {
    setIsEdit(message.id);
    setMsg(message.body);
  };

  useEffect(() => {
    console.log('selectedRoom.id', selectedRoom.id);
    try {
      const newMsgsubscription = API.graphql(
        graphqlOperation(customSubscriptions.onCreateRoomMsgs, {roomID: selectedRoom.id})
        // @ts-ignore
      ).subscribe({
        next: (event: any) => {
          setMsgs([...msgs, event.value.data.onCreateRoomMsgs]);
        },
      });
      const deleteMsgsubscription = API.graphql(
        graphqlOperation(customSubscriptions.onDeleteRoomMsgs, {roomID: selectedRoom.id})
        // @ts-ignore
      ).subscribe({
        next: (event: any) => {
          let msgId = event.value.data.onDeleteRoomMsgs.id;
          let messages = msgs.filter((m: any) => m.id !== msgId);
          setMsgs([...messages]);
        },
      });
      const editMsgSubscription = API.graphql(
        graphqlOperation(customSubscriptions.onUpdateRoomMsgs, {roomID: selectedRoom.id})
        // @ts-ignore
      ).subscribe({
        next: (event: any) => {
          let message = event.value.data.onUpdateRoomMsgs;
          let messages = msgs.map((m: any) => {
            if (m.id === message.id) {
              m.body = message.body;
            }
            return m;
          });
          setMsgs([...messages]);
        },
      });
      return () => {
        newMsgsubscription.unsubscribe();
        deleteMsgsubscription.unsubscribe();
        editMsgSubscription.unsubscribe();
      };
    } catch (err) {
      console.log('newMsgsubscription error', err);
    }
  }, [msgs]);

  return (
    <>
      <div id={`roomchat_container`} className={`flex-1 bg-container`}>
        <div className={`${loading ? 'p-2 absolute inset-0 top-2.5 bottom-0' : 'h-0'}`}>
          {showLoader()}
        </div>

        <div
          className={`absolute bottom-3.5 h-6 min-w-48 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none z-50`}
        />
        <div
          className={`
                      transform transition-opacity ease-in-out duration-700 
                      ${!loading ? 'opacity-100' : 'opacity-0'}
                      absolute inset-0 top-3 bottom-3.5 overflow-y-scroll container_background
                      border-t-0 border-gray-400`}>
          {!loading && showRoomMsgs()}
        </div>
      </div>
      <div
        className={`flex-none absolute bottom-0 h-14 flex items-center border-t-0 border-b-0 border-gray-400`}>
        {msgInputBox()}
      </div>
    </>
  );
};

export default RoomChat;