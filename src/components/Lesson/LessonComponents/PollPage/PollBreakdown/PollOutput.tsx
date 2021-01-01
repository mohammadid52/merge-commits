import React, { useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';

/**
 * Module imports
 */
import { PollInput } from '../PollModules/PollActivity';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface PollOutputProps {
  isTeacher?: boolean;
  dataProps?: {
    pollInputs?: PollInput[];
    poll?: PollInput[];
    additional: any;
  };
}

const PollOutput = (props: PollOutputProps) => {
  /**
   * Teacher switch
   */
  const { isTeacher, dataProps } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme } = switchContext;

  /**
   * Function which retrieves the 'option' string for the poll question,
   * this is first gets the poll question from the array,
   * then the specific option string is returned if an answer was given for that question
   * @param pollQuestionID
   * @param pollOptionID
   */
  const getOption = (pollQuestionID: number, pollOptionID: string) => {
    const questionOptions = state.data.lesson.warmUp.inputs.pollInputs[pollQuestionID]['option'];
    const questionAnswer = questionOptions.filter((option: { id: string; isChoice: boolean; option: string }) => {
      console.log('questionAnswer Filter -> ', option.id, '  ', pollOptionID);
      return option.id === pollOptionID ? option : null;
    });

    return questionAnswer.length > 0 ? questionAnswer[0].option : 'No answer given...';
  };

  return (
    <>
      {/**
       *
       * Below will iterate over the questions one - by - one,
       * If there's an answer to the poll, it will be displayed
       *
       */}
      <div className={`w-full flex flex-col`}>
        {dataProps && dataProps.pollInputs ? (
          dataProps.pollInputs.map((item: { id: string; question: string; option: any }, key: number) => {
            {
              console.log('item.option -> ', item.option);
            }

            return (
              <div key={`polloutput_${key}`} className={`py-4`}>
                <div className={`${theme.elem.text}`}>{`${item.question}:`}</div>
                <div className={`${theme.elem.text} ${theme.blockQuote}`}>
                  {item.option[0].hasOwnProperty('id') ? getOption(key, item.option[0].id) : 'No answer given...'}
                </div>
              </div>
            );
          })
        ) : dataProps && dataProps.poll ? (
          dataProps.poll.map((item: { id: string; question: string; option: any }, key: number) => {
            console.log('item.option -> ', item.option);

            return (
              <div key={`polloutput_${key}`} className={`py-4`}>
                <div className={`${theme.elem.text}`}>{`${item.question}:`}</div>
                <div className={`${theme.elem.text} ${theme.blockQuote}`}>
                  {item.option[0].hasOwnProperty('id') ? getOption(key, item.option[0].id) : 'No answer given...'}
                </div>
              </div>
            );
          })
        ) : (
          <div key={`polloutput_0`} className={`py-4`}>
            {console.log('PollOutput, no dataprops? ', dataProps)}
            <div className={`${theme.elem.text} ${theme.blockQuote}`}>You did not answer the poll :(</div>
          </div>
        )}
      </div>
    </>
  );
};

export default PollOutput;
