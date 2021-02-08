import React, { useState } from 'react';

import CheckpointLookup from './CheckPointSteps/CheckpointLookup';
import AddNewCheckPoint from './CheckPointSteps/AddNewCheckPoint';
import EditCheckPoint from './CheckPointSteps/EditCheckPoint';
import AddNewQuestion from './CheckPointSteps/AddNewQuestion';
import QuestionLookup from './CheckPointSteps/QuestionLookup';
import SelectedCheckPointsList from './CheckPointSteps/SelectedCheckPointsList';

interface CheckpointBuilderProps {

}

const CheckpointBuilder = (props: CheckpointBuilderProps) => {
  const { } = props;
  const [builderStep, setBuilderStep] = useState('SelectedCheckPointsList');
  const [savedCheckPoints, setSavedCheckpoints] = useState([])

  // tentative static data 

  const dymmyCheckpointsList = [
    { id: '1', title: 'Social Engagement and Impact', subtitle: 'Social Engagement Practices ', language: 'English' },
    { id: '2', title: 'Leadership and Ministry Contexts', subtitle: 'Decision Making and Growth', language: 'English' },
    { id: '3', title: 'Social Engagement and Impact', subtitle: 'Social Engagement Practices ', language: 'English' },
    { id: '4', title: 'Leadership and Ministry Contexts', subtitle: 'Decision Making and Growth', language: 'English' },
    { id: '5', title: 'Leadership and Ministry Contexts', subtitle: 'Decision Making and Growth', language: 'English' },
    { id: '6', title: 'Social Engagement and Impact', subtitle: 'Social Engagement Practices ', language: 'English' },
    { id: '7', title: 'Leadership and Ministry Contexts', subtitle: 'Decision Making and Growth', language: 'English' },
    { id: '8', title: 'Leadership and Ministry Contexts', subtitle: 'Decision Making and Growth', language: 'English' },
    { id: '9', title: 'Social Engagement and Impact', subtitle: 'Social Engagement Practices ', language: 'English' },
    { id: '10', title: 'Leadership and Ministry Contexts', subtitle: 'Decision Making and Growth', language: 'English' },
  ]


  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'SelectedCheckPointsList':
        return <SelectedCheckPointsList changeStep={changeBuilderStep} activeCheckpoints={savedCheckPoints} />;
      case 'CheckpointLookup':
        return <CheckpointLookup
          checkpointList={dymmyCheckpointsList}
          changeStep={changeBuilderStep}
          onSave={saveCheckpoints}
        />;
      case 'AddNewCheckPoint':
        return <AddNewCheckPoint changeStep={changeBuilderStep} />;
      case 'EditCheckPoint':
        return <EditCheckPoint changeStep={changeBuilderStep} />;
      case 'AddNewQuestion':
        return <AddNewQuestion changeStep={changeBuilderStep} />;
      case 'QuestionLookup':
        return <QuestionLookup changeStep={changeBuilderStep} />;
      default:
        return <SelectedCheckPointsList changeStep={changeBuilderStep} activeCheckpoints={savedCheckPoints} />;
    }
  }


  const changeBuilderStep = (step: string) => {
    setBuilderStep(step)
  }
  const saveCheckpoints = (selectedId: string[]) => {
    const updatedList = dymmyCheckpointsList.filter(item => selectedId.includes(item.id))
    setSavedCheckpoints(updatedList)
    setBuilderStep('SelectedCheckPointsList')
  }
  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>
      {currentStepComp(builderStep)}
    </div>
  )
}

export default CheckpointBuilder
