import React, { useEffect, useState, useContext } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customQueries from '../../customGraphql/customQueries';
import { GlobalContext } from '../../contexts/GlobalContext';

interface Rooms {
    selectRoom: Function
}

const Rooms = (props: Rooms) => {
    const { state, dispatch } = useContext(GlobalContext);
    const { selectRoom } = props;
    const [rooms, setRooms] = useState(null);
    const [loadingRooms, setLoadingRooms] = useState(false);

    const fetchRooms = async () => {
        setLoadingRooms(true)
        let rooms: any = await API.graphql(graphqlOperation(customQueries.getChatRooms, { email: state.user.email, authId: state.user.authId }))
        let classes = rooms.data.getPerson?.classes?.items || []
        let chatRooms: any = []
        classes.map((cls: any, i: any) => {
            let rooms = cls.class.rooms?.items;
            chatRooms = chatRooms.concat(rooms);
        })
        setRooms(chatRooms)
        setLoadingRooms(false)
    }

    useEffect(() => {
        fetchRooms()
    }, []);

    const showLoader = () => {
        return (
            <div>Loading Rooms...</div>
        )
    }

    const showNoRooms = () => {
        return (
            <div>You are not part of any room. Please contact admin.</div>
        )
    }

    const listRooms = () => {
        return (
            <div>
                {
                    rooms.map((rm: any, index: any) => {
                        return (
                            <div key={index} onClick={() => selectRoom(rm)}>{rm.name}</div>
                        )
                    })
                }
            </div>
        )
    }

    const renderRooms = () => {
        if (Array.isArray(rooms) && !rooms.length) {
            return showNoRooms();
        }
        if (Array.isArray(rooms) && rooms.length) {
            return listRooms();
        }
    }

    return (
        <div>
            <div>
                <h6>Rooms list</h6>
            </div>
            <div>
                { loadingRooms && showLoader() }
                { !loadingRooms && renderRooms() }
            </div>
        </div>
    );
};

export default Rooms;
