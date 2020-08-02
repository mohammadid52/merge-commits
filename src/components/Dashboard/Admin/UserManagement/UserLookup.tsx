import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../../../../graphql/queries';

const UserLookup = () => {
    const [ data, setData ] = useState([]);
    const match = useRouteMatch();
    const history = useHistory();

    async function listUsers() {
        let limit = 10;
        try {
            const users: any = await API.graphql(graphqlOperation(queries.listPersons, { limit: limit }))
            console.log('list users', users);
            setData(users.data.listPersons.items)
        } catch (error) {
            console.error(error);  
        }
    }

    const handleSubmit = () => {
        listUsers()
    }

    const handleLink = (e: any) => {
        const { id } = e.target
        // console.log(`/user?id=${id}`);
        history.push(`${match.url}/user?id=${id}`)
    }

    return (
        <div className={`w-full h-full`}>
            <div className={`w-full h-full rounded-lg shadow-elem-light p-4`}>
                <div className={`w-full h-2/10 flex flex-col`}>
                    <div className={`self-end h-8 w-16 flex justify-center items-center bg-green-500 text-green-700 font-open font-bold shadow-elem-light rounded-lg cursor-pointer`} onClick={handleSubmit}>Submit</div>
                </div>
                <div className={`w-full h-8/10 px-4`}>
                    {
                        data.length > 0 ? data.map((item: any, key: number) => (
                            <div id={item.id} key={key} className={`w-full flex justify-between py-4 cursor-pointer hover:text-blue-600`} onClick={handleLink} >
                                <div id={item.id} className={`w-2/12`}>
                                    {`${item.lastName}, ${ item.preferredName ? item.preferredName : item.firstName }`}
                                </div>
                                <div id={item.id} className={`w-4/12`}>
                                    { item.email }
                                </div>
                                <div id={item.id} className={`w-1/12`}>
                                    { item.role }
                                </div>
                                <div id={item.id} className={`w-1/12`}>
                                    { item.language }
                                </div>
                            </div>
                        )): null
                    }
                </div>
            </div>
        </div>
    )
}

export default UserLookup;