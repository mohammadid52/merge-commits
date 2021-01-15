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
  lessonKey: any;
  open: boolean;
  accessible: boolean;
}

const Today: React.FC<Props> = (props: Props) => {
  const { lessonKey, open, accessible } = props;
  const history = useHistory();
  const { theme } = useContext(GlobalContext);

  const handleLink = () => {
    if (accessible && open) {
      history.push(`${`/lesson?id=${lessonKey}`}`);
    }
  };

  return (
    <div>
      <button
        type="submit"
        onClick={handleLink}
        className={`${
          accessible && open
            ? 'bg-ketchup hover:bg-red-300 focus:border-red-700 focus:shadow-outline-red active:bg-red-500 text-white'
            : 'bg-gray-500 text-gray-700 cursor-default'
        }
                              h-full w-full text-white rounded-br focus:outline-none transition duration-150 ease-in-out`}>
        <span className="w-auto h-auto">START LESSON</span>
      </button>
    </div>
  );
};

export default Today;
