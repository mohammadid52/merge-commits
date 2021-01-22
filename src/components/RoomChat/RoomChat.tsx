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
    const [loading, setLoading] = useState(false)
    const handleChange = (e: any) => {
        setMsg(e.target.value)
    }

    const sendMsg = async () => {
        try {
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
        const subscription = API.graphql(graphqlOperation(subscriptions.onNewRoomMsg, { roomID: '06263081-3fb9-4b4b-be13-d1753297d3d3' })).subscribe({
            next: (event: any) => {
                setMsgs([...msgs, event.value.data.onNewRoomMsg]);
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [msgs]);

    return (
        <>
            <div>Room Chat</div>
            {
                !loading ?
                    msgs.map((message) => (
                        <div key={message.id}>{message.body}</div>
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
