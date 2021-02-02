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
  const [builderStep, setBuilderStep] = useState('0');

  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'CheckpointLookup':
        return <CheckpointLookup changeStep={changeBuilderStep} />;
      case 'AddNewCheckPoint':
        return <AddNewCheckPoint changeStep={changeBuilderStep} />;
      case 'EditCheckPoint':
        return <EditCheckPoint changeStep={changeBuilderStep} />;
      case 'AddNewQuestion':
        return <AddNewQuestion changeStep={changeBuilderStep} />;
      case 'QuestionLookup':
        return <QuestionLookup changeStep={changeBuilderStep} />;
      default:
        return <SelectedCheckPointsList changeStep={changeBuilderStep} />;
    }
  }

  // const currentStepComp = (currentStep: string) => {
  //   switch (currentStep) {
  //     case '1':
  //       return <CheckpointLookup changeStep={changeBuilderStep} />;
  //     case '2':
  //       return <AddNewCheckPoint changeStep={changeBuilderStep} />;
  //     case '3':
  //       return <EditCheckPoint changeStep={changeBuilderStep} />;
  //     case '4':
  //       return <AddNewQuestion changeStep={changeBuilderStep} />;
  //     case '5':
  //       return <QuestionLookup changeStep={changeBuilderStep} />;
  //     default:
  //       return <SelectedCheckPointsList changeStep={changeBuilderStep} />;
  //   }
  // }

  const changeBuilderStep = (step: string) => {
    setBuilderStep(step)
  }

  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>
      {currentStepComp(builderStep)}
    </div>
  )
}

export default CheckpointBuilder
