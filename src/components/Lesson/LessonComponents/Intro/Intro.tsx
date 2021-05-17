import React, {useContext, useEffect} from 'react';
import {LessonContext} from '../../../../contexts/LessonContext';
import Banner from '../Banner';
import QuoteBlock from './QuoteBlock';
import Keyword from './Keyword';
import DoFirst from './DoFirst';
import Connect from './Connect';
import InstructionBlock from '../InstructionBlock';
import useDictionary from '../../../../customHooks/dictionary';
import {stripStyleFromHTML} from '../../../../utilities/strings';
import {LessonComponentsInterface} from '../../../../interfaces/LessonComponentsInterfaces';

const Intro = (props: LessonComponentsInterface) => {
  const {checkpointsItems} = props;
  const {state, theme, dispatch, clientKey, userLanguage} = useContext(LessonContext);
  const {lessonDict} = useDictionary(clientKey);

  const imgArray = state.data?.lesson?.artist?.images;
  const lessonType = state.data.lesson.type;

  useEffect(() => {
    dispatch({type: 'ACTIVATE_LESSON', payload: ''});
  }, []);

  /**
   *
   * SURVEY INTRO COMPONENT
   *
   */
  if (lessonType === 'survey' || lessonType === 'assessment') {
    return (
      <div className={theme.section}>
        <Banner
          title={state.data.lesson?.title && stripStyleFromHTML(state.data.lesson?.title)}
        />
        <Banner
          titleSection={
            state.data.lesson?.introductionTitle &&
            stripStyleFromHTML(state.data.lesson?.introductionTitle)
          }
        />
        <p
          className={`mb-1 text-gray-100 ${theme.elem.text}`}
          dangerouslySetInnerHTML={{
            __html:
              state.data.lesson?.introduction &&
              stripStyleFromHTML(state.data.lesson?.introduction),
          }}
        />
        <div className="flex flex-col justify-between items-center mt-4">
          <Banner
            titleSection={
              state.data.lesson?.instructionsTitle &&
              stripStyleFromHTML(state.data.lesson?.instructionsTitle)
            }
          />
          <InstructionBlock
            instructions={
              state.data.lesson.instructions &&
              stripStyleFromHTML(state.data.lesson.instructions)
            }
          />
        </div>
      </div>
    );
  }

  /**
   *
   * STANDARD INTRO COMPONENT
   *
   */
  return (
    <div className={theme.section}>
      <Banner title={state.data.lesson.title} iconName={'FaHourglassStart'} />
      <div
        className="h-96 flex flex-col mb-4 justify-between items-center bg-cover bg-right-top rounded-xl z-10"
        style={{backgroundImage: `url(${imgArray ? imgArray[0] : null})`}}>
        <QuoteBlock />
      </div>
      <Connect />
      <div className="flex flex-col justify-between items-center mt-4">
        <Keyword />
      </div>
      <div className="flex flex-col justify-between items-center mt-4">
        <DoFirst checkpointsItems={checkpointsItems} />
      </div>
    </div>
  );
};

export default Intro;
