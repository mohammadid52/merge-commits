import React, {useEffect, useState, useContext} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as customQueries from '../../customGraphql/customQueries';
import * as customMutations from '../../customGraphql/customMutations';
import * as customSubscriptions from '../../customGraphql/customSubscriptions';
import {GlobalContext} from '../../contexts/GlobalContext';
import {IconContext} from 'react-icons';
import {AiOutlineSend} from 'react-icons/all';

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
      <div className="truncate inline-flex items-center p-2 mb-2 border-0 border-dashed border-gray-600 text-gray-200 shadow-sm text-xs font-medium rounded">
        Loading room messages...
      </div>
    );
  };

  const showNomsgs = () => {
    return (
      <div
        className={`flex flex-col flex-1 p-2 bg-gradient-to-t from-gray-500 to-gray-600`}>
        <div className="truncate inline-flex items-center p-2 mb-2 border-0 border-dashed border-gray-600 text-gray-200 shadow-sm text-xs font-medium rounded">
          No recent messages (24 hrs)
        </div>
      </div>
    );
  };

  const listMsgs = () => {
    return (
      <div
        className={`flex flex-col flex-1 p-2 bg-gradient-to-t from-gray-500 to-gray-600`}>
        {msgs.map((msg: any, index: any) => {
          return (
            <div key={index} className={`animate-slideUp`}>
              {msg.sender.firstName}: {msg.body}
              {/*{msg.sender.id === state.user.id ? (*/}
              {/*  <div>*/}
              {/*    <button onClick={() => editMsg(msg)}>Edit</button>*/}
              {/*    <button onClick={() => deleteMsg(msg)}>Delete</button>*/}
              {/*  </div>*/}
              {/*) : null}*/}
            </div>
          );
        })}
      </div>
    );
  };

  const showRoomMsgs = () => {
    if (Array.isArray(msgs) && !msgs.length) {
      return showNomsgs();
    }
    if (Array.isArray(msgs) && msgs.length) {
      return listMsgs();
    }
  };

  const msgInputBox = () => {
    return (
      <div className={`h-12 flex flex-none`}>
        <form className={`flex flex-row`} onSubmit={(e) => sendMsg(e)}>
          <input
            className={`flex-1`}
            type="text"
            name="message"
            placeholder="Type your message here..."
            onChange={handleChange}
            value={msg}
          />
          <div className={`flex-none bg-white w-12 h-12`}>
            <div
              className={`w-12 h-12 flex items-center cursor-pointer border border-indigo-600 bg-white shadow-sm rounded-full hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400`}
              onClick={(e) => sendMsg(e)}>
              <IconContext.Provider
                value={{
                  className:
                    'w-auto h-auto mx-auto my-auto text-indigo-600 pointer-events-none',
                }}>
                <AiOutlineSend size={32} />
              </IconContext.Provider>
            </div>
          </div>
        </form>
      </div>
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
    focusSection &&
    focusSection === 'Chat' &&
    Object.keys(selectedRoom).length > 0 && (
      <div id={`roomchat_container`} className={`flex flex-col flex-1`}>
        {loading && showLoader()}
        {!loading && showRoomMsgs()}
        {!loading && msgInputBox()}
      </div>
    )
  );
};

export default RoomChat;