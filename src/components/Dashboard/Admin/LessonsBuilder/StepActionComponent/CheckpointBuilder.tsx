import React, { useState, useEffect } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';

import CheckpointLookup from './CheckPointSteps/CheckpointLookup';
import AddNewCheckPoint from './CheckPointSteps/AddNewCheckPoint';
import EditCheckPoint from './CheckPointSteps/EditCheckPoint';
import AddNewQuestion from './CheckPointSteps/AddNewQuestion';
import QuestionLookup from './CheckPointSteps/QuestionLookup';
import SelectedCheckPointsList from './CheckPointSteps/SelectedCheckPointsList';
import { LessonPlansProps } from '../LessonEdit';

import * as queries from '../../../../../graphql/queries';
import * as customQueries from '../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../customGraphql/customMutations';

interface CheckpointBuilderProps {
  designersList?: { id: string, name: string, value: string }[]
  lessonID: string
  lessonPlans?: LessonPlansProps[] | null
  updateLessonPlan: (plan: LessonPlansProps[]) => void
}

// TODO: Replace type any with actual type wherever required.
// TODO: Add comments to entire lesson builder component flow.

const CheckpointBuilder = (props: CheckpointBuilderProps) => {
  const { designersList, lessonID, lessonPlans, updateLessonPlan } = props;

  const initialCheckpData = {
    title: '',
    subtitle: '',
    label: '',
    instructionsTitle: '',
    purposeHtml: '<p></p>',
    objectiveHtml: '<p></p>',
    instructionHtml: '<p></p>',
    language: { id: '1', name: "English", value: 'EN' }
  }

  const [builderStep, setBuilderStep] = useState('SelectedCheckPointsList');
  // const [builderStep, setBuilderStep] = useState('AddNewCheckPoint');

  const [allCheckPointsList, setAllCheckPointsList] = useState([]);
  const [fileredCheckpointList, setFilteredCheckpointList] = useState([]);
  const [savedCheckPoints, setSavedCheckpoints] = useState([]);
  const [parentLessonPlans, setParentLessonPlans] = useState(lessonPlans);
  const [checkpointDetails, setCheckpointDetails] = useState(initialCheckpData);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [checkpQuestions, setCheckpQuestions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)

  const languageList = [
    { id: 1, name: 'English', value: 'EN' },
    { id: 2, name: 'Spanish', value: 'ES' },
  ];

  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'SelectedCheckPointsList':
        return <SelectedCheckPointsList
          changeStep={changeBuilderStep}
          activeCheckpoints={savedCheckPoints}
          DeleteCheckpoint={DeleteCheckpoint}
          editCheckPoint={fetchCheckDetails}
        />;
      case 'CheckpointLookup':
        return <CheckpointLookup
          checkpointList={fileredCheckpointList}
          changeStep={changeBuilderStep}
          onSave={saveCheckpoints}
        />;
      case 'AddNewCheckPoint':
        return <AddNewCheckPoint
          lessonPlans={parentLessonPlans}
          updateLessonPlan={onNewCheckpCreation}
          changeStep={changeBuilderStep}
          designersList={designersList}
          lessonID={lessonID}
          checkPointData={checkpointDetails}
          setCheckPointData={setCheckpointDetails}
          selectedDesigners={selectedDesigners}
          setSelectedDesigners={setSelectedDesigners}
          checkpQuestions={checkpQuestions}
          setCheckpQuestions={setCheckpQuestions}
        />;

      case 'EditCheckPoint':
        return <EditCheckPoint
          lessonPlans={parentLessonPlans}
          updateLessonPlan={onNewCheckpCreation}
          changeStep={changeBuilderStep}
          designersList={designersList}
          lessonID={lessonID}
          checkPointData={checkpointDetails}
          setCheckPointData={setCheckpointDetails}
          selectedDesigners={selectedDesigners}
          setSelectedDesigners={setSelectedDesigners}
          checkpQuestions={checkpQuestions}
          setCheckpQuestions={setCheckpQuestions} />;

      case 'AddNewQuestion':
        return <AddNewQuestion changeStep={changeBuilderStep} setCheckpQuestions={onAddNewQuestion} />;
      case 'QuestionLookup':
        return <QuestionLookup selecteList={checkpQuestions} changeStep={changeBuilderStep} onSave={saveQuestionsList} />;
      default:
        return <SelectedCheckPointsList
          changeStep={changeBuilderStep}
          activeCheckpoints={savedCheckPoints}
          DeleteCheckpoint={DeleteCheckpoint}
          editCheckPoint={fetchCheckDetails}
        />;
    }
  }

  const changeBuilderStep = (step: string) => {
    setBuilderStep(step)
  }
  const saveQuestionsList = (list: any[]) => {
    setCheckpQuestions([...list])
    setBuilderStep('AddNewCheckPoint');
  }
  const onAddNewQuestion = (obj: any) => {
    setCheckpQuestions([...checkpQuestions, obj]);
    setBuilderStep('AddNewCheckPoint');
  }
  const onNewCheckpCreation = (newLessonPlans: any, newData: any) => {
    updateLessonPlan(newLessonPlans);
    setSavedCheckpoints([
      ...savedCheckPoints,
      ...newData
    ])
  }

  const fetchCheckDetails = async (checkpId: string) => {
    try {
      setLoading(true);
      const fetchCheckpointsData: any = await API.graphql(graphqlOperation(queries.getCheckpoint, {
        id: checkpId
      }));
      if (!fetchCheckpointsData) {
        throw new Error('fail!');
      } else {
        const results = fetchCheckpointsData.data?.getCheckpoint;
        const designers = designersList.filter(item => results.designers.includes(item.id));
        const selectedLanguage: any = languageList.find(item => item.value === results.language);
        setCheckpointDetails({
          ...checkpointDetails,
          title: results.title,
          subtitle: results.subtitle,
          label: results.label,
          instructionsTitle: results.instructionsTitle,
          purposeHtml: results.purpose,
          objectiveHtml: results.objectives,
          instructionHtml: results.instructions,
          language: selectedLanguage,
        });
        setSelectedDesigners(designers);
      }
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
      console.error(error);
    }
  }

  const DeleteCheckpoint = async (checkpId: string) => {
    console.log("parentLessonPlans", parentLessonPlans)
    const lessonPlansInput = parentLessonPlans.filter((item) => item.LessonComponentID !== checkpId)
    try {
      const result: any = await API.graphql(graphqlOperation(customMutations.updateLesson, {
        input: {
          id: lessonID,
          lessonPlan: lessonPlansInput
        }
      }));
      const updatedPlan = result?.data?.updateLesson?.lessonPlan;
      if (updatedPlan) {
        const lessonPlanIds = updatedPlan.map((item: any) => item.LessonComponentID)
        const updatedList = updatedPlan.map((item: any) => {
          const checkpointDetails = allCheckPointsList.find(checkp => checkp.id === item.LessonComponentID)
          return {
            ...item,
            ...checkpointDetails
          };
        })
        const remainingCheckps = allCheckPointsList.filter(item => !lessonPlanIds.includes(item.id))

        // IN PROGRESS...
        setSavedCheckpoints(updatedList);
        // setFilteredCheckpointList(remainingCheckps);
        updateLessonPlan(updatedPlan);
        // setParentLessonPlans(updatedPlan);
        console.info(updatedPlan, updatedList, remainingCheckps);

      }
    } catch{
      setError(true);
    }
  }

  const updateMultiLessonPlans = async (lessonPlans: any, remainingCheckp: any) => {
    const lessonPlansInput = lessonPlans.map((item: { type: string, LessonComponentID: string, sequence: number, stage: string }) => ({
      type: item.type,
      LessonComponentID: item.LessonComponentID,
      sequence: item.sequence,
      stage: item.stage
    }))
    try {
      const result: any = await API.graphql(graphqlOperation(customMutations.updateLesson, {
        input: {
          id: lessonID,
          lessonPlan: lessonPlansInput
        }
      }));
      const updatedPlan = result?.data?.updateLesson?.lessonPlan;
      if (updatedPlan) {
        updateLessonPlan(updatedPlan);
        setSavedCheckpoints(lessonPlans);
        setFilteredCheckpointList(remainingCheckp);
        setBuilderStep('SelectedCheckPointsList')
      }
    } catch{
      setError(true);
    }
  }

  const saveCheckpoints = async (selectedId: string[]) => {
    if (selectedId?.length > 0) {
      const updatedList = fileredCheckpointList.filter(item => selectedId.includes(item.id));
      const remainingCheckp = fileredCheckpointList.filter(item => !selectedId.includes(item.id));
      const newCkeckpoints = updatedList.map((item, index) => {
        return {
          ...item,
          sequence: (parentLessonPlans?.length || 0) + index,
          LessonComponentID: item.id,
          type: 'checkpoint',
          stage: 'checkpoint'
        }
      })
      const lessonComponentPlans = [
        ...savedCheckPoints,
        ...newCkeckpoints
      ]
      await updateMultiLessonPlans(lessonComponentPlans, remainingCheckp);
    }
  }

  const filteredLessonPlans = () => {
    if (allCheckPointsList?.length > 0) {
      if (parentLessonPlans?.length > 0) {
        const savedLessonPlans = [...parentLessonPlans];
        const lessonPlanIds = savedLessonPlans.map(item => item.LessonComponentID)
        const updatedList = savedLessonPlans.map(item => {
          const checkpointDetails = allCheckPointsList.find(checkp => checkp.id === item.LessonComponentID)
          return {
            ...item,
            ...checkpointDetails
          };
        })
        const remainingCheckps = allCheckPointsList.filter(item => !lessonPlanIds.includes(item.id))
        setSavedCheckpoints(updatedList);
        setFilteredCheckpointList(remainingCheckps);
      } else {
        setFilteredCheckpointList(allCheckPointsList);
      }
    }
  }

  const fetchCheckpointLists = async () => {
    try {
      setLoading(true);
      const fetchCheckpointsData: any = await API.graphql(
        graphqlOperation(customQueries.listCheckpoints)
      );
      if (!fetchCheckpointsData) {
        throw new Error('fail!');
      } else {
        const checkpointList = fetchCheckpointsData.data?.listCheckpoints?.items;
        const sortedList = checkpointList.sort((a: any, b: any) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1)
        setAllCheckPointsList(sortedList);
      }
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
      console.error(error);
    }
  }

  useEffect(() => {
    fetchCheckpointLists();
  }, [])

  useEffect(() => {
    filteredLessonPlans();
  }, [allCheckPointsList])

  useEffect(() => {
    setParentLessonPlans(lessonPlans);
  }, [lessonPlans])

  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>
      {currentStepComp(builderStep)}
    </div>
  )
}

export default CheckpointBuilder
