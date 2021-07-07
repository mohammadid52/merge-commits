import React from 'react';

export interface IStepElementInterface {
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  isComplete?: boolean;
  step: string;
  title: string;
}

export interface IStepComponentInterface {
  steps: IStepElementInterface[];
  activeStep: string;
  handleTabSwitch: (step: string) => void;
}

const StepComponent = ({activeStep, handleTabSwitch, steps}: IStepComponentInterface) => {
  return (
    <div className="lg:border-t lg:border-b lg:border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Progress">
        <ol className="rounded-md overflow-hidden lg:flex lg:border-l lg:border-r lg:border-gray-200 lg:rounded-none">
          {steps.map(
            ({description, disabled, isComplete, title, step}: any, index: number) => (
              <li
                className={`relative overflow-hidden lg:flex-1 ${
                  disabled ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer'
                }`}
                key={index}
                onClick={() => (!disabled ? handleTabSwitch(step) : null)}>
                <div
                  className={`border border-gray-200 overflow-hidden ${
                    step === activeStep ? '' : 'border-b-0'
                  } lg:border-0 ${
                    index === 0
                      ? 'lg:border-r-none'
                      : index !== steps.length - 1
                      ? 'lg:border-r-none lg:border-l-none'
                      : 'lg:border-l-none'
                  }`}>
                  <div className="group">
                    <span
                      className={`absolute top-0 left-0 w-1 h-full ${
                        step === activeStep
                          ? 'bg-indigo-600'
                          : 'bg-transparent group-hover:bg-gray-200'
                      } lg:w-full lg:h-1 lg:bottom-0 lg:top-auto`}
                      aria-hidden="true"></span>
                    <span className="px-6 py-5 flex items-start text-sm font-medium">
                      <span className="flex-shrink-0 w-auto">
                        <span
                          className={`w-6 h-6 flex items-center justify-center border-2 ${
                            disabled ? 'bg-gray-600' : ''
                          } ${!disabled ? 'border-indigo-600' : ''} rounded-full`}>
                          <span
                            className={`${
                              !disabled ? 'text-indigo-600' : 'text-white'
                            } w-auto`}>
                            {index + 1}
                          </span>
                        </span>
                      </span>
                      <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
                        <span className="text-xs font-semibold tracking-wide uppercase">
                          {title}
                        </span>
                        {description ? (
                          <span className="text-sm font-medium text-gray-500">
                            {description}
                          </span>
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
              </li>
            )
          )}
        </ol>
      </nav>
    </div>
  );
};

export default StepComponent;
