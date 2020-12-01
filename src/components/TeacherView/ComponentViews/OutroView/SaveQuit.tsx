import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../../../../customGraphql/customMutations';

interface props {
        fullscreen: boolean
    }

const SaveQuit = (props: props) => {    
  const {  fullscreen } = props;
  const { theme } = useContext(LessonControlContext);
  

  return (
    <div className='w-full flex flex-col mt-4'>
    <button
      type='submit'
      className={`self-center w-auto px-3 h-8 bg-yellow-500 text-gray-900 font-bold flex justify-center items-center rounded-xl mt-4 ${theme.elem.text}`}
      /* onClick={() => setAlert(!alert)} */>
      Save and Go to Dashboard
    </button>
  </div>
  );
};

export default SaveQuit;
