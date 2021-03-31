import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom';

interface QuestionListRowProps {
  id: string,
  index: number,
  question: string,
  label: string,
  type: string,
  source: string,
  topics: string,
  language: string,
}

const QuestionListRow = (props: QuestionListRowProps) => {

  const match = useRouteMatch();
  const history = useHistory();
  const handleQuestionEdit = () => {
    history.push(`${match.url}/question/edit?id=${id}`);
  }

  const getLanguageString = (language: string) => {
    switch (language) {
      case 'EN':
        return 'English';
      case 'ES':
        return 'Spanish';
    }
  }

  const { id, index, question, label, type, source, topics, language } = props;

  return (
    <div id={id} className="flex justify-between bg-white w-full border-b-0 border-gray-200">
      <div className="w-.5/10 flex justify-center items-center px-4 py-4 whitespace-normal text-sm leading-5 font-medium" >
        {index + 1}.
      </div>
      <div className="w-3/10 flex items-center px-8 py-4 hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900 whitespace-normal" onClick={handleQuestionEdit}>
        <span>
          {question.length < 100 ? question : `${question.substr(0, 100)}...`}
        </span>
      </div>
      <div className="w-1.5/10 flex items-center px-8 py-4 whitespace-normal text-sm leading-5 text-gray-500">
        <span className="w-auto">
          {label ? label : '--'}
        </span>
      </div>
      <div className="w-1/10 flex justify-center items-center px-8 py-4 whitespace-normal text-sm leading-5 text-gray-500">
        <span className="w-auto">
          {type ? type : '--'}
        </span>
      </div>
      <div className="w-1/10 flex justify-center items-center px-8 py-4 whitespace-normal text-sm leading-5 text-gray-500">
        <span className="w-auto">
          {source ? source : '--'}
        </span>
      </div>
      <div className="w-1.5/10 flex justify-center items-center px-8 py-4 whitespace-normal text-sm leading-5 text-gray-500">
        <span className="w-auto">
          {topics ? topics : '--'}
        </span>
      </div>
      <div className="w-.5/10 flex justify-center items-center pr-4 py-4 whitespace-normal text-sm leading-5 text-gray-500">
        <span className="w-auto">{language ? getLanguageString(language) : '--'}</span>
      </div>
      <div className="w-1/10 flex justify-center items-center pr-4 py-4 cursor-pointer whitespace-nowrap text-indigo-600 hover:text-indigo-900 text-sm leading-5 font-medium" onClick={handleQuestionEdit} >
        <span className="w-auto">Edit</span>
      </div>
    </div>
  )
}

export default QuestionListRow
