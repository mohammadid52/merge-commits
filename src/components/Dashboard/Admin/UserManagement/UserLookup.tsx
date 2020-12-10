import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import API, { graphqlOperation } from '@aws-amplify/api';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';

import { GlobalContext } from '../../../../contexts/GlobalContext';
import * as queries from '../../../../graphql/queries';
import Pagination from '../../../Atoms/Pagination';

import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import List from './List';
import ListStudents from './ListStudents'
import Buttons from '../../../Atoms/Buttons';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageCountSelector from '../../../Atoms/pageCountSelector';

const UserLookup = () => {
	const { state, theme } = useContext(GlobalContext);
	const match = useRouteMatch();
	const history = useHistory();
	const [data, setData] = useState([]);
	const [status, setStatus] = useState('');
	const [userList, setUserList] = useState([]);
	const [userCount, setUserCount] = useState(10);
	const [totalCount, setTotalCount] = useState(10);
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const breadCrumsList = [
		{ title: 'Home', url: '/dashboard', last: false },
		{ title: 'People', url: '/dashboard/manage-users', last: true },
	]

	async function listUsers() {
		try {
			const users: any = await API.graphql(graphqlOperation(queries.listPersons,))
			const items: any = await users.data.listPersons.items;
			const totalListPages = Math.floor(items.length / userCount)
			setUserList(items);
			setTotalCount(items.length);
			if (totalListPages * userCount === items.length) {
				setTotalPages(totalListPages);
			} else {
				setTotalPages(totalListPages + 1)
			}
			setStatus('done');
		} catch (error) {
			console.error(error);
		}
	}

	const pageSortedList = () => {
		const initialItem = (currentPage) * userCount;
		const updatedList = userList.slice(initialItem, initialItem + userCount);
		console.log({ updatedList, initialItem, userList })
		setData(updatedList);
	}

	const handleLink = () => {
		history.push(`/dashboard/registration`)
	}

	useEffect(() => {
		listUsers();
	}, [])

	useEffect(() => {
		pageSortedList();
	}, [userList.length, userCount, currentPage])

	useEffect(() => {
		const totalListPages = Math.floor(totalCount / userCount);
		if (userCount * totalListPages === totalCount) {
			setTotalPages(totalListPages);
		} else {
			setTotalPages(totalListPages + 1)
		}
	}, [userCount])

	if (status !== 'done') {
		return (
			<LessonLoading />
		)
	}
	{
		return (
			<div className={`w-full h-full mt-4`}>
				<BreadCrums items={breadCrumsList} />
				<div className="flex justify-between">
					<SectionTitle title="USER MANAGEMENT" subtitle="People's List" />
					<div className="flex justify-end py-4 mb-4 w-5/10">
						<Buttons label="Add New Person" onClick={handleLink} btnClass="mr-4" Icon={AiOutlineUsergroupAdd} />
						<PageCountSelector pageSize={userCount} setPageSize={(c: number) => setUserCount(c)} />
					</div>
				</div>
				<div className="flex flex-col">
					<div className="-my-2 py-2">
						<div className="white_back py-4 px-8 mt-2 mb-8 align-middle rounded-lg border-b border-gray-200">
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
									<div className="w-1/10 px-8 justify-center py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</div>
								</div>
								{
									data.length > 0 ? data.map((item: any, key: number) => (
										<div key={key} >
											{state.user.role === 'FLW' ?
												<ListStudents item={item} />
												:
												<List item={item} key={key} />
											}
										</div>

									)) : null

								}
							</div>
							<div className="flex justify-center my-8">
								<Pagination currentPage={currentPage} totalPages={totalPages} setPage={(c: number) => setCurrentPage(c)} />
							</div>
						</div>
					</div>
				</div>

			</div>
		)
	}
}

export default UserLookup;