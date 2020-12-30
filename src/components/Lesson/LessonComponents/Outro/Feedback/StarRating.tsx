import React, { useEffect, useState } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

interface StarRatingProps {
  isRated: boolean;
  setIsRated: React.Dispatch<React.SetStateAction<boolean>>;
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
  handleStarRating: () => void;
}

const StarRating: React.FC<StarRatingProps> = (props: StarRatingProps) => {
  const { isRated, setIsRated, rating, setRating, handleStarRating } = props;
  const [whichStarRating, setWhichStarRating] = useState<number>(0);
  const [whichStarHovered, setWhichStarHovered] = useState<number>(0);

  const ratings = ['1', '2', '3', '4', '5'];

  const handleStarHover = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;

    if (ratings.includes(t.id)) {
      setWhichStarHovered(parseInt(t.id));
    }
  };

  const handleStarLeave = () => {
    setWhichStarHovered(0);
  };

  const handleStarRate = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;

    if (ratings.includes(t.id)) {
      setIsRated(true);
      setRating(parseInt(t.id));
    }
  };

  /**
   *
   * USEEFFECTS
   *
   */

  useEffect(() => {
    // if (isRated) {
    //   setWhichStarRating(rating);
    // }
  }, []);

  return (
    <div
      className="w-auto flex flex-row"
      onPointerOver={handleStarHover}
      onPointerLeave={handleStarLeave}
      onClick={handleStarRate}
    >
      <div id={`1`} className={`w-auto`}>
        <IconContext.Provider value={{ color: '#ffffff', size: '1.5rem' }}>
          {whichStarHovered >= 1 || (isRated && rating >= 1) ? (
            <AiFillStar id="1" style={{ pointerEvents: 'none' }} />
          ) : (
            <AiOutlineStar id="1" style={{ pointerEvents: 'none' }} />
          )}
        </IconContext.Provider>
      </div>

      <div id={`2`} className={`w-auto`}>
        <IconContext.Provider value={{ color: '#ffffff', size: '1.5rem' }}>
          {whichStarHovered >= 2 || (isRated && rating >= 2) ? (
            <AiFillStar id="2" style={{ pointerEvents: 'none' }} />
          ) : (
            <AiOutlineStar id="2" style={{ pointerEvents: 'none' }} />
          )}
        </IconContext.Provider>
      </div>

      <div id={`3`} className={`w-auto`}>
        <IconContext.Provider value={{ color: '#ffffff', size: '1.5rem' }}>
          {whichStarHovered >= 3 || (isRated && rating >= 3) ? (
            <AiFillStar id="3" style={{ pointerEvents: 'none' }} />
          ) : (
            <AiOutlineStar id="3" style={{ pointerEvents: 'none' }} />
          )}
        </IconContext.Provider>
      </div>

      <div id={`4`} className={`w-auto`}>
        <IconContext.Provider value={{ color: '#ffffff', size: '1.5rem' }}>
          {whichStarHovered >= 4 || (isRated && rating >= 4) ? (
            <AiFillStar id="4" style={{ pointerEvents: 'none' }} />
          ) : (
            <AiOutlineStar id="4" style={{ pointerEvents: 'none' }} />
          )}
        </IconContext.Provider>
      </div>

      <div id={`5`} className={`w-auto`}>
        <IconContext.Provider value={{ color: '#ffffff', size: '1.5rem' }}>
          {whichStarHovered >= 5 || (isRated && rating >= 5) ? (
            <AiFillStar id="5" style={{ pointerEvents: 'none' }} />
          ) : (
            <AiOutlineStar id="5" style={{ pointerEvents: 'none' }} />
          )}
        </IconContext.Provider>
      </div>
    </div>
  );
};

export default StarRating;
