import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import ContentCard from '../../Atoms/ContentCard';
import { AnthologyContentType } from '../../../customHooks/timer';

interface ContentCardProps {
  subSection: string;
  content?: any
}

const AnthologyContent = (props: ContentCardProps) => {
  const { subSection, content } = props;
  const { theme } = useContext(GlobalContext);

  return (
    <>
      {
        content.length > 0 ?
          (content.map((contentObj: AnthologyContentType, idx: number) => (
              <ContentCard key={`anthology_${subSection}${idx}`}>
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
                        return (
                          <div className={`h-12 overflow-ellipsis overflow-hidden ellipsis`}>
                            {contentObj.content}
                          </div>
                        )
                    })()
                  }

                  <div>
                    <p className={`cursor-pointer font-semibold text-blueberry`}>View/Edit</p>
                  </div>
                </div>
              </ContentCard>
            ))
          ):(
            <ContentCard>
              No content for this section :(
            </ContentCard>
          )
      }

    </>
  );
};

export default AnthologyContent;
