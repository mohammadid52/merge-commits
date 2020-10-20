import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
// import { FaClock, FaUserAlt } from 'react-icons/fa';
import { AiOutlineClockCircle, AiOutlineUser } from 'react-icons/ai';
import ProgressRing from './ProgressRing';
import { CurriculumInfo } from './Classroom';
import ToolTip from '../../General/ToolTip/ToolTip';
import * as customQueries from '../../../customGraphql/customQueries';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import { start } from 'repl';

interface Props {
    lessonKey: any
}

const Today: React.FC<Props> = (props: Props) => {
  const { lessonKey } = props;
  const [accessible, setAccessible] = useState<boolean>(true);
  const history = useHistory();
  const { theme } = useContext(GlobalContext);

  const [lesson, setLesson] = useState<any>();
  const [ open, setOpen ] = useState<any>();

  async function getClassroom() {
    try {
        let id = lessonKey + 1
        // this any needs to be changed once a solution is found!!!
        const classroom: any = await API.graphql(graphqlOperation(customQueries.getClassroom, { id: id }))
        setLesson(classroom.data.getClassroom)
        setOpen(classroom.data.getClassroom.open)
    } catch (error) {
        console.error(error)
    }
  }

  useEffect(() => {
    getClassroom()
  }, [])

  const handleLink = (key: number) => {

    if (accessible && open ) {
      history.push((`${`/lesson?id=${lessonKey + 1}`}`));
    }
    // For testing: enables clickthrough survey
    // history.push(link);
  };


  return (
    <div>
        <button
              type='submit'
              onClick={() => handleLink(lessonKey)}
              className={`${
                accessible && open
                  ? 'bg-ketchup hover:bg-red-300 focus:border-red-700 focus:shadow-outline-red active:bg-red-500 text-white'
                  : 'bg-gray-500 text-gray-700 cursor-default'
              }
                              h-full w-full text-white rounded-br-xl focus:outline-none transition duration-150 ease-in-out`}>
              <span className='w-auto h-auto'>START LESSON</span>
            </button>
    </div>
  );
};

export default Today;
