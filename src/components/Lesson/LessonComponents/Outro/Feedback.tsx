import React, { useContext, useState, useEffect } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';

interface FeedbackProps {
  setFeedback: React.Dispatch<React.SetStateAction<{
    like: string;
    text: string;
  }>>
}

const Feedback = (props: FeedbackProps) => {
  const { theme, state } = useContext(LessonContext);
  const { setFeedback } = props;
  const [ thumb, setThumb ] = useState('');
  const [ feedbackText, setFeedbackText ] = useState('');

  const handleThumb = (item: string) => {
    setThumb(() => {
      if ( item === thumb ) { return '' }
      
      return item 
    })
  }

  const handleTextChange = (e: { target: { value: string }}) => {
    const { value } = e.target;

    setFeedbackText(value)
  }

  useEffect(() => {
    setFeedback(() => {
      return {
        like: thumb,
        text: feedbackText,
      }
    })
  }, [thumb, feedbackText])
  
  return (
    <div className={`${theme.gradient.cardBase} bg-dark-blue w-full h-4/10 flex flex-col items-start rounded-lg text-gray-200 p-4 border-l-8 border-green-light`}>
      <div className='h-2/10 w-full mb-4 flex justify-between items-center'>
        <div className='w-7/10 text-xl font-open font-light text-base text-blue-100 text-opacity-70'>
          What did you think about the { state.data.lesson.type }?
        </div>
        <div className='w-3/10 flex justify-center items-center'>
          <div className='cursor-pointer w-3/10' onClick={() => handleThumb('up')}>
            {thumb === 'up' ?
            <IconContext.Provider value={{ color: '#519c51', size: '2.5rem' }}>
              <FaThumbsUp />
            </IconContext.Provider> :
            <IconContext.Provider value={{ color: '#666666bf', size: '2rem' }}>
            <FaThumbsUp />
          </IconContext.Provider>
            } 
          </div>
          <div className='cursor-pointer w-3/10' onClick={() => handleThumb('down')}>
            {thumb === 'down' ? 
             <IconContext.Provider value={{ color: '#e62626d1', size: '2.5rem' }}>
             <FaThumbsDown />
           </IconContext.Provider> : 
            <IconContext.Provider value={{ color: '#666666bf', size: '2rem' }}>
            <FaThumbsDown />
          </IconContext.Provider>
            }
           
          </div>
        </div>
      </div>
      <div className='h-6/10 w-full'>
        {/* <div className='h-2/10 w-full text-lg font-light text-base text-blue-100 text-opacity-70'>
          Do you have any comments?
        </div> */}
        <textarea
          id='text'
          className='bg-gray-300 w-full h-full p-2 text-md text-gray-800 rounded-lg'
          value={feedbackText} onChange={handleTextChange}
          placeholder='Do you have any comments?'
        />
      </div>
    </div>
  );
};

export default Feedback;
