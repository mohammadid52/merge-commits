import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../../../../customGraphql/customMutations';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineSave } from 'react-icons/ai';

interface props {
  fullscreen: boolean
}

const SaveQuit = (props: props) => {
  const { fullscreen } = props;
  const { theme } = useContext(LessonControlContext);


  return (
    <div className='w-full flex flex-col my-4'>
      <button
        type="submit"
        className={`self-center w-auto px-4 h-10 font-semibold bg-blueberry hover:bg-blue-500 hover:text-underline text-white flex justify-center items-center rounded-full my-4`}
      >
        <IconContext.Provider value={{ className: 'w-auto mr-2', style: { cursor: 'pointer' } }}>
          <AiOutlineSave size={24}/>
        </IconContext.Provider>
        <div>Save and Go to Dashboard</div>
      </button>
    </div>
  );
};

export default SaveQuit;
