import React, {useEffect, useState} from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {AiFillStar, AiOutlineStar} from 'react-icons/ai';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';

interface StarRatingBlockProps {
  id?: string;
  inputID?: string;
  label?: string;
}

const StarRatingBlock = (props: StarRatingBlockProps) => {
  const {id, inputID, label} = props;
  const [isRated, setIsRated] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [whichStarHovered, setWhichStarHovered] = useState<number>(0);
  const {builderTheme, themeTextColor} = useULBContext();

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

  const iconColor = builderTheme === 'light' ? 'gray' : '#ffffff';
  return (
    <div id={id} key={inputID} className={`mb-4 p-4`}>
      <label className={`text-sm ${themeTextColor} my-2`} htmlFor="label">
        {label}
      </label>
      <div
        className="w-auto flex flex-row flex-start"
        onPointerOver={handleStarHover}
        onPointerLeave={handleStarLeave}
        onClick={handleStarRate}>
        <div id={`1`} className={`w-auto`}>
          <IconContext.Provider value={{color: iconColor}}>
            {whichStarHovered >= 1 || (isRated && rating >= 1) ? (
              <AiFillStar size={24} id="1" style={{pointerEvents: 'none'}} />
            ) : (
              <AiOutlineStar size={24} id="1" style={{pointerEvents: 'none'}} />
            )}
          </IconContext.Provider>
        </div>

        <div id={`2`} className={`w-auto`}>
          <IconContext.Provider value={{color: iconColor}}>
            {whichStarHovered >= 2 || (isRated && rating >= 2) ? (
              <AiFillStar size={24} id="2" style={{pointerEvents: 'none'}} />
            ) : (
              <AiOutlineStar size={24} id="2" style={{pointerEvents: 'none'}} />
            )}
          </IconContext.Provider>
        </div>

        <div id={`3`} className={`w-auto`}>
          <IconContext.Provider value={{color: iconColor}}>
            {whichStarHovered >= 3 || (isRated && rating >= 3) ? (
              <AiFillStar size={24} id="3" style={{pointerEvents: 'none'}} />
            ) : (
              <AiOutlineStar size={24} id="3" style={{pointerEvents: 'none'}} />
            )}
          </IconContext.Provider>
        </div>

        <div id={`4`} className={`w-auto`}>
          <IconContext.Provider value={{color: iconColor}}>
            {whichStarHovered >= 4 || (isRated && rating >= 4) ? (
              <AiFillStar size={24} id="4" style={{pointerEvents: 'none'}} />
            ) : (
              <AiOutlineStar size={24} id="4" style={{pointerEvents: 'none'}} />
            )}
          </IconContext.Provider>
        </div>

        <div id={`5`} className={`w-auto`}>
          <IconContext.Provider value={{color: iconColor}}>
            {whichStarHovered >= 5 || (isRated && rating >= 5) ? (
              <AiFillStar size={24} id="5" style={{pointerEvents: 'none'}} />
            ) : (
              <AiOutlineStar size={24} id="5" style={{pointerEvents: 'none'}} />
            )}
          </IconContext.Provider>
        </div>
      </div>
    </div>
  );
};

export default StarRatingBlock;
