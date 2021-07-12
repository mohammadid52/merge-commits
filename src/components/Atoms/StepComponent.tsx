import React, { useContext } from 'react';
import { getAsset } from '../../assets';
import { GlobalContext } from '../../contexts/GlobalContext';
import Tooltip from './Tooltip';

export interface IStepElementInterface {
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  isComplete?: boolean;
  stepValue?: string;
  title: string;
  tooltipText?: string;
  tooltipPlacement?: 'bottom' | 'top' | 'left' | 'right' | 'bottomleft';
}

export interface IStepComponentInterface {
  steps: IStepElementInterface[];
  activeStep: string;
  handleTabSwitch: (step: string) => void;
}

const StepComponent = ({activeStep, handleTabSwitch, steps}: IStepComponentInterface) => {
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  
  const renderStepElement = (
    {description, disabled, isComplete, title, stepValue}: any,
    index: number
  ) => {
    return (
      <div
        className={`border border-gray-200 ${
          stepValue === activeStep ? '' : 'border-b-0'
        } lg:border-0 ${
          index === 0
            ? 'lg:border-r-none'
            : index !== steps.length - 1
            ? 'lg:border-r-none lg:border-l-none'
            : 'lg:border-l-none'
        }`}>
        <div className="group">
          {/* <span
            className={`absolute top-0 left-0 w-1 h-full ${
              stepValue === activeStep
                ? 'bg-gray-900'
                : 'bg-transparent group-hover:bg-gray-200'
            } lg:w-full lg:h-1 lg:bottom-0 lg:top-auto`}
            aria-hidden="true"></span> */}
          <span className="px-6 py-5 flex items-start text-sm font-medium">
            <span className="flex-shrink-0 w-auto">
              <span
                className={`w-6 h-6 flex items-center justify-center border-2 ${
                  disabled ? 'bg-gray-600' : ''
                } ${
                  stepValue === activeStep
                    ? theme.borderColor[themeColor]
                    : 'border-gray-300'
                } rounded-full`}>
                <span
                  className={`${
                    stepValue === activeStep
                      ? theme.textColor[themeColor]
                      : disabled
                      ? 'text-white'
                      : 'text-gray-500'
                  } w-auto`}>
                  {index + 1}
                </span>
              </span>
            </span>
            <span className="mt-0.5 ml-4 min-w-0 w-auto flex flex-col">
              <span
                className={`text-xs font-semibold ${
                  stepValue === activeStep
                    ? theme.textColor[themeColor]
                    : ''
                } tracking-wide uppercase`}>
                {title}
              </span>
              {description ? (
                <span className="text-sm font-medium text-gray-500">{description}</span>
              ) : null}
            </span>
          </span>
        </div>
        {index ? (
          <div
            className="hidden absolute top-0 left-0 w-3 inset-0 lg:block"
            aria-hidden="true">
            <svg
              className="h-full w-full text-gray-600"
              viewBox="0 0 12 82"
              fill="none"
              preserveAspectRatio="none">
              <path
                d="M0.5 0V31L10.5 41L0.5 51V82"
                stroke="currentcolor"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        ) : null}
      </div>
    );
  };
  return (
    <div className="lg:border-t lg:border-b lg:border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Progress">
        <ol className="rounded-md lg:flex lg:border-l lg:border-r lg:border-gray-200 lg:rounded-none">
          {steps.map((step: any, index: number) => (
            <li
              className={`relative lg:flex-1 ${
                step.disabled ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer'
              }`}
              key={index}
              onClick={() =>
                !step.disabled ? handleTabSwitch(step.stepValue || step.title) : null
              }>
              {step.disabled ? (
                <Tooltip text={step.tooltipText} placement={step.tooltipPlacement || 'top'}>
                  {renderStepElement(step, index)}
                </Tooltip>
              ) : (
                renderStepElement(step, index)
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default StepComponent;
