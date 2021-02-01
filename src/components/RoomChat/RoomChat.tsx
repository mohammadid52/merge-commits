import React, { useEffect, useState, useContext } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customQueries from '../../customGraphql/customQueries';
import * as mutations from '../../graphql/mutations';
import * as subscriptions from '../../graphql/subscriptions';
import { GlobalContext } from '../../contexts/GlobalContext';

interface RoomChatProps {

}

const RoomChat = (props: RoomChatProps) => {
    const { state, dispatch } = useContext(GlobalContext);
    const [msgs, setMsgs] = useState([])
    const [msg, setMsg] = useState('')
    const [isEdit, setIsEdit] = useState('')
    const [loading, setLoading] = useState(false)
    const handleChange = (e: any) => {
        setMsg(e.target.value)
        // if while edit msg clear all text, remove the edit mode
        if (isEdit && !e.target.value.length) setIsEdit('')
    }

    const sendMsg = async () => {
        try {
            if (msg.length) {
                // add new msg
                if (!isEdit) {
                    const input = {
                        roomID: '06263081-3fb9-4b4b-be13-d1753297d3d3',
                        senderAuthID: state.user.authId,
                        senderEmail: state.user.email,
                        body: msg,
                        createdAt: (new Date()).toISOString()
                    }
                    let msgItem: any = await API.graphql(graphqlOperation(mutations.createRoomMsgs, { input }));
                    setMsgs([...msgs, { id: msgs.length + 1, body: msg }])
                    setMsg('')
                } else {
                    // edit msg
                    const input = {
                        id: isEdit,
                        body: msg
                      }
                    let msgItem: any = await API.graphql(graphqlOperation(mutations.updateRoomMsgs, { 
                        input
                    }));
                    let messages = msgs.map(m => {
                        if (m.id === isEdit) {
                            m.body = msg
                        }
                        return m;
                    })
                    setMsgs([...messages])
                    setIsEdit('')
                    setMsg('')
                }
            }
        } catch (err) {
            console.log('err', err)
        }
    }

    const fetchMsgs = async () => {
        setLoading(true)
        let msgs: any = await API.graphql(graphqlOperation(customQueries.messagesByRoomId, { roomID: '06263081-3fb9-4b4b-be13-d1753297d3d3' }))
        msgs = msgs?.data.messagesByRoomID?.items || []
        setMsgs(msgs)
        setLoading(false)
    }

    useEffect(() => {
        fetchMsgs()
    }, []);

    useEffect(() => {
        // @ts-ignore
        const newMsgsubscription = API.graphql(graphqlOperation(subscriptions.onNewRoomMsg, { roomID: '06263081-3fb9-4b4b-be13-d1753297d3d3' })).subscribe({
            next: (event: any) => {
                setMsgs([...msgs, event.value.data.onNewRoomMsg]);
            }
        });
        // @ts-ignore
        const deleteMsgsubscription = API.graphql(graphqlOperation(subscriptions.onDeleteRoomMsg, { roomID: '06263081-3fb9-4b4b-be13-d1753297d3d3' })).subscribe({
            next: (event: any) => {
                let msgId = event.value.data.onDeleteRoomMsg.id
                let messages = msgs.filter(m => m.id !== msgId)
                setMsgs([...messages])
            }
        });
        // @ts-ignore
        const editMsgSubscription = API.graphql(graphqlOperation(subscriptions.onEditRoomMsg, { roomID: '06263081-3fb9-4b4b-be13-d1753297d3d3' })).subscribe({
            next: (event: any) => {
                let message = event.value.data.onEditRoomMsg
                let messages = msgs.map(m => {
                    if (m.id === message.id) {
                        m.body = message.body
                    }
                    return m;
                })
                setMsgs([...messages])
            }
        });
        return () => {
            newMsgsubscription.unsubscribe();
            deleteMsgsubscription.unsubscribe();
            editMsgSubscription.unsubscribe();
        };
    }, [msgs]);

    const editMsg = (message: any) => {
        setIsEdit(message.id)
        setMsg(message.body)
    }

    const deleteMsg = async (message: any) => {
        let msgItem: any = await API.graphql(graphqlOperation(mutations.deleteRoomMsgs, { input: { id: message.id }}));
        let messages = msgs.filter(m => m.id !== message.id)
        setMsgs([...messages])
    }

    return (
        <>
            <div>Room Chat</div>
            {
                !loading ?
                    msgs.map((message) => (
                        <React.Fragment key={message.id}>
                        <div>{message.body}</div>
                        <button onClick={() => editMsg(message)}>Edit</button>
                        <button onClick={() => deleteMsg(message)}>Delete</button>
                        </React.Fragment>
                    ))
                    : <div>Loading msgs ...</div>
            }
            <input
                type="text"
                name="message"
                placeholder="Type your message here..."
                onChange={handleChange}
                value={msg} />
            <button onClick={sendMsg}>Send</button>
        </>
    );
};

export default RoomChat;
