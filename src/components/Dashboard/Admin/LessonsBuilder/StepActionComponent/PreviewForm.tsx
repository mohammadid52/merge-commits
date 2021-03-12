import React, { useState, useContext, useEffect } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';

import Buttons from '../../../../Atoms/Buttons';
import { GlobalContext } from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import ModalPopUp from '../../../../Molecules/ModalPopUp';

import * as queries from '../../../../../graphql/queries';
import * as customMutations from '../../../../../customGraphql/customMutations';
import * as customQueries from '../../../../../customGraphql/customQueries';

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
  const { BUTTONS, lessonBuilderDict } = useDictionary(clientKey);

  const [warnModal, setWarnModal] = useState({
    show: false,
    message: lessonBuilderDict[userLanguage]['PREVIEW_DETAILS']['WARN_MESSAGE']
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
    if (relatedUnitsID?.length) {
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
        msg: 'Successfully updated lesson plans in all units.'
      })).catch(err => setMessage({
        ...message,
        isError: true,
        msg: 'Error while updating lesson plans for units, please try again after some time.'
      }))
    }
    toggleModal();
  }

  const toggleModal = () => {
    setWarnModal({
      ...warnModal,
      show: !warnModal.show
    })
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
          msg: 'Error while fetching units for this lesson.Please try after some time.'
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
        msg: 'Error while fetching lesson details for this lesson.Please try after some time.'
      })
      setLoading(true);
    }
  }

  useEffect(() => {
    fetchLessonPreview();
    fetchSyllabusLessonData();
  }, [])

  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>

      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900"> {lessonBuilderDict[userLanguage]['PREVIEW_DETAILS']['TITLE']} - {lessonName}</h3>
      </div>
      {loading ? (
        <div className="py-20 text-center mx-auto">
          <p>Fetching Lesson checkpoints please wait...</p>
        </div>) :
        (<div className="p-4">
          {/* <div>
            <h3>{lessonDetails?.introductionTitle || ''}</h3>
            {lessonDetails?.introduction || ''}
          </div> */}
          {enablePublish &&
            <div className="w-2/10 mx-auto">
              <Buttons btnClass="" onClick={toggleModal} label={BUTTONS[userLanguage]['PUBLISH']} />
            </div>
          }
          {warnModal.show && <ModalPopUp closeAction={toggleModal} saveAction={updateAllLessonPlans} saveLabel={BUTTONS[userLanguage]['YES']} message={warnModal.message} />}
        </div>)
      }

    </div>
  )
}

export default PreviewForm
