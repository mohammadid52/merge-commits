import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api';
import BreadCrums from '../../../../../../Atoms/BreadCrums';
import SectionTitle from '../../../../../../Atoms/SectionTitle';
import Buttons from '../../../../../../Atoms/Buttons';
import PageWrapper from '../../../../../../Atoms/PageWrapper';
import FormInput from '../../../../../../Atoms/Form/FormInput';
import TextArea from '../../../../../../Atoms/Form/TextArea';
import Selector from '../../../../../../Atoms/Form/Selector'
import * as queries from '../../../../../../../graphql/queries';
import * as mutations from '../../../../../../../graphql/mutations';
interface AddTopicProps {

}

const AddTopic = (props: AddTopicProps) => {
  const { } = props;
  const history = useHistory();
  const urlParams: any = useParams()
  const curricularId = urlParams.curricularId;

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Add Topic', url: `/dashboard/curricular/${curricularId}/topic/add`, last: true }
  ];

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [learning, setLearning] = useState({ id: '', name: '', value: '' });
  const [validation, setValidation] = useState({ isValid: true, msgs: {name: '', learning: ''} })
  const [learnings, setLearnings] = useState([]);

  const onInputChange = (e: any) => {
    if (e.target.name === 'name') {
      const value = e.target.value
      setName(value)
      // if (!validation.isValid && value.length) setValidation({ isValid: true, msgs: {...validation.msgs, name: ''} })
    }
    if (e.target.name === 'description') setDescription(e.target.value)
  }

  const saveTopicDetails = async () => {
    if (!name.length) {
      // setValidation({ isValid: false, msg: 'Name is required' })
      return
    }
    if (!learning.id) {
      // setValidation({ isValid: false, msg: 'Name is required' })
      return
    }
    // setValidation({ isValid: true, msg: '' })
    const input = {
      name, description, curriculumID: curricularId, learningObjectiveID: learning.id
    };
    const item: any = await API.graphql(graphqlOperation(mutations.createTopic, { input }));
    const addedItem = item.data.createTopic
    if (addedItem) {
      history.push(`/dashboard/manage-institutions/curricular?id=${curricularId}`);
    } else {
      console.log('Could not add learning objective');
    }
  }

  const fetchLearningObjectives = async () => {
    let list: any = await API.graphql(graphqlOperation(queries.listLearningObjectives, {
      filter: { curriculumID: { eq: curricularId } },
    }));
    list = list.data.listLearningObjectives?.items || []
    list = list.map((item: any) => ({
      id: item.id,
      name: item.name,
      value: item.name
    }));
    setLearnings(list)
  }

  const selectLearning = (val: string, name: string, id: string) => {
    
    setLearning({ id, name, value: val })
  }

  // validateForm() {

  // }

  useEffect(() => {
    console.log('hereeeeeeeeeeeeeeeeeeeeeeee')
    // fetchLearningObjectives()
  }, [])

  return (
    <div className="w-8/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Add Topic" subtitle="Add new topic to the curricular." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-6/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">TOPIC INFORMATION</h3>
          <div className="">

            <div className="px-3 py-4">
              <FormInput value={name} id='name' onChange={onInputChange} name='name' label="Topic Name" isRequired />
            </div>

            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Select Learning objective
              </label>
              <Selector selectedItem={learning.value} placeholder="Learning objective" list={learnings} onChange={selectLearning} />
            </div>

            <div className="px-3 py-4">
              <TextArea id='description' value={description} onChange={onInputChange} name='description' label="Description" />
            </div>

          </div>
        </div>
        <div className="flex my-8 justify-center">
          <Buttons btnClass="py-3 px-10" label="Save" onClick={saveTopicDetails} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default AddTopic
