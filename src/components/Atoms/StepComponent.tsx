import {Steps} from 'antd';
import React from 'react';

interface IStepElementInterface {
  description?: string;
  disabled?: boolean;
  subTitle?: string;
  title: string;
  stepValue: string;
}

interface IStepComponentInterface {
  steps: IStepElementInterface[];
  activeStep: string;
  handleTabSwitch: (step: string) => void;
}

const StepComponent = ({activeStep, handleTabSwitch, steps}: IStepComponentInterface) => {
  const onChange = (current: number) => {
    handleTabSwitch(steps[current].stepValue);
  };

  const current = steps.findIndex((step) => step.stepValue === activeStep);

  return (
    <Steps
      type="navigation"
      size="small"
      responsive
      current={current}
      onChange={onChange}
      className="site-navigation-steps"
      items={steps}
    />
  );
};

export default StepComponent;
