import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api';

import BreadCrums from '../../../../../../Atoms/BreadCrums';
import SectionTitle from '../../../../../../Atoms/SectionTitle';
import Buttons from '../../../../../../Atoms/Buttons';
import PageWrapper from '../../../../../../Atoms/PageWrapper';
import FormInput from '../../../../../../Atoms/Form/FormInput';
import TextArea from '../../../../../../Atoms/Form/TextArea';

import * as queries from '../../../../../../../graphql/queries';
import * as mutations from '../../../../../../../graphql/mutations';
interface AddLearningObjectiveProps {

}

const AddLearningObjective = (props: AddLearningObjectiveProps) => {
  const { } = props;
  const history = useHistory();
  const urlParams: any = useParams()
  const curricularId = urlParams.curricularId;

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Add Learning objective', url: `/dashboard/curricular/${curricularId}/learning-objective/add`, last: true }
  ];

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [validation, setValidation] = useState({ isValid: true, msg: '' })
  const [learningsIds, setLearningsIds] = useState([]);

  const onInputChange = (e: any) => {
    if (e.target.name === 'name') {
      const value = e.target.value
      setName(value)
      if (!validation.isValid && value.length) setValidation({ isValid: true, msg: '' })
    }
    if (e.target.name === 'description') setDescription(e.target.value)
  }

  const saveLearningObjectiveDetails = async () => {
    if (!name.length) {
      setValidation({ isValid: false, msg: 'Name is required' })
      return
    }
    setValidation({ isValid: true, msg: '' })
    const input = {
      name, description, curriculumID: curricularId
    };
    const item: any = await API.graphql(graphqlOperation(mutations.createLearningObjective, { input }));
    const addedItem = item.data.createLearningObjective
    if (!learningsIds.length) {
      let seqItem: any = await API.graphql(graphqlOperation(mutations.createCSequences, { input: { id: `l_${curricularId}`, sequence: [addedItem.id] } }));
      seqItem = seqItem.data.createCSequences
      console.log('seqItem', seqItem)
    } else {
      let seqItem: any = await API.graphql(graphqlOperation(mutations.updateCSequences, { input: { id: `l_${curricularId}`, sequence: [...learningsIds, addedItem.id] } }));
      seqItem = seqItem.data.updateCSequences
      console.log('seqItem', seqItem)
    }
    if (addedItem) {
      history.goBack()
    } else {
      console.log('Could not add learning objective');
    }
  }

  const fetchLOSequence = async () => {
    let item: any = await API.graphql(graphqlOperation(queries.getCSequences,
      { id: `l_${curricularId}` }))
    item = item?.data.getCSequences?.sequence || []
    if (item) {
      setLearningsIds(item)
    }
  }

  useEffect(() => {
    fetchLOSequence()
  }, [])

  return (
    <div className="w-8/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Add learning objective" subtitle="Add new learning objective." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons label="Go Back" btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-6/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">LEARNING OBJECTIVE INFORMATION</h3>
          <div className="">

            <div className="px-3 py-4">
              <FormInput value={name} id='name' onChange={onInputChange} name='name' label="Learning Objective Name" isRequired />
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
              <TextArea id='description' value={description} onChange={onInputChange} name='description' label="Description" />
            </div>

          </div>
        </div>
        <div className="flex my-8 justify-center">
          <Buttons btnClass="py-3 px-10" label="Save" onClick={saveLearningObjectiveDetails} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default AddLearningObjective
