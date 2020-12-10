import React, {useContext, useEffect, useState} from 'react';
import {LessonContext} from '../../../../contexts/LessonContext';
import StarRating from './Feedback/StarRating';

interface FeedbackProps {
    setFeedback: React.Dispatch<React.SetStateAction<{
        like: string;
        text: string;
    }>>;
}

const Feedback = (props: FeedbackProps) => {
    const {theme, state} = useContext(LessonContext);
    const {setFeedback} = props;
    const [thumb, setThumb] = useState('');
    const [feedbackText, setFeedbackText] = useState('');
    const [isRated, setIsRated] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(0);

    // const handleThumb = (item: string) => {
    //     setThumb(() => {
    //         if (item === thumb) {
    //             return '';
    //         }
    //
    //         return item;
    //     });
    // };

    const handleTextChange = (e: { target: { value: string } }) => {
        const {value} = e.target;

        setFeedbackText(value);
    };

    useEffect(() => {
        const stringRating = rating.toString();

        setFeedback(() => {
            return {
                like: stringRating,
                text: feedbackText,
            };
        });
    }, [rating, feedbackText]);

    return (
        <div className={`w-full h-full rounded-xl`}>
            <div className={`w-full`}>
                <div className={`w-full flex flex-row text-xl ${theme.banner} border-b-4 border-sea-green`}>

                    <h3>What did you think about the {state.data.lesson.type}?</h3>

                    <StarRating
                        isRated={isRated}
                        setIsRated={setIsRated}
                        rating={rating}
                        setRating={setRating}
                        handleStarRating={() => console.log('handleStarRating(): ', ' test ')}
                    />

                    {/* <div
            className={`text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 cursor-pointer`}
            onClick={() => handleThumb('up')}>
            {thumb === 'up' ? (
              <IconContext.Provider value={{ color: '#519c51', size: '1.5rem' }}>
                <FaThumbsUp />
              </IconContext.Provider>
            ) : (
              <IconContext.Provider value={{ color: '#666666bf', size: '1.5rem' }}>
                <FaThumbsUp />
              </IconContext.Provider>
            )}
          </div>
          <div
            className={`text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 cursor-pointer`}
            onClick={() => handleThumb('down')}>
            {thumb === 'down' ? (
              <IconContext.Provider value={{ color: '#e62626d1', size: '1.5rem' }}>
                <FaThumbsDown />
              </IconContext.Provider>
            ) : (
              <IconContext.Provider value={{ color: '#666666bf', size: '1.5rem' }}>
                <FaThumbsDown />
              </IconContext.Provider>
            )}
          </div> */}

                </div>
            </div>

            <div className='w-full'>
        <textarea
            id='text'
            className={`h-40 ${theme.elem.textInput} w-full rounded-xl`}
            value={feedbackText}
            onChange={handleTextChange}
            placeholder='Do you have any comments?'
        />
            </div>
        </div>
    );
};

export default Feedback;
