import React, { useState, useEffect, useContext, Fragment } from 'react'
import API, { graphqlOperation } from '@aws-amplify/api';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { IoMdAddCircleOutline } from "react-icons/io";

import { GlobalContext } from '../../../../contexts/GlobalContext';
import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import * as queries from '../../../../graphql/queries';
import QuestionListRow from './QuestionListRow';

import Buttons from '../../../Atoms/Buttons';
import Selector from '../../../Atoms/Form/Selector';
import BreadCrums from '../../../Atoms/BreadCrums';
import Pagination from '../../../Atoms/Pagination';
import SearchInput from '../../../Atoms/Form/SearchInput';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageCountSelector from '../../../Atoms/PageCountSelector';
interface QuestionsListProps {

}

const QuestionsList = (props: QuestionsListProps) => {
  const { } = props;
  const match = useRouteMatch();
  const history = useHistory();

  const { theme } = useContext(GlobalContext);

  const [status, setStatus] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [questionsData, setQuestionsData] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [lastPage, setLastPage] = useState(false);
  const [firstPage, setFirstPage] = useState(false);
  const [pageCount, setPageCount] = useState(10);
  const [totalQuesNum, setTotalQuesNum] = useState(0);
  const [searchInput, setSearchInput] = useState({
    value: '',
    isActive: false
  });
  const [sortingType, setSortingType] = useState({
    value: '',
    name: '',
    asc: true
  });

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Question Bank', url: '/dashboard/question-bank', last: true },
  ]

  const sortByList = [
    { id: 1, name: 'Type', value: 'type' },
    { id: 2, name: 'Label', value: 'label' },
    { id: 3, name: 'Source', value: 'sourceId' },
    // { id: 3, name: 'Topics', value: '' },
    { id: 4, name: 'Language', value: 'language' },
  ]

  const goNextPage = () => {
    const pageHigherLimit = totalPages - 1;
    if (firstPage) {
      setFirstPage(false)
    }
    if (currentPage < (pageHigherLimit - 1)) {
      setCurrentPage(currentPage + 1);
    } else if (currentPage === pageHigherLimit - 1) {
      setCurrentPage(currentPage + 1);
      setLastPage(true);
    }
  }

  const goPrevPage = () => {
    if (lastPage) {
      setLastPage(false)
    }
    if (currentPage > 0)
      setCurrentPage(currentPage - 1);
    else {
      setFirstPage(true)
    }
  }

  const currentPageQuestions = () => {
    const initialItem = (currentPage) * pageCount;
    const updatedList = questionsData.slice(initialItem, initialItem + pageCount);
    setCurrentList(updatedList);
  }

  const backToInitials = () => {
    setCurrentPage(0);
    currentPageQuestions();
    setFirstPage(true);
    if (totalPages === 1) {
      setLastPage(true)
    } else {
      setLastPage(false);
    }
  }

  const addNewQuestion = () => {
    history.push(`${match.url}/question/add`);
  }

  const getQuestionsList = async () => {
    try {
      const fetchQuestionsData: any = await API.graphql(
        graphqlOperation(queries.listQuestions)
      );
      if (!fetchQuestionsData) {
        throw new Error('fail!');
      } else {
        const QuestionsList = fetchQuestionsData.data?.listQuestions?.items;
        const totalListPages = Math.floor(QuestionsList.length / pageCount)
        if (totalListPages * pageCount === QuestionsList.length) {
          setTotalPages(totalListPages);
        } else {
          setTotalPages(totalListPages + 1)
        }
        setQuestionsData(QuestionsList);
        setTotalQuesNum(QuestionsList.length);
        setStatus('done');
      }
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

  const searchQuestionFromList = () => {
    if (searchInput.value) {
      const currentQuesList = [...questionsData];
      const newList = currentQuesList.filter(item => {
        // Search on question for match.
        return (
          (item.question?.toLowerCase().includes(searchInput.value))
        )
      });
      setSearchInput({
        ...searchInput,
        isActive: true
      })
      setCurrentList(newList)
    } else {
      removeSearchAction();
    }
  }
  const toggleSortDimention = () => {
    setSortingType({
      ...sortingType,
      asc: !sortingType.asc
    })
  }
  const removeSearchAction = () => {
    backToInitials();
    setSearchInput({ value: '', isActive: false });

  }

  const fetchSortedList = () => {
    const newQuestList = [...questionsData].sort((a, b) => ((a[sortingType.value]?.toLowerCase() > b[sortingType.value]?.toLowerCase()) && sortingType.asc) ? 1 : -1);
    setQuestionsData(newQuestList);
  }

  const setSortingValue = (str: string, name: string) => {
    setSortingType({
      ...sortingType,
      value: str,
      name: name
    })
  }
  useEffect(() => {
    getQuestionsList();
  }, []);


  useEffect(() => {
    backToInitials();
  }, [questionsData])

  useEffect(() => {
    setCurrentPage(0);
    setFirstPage(true);
    setLastPage(false);
    const totalListPages = Math.floor(totalQuesNum / pageCount);
    console.log("totalListPages", totalListPages)
    if (pageCount * totalListPages === totalQuesNum) {
      setTotalPages(totalListPages);
    } else {
      setTotalPages(totalListPages + 1)
    }
    if (totalPages === 1 && totalListPages === 0) {
      setFirstPage(true);
      setLastPage(true);
    }
  }, [pageCount]);

  useEffect(() => {
    currentPageQuestions();
  }, [currentPage, totalQuesNum, pageCount])

  useEffect(() => {
    if (totalPages === 1) {
      console.log("set page initials called.")
      setFirstPage(true);
      setLastPage(true);
    }
  }, [totalPages])

  useEffect(() => {
    fetchSortedList();
  }, [sortingType.value, sortingType.asc])


  if (status !== 'done') {
    return (
      <LessonLoading />
    )
  }
  {
    return (
      <div className={`w-full h-full`}>

        {/* Header section */}
        <BreadCrums items={breadCrumsList} />
        <div className="flex justify-between">
          <SectionTitle title="QUESTION BANK" subtitle="All Questions List" />
          <div className="flex justify-end py-4 mb-4">
            <SearchInput value={searchInput.value} onChange={setSearch} onKeyDown={searchQuestionFromList} closeAction={removeSearchAction} style="mr-4 w-full" />
            <Selector placeholder="Sort By" list={sortByList} selectedItem={sortingType.name} onChange={setSortingValue} btnClass="rounded-r-none  border-r-0 " arrowHidden={true} />
            <button className={`w-28 bg-gray-100 mr-4 p-3 border-gray-400  border-0 rounded border-l-0 rounded-l-none ${theme.outlineNone} `} onClick={toggleSortDimention}>
              <IconContext.Provider value={{ size: '1.5rem', color: '#667eea' }}>
                {sortingType.asc ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
              </IconContext.Provider>
            </button>
            <Buttons label="Add New Question" onClick={addNewQuestion} btnClass="mr-4 w-full" Icon={IoMdAddCircleOutline} />
          </div>
        </div>


        {/* List / Table */}
        <div className="flex flex-col">
          <div className="-my-2 py-2">
            <div className="white_back py-4 px-8 mt-2 mb-8 align-middle rounded-lg border-b-0 border-gray-200">
              <div className="h-8/10 px-4">
                <div className="w-full flex justify-between border-b-0 border-gray-200 ">
                  <div className="w-.5/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>No.</span>
                  </div>
                  <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>Question</span>
                  </div>
                  <div className="w-1.5/10 flex px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">Label</span>
                  </div>
                  <div className="w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">Type</span>
                  </div>
                  <div className="w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">Source</span>
                  </div>
                  <div className="w-1.5/10 flex justify-center px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">Topics</span>
                  </div>
                  <div className="w-.5/10 flex justify-center px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">Language</span>
                  </div>
                  <div className="w-1/10 px-8 flex justify-center py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Actions
								</div>
                </div>

                {(currentList && currentList.length) ?
                  currentList.map((questionObject, i) => (
                    <QuestionListRow
                      key={`questionRow${i}`}
                      index={currentPage * pageCount + i}
                      id={questionObject.id}
                      question={questionObject.question}
                      label={questionObject.label}
                      type={questionObject.type}
                      source={questionObject.sourceId}
                      topics={''}
                      language={questionObject.language}
                    />
                  ))
                  : (
                    <div className="flex p-12 mx-auto justify-center">
                      No Results
                    </div>)}
              </div>

              {/* Pagination And Counter */}
              <div className="flex justify-center my-8">
                {!searchInput.isActive &&
                  (
                    <Fragment>
                      <span className="py-3 px-5 w-auto flex-shrink-0 my-5 text-md leading-5 font-medium text-gray-900">Showing Page {currentPage + 1} of {totalPages} pages</span>
                      <Pagination
                        currentPage={currentPage + 1}
                        setNext={goNextPage}
                        setPrev={goPrevPage}
                        firstPage={firstPage}
                        lastPage={lastPage}
                      />
                      <PageCountSelector pageSize={pageCount} setPageSize={(c: number) => setPageCount(c)} />
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
export default QuestionsList
