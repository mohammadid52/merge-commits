import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../../../../graphql/queries';
import UserSearch from './UserSearch';

const UserLookup = () => {
    const [ data, setData ] = useState([]);
    const match = useRouteMatch();
    const history = useHistory();

    async function listUsers() {
        let limit = 10;
        try {
            const users: any = await API.graphql(graphqlOperation(queries.listPersons, { limit: limit }))
            // console.log('list users', users);
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
            <div className={`white_back w-full h-full rounded-lg shadow-elem-light p-4`}>
                <div className="mb-2 font-bold text-lg">Look up users by:</div>
                <div className="grid grid-cols-1 row-gap-4 col-gap-4 sm:grid-cols-4">
                    <UserSearch 
                        name = 'first name'
                        id = 'firstName'
                    />
                    <UserSearch 
                        name = 'last name'
                        id = 'lastName'
                    />
                    <UserSearch 
                        name = 'nickname'
                        id = 'PreferredName'
                    />
                    <UserSearch 
                        name = 'role'
                        id = 'role'
                    />
                    <UserSearch 
                        name = 'status'
                        id = 'status'
                    />
                    <UserSearch 
                        name = 'institution'
                        id = 'institution'
                    />
                    <UserSearch 
                        name = 'grade'
                        id = 'grade'
                    />
                    <UserSearch 
                        name = 'language preference'
                        id = 'language'
                    />
                </div>
                <div className={`mt-4 w-full flex justify-end`}>
                    <div className="w-32 cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700" onClick={handleSubmit}>Submit</div>
                </div>
            </div>
                <div className="flex flex-col">
                    <div className="-my-2 py-2 overflow-x-auto">
                        <div className="white_back mt-8 align-middle inline-block min-w-full overflow-hidden sm:rounded-lg border-b border-gray-200">
                        <table className="h-8/10 px-4 min-w-full divide-y divide-gray-200">
                            <thead>
                            <tr>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Name
                                </th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Institution
                                </th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Status
                                </th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Role
                                </th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
                            </tr>
                            </thead>
                        { 
                    data.length > 0 ? data.map((item: any, key: number) => (
                            <tbody id={item.id} key={key} className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <img className="h-10 w-10 rounded-lg" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60" alt="" />
                                    </div>
                                    <div className="ml-4">
                                        <div id={item.id} className="text-sm leading-5 font-medium text-gray-900">
                                            {`${item.lastName}, ${ item.preferredName ? item.preferredName : item.firstName }`}
                                        </div>
                                        <div id={item.id} className="text-sm leading-5 text-gray-500">
                                            { item.email }
                                        </div>
                                    </div>
                                </div>
                                </td>
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                    <div id={item.id} className="text-sm leading-5 text-gray-900">{item.institution ? item.institution : 'Institution Name'}</div>
                                    <div id={item.id} className="text-sm leading-5 text-gray-500">{item.grade ? item.grade : 'Grade'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                    <span id={item.id} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-lg bg-green-100 text-green-800">
                                    {item.status}
                                    </span>
                                </td>
                                <td id={item.id} className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                                    { item.role }
                                </td>
                                <td className="px-6 py-4 cursor-pointer whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium" onClick={handleLink} >
                                    <div id={item.id} key={key} className="text-indigo-600 hover:text-indigo-900">View</div>
                                </td>
                            </tr>

                            </tbody>
                            )): null
                            }
                            </table>
                        </div>
                    </div>
                </div>
            
        </div>
    )
}

export default UserLookup;