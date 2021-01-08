import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router';
import { IoArrowUndoCircleOutline } from 'react-icons/io5'
import API, { graphqlOperation } from '@aws-amplify/api';
import BreadCrums from '../../../../../../Atoms/BreadCrums'
import SectionTitle from '../../../../../../Atoms/SectionTitle'
import Buttons from '../../../../../../Atoms/Buttons'
import PageWrapper from '../../../../../../Atoms/PageWrapper'
import FormInput from '../../../../../../Atoms/Form/FormInput'
import TextArea from '../../../../../../Atoms/Form/TextArea'
import Selector from '../../../../../../Atoms/Form/Selector'

import * as mutations from '../../../../../../../graphql/mutations';
import * as queries from '../../../../../../../graphql/queries';
interface EditLearningObjectiveProps {

}

const EditLearningObjective = (props: EditLearningObjectiveProps) => {
  const { } = props;
  const urlParams: any = useParams()
  const curricularId = urlParams.curricularId;
  const learningId = urlParams.id;

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [learning, setLearning] = useState({
    id: learningId, name: '', description: '', curriculumID: curricularId
  })
  const [validation, setValidation] = useState({ isValid: true, msg: '' })


  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Edit Learning objective', url: `/dashboard/curricular/${curricularId}/learning-objective/edit/${learningId}`, last: true }
  ];

  const onInputChange = (e: any) => {
    const value = e.target.value
    if (e.target.name === 'name') {
      setLearning({ ...learning, name: value })
      if (!validation.isValid && value.length) setValidation({ isValid: true, msg: '' })
    }
    if (e.target.name === 'description') setLearning({ ...learning, description: value })
  }


  const savelearning = async () => {
    if (!learning.name) {
      setValidation({ isValid: false, msg: 'Name is required' })
      return;
    }
    if (!validation.isValid) setValidation({ isValid: true, msg: '' })
    const input = {
      id: learningId, name: learning.name, description: learning.description
    };
    const item: any = await API.graphql(graphqlOperation(mutations.updateLearningObjective, { input }));
    const updatedItem = item?.data?.updateLearningObjective
    if (updatedItem) {
      history.push(`/dashboard/manage-institutions/curricular?id=${curricularId}`);
    } else {
      console.log('Could not update learning objective');
    }
  }

  const fetchLearningObjective = async () => {
    console.log('In here for query')
    setLoading(true)
    let item: any = await API.graphql(graphqlOperation(queries.getLearningObjective, { id: learningId }));
    item = item.data.getLearningObjective
    if (item.curriculumID === curricularId) {
      setLearning({ ...learning, name: item.name, description: item.description })
      setLoading(false)
    } else {
      console.log('wrong cr')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLearningObjective()
  }, [])
  return (
    <div className="w-8/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Edit Learning objective" subtitle="Edit curricular Learning objective." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-6/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">LEARNING OBJECTIVE INFORMATION</h3>
        </div>
        {
          !loading ?
            <>
              <div className="w-6/10 m-auto">
                <div className="">
                  <div className="px-3 py-4">
                    <FormInput id='name' value={learning.name} onChange={onInputChange} name='name' label="Lerning objective name" isRequired />
                    {
                      !validation.isValid ? <p className="text-red-600">{validation.msg}</p> : null
                    }
                  </div>
                  {/* <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Select Sequence
              </label>
              <Selector placeholder="Sequence" list={sequenceList} onChange={() => console.log('')} />
            </div> */}
                  <div className="px-3 py-4">
                    <TextArea id='description' value={learning.description} onChange={onInputChange} name='description' label="Description" />
                  </div>
                </div>
              </div>
              <div className="flex my-8 justify-center">
                <Buttons btnClass="py-3 px-10 mr-4" label="Cancel" onClick={history.goBack} transparent />
                <Buttons btnClass="py-3 px-10 ml-4" label="Save" onClick={savelearning} />
              </div>
            </> : <div>Fetching data...</div>
        }
      </PageWrapper>
    </div>
  )
}

export default EditLearningObjective
