import React, { useContext, useState } from 'react';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';
import StarRating from '../../../Lesson/LessonComponents/Outro/Feedback/StarRating';

interface props {
  fullscreen: boolean;
}

const Feedback = (props: props) => {
  const { fullscreen } = props;
  const { state, theme } = useContext(LessonControlContext);
  const [thumb, setThumb] = useState('');
  const [isRated, setIsRated] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);

  return (
    <div className={`w-full h-full rounded-xl`}>
      <div className={`w-full`}>
        <div className={`w-full flex flex-row text-xl ${theme.banner} border-b-4 border-sea-green`}>
          <h3>What did you think about the {state.data.lesson.type}?</h3>
        </div>
      </div>

      <h3
        className={`w-full text-lg w-auto relative font-open font-light text-left flex flex-row items-center text-gray-200 border-b-0 border-white border-opacity-10 pb-2 my-6`}>
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
          placeholder="Do you have any comments?"
        />
      </div>
    </div>
  );
};

export default Feedback;
