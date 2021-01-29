import React, { Fragment } from 'react'
import { IconContext } from 'react-icons/lib/esm/iconContext';

interface WizardScrollerProps {
  stepsList: { name: string, icon: React.ReactNode }[]
  activeStep: string
  setActiveStep: (step: string) => void
}
const WizardScroller = (props: WizardScrollerProps) => {
  const { stepsList, activeStep, setActiveStep } = props;
  return (
    <div className="w-full py-6">
      <div className="flex flex-col">

        {stepsList.length && stepsList.map((stepItem: any, i) => (
          <Fragment>

            <div className="relative mt-2">

              {/* Connecting line */}
              {(i !== 0) ? (< div className="w-full flex items-center" >
                <div className="w-1/4 flex items-center h-16 mb-2">
                  <div className="h-full w-16 flex rounded items-center transform rotate-90">
                    <div className="w-0 bg-gray-400 py-1 rounded" style={{ width: "4rem" }}></div>
                  </div>
                </div>
              </div>) : null}

              <div className="flex justify-start items-center mx-1 cursor-pointer" onClick={() => setActiveStep(stepItem.name)}>
                <div className={`w-10 h-10 mx-2 rounded-full text-lg text-white flex items-center ${activeStep === stepItem.name ? 'bg-indigo-500 ' : 'bg-gray-400 '}`}>
                  <span>
                    <IconContext.Provider value={{ size: '1.5rem', color: '#ffffff' }}>
                      {stepItem.icon}
                    </IconContext.Provider>
                  </span>
                </div>
                <div className={`text-xs md:text-base mx-2 w-auto ${activeStep === stepItem.name ? 'text-indigo-600 font-medium ' : ''}`}>{stepItem.name}</div>
              </div>
            </div>

          </Fragment>

        )
        )}
      </div>
    </div >
  )
}

export default WizardScroller
