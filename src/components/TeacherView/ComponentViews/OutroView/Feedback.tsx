import React, { useContext, useState } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean 
    }

const Feedback = (props: props) => {
    const {  fullscreen } = props;
    const { theme } = useContext(LessonControlContext);
    const [ thumb, setThumb ] = useState('');

    const handleThumb = (item: string) => {
      setThumb(() => {
        if ( item === thumb ) { return '' }
        
        return item
      })
    }

    return(
        <div className={`${theme.gradient.cardBase} bg-dark-blue w-full h-4/10 flex flex-col items-start rounded-lg text-gray-200 p-4 border-l-8 border-green-light`}>
      <div className='h-2/10 w-full mb-4 flex justify-between items-center'>
        <div className={`${fullscreen ? 'text-xl' : 'text-sm'} w-7/10 font-open font-light text-blue-100 text-opacity-70`}>
          What did you think about the lesson?
        </div>
        <div className={`${fullscreen ? 'w-3/10' : 'w-4/10'} flex justify-center items-center`}>
        
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
        <textarea
          id='text'
          className={`${fullscreen ? 'text-lg' : 'text-sm'} bg-gray-300 w-full h-full p-2 text-md text-gray-800 rounded-lg `}
          // value={editInput.text} onChange={handleChange}
          placeholder='Do you have any comments?'
        />
      </div>
    </div>

        // <div className="bg-dark-blue w-full h-4.8/10 flex flex-col justify-between rounded-lg shadow-2 text-gray-200 p-4">
        //     <div className="h-2/10 w-full flex justify-between items-center">
        //         <div className={`${fullscreen ? 'text-xl' : 'text-base'} w-8/10 text-gray-200 font-open font-bold`}>
        //             What did you think about the lesson?
        //         </div>
        //         <div className={`${fullscreen ? 'w-2/10' : 'w-4/10'} flex justify-between items-center`}>
        //             <div className="cursor-pointer"> 
        //                 <IconContext.Provider value={{ color: '#519c51', size: '2rem'}}>
        //                     <FaThumbsUp />
        //                 </IconContext.Provider>
        //             </div>
        //             <div className="cursor-pointer">
        //                 <IconContext.Provider value={{ color: '#e62626d1', size: '2rem'}}>
        //                     <FaThumbsDown />
        //                 </IconContext.Provider>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="h-8/10 w-full">
        //         <div className={`${fullscreen ? 'text-lg' : 'text-sm'} h-2/10 w-full text-gray-200`}>
        //             Do you have any comments?
        //         </div>
        //         <textarea id="text" className="h-8/10 bg-gray-300 w-full p-2 text-md text-gray-800 rounded-lg shadow-2" 
        //         // value={editInput.text} onChange={handleChange}
        //         />
        //     </div>

        // </div>
    )
}

export default Feedback;
