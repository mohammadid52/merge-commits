import React, { useState, useEffect, useContext, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import API, { graphqlOperation } from '@aws-amplify/api';
import { AiOutlineUsergroupAdd, AiOutlineArrowUp } from 'react-icons/ai';
import { IconContext } from 'react-icons/lib/esm/iconContext';

import { GlobalContext } from '../../../../contexts/GlobalContext';
import * as queries from '../../../../graphql/queries';
import { getAsset } from '../../../../assets';

import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import ListStudents from './ListStudents'
import List from './List';
import Pagination from '../../../Atoms/Pagination';
import Buttons from '../../../Atoms/Buttons';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageCountSelector from '../../../Atoms/PageCountSelector';
import SearchInput from '../../../Atoms/Form/SearchInput';
import Selector from '../../../Atoms/Form/Selector';
import useDictionary from '../../../../customHooks/dictionary';


{/* 
		This component represent the pagination implementation 
		with nextToken of dynamoDb.
		Currently using pagination and sorting on client side 
		that will modified once moved to another database solution.
*/}

const UserLookup = () => {
	const { state, theme, clientKey,userLanguage } = useContext(GlobalContext);
	const themeColor = getAsset(clientKey, 'themeClassName');
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
	const [sortingType, setSortingType] = useState({
		value: '',
		name: '',
		asc: true
	});
	const { UserLookupWithTokenDict,paginationPage,BreadcrumsTitles  } = useDictionary(clientKey);
	
	const breadCrumsList = [
		{ title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false },
		{ title: BreadcrumsTitles[userLanguage]['PEOPLE'], url: '/dashboard/manage-users', last: true },
	]

	const sortByList = [
		{ id: 1, name: 'Name', value: 'lastName' },
		{ id: 2, name: 'Role', value: 'role' },
		{ id: 3, name: 'Institution', value: 'institution' },
		{ id: 4, name: 'Status', value: 'status' },
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
		setSortingToInitial();
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
		setSortingToInitial()
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
			setSortingToInitial();
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

	const setSortingValue = (str: string, name: string) => {
		setSortingType({
			...sortingType,
			value: str,
			name: name
		})
	}

	const toggleSortDimention = () => {
		setSortingType({
			...sortingType,
			asc: !sortingType.asc
		})
	}

	const removeSearchAction = () => {
		setSearchInput({ value: '', isActive: false })
		setSortingToInitial();
		listUsers(null)
	}

	const setSortingToInitial = () => {
		setSortingType({
			value: '',
			name: '',
			asc: true
		})
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
		setSortingToInitial();
	}, [userCount])

	useEffect(() => {
		const newUserList = [...userList].sort((a, b) => ((a[sortingType.value]?.toLowerCase() > b[sortingType.value]?.toLowerCase()) && sortingType.asc) ? 1 : -1);
		setUserList(newUserList);
		console.log({ userList, newUserList })
	}, [sortingType.value, sortingType.asc])

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
					<SectionTitle title={UserLookupWithTokenDict[userLanguage]['title']} subtitle={UserLookupWithTokenDict[userLanguage]['subtitle']} />
					<div className="flex justify-end py-4 mb-4">
						<SearchInput value={searchInput.value} onChange={setSearch} onKeyDown={searchUserFromList} closeAction={removeSearchAction} style="mr-4 w-full" />
						<Selector placeholder={UserLookupWithTokenDict[userLanguage]['sortby']} list={sortByList} selectedItem={sortingType.name} onChange={setSortingValue} btnClass="rounded-r-none border-r-0" arrowHidden={true} />
						<button className={`w-28 bg-gray-100 mr-4 p-3 border-gray-400 border rounded ${theme.outlineNone} ${sortingType.asc ? 'border-l-0 rounded-l-none' : 'border-r-0 rounded-r-none transform rotate-180'}`} onClick={toggleSortDimention}>
							<IconContext.Provider value={{ size: '1.5rem', color: theme.iconColor[themeColor] }}>
								<AiOutlineArrowUp />
							</IconContext.Provider>
						</button>
						<Buttons label={UserLookupWithTokenDict[userLanguage]['button']['add']} onClick={handleLink} btnClass="mr-4 w-full" Icon={AiOutlineUsergroupAdd} />
					</div>
				</div>
				<div className="flex flex-col">
					<div className="-my-2 py-2">
						<div className="white_back py-4 px-8 mt-2 mb-8 align-middle rounded-lg border-b border-gray-200">
							<div className="h-8/10 px-4">
								<div className="w-full flex justify-between border-b border-gray-200 ">
									<div className="w-3.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										<span>{UserLookupWithTokenDict[userLanguage]['name']}</span>
									</div>
									<div className="w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										<span className="w-auto">{UserLookupWithTokenDict[userLanguage]['role']}</span>
									</div>
									<div className="w-3.5/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										<span className="w-auto">{UserLookupWithTokenDict[userLanguage]['institution']}</span>
									</div>
									<div className="w-1.5/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										<span className="w-auto">{UserLookupWithTokenDict[userLanguage]['status']}</span>
									</div>
									<div className="w-1/10 px-8 justify-center py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										{UserLookupWithTokenDict[userLanguage]['action']}
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
												{UserLookupWithTokenDict[userLanguage]['noresult']}
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