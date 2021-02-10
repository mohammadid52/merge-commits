import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import ContentCard from '../../Atoms/ContentCard';

interface ContentCardProps {
  subSection: string;
  content?: {
    type?: string;
    title: string;
    subTitle?: string;
    description?: string;
    content?: string;
  };
}

const AnthologyContent = (props: ContentCardProps) => {
  const { subSection, content } = props;
  const { theme } = useContext(GlobalContext);
  return (
    <>
      <ContentCard>
        <div className={`flex flex-col p-2`}>
          <div className={`flex`}>
            <span>Lesson: Lesson Title</span>
            <span className={`${theme.lessonCard.subtitle}`}>Last updated date</span>
          </div>
          <div className={`flex flex-row justify-start items-center`}>
            <h4 className={`w-auto text-xl font-semibold mr-4`}>{`"My ${subSection} title"`}</h4>
            <p className={`w-auto `}>{`Just a ${subSection} subtitle`}</p>
          </div>
          {
            (()=>{
              if(subSection !== 'Poems'){
                return (
                  <div className={`h-12 text-overflow ellipsis`}>
                    Most of The Sorrows of Young Werther, a story about unrequited love, is presented as a collection of letters
                    written by Werther, a young artist of a sensitive and passionate temperament, to his friend Wilhelm.
                  </div>
                )
              }
            })()
          }
          <div>
            <p className={`cursor-pointer font-semibold text-blueberry`}>View/Edit</p>
          </div>
        </div>
      </ContentCard>
    </>
  );
};

export default AnthologyContent;
