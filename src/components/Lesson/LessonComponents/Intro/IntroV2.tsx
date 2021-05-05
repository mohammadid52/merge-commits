import React, {useContext, useEffect, useState} from 'react';
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
import findIndex from 'lodash/findIndex';
import Checkpoint from '../../AssessmentComponents/Checkpoint';
import {useLocation} from 'react-router';
import SurveyOutro from '../../AssessmentComponents/SurveyOutro';
import SaveQuit from '../Outro/SaveQuit';
import useUrlState from '@ahooksjs/use-url-state';
import {BsArrowRight, BsArrowLeft} from 'react-icons/bs';
import Tooltip from '../../../Atoms/Tooltip';

const Intro = (props: LessonComponentsInterface) => {
  const {checkpointsItems} = props;
  const {
    state,
    theme,
    dispatch,
    clientKey,
    userLanguage,
    pageList,
    currentPage,
    setCurrentPage,
  } = useContext(LessonContext);
  const {lessonDict} = useDictionary(clientKey);
  const location = useLocation();

  const imgArray = state.data?.lesson?.artist?.images;
  const lessonType = state.data.lesson.type;

  useEffect(() => {
    dispatch({type: 'ACTIVATE_LESSON', payload: ''});
  }, []);

  const currentPageIdx = findIndex(pageList, (item: any) => item.id === currentPage.id);

  const [urlState] = useUrlState({roomId: ''});
  const {roomId} = urlState;

  const onBack = () => {
    const curPage = pageList[currentPageIdx - 1];
    setCurrentPage(curPage);
  };
  const onNext = () => {
    const curPage = pageList[currentPageIdx + 1];
    setCurrentPage(curPage);
  };

  const isLastPage = currentPageIdx === pageList.length - 1;
  const isNotFirstPage = currentPageIdx > 0;

  const [fromClosing, setFromClosing] = useState(false);

  // To get back to the last checkpoint not first checkpoint from closing section
  useEffect(() => {
    if (currentPage.name === 'closing') {
      setFromClosing(true);
    } else {
      setFromClosing(false);
    }
  }, [currentPage.name]);

  /**
   *
   * SURVEY INTRO COMPONENT
   *
   */

  if (lessonType === 'survey' || lessonType === 'assessment') {
    return (
      <div className={`${theme.section}`}>
        <Banner
          animate
          titleCenter
          title={state.data.lesson?.title && stripStyleFromHTML(state.data.lesson?.title)}
        />
        <div
          style={{minHeight: '80vh'}}
          className="flex items-center w-auto flex-col justify-center">
          {currentPage.name === 'message' && (
            <>
              <Banner
                animate
                titleSection={
                  state.data.lesson?.introductionTitle &&
                  stripStyleFromHTML(state.data.lesson?.introductionTitle)
                }
              />
              <div>
                <p
                  className={`mb-1 text-gray-100 fade__animation2 ${theme.elem.text}`}
                  dangerouslySetInnerHTML={{
                    __html:
                      state.data.lesson?.introduction &&
                      stripStyleFromHTML(state.data.lesson?.introduction),
                  }}
                />
              </div>
            </>
          )}
          {currentPage.name === 'instructions' && (
            <>
              <Banner
                animate
                titleSection={
                  state.data.lesson?.instructionsTitle &&
                  stripStyleFromHTML(state.data.lesson?.instructionsTitle)
                }
              />
              <InstructionBlock
                animate
                instructions={
                  state.data.lesson.instructions &&
                  stripStyleFromHTML(state.data.lesson.instructions)
                }
              />
            </>
          )}
          {currentPage.name === 'closing' && (
            <>
              <SurveyOutro animate />
              <SaveQuit roomID={roomId} />
            </>
          )}
          {currentPage.name === 'checkpoints' && (
            <Checkpoint
              fromClosing={fromClosing}
              isTeacher={false}
              checkpointsItems={checkpointsItems}
            />
          )}

          {currentPage.name !== 'checkpoints' && (
            <div
              className={`flex mt-4 items-center  ${
                isLastPage || !isNotFirstPage ? 'justify-center' : 'justify-between'
              } text-white `}>
              {isNotFirstPage && !isLastPage && (
                <div
                  onClick={onBack}
                  className="px-2 py-1 border-0 pageChange__btn border-sea-green rounded hover:bg-sea-green transition-all cursor-pointer flex items-center ">
                  <Tooltip
                    text={`${pageList[currentPageIdx - 1].name} section`}
                    placement="bottom">
                    <div className="flex back-content items-center">
                      <BsArrowLeft color="#fff" />
                      <p className="ml-2">Back</p>
                    </div>
                  </Tooltip>
                </div>
              )}
              {!isLastPage && (
                <div
                  onClick={onNext}
                  className="px-2 py-1 border-0 border-sea-green rounded hover:bg-transparent bg-sea-green pageChange__btn transition-all cursor-pointer flex items-center">
                  <Tooltip
                    text={`${pageList[currentPageIdx + 1].name} section`}
                    placement="bottom">
                    <div className="flex next-content items-center">
                      <p className="mr-2">Next</p>
                      <BsArrowRight color="#fff" />
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>
          )}
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
