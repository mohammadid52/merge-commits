import React, { useState, useEffect, useContext, Fragment } from 'react';
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
import PageCountSelector from '../../../Atoms/PageCountSelector';
import SearchInput from '../../../Atoms/Form/SearchInput';

const UserLookup = () => {
	const { state } = useContext(GlobalContext);
	const history = useHistory();
	const [status, setStatus] = useState('');
	const [userList, setUserList] = useState([]);
	const [userCount, setUserCount] = useState(10);
	const [currentPage, setCurrentPage] = useState(0);
	const [pageTokens, setPageTokens] = useState({
		currentPageToken: null,
		nextPageToken: null,
		prevToken: []
	})
	const [userListLength, setUSerListLength] = useState(10);
	const [lastPage, setLastPage] = useState(false);
	const [firstPage, setFirstPage] = useState(false);
	const [searchInput, setSearchInput] = useState({
		value: '',
		isActive: false
	});

	const breadCrumsList = [
		{ title: 'Home', url: '/dashboard', last: false },
		{ title: 'People', url: '/dashboard/manage-users', last: true },
	]

	async function listUsers(currToken?: string, isPrev?: boolean, isTokenStored?: boolean) {
		try {
			const users: any = await API.graphql(graphqlOperation(queries.listPersons, {
				limit: userCount,
				nextToken: currToken
			}))
			const listPersons: any = users.data.listPersons;
			const items: any = listPersons.items;

			if (!isPrev && !isTokenStored) {
				// To store tokens for next and prev pages.

				setPageTokens({
					...pageTokens,
					currentPageToken: currToken,
					nextPageToken: listPersons.nextToken,
					prevToken: [
						...pageTokens.prevToken,
						pageTokens.currentPageToken
					]
				})
				setCurrentPage(currentPage + 1);
			} else if (!isPrev && isTokenStored) {
				setCurrentPage(currentPage + 1);
			} else {
				currentPage === 1 ? setFirstPage(true) :
					setCurrentPage(currentPage - 1);
			}
			if (!listPersons.nextToken) {
				setLastPage(true);
			}
			setUserList(items);
			setStatus('done');
		} catch (error) {
			console.error(error);
		}
	}


	const loadPrevPage = () => {

		if (lastPage) {
			setLastPage(false);
		}
		// This will find token for the previous page from prevToken list.
		listUsers(pageTokens.prevToken[currentPage - 1], true)
	}

	const loadNextPage = () => {
		if (firstPage) {
			setFirstPage(false);
		}
		// Below conditions decides which token to use for data fetching.  

		if (pageTokens.prevToken.length < currentPage + 1) {
			listUsers(pageTokens.nextPageToken)
		} else if (pageTokens.prevToken.length === currentPage + 1) {
			listUsers(pageTokens.currentPageToken, false, true)
		} else {
			listUsers(pageTokens.prevToken[currentPage + 1], false, true)
		}
	}

	const handleLink = () => {
		history.push(`/dashboard/registration`)
	}

	const searchUserFromList = async () => {
		try {
			const users: any = await API.graphql(graphqlOperation(queries.listPersons, {
				filter: {
					email: { contains: searchInput.value },
				}
			}))
			const items: any = users.data.listPersons.items;
			setUserList(items);
			setSearchInput({
				...searchInput,
				isActive: true
			})
		} catch (error) {
			console.error(error);
		}
	}

	const setSearch = (str: string) => {
		setSearchInput({
			...searchInput,
			value: str
		})
	}

	const removeSearchAction = () => {
		setSearchInput({ value: '', isActive: false })
		listUsers(null)
	}

	useEffect(() => {
		setCurrentPage(0);
		setLastPage(false);
		setFirstPage(true);
		setPageTokens({
			currentPageToken: null,
			nextPageToken: null,
			prevToken: []
		})
		setUSerListLength(userCount);
	}, [userCount])

	useEffect(() => {
		listUsers(null)
	}, [userListLength])

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
						<SearchInput value={searchInput.value} onChange={setSearch} onKeyDown={searchUserFromList} closeAction={removeSearchAction} style="mr-4" />
						<Buttons label="Add New Person" onClick={handleLink} btnClass="mr-4" Icon={AiOutlineUsergroupAdd} />
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
									userList.length > 0 ? userList.map((item: any, key: number) => (
										<div key={key} >
											{state.user.role === 'FLW' ?
												<ListStudents item={item} />
												:
												<List item={item} key={key} />
											}
										</div>
									)) : (
											<div className="flex p-12 mx-auto justify-center">
												No Results
											</div>)
								}
							</div>
							<div className="flex justify-center my-8">
								{!searchInput.isActive &&
									(
										<Fragment>
											<Pagination currentPage={currentPage} setNext={loadNextPage} setPrev={loadPrevPage} firstPage={firstPage} lastPage={lastPage} />
											<PageCountSelector pageSize={userCount} setPageSize={(c: number) => setUserCount(c)} />
										</Fragment>
									)}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default UserLookup;