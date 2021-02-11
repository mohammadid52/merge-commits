import React, { useState, useEffect } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';

import CheckpointLookup from './CheckPointSteps/CheckpointLookup';
import AddNewCheckPoint from './CheckPointSteps/AddNewCheckPoint';
import EditCheckPoint from './CheckPointSteps/EditCheckPoint';
import AddNewQuestion from './CheckPointSteps/AddNewQuestion';
import QuestionLookup from './CheckPointSteps/QuestionLookup';
import SelectedCheckPointsList from './CheckPointSteps/SelectedCheckPointsList';
import { LessonPlansProps } from '../LessonEdit';

import * as customQueries from '../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../customGraphql/customMutations';

interface CheckpointBuilderProps {
  designersList?: { id: string, name: string, value: string }[]
  lessonID: string
  lessonPlans?: LessonPlansProps[] | null
  updateLessonPlan: (plan: LessonPlansProps[]) => void
}

// TODO: Replace type any with actual type wherever required.

const CheckpointBuilder = (props: CheckpointBuilderProps) => {
  const { designersList, lessonID, lessonPlans, updateLessonPlan } = props;
  const [builderStep, setBuilderStep] = useState('SelectedCheckPointsList');
  // const [builderStep, setBuilderStep] = useState('AddNewQuestion');
  const [savedCheckPoints, setSavedCheckpoints] = useState([]);
  const [fileredCheckpointList, setFilteredCheckpointList] = useState([]);
  const [allCheckPointsList, setAllCheckPointsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)

  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'SelectedCheckPointsList':
        return <SelectedCheckPointsList
          changeStep={changeBuilderStep}
          activeCheckpoints={savedCheckPoints} />;
      case 'CheckpointLookup':
        return <CheckpointLookup
          checkpointList={fileredCheckpointList}
          changeStep={changeBuilderStep}
          onSave={saveCheckpoints}
        />;
      case 'AddNewCheckPoint':
        return <AddNewCheckPoint
          lessonPlans={lessonPlans}
          updateLessonPlan={onNewCheckpCreation}
          changeStep={changeBuilderStep}
          designersList={designersList}
          lessonID={lessonID}
        />;
      case 'EditCheckPoint':
        return <EditCheckPoint changeStep={changeBuilderStep} />;
      case 'AddNewQuestion':
        return <AddNewQuestion changeStep={changeBuilderStep} />;
      case 'QuestionLookup':
        return <QuestionLookup changeStep={changeBuilderStep} />;
      default:
        return <SelectedCheckPointsList
          changeStep={changeBuilderStep}
          activeCheckpoints={savedCheckPoints} />;
    }
  }

  const changeBuilderStep = (step: string) => {
    setBuilderStep(step)
  }
  const onNewCheckpCreation = (newLessonPlans: any, newData: any) => {
    updateLessonPlan(newLessonPlans);
    setSavedCheckpoints([
      ...savedCheckPoints,
      ...newData
    ])
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
          sequence: lessonPlans.length > 0 ? (lessonPlans.length + index) : 0,
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
      if (lessonPlans?.length > 0) {
        const savedLessonPlans = [...lessonPlans];
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

  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>
      {currentStepComp(builderStep)}
    </div>
  )
}

export default CheckpointBuilder
