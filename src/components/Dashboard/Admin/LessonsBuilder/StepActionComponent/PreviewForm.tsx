import React, { useState, useContext, useEffect, Fragment } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import ReactHtmlParser from 'react-html-parser';
import isEmpty from 'lodash/isEmpty';
import { BiChevronDown } from 'react-icons/bi';

import Buttons from '../../../../Atoms/Buttons';
import { GlobalContext } from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import ModalPopUp from '../../../../Molecules/ModalPopUp';

import * as queries from '../../../../../graphql/queries';
import * as customMutations from '../../../../../customGraphql/customMutations';
import * as customQueries from '../../../../../customGraphql/customQueries';

import { getTypeString } from '../../../../../utilities/strings';

interface PreviewFormProps {
  lessonName: string;
  enablePublish?: boolean;
  lessonID: string;
  lessonPlans: any;
  lessonType: string;
}
const PreviewForm = (props: PreviewFormProps) => {
  const { lessonName, enablePublish, lessonID, lessonPlans, lessonType } = props;
  const { userLanguage, clientKey } = useContext(GlobalContext);
  const { BUTTONS, PreviewFormDict } = useDictionary(clientKey);

  const [warnModal, setWarnModal] = useState({
    show: false,
    message: PreviewFormDict[userLanguage]['PREVIEW_DETAILS']['WARN_MESSAGE'],
  });
  const [loading, setLoading] = useState(false);
  const [relatedUnitsID, setRelatedUnitsID] = useState([]);
  const [lessonDetails, setLessonDetails] = useState<any>({});
  const [fetchingQuestionSequence, setFetchingQuestionSequence] = useState(false);

  const [message, setMessage] = useState({
    msg: '',
    isError: true,
  });

  const updateLessonPlan = async (syllabusLessonId: string, updatedLessonPlan: any) => {
    const input = {
      id: syllabusLessonId,
      lessonPlan: updatedLessonPlan,
    };
    const result: any = await API.graphql(graphqlOperation(customMutations.updateSyllabusLesson, { input: input }));
  };

  const updateAllLessonPlans = () => {
    const updatedLessonPlan = lessonPlans.map((item: any) => ({
      disabled: false,
      open: lessonType !== 'lesson' ? true : false,
      active: lessonType !== 'lesson' ? true : false,
      stage: `checkpoint?id=${item.LessonComponentID}`,
      type: 'survey',
      displayMode: 'SELF',
    }));
    let updatedPlans: any = Promise.all(
      relatedUnitsID.map(async (ID: string) => updateLessonPlan(ID, updatedLessonPlan))
    )
      .then((res) =>
        setMessage({
          ...message,
          isError: false,
          msg: PreviewFormDict[userLanguage]['MESSAGES']['UPDATESUCCESS'],
        })
      )
      .catch((err) =>
        setMessage({
          ...message,
          isError: true,
          msg: PreviewFormDict[userLanguage]['MESSAGES']['UPDATEERR'],
        })
      );
    toggleModal();
  };

  const toggleModal = () => {
    setWarnModal({
      ...warnModal,
      show: !warnModal.show,
    });
  };

  const publishAction = () => {
    if (relatedUnitsID?.length) {
      toggleModal();
    } else {
      setMessage({
        ...message,
        isError: false,
        msg: PreviewFormDict[userLanguage]['MESSAGES']['CONNECTERR'],
      });
    }
  };

  const fetchSyllabusLessonData = async () => {
    if (lessonID) {
      try {
        const result: any = await API.graphql(
          graphqlOperation(queries.listSyllabusLessons, {
            filter: { lessonID: { eq: lessonID } },
          })
        );
        const savedData = result?.data?.listSyllabusLessons?.items;
        if (savedData?.length) {
          const syllabusLessonId = savedData.map((item: any) => item.id);
          setRelatedUnitsID([...syllabusLessonId]);
        }
        setLoading(false);
      } catch {
        setMessage({
          ...message,
          isError: true,
          msg: PreviewFormDict[userLanguage]['MESSAGES']['FETCHERR'],
        });
      }
    }
  };

  const fetchLessonPreview = async () => {
    try {
      setLoading(true);
      const result: any = await API.graphql(
        graphqlOperation(customQueries.getCompleteLesson, {
          id: lessonID,
        })
      );
      const savedData: any = result.data.getLesson;
      setFetchingQuestionSequence(true);
      const checkpointSequence = await Promise.all(
        savedData?.checkpoints?.items?.map(async (checkpoint: any) => {
          let lessonplanSequence = savedData?.lessonPlan?.find(
            (item: any) => item.LessonComponentID === checkpoint?.checkpointID
          )?.sequence;

          let questionSequence: any = await API.graphql(
            graphqlOperation(queries.getCSequences, { id: `Ch_Ques_${checkpoint.checkpointID}` })
          );
          questionSequence = questionSequence?.data.getCSequences?.sequence || [];
          checkpoint?.checkpoint?.questions?.items.forEach((t: any) => {
            let index = questionSequence.indexOf(t.questionID);
            // console.log(index);
            t.index = index;
          });

          checkpoint?.checkpoint?.questions?.items.sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

          return {
            ...checkpoint,
            sequence: lessonplanSequence,
          };
        })
      );
      setFetchingQuestionSequence(false);

      checkpointSequence.sort((a: any, b: any) => (a.sequence > b.sequence ? 1 : -1));

      savedData.checkpoints = {
        items: checkpointSequence,
      };

      setLessonDetails({ ...savedData });
      setLoading(false);
    } catch {
      setMessage({
        ...message,
        isError: true,
        msg: PreviewFormDict[userLanguage]['MESSAGES']['UPDATEERR'],
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonPreview();
    fetchSyllabusLessonData();
  }, []);

  useEffect(() => {
    if (message?.msg) {
      setTimeout(() => {
        setMessage({
          ...message,
          isError: true,
          msg: '',
        });
      }, 3000);
    }
  }, [message.msg]);

  const fieldClass = 'p-3 flex justify-center items-center w-full border-b-0 border-gray-300';
  const QuestionList = ({ checkpItem, index }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const showListAndDropDown =
      checkpItem?.question?.type === 'selectMany' || checkpItem?.question?.type === 'selectOne';
    return (
      <div className="my-4 w-9/10 question__container">
        <div
          onClick={() => showListAndDropDown && setIsOpen(!isOpen)}
          role="button"
          className={`${
            isOpen ? 'border-indigo-300' : 'border-gray-200'
          } question__title border-0  p-2 px-4 rounded-md cursor-pointer hover:border-indigo-300 flex items-center justify-center w-full`}>
          <p className="w-9.3/10" key={checkpItem.id}>
            <span>
              {index + 1}.{checkpItem?.question?.question}{' '}
            </span>
            <span
              className={`py-0.5 px-1 ml-2 text-xs  rounded ${
                showListAndDropDown ? 'bg-indigo-200  text-indigo-700' : 'bg-red-200 text-red-700'
              }`}>
              {getTypeString(checkpItem?.question?.type)}
            </span>
          </p>
          {showListAndDropDown ? (
            <BiChevronDown className="text-gray-900 w-.7/10 text-lg" />
          ) : (
            <div className="w-.7/10" />
          )}
        </div>
        <div id="option__list" className={`px-12 py-2 option__list ${isOpen ? 'show' : 'hide'}`}>
          {showListAndDropDown && (
            <ul className="list-disc">
              {checkpItem?.question?.options?.map((opt: any) => (
                <li key={opt?.text}>{opt?.text}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4">
      <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
        <h3 style={{ color: '#374151' }} className="text-lg leading-6 font-semibold">
          {PreviewFormDict[userLanguage]['PREVIEW_DETAILS']['TITLE']} - {lessonName}
        </h3>
      </div>
      {loading || isEmpty(lessonDetails) ? (
        <div className="py-20 text-center mx-auto">
          <p>{PreviewFormDict[userLanguage]['FETCHING']}</p>
        </div>
      ) : (
        <Fragment>
          <div className="p-4 max-h-screen overflow-y-auto hide__scrollbar overflow-x-hidden w-full">
            <div className={fieldClass}>
              <h3 className="w-1/4 font-medium text-gray-500 text-base self-start">
                {PreviewFormDict[userLanguage]['PURPOSE']}
              </h3>
              <p className="w-3/4">{lessonDetails?.purpose ? ReactHtmlParser(lessonDetails?.purpose) : ''}</p>
            </div>
            <div className={fieldClass}>
              <h3 className="w-1/4 font-medium text-gray-500 text-base self-start">
                {PreviewFormDict[userLanguage]['OBJECTIVE']}:{' '}
              </h3>
              <p className="w-3/4">{lessonDetails?.objectives ? ReactHtmlParser(lessonDetails?.objectives[0]) : ''}</p>
            </div>
            <div className={fieldClass}>
              <h3 className="w-1/4 font-medium text-gray-500 text-base self-start">Welcome Message:</h3>
              {/* <h3 className="font-medium text-gray-500 text-base">{lessonDetails?.introductionTitle || ''}</h3> */}
              <p className="w-3/4">{lessonDetails?.introduction ? ReactHtmlParser(lessonDetails?.introduction) : ''}</p>
            </div>
            <div className={fieldClass}>
              <h3 className="w-1/4 font-medium text-gray-500 text-base self-start">
                {lessonType === 'survey' ? 'Survey' : 'Assessment'} Instructions:
              </h3>
              {/* <h3 className="font-medium text-gray-500 text-base">{lessonDetails?.instructionsTitle || ''}</h3> */}
              <p className="w-3/4">
                {lessonDetails?.instructions ? ReactHtmlParser(lessonDetails?.instructions[0]) : ''}
              </p>
            </div>
            <div className={'py-2 px-4 w-full'}>
              <h3 className="font-semibold text-gray-700 text-xl mb-2">
                {lessonType === 'survey' ? 'Survey' : 'Assessment'} :
              </h3>
              {lessonDetails?.checkpoints?.items?.length > 0 && !fetchingQuestionSequence ? (
                <div className="ml-8 mt-4">
                  {lessonDetails?.checkpoints?.items?.map((item: any) => (
                    <Fragment key={item.id}>
                      <h4 className="font-bold text-gray-900 text-base">
                        {item.checkpoint?.title || ''}
                        <br />
                        <span className="text-gray-700 text-sm font-semibold">{item.checkpoint?.subtitle || ''}</span>
                      </h4>
                      <div className="py-2">
                        <h4 className="font-bold text-gray-800 text-base"> {item.checkpoint?.instructionsTitle} </h4>
                        {item.checkpoint?.instructions ? ReactHtmlParser(item.checkpoint?.instructions) : ''}
                      </div>
                      <div>
                        {item.checkpoint?.questions?.items?.length > 0 ? (
                          <div className="py-2">
                            {item.checkpoint?.questions?.items?.map((checkpItem: any, index: number) => (
                              <QuestionList index={index} key={index} checkpItem={checkpItem} />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </Fragment>
                  ))}
                </div>
              ) : (
                <p className="w-3/4">{PreviewFormDict[userLanguage]['NOCHECKPOINT']}</p>
              )}
            </div>
            <div className="py-2 italic px-4">
              <h3 className="font-bold text-gray-900 text-base">{lessonDetails?.summaryTitle || ''}</h3>
              <Fragment>{lessonDetails?.introduction ? ReactHtmlParser(lessonDetails?.summary) : ''}</Fragment>
            </div>
          </div>
          {message ? (
            <div className="py-4 m-auto mt-2 text-center">
              <p className={`${message.isError ? 'text-red-600' : 'text-green-600'}`}> {message.msg} </p>
            </div>
          ) : null}
          {enablePublish && (
            <div className="w-2/10 mx-auto py-4">
              <Buttons btnClass="mx-auto w-full" onClick={publishAction} label={BUTTONS[userLanguage]['PUBLISH']} />
            </div>
          )}
          {warnModal.show && (
            <ModalPopUp
              closeAction={toggleModal}
              saveAction={updateAllLessonPlans}
              saveLabel={BUTTONS[userLanguage]['YES']}
              message={warnModal.message}
            />
          )}
        </Fragment>
      )}
    </div>
  );
};

export default PreviewForm;
