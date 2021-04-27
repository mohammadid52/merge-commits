import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import Rooms from './Rooms';
import RoomChat from './RoomChat';

interface Chat { }

const Chat = (props: Chat) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const selectRoom = (room: any) => {
        setSelectedRoom({ ...room });
    }

    return (
        <div className="w-full min-h-24 bg-green-200 p-8">
            <div>Chat</div>
            {
                !selectedRoom ?
                    <Rooms selectRoom={selectRoom}/>
                    :
                    <RoomChat selectedRoom={selectedRoom}/>
            }

        </div>
    );
};

export default Chat;
