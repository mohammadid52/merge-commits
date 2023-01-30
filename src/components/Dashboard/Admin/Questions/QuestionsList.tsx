import API, {graphqlOperation} from '@aws-amplify/api';
import React, {useContext, useEffect, useState} from 'react';
import {AiOutlineArrowDown, AiOutlineArrowUp} from 'react-icons/ai';
import {IoMdAddCircleOutline} from 'react-icons/io';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {useHistory, useRouteMatch} from 'react-router-dom';

import {GlobalContext} from 'contexts/GlobalContext';
import * as queries from 'graphql/queries';
import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import QuestionListRow from './QuestionListRow';

import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import ListBottomBar from '@components/Molecules/ListBottomBar';
import usePagination from '@customHooks/usePagination';
import BreadCrums from 'atoms/BreadCrums';
import Buttons from 'atoms/Buttons';
import SearchInput from 'atoms/Form/SearchInput';
import Selector from 'atoms/Form/Selector';
interface QuestionsListProps {}

const QuestionsList = (props: QuestionsListProps) => {
  const {} = props;
  const match = useRouteMatch();
  const history = useHistory();

  const {theme} = useContext(GlobalContext);

  const [status, setStatus] = useState('');

  const [questionsData, setQuestionsData] = useState([]);

  const [totalQuesNum, setTotalQuesNum] = useState(0);

  const {
    currentPage,
    allAsProps,
    setTotalPages,
    pageCount,
    setCurrentList,
    currentList,
    resetPagination
  } = usePagination(questionsData, totalQuesNum);

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
    {title: 'Home', url: '/dashboard', last: false},
    {title: 'Question Bank', url: '/dashboard/question-bank', last: true}
  ];

  const sortByList = [
    {id: 1, name: 'Type', value: 'type'},
    {id: 2, name: 'Label', value: 'label'},
    {id: 3, name: 'Source', value: 'sourceId'},
    // { id: 3, name: 'Topics', value: '' },
    {id: 4, name: 'Language', value: 'language'}
  ];

  const addNewQuestion = () => {
    history.push(`${match.url}/question/add`);
  };

  const getQuestionsList = async () => {
    try {
      const fetchQuestionsData: any = await API.graphql(
        graphqlOperation(queries.listQuestions)
      );
      if (!fetchQuestionsData) {
        throw new Error('fail!');
      } else {
        const QuestionsList = fetchQuestionsData.data?.listQuestions?.items;
        const totalListPages = Math.floor(QuestionsList.length / pageCount);
        if (totalListPages * pageCount === QuestionsList.length) {
          setTotalPages(totalListPages);
        } else {
          setTotalPages(totalListPages + 1);
        }
        setQuestionsData(QuestionsList);
        setTotalQuesNum(QuestionsList.length);
        setStatus('done');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setSearch = (str: string) => {
    setSearchInput({
      ...searchInput,
      value: str
    });
  };

  const searchQuestionFromList = () => {
    if (searchInput.value) {
      const currentQuesList = [...questionsData];
      const newList = currentQuesList.filter((item) => {
        // Search on question for match.
        return item.question?.toLowerCase().includes(searchInput.value);
      });
      setSearchInput({
        ...searchInput,
        isActive: true
      });
      setCurrentList(newList);
    } else {
      removeSearchAction();
    }
  };
  const toggleSortDimention = () => {
    setSortingType({
      ...sortingType,
      asc: !sortingType.asc
    });
  };
  const removeSearchAction = () => {
    resetPagination();
    setSearchInput({value: '', isActive: false});
  };

  const fetchSortedList = () => {
    const newQuestList = [...questionsData].sort((a, b) =>
      a[sortingType.value]?.toLowerCase() > b[sortingType.value]?.toLowerCase() &&
      sortingType.asc
        ? 1
        : -1
    );
    setQuestionsData(newQuestList);
  };

  const setSortingValue = (str: string, name: string) => {
    setSortingType({
      ...sortingType,
      value: str,
      name: name
    });
  };
  useEffect(() => {
    getQuestionsList();
  }, []);

  useEffect(() => {
    fetchSortedList();
  }, [sortingType.value, sortingType.asc]);

  if (status !== 'done') {
    return <LessonLoading />;
  }
  {
    return (
      <div className={`w-full h-full`}>
        {/* Header section */}
        <BreadCrums items={breadCrumsList} />
        <div className="flex justify-between">
          <SectionTitleV3 title="QUESTION BANK" subtitle="All Questions List" />
          <div className="flex justify-end py-4 mb-4">
            <SearchInput
              value={searchInput.value}
              onChange={setSearch}
              onKeyDown={searchQuestionFromList}
              closeAction={removeSearchAction}
              style="mr-4 w-full"
            />
            <Selector
              placeholder="Sort By"
              list={sortByList}
              selectedItem={sortingType.name}
              onChange={setSortingValue}
              btnClass="rounded-r-none  border-r-0 "
              arrowHidden={true}
            />
            <button
              className={`w-28 bg-gray-100 mr-4 p-3 border-gray-400  border-0 rounded border-l-0 rounded-l-none ${theme.outlineNone} `}
              onClick={toggleSortDimention}>
              <IconContext.Provider value={{size: '1.5rem', color: '#667eea'}}>
                {sortingType.asc ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
              </IconContext.Provider>
            </button>
            <Buttons
              label="Add New Question"
              onClick={addNewQuestion}
              btnClass="mr-4 w-full"
              Icon={IoMdAddCircleOutline}
            />
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

                {currentList && currentList.length ? (
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
                ) : (
                  <div className="flex p-12 mx-auto justify-center">No Results</div>
                )}
              </div>

              {/* Pagination And Counter */}
              <div className="flex justify-center my-8">
                {!searchInput.isActive && <ListBottomBar {...allAsProps} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
export default QuestionsList;
