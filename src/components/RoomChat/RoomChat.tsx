import React, { useEffect, useState, useContext } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customQueries from '../../customGraphql/customQueries';
import * as customMutations from '../../customGraphql/customMutations';
import * as customSubscriptions from '../../customGraphql/customSubscriptions';
import { GlobalContext } from '../../contexts/GlobalContext';

interface RoomChatProps {
    selectedRoom: any
}

const RoomChat = (props: RoomChatProps) => {
    const { selectedRoom } = props;
    const { state, dispatch } = useContext(GlobalContext);
    const [msgs, setMsgs] = useState(null)
    const [loading, setLoading] = useState(false)

    const fetchRoomChat = async () => {
        setLoading(true)
        let msgs: any = await API.graphql(graphqlOperation(customQueries.messagesByRoomId, { roomID: '06263081-3fb9-4b4b-be13-d1753297d3d3' }))
        msgs = msgs?.data.messagesByRoomID?.items || []
        setMsgs(msgs)
        setLoading(false)
    }

    useEffect(() => {
        fetchRoomChat();
    }, [])

    const showLoader = () => {
        return (
            <div>
                Loading room messages...
            </div>
        )
    }

    const showNomsgs = () => {
        return (
            <div>No messages in the room in last 24 hours.</div>
        )
    }

    const listMsgs = () => {
        return (
            <div>
                {
                    msgs.map((msg: any, index: any) => {
                        return (
                            <div key={index}>{msg.sender.firstName}: {msg.body}</div>
                        )
                    })
                }
            </div>
        )
    }

    const showRoomMsgs = () => {
        if (Array.isArray(msgs) && !msgs.length) {
            return showNomsgs();
        }
        if (Array.isArray(msgs) && msgs.length) {
            return listMsgs();
        }
    }

    return (
        <>
            <div>Room Chat</div>
            <div>Room: {selectedRoom.name}</div>
            { loading && showLoader() }
            { !loading && showRoomMsgs() }
        </>
    );
};

export default RoomChat;
