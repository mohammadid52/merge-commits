import React, {useState, useEffect} from 'react';

interface RatingCard {
  lessonProps: any;
  user: any;
  getLessonRating?: (lessonId: string, userEmail: string, userAuthId: string) => any;
  handleLessonMutationRating?: (lessonID: string, ratingValue: string) => void;
}

const StarRating = ({
  lessonProps,
  user,
  handleLessonMutationRating,
  getLessonRating
}: RatingCard) => {
  const [rating, setRating] = useState<any>();
  const [hover, setHover] = useState<any>();

  useEffect(() => {
    getLessonRating(lessonProps.lesson.id, user.email, user.authId).then((value: any) => {
      if (value) {
        setRating(value.ratingValue);
      }
    });
  }, []);

  useEffect(() => {
    handleLessonMutationRating(lessonProps.lesson.id, rating);
  }, [rating]);
  return (
    <div className="flex justify-end px-4 gap-1">
      <span className="w-auto mr-2 font-light text-gray-500">Rate Lesson</span>
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? 'rating on' : 'rating off'}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}>
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
};

export default React.memo(StarRating);
