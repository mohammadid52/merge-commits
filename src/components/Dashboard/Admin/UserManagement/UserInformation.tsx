import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import * as queries from '../../../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';

const UserInformation = () => {
    const location = useLocation();
    const queryParams = queryString.parse(location.search)
    
    async function getUserById(id: string) {
        const data: any = await API.graphql(graphqlOperation(queries.userById, { id: id }))
        console.log('user', data.data.userById.items.pop())
    }

    useEffect(() => {
        let id = queryParams.id;
        console.log(id);

        if ( typeof id === 'string') {
            getUserById(id);
        }
    }, [])

    return (
        <div className={`w-full h-full`}>
            <div className={`w-full h-full rounded-lg shadow-elem-light p-4`}>
                Hey Jayne! Check the console :)
            </div>
        </div>
    )
}

export default UserInformation;