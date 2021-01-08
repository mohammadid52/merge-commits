import React, { useState, Fragment, useEffect } from 'react';
import { useHistory } from 'react-router';
import API, { graphqlOperation } from '@aws-amplify/api';
import PageWrapper from '../../../../../../Atoms/PageWrapper';
import Buttons from '../../../../../../Atoms/Buttons';
import * as customQueries from '../../../../../../../customGraphql/customQueries'

interface MeasMntListProps {
  measurementList?: any[]
  curricularId: string
}

const MeasMntList = (props: MeasMntListProps) => {
  const { curricularId } = props;
  const history = useHistory();
  const [loading, setLoading] = useState(false)
  const [measurements, setMeasurements] = useState([])

  const createNewMeasurement = () => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/measurement/add`)
  }

  const editCurrentMeasurement = (id: string) => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/measurement/edit/${id}`)
  }

  const fetchMeasurements = async () => {
    setLoading(true)
    let list: any = await API.graphql(graphqlOperation(customQueries.listRubrics, {
      filter: { curriculumID: { eq: curricularId } },
    }));
    list = list.data.listRubrics?.items || []
    setMeasurements(list)
    setLoading(false)
  }

  useEffect(() => {
    fetchMeasurements()
  }, [])

  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">CURRICULAR MEASUREMENTS</h3>
          <>
            {
              !loading ?
                <>
                  {(measurements && measurements.length > 0) ? (
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
                        {measurements.map((item, index) => (
                          <div key={index} className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                            <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>
                            <div className="flex w-6/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                              {item.name}
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
                </>
                : <div>Loading...</div>
            }
          </>
        </PageWrapper>
      </div>
    </div>
  )
}

export default MeasMntList
