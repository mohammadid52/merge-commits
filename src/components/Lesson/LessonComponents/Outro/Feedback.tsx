import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import StarRating from './Feedback/StarRating';

interface FeedbackProps {
  setFeedback: React.Dispatch<
    React.SetStateAction<{
      like: string;
      text: string;
    }>
  >;
}

const Feedback = (props: FeedbackProps) => {
  const { theme, state } = useContext(LessonContext);
  const { setFeedback } = props;
  const [thumb, setThumb] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isRated, setIsRated] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);

  const handleTextChange = (e: { target: { value: string } }) => {
    const { value } = e.target;

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
        </div>
      </div>

      <h3
        className={`w-full text-lg w-auto relative font-open font-light text-left flex flex-row items-center text-gray-200 border-b border-white border-opacity-10 pb-2 my-6`}>
        Rating:
      </h3>

      <StarRating
        isRated={isRated}
        setIsRated={setIsRated}
        rating={rating}
        setRating={setRating}
        handleStarRating={() => console.log('handleStarRating(): ', ' test ')}
      />

      <h3
        className={`w-full text-lg w-auto relative font-open font-light text-left flex flex-row items-center text-gray-200  mb-2 mt-6`}>
        Feedback:
      </h3>

      <div className="w-full">
        <textarea
          id="text"
          className={`h-40 ${theme.elem.textInput} w-full rounded-xl`}
          value={feedbackText}
          onChange={handleTextChange}
          placeholder="Do you have any comments?"
        />
      </div>
    </div>
  );
};

export default Feedback;
