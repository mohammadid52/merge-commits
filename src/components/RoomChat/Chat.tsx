import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import Rooms from './Rooms';
import RoomChat from './RoomChat';

interface Chat { }

const Chat = (props: Chat) => {
    const { state, dispatch } = useContext(GlobalContext);
    const [selectedRoom, setSelectedRoom] = useState(null);


    const selectRoom = (room: any) => {
        setSelectedRoom({ ...room });
    }


    return (
        <>
            <div>Chat</div>
            {
                !selectedRoom ?
                    <Rooms selectRoom={selectRoom}/>
                    :
                    <RoomChat selectedRoom={selectedRoom}/>
            }

        </>
    );
};

export default Chat;
