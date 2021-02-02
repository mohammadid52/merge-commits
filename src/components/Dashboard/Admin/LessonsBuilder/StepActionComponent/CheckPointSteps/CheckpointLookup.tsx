import React, { Fragment } from 'react'
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoIosKeypad } from 'react-icons/io';
import { RiArrowRightLine } from 'react-icons/ri';

interface CheckpointLookupProps {
  changeStep: (step: string) => void

}

const CheckpointLookup = (props: CheckpointLookupProps) => {
  const { } = props;
  return (
    <Fragment>
    <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center">
      <span className="w-6 h-6 flex items-center mr-4" onClick={() => console.log('')}>
        <IconContext.Provider value={{ size: '1.5rem', color: 'darkgrey' }}>
          <IoIosKeypad />
        </IconContext.Provider>
      </span>

      {/* Breadcrums */}
      <h4 className="text-base leading-6 font-medium text-gray-900 flex items-center">
        <span className="w-auto flex-shrink-0">Assessment Builder</span>
        <span className="w-6 h-6 flex items-center mx-4">
          <IconContext.Provider value={{ size: '1.5rem', color: 'darkgrey' }}>
            <RiArrowRightLine />
          </IconContext.Provider>
        </span>
        <span className="font-normal text-gray-600 w-auto flex-shrink-0">Previous Checkpoints</span>
      </h4>
    </div>

    <div className="p-4">

    </div>
  </Fragment>
  )
}

export default CheckpointLookup
