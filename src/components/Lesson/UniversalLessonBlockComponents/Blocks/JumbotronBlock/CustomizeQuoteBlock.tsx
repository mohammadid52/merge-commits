import React, {useState} from 'react';
import {AiOutlineRead} from 'react-icons/ai';

interface QuoteBlockProps {
  title?: string;
  subtitle?: string;
  description?: string;
  styles?: string;
  bgClass?: string;
  textClass?: string;
}

const CustomizedQuoteBlock = (props: QuoteBlockProps) => {
  const {title, subtitle, bgClass, textClass, description} = props;
  const [heroIsActive, setHeroIsActive] = useState<boolean>(false);
  const [isToggled, setIsToggled] = useState<string[]>(['']);
  const [showReadMe, setShowReadMe] = useState<boolean>(true);

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
      className={`relative ${bgClass} w-full md:h-96 flex flex-grow items-center rounded text-white`}
      onMouseEnter={toggleHeroDescription}
      onMouseLeave={toggleHeroDescription}>
      {/* READ ICON */}
      {description ? (
        <div
          id="read-icon"
          className="absolute top-1 right-1 w-auto h-auto flex flex-row text-white z-50">
          <AiOutlineRead className="w-auto cursor-pointer" size={'2rem'} />
        </div>
      ) : null}

      <div className="h-full w-full text-left flex flex-col rounded-lg items-start">
        {/* HOVER OVERLAY */}
        <div
          className={`
          ${
            heroIsActive
              ? 'visible opacity-100 bg-black50 overflow-y-auto'
              : 'invisible opacity-0'
          } 
          h-full w-full flex flex-col justify-start  p-4 transition-all duration-500 ease-in-out overflow-hidden rounded-lg`}>
          <p className="w-full text-xl leading-7 font-semibold">{title}</p>
          {description ? (
            <div
              dangerouslySetInnerHTML={{__html: `"${description}"`}}
              className="header-font leading-5 font-light"></div>
          ) : null}
        </div>

        {/* STANDARD HERO TEXT */}

        <div
          className={`
          ${
            heroIsActive ? 'opacity-0' : `opacity-100`
          } absolute bottom-0 opacity-100 h-full w-full flex flex-col justify-end transition-all duration-500 ease-in-out`}>
          <div
            className={`${textClass} absolute w-full bottom-0 left-0 p-4 h-auto mb-0 flex flex-col bg-gradient-to-r from-black20 rounded-b-lg  `}>
            <div
              dangerouslySetInnerHTML={{__html: title || ''}}
              className=" text-base sm:text-lg lg:text-xl xl:text-2xl  font-medium"></div>
            <div
              dangerouslySetInnerHTML={{__html: subtitle || ''}}
              className="w-full text-lightest text-sm sm:text-base lg:text-lg xl:text-lg font-regular"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizedQuoteBlock;
