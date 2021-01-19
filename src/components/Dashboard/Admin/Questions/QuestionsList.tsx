import React, { useState, useContext } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { IoMdAddCircleOutline } from "react-icons/io";

import { GlobalContext } from '../../../../contexts/GlobalContext';

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
    { id: 1, name: 'a', value: 'a' },
    { id: 2, name: 'b', value: 'b' },
    { id: 2, name: 'c', value: 'c' },
    { id: 2, name: 'd', value: 'd' },
  ]

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
  const addNewQuestion = () => {
    history.push(`${match.url}/question/add`);
  }

  const searchQuestionFromList = () => {

  }
  const removeSearchAction = () => {

  }

  return (
    <div className={`w-full h-full`}>

      {/* Header section */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="QUESTION BANK" subtitle="All Questions List" />
        <div className="flex justify-end py-4 mb-4">
          <SearchInput value={searchInput.value} onChange={setSearch} onKeyDown={searchQuestionFromList} closeAction={removeSearchAction} style="mr-4 w-full" />
          <Selector placeholder="Sort By" list={sortByList} selectedItem={sortingType.name} onChange={setSortingValue} btnClass="rounded-r-none border-r-0" arrowHidden={true} />
          <button className={`w-28 bg-gray-100 mr-4 p-3 border-gray-400 border rounded border-l-0 rounded-l-none ${theme.outlineNone} `} onClick={toggleSortDimention}>
            <IconContext.Provider value={{ size: '1.5rem', color: '#667eea' }}>
              {sortingType.asc ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
            </IconContext.Provider>
          </button>
          <Buttons label="Add New Question" onClick={addNewQuestion} btnClass="mr-4 w-full" Icon={IoMdAddCircleOutline} />
        </div>
      </div>
    </div>
  )
}

export default QuestionsList
