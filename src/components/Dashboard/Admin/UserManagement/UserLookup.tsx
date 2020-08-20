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
            <div className={`py-4 px-8 white_back w-full h-full rounded-lg shadow-elem-light`}>
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
                    <div className="-my-2 py-2">
                        <div className="white_back py-4 px-8 mt-8 align-middle rounded-lg border-b border-gray-200">
                        <div className="h-8/10 px-4">
                            <div className="w-full flex justify-between border-b border-gray-200 ">
                                <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                    <span>Name</span>
                                </div>
                                <div className="w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                    <span className="w-auto">Role</span>
                                </div>
                                <div className="w-2/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                    <span className="w-auto">Institution</span>
                                </div>
                                <div className="w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                    <span className="w-auto">Status</span>
                                </div>
                                <div className="w-16 pr-4 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"></div>
                            </div>
                        { 
                    data.length > 0 ? data.map((item: any, key: number) => (
                            <div id={item.id} key={key} className="flex justify-between bg-white w-full border-b border-gray-200">
                            
                                <div className="w-3/10 px-8 py-4 whitespace-no-wrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-lg" src="https://i2.wp.com/www.quartzmasters.com/wp-content/uploads/2017/03/article-user-blank.jpg?ssl=1" alt="" />
                                        </div>
                                        <div className="ml-2">
                                            <div id={item.id} className="cursor-pointer text-sm leading-5 font-medium text-gray-900" onClick={handleLink} >
                                                {`${item.lastName}, ${ item.preferredName ? item.preferredName : item.firstName }`}
                                            </div>
                                            <div id={item.id} className="text-sm leading-5 text-gray-500">
                                                { item.email }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/10 flex justify-center items-center px-8 py-4 whitespace-no-wrap">
                                        <span id={item.id} className="w-auto text-sm leading-5 text-gray-500">
                                        { item.role }
                                        </span>
                                </div>
                                <div className="w-2/10 flex justify-center px-8 py-4 whitespace-no-wrap">
                                    <div className="flex flex-col justify-center items-center">
                                        <div id={item.id} className="w-auto text-sm leading-5 text-gray-900">{item.institution ? item.institution : 'Some really long Institution Name'}</div>
                                        <div id={item.id} className="w-auto text-sm leading-5 text-gray-500">{item.grade ? item.grade : 'Grade'}</div>
                                    </div>
                                </div>
                                <div className="w-1/10 flex justify-center items-center px-8 py-4 whitespace-no-wrap">
                                    <div className="w-16 flex justify-center">
                                        <span id={item.id} className="w-auto px-2 inline-flex text-xs leading-5 font-semibold rounded-lg bg-green-100 text-green-800">
                                        {item.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-16 flex justify-center items-center pr-4 py-4 cursor-pointer whitespace-no-wrap text-right text-sm leading-5 font-medium" onClick={handleLink} >
                                    <div id={item.id} key={key} className="text-indigo-600 hover:text-indigo-900">View</div>
                                </div>
                

                            </div>
                            )): null
                            }
                            </div>
                        </div>
                    </div>
                </div>
            
        </div>
    )
}

export default UserLookup;