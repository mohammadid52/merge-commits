import React, { Fragment } from 'react';
import { useHistory } from 'react-router';

import PageWrapper from '../../../../../../Atoms/PageWrapper';
import Buttons from '../../../../../../Atoms/Buttons';


interface MeasMntListProps {
  measurementList?: any[]

}

const MeasMntList = (props: MeasMntListProps) => {
  const { measurementList } = props;
  const history = useHistory();

  const createNewMeasurement = () => {
    history.push(`/dashboard/manage-institutions/curricular/measurement/add?id=${'_blank_'}`)

  }

  const editCurrentMeasurement = (id: string) => {
    history.push(`/dashboard/manage-institutions/curricular/measurement/edit?id=${'_blank_'}`)

  }
  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">CURRICULAR MEASUREMENTS</h3>
          {(measurementList && measurementList.length > 0) ? (
            <Fragment>
              <div className="flex justify-end w-8/10 m-auto ">
                <Buttons btnClass="mx-4" label="Add new Measurement" onClick={createNewMeasurement} />
              </div>
              <div className="my-8 w-8/10 m-auto max-h-88 overflow-y-auto">

                <div className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                  <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>No.</span>
                  </div>
                  <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>Measurement Name</span>
                  </div>
                  <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>Actions</span>
                  </div>
                </div>

                {/* Edit as per respective syllabus fields.  */}
                {measurementList.map((item, index) => (
                  <div key={index} className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>
                    <div className="flex w-6/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                      {item.name ? item.name : ''}
                    </div>
                    <span className="w-3/10 h-6 flex items-center text-left px-8 py-3 text-indigo-600 hover:text-indigo-900 cursor-pointer" onClick={() => editCurrentMeasurement(item.id)}>
                      edit
                  </span>
                  </div>
                ))}
              </div>
            </Fragment>
          ) : (
              <Fragment>
                <div className="flex justify-center mt-8">
                  <Buttons btnClass="mx-4" label="Add new Measurement" onClick={createNewMeasurement} />
                </div>
                <p className="text-center p-16">  This curricular does not have any measurement yet. Please create a new one.</p>
              </Fragment>)}
        </PageWrapper>
      </div>
    </div>
  )
}

export default MeasMntList
