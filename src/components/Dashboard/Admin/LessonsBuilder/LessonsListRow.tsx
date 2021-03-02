import React, { useContext } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom';
import { getAsset } from '../../../../assets';
import { GlobalContext } from '../../../../contexts/GlobalContext';

interface LessonsListRow {
  id: string,
  index: number,
  title: string,
  type: string,
  languages: string[]
}

const LessonsListRow = (props: LessonsListRow) => {

  const match = useRouteMatch();
  const history = useHistory();
  const { theme, clientKey } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const handleLessonsEdit = (type: string) => {
    if (type === 'Lesson') {
      history.push(`${match.url}/lesson/edit?lessonId=${id}`);
    } else {
      history.push(`${match.url}/lesson/edit?assessmentId=${id}`);
    }
  }


  const { id, index, title, type, languages } = props;
  return (
    <div id={id} className="flex justify-between bg-white w-full border-b border-gray-200">
      <div className="w-.5/10 flex justify-center items-center px-4 py-4 whitespace-normal text-sm leading-5 font-medium" >
        {index + 1}.
      </div>
      <div className="w-3/10 flex items-center px-8 py-4 hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900 whitespace-normal" onClick={() => handleLessonsEdit(type)}>
        <span>
          {title ? title : '--'}
        </span>
      </div>
      {/* <div className="w-1.5/10 flex items-center px-8 py-4 whitespace-normal text-sm leading-5 text-gray-500">
        <span className="w-auto">
          {type ? type : '--'}
        </span>
      </div> */}
      <div className="w-1/10 flex justify-center items-center px-8 py-4 whitespace-normal text-sm leading-5 text-gray-500">
        <span className="w-auto">
          {type ? type : '--'}
        </span>
      </div>

      <div className="w-2/10 flex justify-center items-center px-8 py-4 whitespace-normal text-sm leading-5 text-gray-500">
        <span className="w-auto">
          {languages?.length ? languages.map((language, index) => language + `${index === (languages.length - 1) ? '.' : ', '}`) : '--'}
        </span>
      </div>

      <div className={`w-1/10 flex justify-center items-center pr-4 py-4 cursor-pointer whitespace-no-wrap ${theme.textColor[themeColor] } text-sm leading-5 font-medium`} onClick={() => handleLessonsEdit(type)} >
        <span className="w-auto">Edit</span>
      </div>
    </div>
  )
}

export default LessonsListRow
