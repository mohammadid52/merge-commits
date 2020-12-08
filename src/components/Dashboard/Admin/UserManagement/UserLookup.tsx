import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import { IoAdd } from 'react-icons/io5';

import { GlobalContext } from '../../../../contexts/GlobalContext';
import * as queries from '../../../../graphql/queries';
import UserSearch from './UserSearch';
import UserStatus from './UserStatus';
import UserRole from './UserRole';
import Pagination from '../../../../standard/List/Pagination';
import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import List from './List';
import ListStudents from './ListStudents'

const UserLookup = () => {
	const [data, setData] = useState([]);
	const { state, theme } = useContext(GlobalContext);
	const match = useRouteMatch();
	const history = useHistory();
	const [status, setStatus] = useState('');

	async function listUsers() {
		// let limit = 20;
		try {
			const users: any = await API.graphql(graphqlOperation(queries.listPersons,
				// { limit: limit }
			))
			setData(users.data.listPersons.items)
			setStatus('done');

		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		listUsers();
	}, [])

	const handleLink = () => {
		history.push(`/dashboard/registration`)
	}

	const initials = (firstName: string, lastName: string) => {
		if (listUsers()) {
			let firstInitial = firstName.charAt(0).toUpperCase()
			let lastInitial = lastName.charAt(0).toUpperCase()
			return firstInitial + lastInitial;
		}
	}

	const stringToHslColor = (str: string) => {
		let hash = 0;
		let i;
		for (i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}

		let h = hash % 360;
		return 'hsl(' + h + ', 70%, 72%)';
	}

	if (status !== 'done') {
		return (
			<LessonLoading />
		)
	}
	{

		return (
			<div className={`w-full h-full mt-4`}>
				{/* <div className="w-full flex justify-end mb-1">
                <span className="w-20 flex inline-flex rounded-md shadow-sm">
                    <button type="submit" onClick={history.goBack} className="
                    text-white bg-indigo-600 hover:bg-indigo-500 focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700
                    inline-flex justify-center py-2 px-4 border border-transparent text-m leading-5 font-medium rounded-md focus:outline-none transition duration-150 ease-in-out">
                        Back
                    </button>
                </span>
            </div> */}
				{/* <div className={`py-4 px-8 white_back w-full h-auto rounded-lg shadow-elem-light`}>
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
            </div> */}

				<div className="pagetitle-container">
					<p className="page-heading">PEOPLE MANAGEMENT</p>
				</div>
				<div className="w-auto flex justify-end mr-4">
					<button className="purpule-button flex" onClick={handleLink}>
						<span className="w-12 pr-3 h-6 flex items-center">
							<IconContext.Provider value={{ size: '2rem', color: '#ffffff' }}>
								<IoAdd />
							</IconContext.Provider>
						</span>
           Add Person
        </button>
				</div>

				<div className="flex flex-col mt-4">
					<div className="-my-2 py-2">
						<div className="white_back py-4 px-8 mt-2 align-middle rounded-lg border-b border-gray-200">
							<div className="h-8/10 px-4">
								<div className="w-full flex justify-between border-b border-gray-200 ">
									<div className="w-3.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										<span>Name</span>
									</div>
									<div className="w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										<span className="w-auto">Role</span>
									</div>
									<div className="w-3.5/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										<span className="w-auto">Institution</span>
									</div>
									<div className="w-1.5/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										<span className="w-auto">Status</span>
									</div>
									<div className="w-1/10 pr-4 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"></div>
								</div>
								{
									data.length > 0 ? data.map((item: any, key: number) => (
										<div key={key} >
											{state.user.role === 'FLW' ?
												<ListStudents item={item} listUsers={listUsers} />
												:
												<List item={item} key={key} listUsers={listUsers} />
											}
										</div>

									)) : null

								}
								{/* <div className="">
                                <Pagination 
                                    data = {data}/>
                            </div> */}

							</div>


						</div>
					</div>
				</div>

			</div>
		)
	}
}

export default UserLookup;