import React, { useState, useContext, useEffect, Fragment } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import ReactHtmlParser from 'react-html-parser';

import Buttons from '../../../../Atoms/Buttons';
import { GlobalContext } from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import ModalPopUp from '../../../../Molecules/ModalPopUp';

import * as queries from '../../../../../graphql/queries';
import * as customMutations from '../../../../../customGraphql/customMutations';
import * as customQueries from '../../../../../customGraphql/customQueries';

import { getTypeString } from '../../../../../utilities/strings';

interface PreviewFormProps {
  lessonName: string
  enablePublish?: boolean
  lessonID: string
  lessonPlans: any
  lessonType: string
}
const PreviewForm = (props: PreviewFormProps) => {
  const { lessonName, enablePublish, lessonID, lessonPlans, lessonType } = props;
  const { userLanguage, clientKey } = useContext(GlobalContext);
  const { BUTTONS, PreviewFormDict } = useDictionary(clientKey);

  const [warnModal, setWarnModal] = useState({
    show: false,
    message: PreviewFormDict[userLanguage]['PREVIEW_DETAILS']['WARN_MESSAGE']
  })
  const [loading, setLoading] = useState(false);
  const [relatedUnitsID, setRelatedUnitsID] = useState([]);
  const [lessonDetails, setLessonDetails] = useState<any>({});
 
  const [message, setMessage] = useState({
    msg: '',
    isError: true
  })

  const updateLessonPlan = async (syllabusLessonId: string, updatedLessonPlan: any) => {
    const input = {
      id: syllabusLessonId,
      lessonPlan: updatedLessonPlan
    }
    const result: any = await API.graphql(graphqlOperation(customMutations.updateSyllabusLesson, { input: input }));
  }

  const updateAllLessonPlans = () => {
    const updatedLessonPlan = lessonPlans.map((item: any) => ({
      disabled: false,
      open: lessonType !== 'lesson' ? true : false,
      active: lessonType !== 'lesson' ? true : false,
      stage: `checkpoint?id=${item.LessonComponentID}`,
      type: 'survey',
      displayMode: 'SELF',
    }))
    let updatedPlans: any = Promise.all(
      relatedUnitsID.map(async (ID: string) => updateLessonPlan(ID, updatedLessonPlan))
    ).then(res => setMessage({
      ...message,
      isError: false,
      msg: PreviewFormDict[userLanguage]['MESSAGES']['UPDATESUCCESS']
    })).catch(err => setMessage({
      ...message,
      isError: true,
      msg: PreviewFormDict[userLanguage]['MESSAGES']['UPDATEERR']
    }))
    toggleModal();
  }

  const toggleModal = () => {
    setWarnModal({
      ...warnModal,
      show: !warnModal.show
    })
  }

  const publishAction = () => {
    if (relatedUnitsID?.length) {
      toggleModal();
    } else {
      setMessage({
        ...message,
        isError: false,
        msg: PreviewFormDict[userLanguage]['MESSAGES']['CONNECTERR']
      });
    }
  }

  const fetchSyllabusLessonData = async () => {
    if (lessonID) {
      try {
        const result: any = await API.graphql(graphqlOperation(queries.listSyllabusLessons, {
          filter: { lessonID: { eq: lessonID } }
        }))
        const savedData = result?.data?.listSyllabusLessons?.items;
        if (savedData?.length) {
          const syllabusLessonId = savedData.map((item: any) => item.id)
          setRelatedUnitsID([
            ...syllabusLessonId
          ])
        }
        setLoading(false);
      } catch {
        setMessage({
          ...message,
          isError: true,
          msg: PreviewFormDict[userLanguage]['MESSAGES']['FETCHERR']
        })
      }
    }
  }

  const fetchLessonPreview = async () => {
    try {
      setLoading(true);
      const result: any = await API.graphql(graphqlOperation(customQueries.getCompleteLesson, {
        id: lessonID
      }));
      const savedData: any = result.data.getLesson;
      setLessonDetails({ ...savedData });
      setLoading(false);
    } catch {
      setMessage({
        ...message,
        isError: true,
        msg: PreviewFormDict[userLanguage]['MESSAGES']['UPDATEERR']
      })
      setLoading(true);
    }
  }

  useEffect(() => {
    fetchLessonPreview();
    fetchSyllabusLessonData();
  }, [])

  useEffect(() => {
    if (message?.msg) {
      setTimeout(() => {
        setMessage({
          ...message,
          isError: true,
          msg: ''
        })
      }, 3000)
    }
  }, [message.msg])

  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>

      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900"> {PreviewFormDict[userLanguage]['PREVIEW_DETAILS']['TITLE']} - {lessonName}</h3>
      </div>
      {loading ? (
        <div className="py-20 text-center mx-auto">
          <p>{PreviewFormDict[userLanguage]['FETCHING']}</p>
        </div>) :
        (<Fragment>
          <div className="p-4 max-h-screen overflow-y-auto">
            <div className="py-2">
              <h3 className="font-bold text-gray-900 text-base"> {PreviewFormDict[userLanguage]['PURPOSE']}: </h3>
              {lessonDetails?.purpose ? ReactHtmlParser(lessonDetails?.purpose) : ''}
            </div>
            <div className="py-2">
              <h3 className="font-bold text-gray-900 text-base"> {PreviewFormDict[userLanguage]['OBJECTIVE']}: </h3>
              {lessonDetails?.objectives ? ReactHtmlParser(lessonDetails?.objectives[0]) : ''}
            </div>
            <div className="py-2">
              <h3 className="font-bold text-gray-900 text-base">{lessonDetails?.introductionTitle || ''}</h3>
              <Fragment>
                {lessonDetails?.introduction ? ReactHtmlParser(lessonDetails?.introduction) : ''}
              </Fragment>
            </div>
            <div className="py-2">
              <h3 className="font-bold text-gray-900 text-base">{lessonDetails?.instructionsTitle || ''}</h3>
              <Fragment>
                {lessonDetails?.instructions ? ReactHtmlParser(lessonDetails?.instructions[0]) : ''}
              </Fragment>
            </div>
            <div className="py-2">
              <h3 className="font-bold text-gray-900 text-base">{PreviewFormDict[userLanguage]['CHECKPOINT']} :</h3>
              {lessonDetails?.checkpoints?.items?.length > 0 ? (<Fragment>
                {lessonDetails?.checkpoints?.items?.map((item: any) => (
                  <Fragment key={item.id}>
                    <h4 className="font-bold text-gray-900 text-base py-2">{item.checkpoint?.title || ''}<br />
                      <span className="text-gray-700 text-sm font-semibold">{item.checkpoint?.subtitle || ''}</span>
                    </h4>
                    <div>
                      {item.checkpoint?.questions?.items?.length > 0 ? (
                        <div className="py-2 px-4">
                          {item.checkpoint?.questions?.items?.map((checkpItem: any, index: number) => (
                            <Fragment>
                              <p key={checkpItem.id}>
                                <span>{index + 1}.{checkpItem?.question?.question} </span>({getTypeString(checkpItem?.question?.type)})
                              </p>
                              <div className="px-12">
                                {(checkpItem?.question?.type === 'selectMany' || checkpItem?.question?.type === 'selectOne') && (
                                  <ul className="list-disc">
                                    {checkpItem?.question?.options?.map((opt: any) => (<li >{opt?.text}</li>))}
                                  </ul>
                                )}
                              </div>
                            </Fragment>
                          ))}
                        </div>) : null}
                    </div>
                  </Fragment>
                ))}
              </Fragment>) : <p>{PreviewFormDict[userLanguage]['NOCHECKPOINT']}</p>}
            </div>
            <div className="py-2">
              <h3 className="font-bold text-gray-900 text-base">{lessonDetails?.summaryTitle || ''}</h3>
              <Fragment>
                {lessonDetails?.introduction ? ReactHtmlParser(lessonDetails?.summary) : ''}
              </Fragment>
            </div>
          </div>
          {message ? (
            <div className="py-4 m-auto mt-2 text-center">
              <p className={`${message.isError ? 'text-red-600' : 'text-green-600'}`}> {message.msg} </p>
            </div>) : null}
          {enablePublish &&
            <div className="w-2/10 mx-auto py-4">
              <Buttons btnClass="mx-auto w-full" onClick={publishAction} label={BUTTONS[userLanguage]['PUBLISH']} />
            </div>
          }
          {warnModal.show && <ModalPopUp closeAction={toggleModal} saveAction={updateAllLessonPlans} saveLabel={BUTTONS[userLanguage]['YES']} message={warnModal.message} />}
        </Fragment>)
      }

    </div>
  )
}

export default PreviewForm
