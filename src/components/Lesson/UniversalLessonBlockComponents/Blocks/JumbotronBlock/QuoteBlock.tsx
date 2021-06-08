import React, {useState} from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {AiOutlineRead} from 'react-icons/ai';

interface QuoteBlockProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

const QuoteBlock = (props: QuoteBlockProps) => {
  const {title, subtitle, description} = props;
  const [heroIsActive, setHeroIsActive] = useState<boolean>(false);
  const [isToggled, setIsToggled] = useState<string[]>(['']);
  const [showReadMe, setShowReadMe] = useState<boolean>(true);

  // const quoteArray = state.data.lesson?.artist?.quotes;
  // const artistName = state.data.lesson?.artist?.name;
  // const title = state.data.lesson.title;
  // const artistBio = state.data.lesson?.artist?.bio;

  /**
   * Function for toggling hero description hover
   * @param e - Hover/click over hero image
   */
  const toggleHeroDescription = (e: React.MouseEvent) => {
    const t = e.currentTarget as HTMLElement;
    const targetWordID = t.id || '';

    if (!heroIsActive) {
      setHeroIsActive(true);
    } else {
      setHeroIsActive(false);
    }

    if (showReadMe) {
      setShowReadMe(false);
    }

    /**
     * Animation
     */
    setIsToggled([...isToggled, targetWordID]);

    setTimeout(() => {
      setIsToggled(
        isToggled.filter((targetString: string) => targetString !== targetWordID)
      );
    }, 300);
  };

  return (
    <div
      className={`relative w-full md:h-96 flex flex-grow items-center rounded text-gray-200`}
      onMouseEnter={toggleHeroDescription}
      onMouseLeave={toggleHeroDescription}>
      {/* READ ICON */}
      <div
        id="read-icon"
        className="absolute top-1 right-1 w-auto h-auto flex flex-row text-gray-200 z-50">
        <IconContext.Provider
          value={{size: '2rem', style: {width: 'auto', cursor: 'pointer'}}}>
          <AiOutlineRead
            style={{
              MozUserSelect: 'none',
              WebkitUserSelect: 'none',
              msUserSelect: 'none',
            }}
          />
        </IconContext.Provider>
      </div>

      <div className="h-full text-left flex flex-col rounded-lg items-start">
        {/* HOVER OVERLAY */}
        <div
          className={`
          ${
            heroIsActive
              ? 'visible opacity-100 bg-black50 overflow-y-auto'
              : 'invisible opacity-0'
          } 
          h-full w-full flex flex-col justify-start  p-4 transition-all duration-500 ease-in-out overflow-hidden rounded-lg`}>
          <p className="w-full leading-7 font-semibold">{title}</p>
        </div>

        {/* STANDARD HERO TEXT */}
        <div
          className={`
          ${heroIsActive ? 'opacity-0' : 'opacity-100'} 
          absolute bottom-0 opacity-100 h-full flex flex-col justify-end transition-all duration-500 ease-in-out`}>
          <div className="absolute bottom-0 left-0 p-2 h-auto mb-0 flex flex-col bg-gradient-to-r from-black20 rounded-b-lg">
            <div className="text-xl header-font  font-light">{title}</div>
            <div className="w-full text-4.5xl leading-none font-light">{subtitle}</div>
            <div className="text-xl header-font  font-light">"{description}"</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteBlock;
