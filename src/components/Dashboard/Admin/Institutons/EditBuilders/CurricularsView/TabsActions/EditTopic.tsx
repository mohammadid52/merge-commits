import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router'
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
import * as customQueries from '../../../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../../../customGraphql/customMutations';
interface EditTopicProps {

}

const EditTopic = (props: EditTopicProps) => {
  const {} = props;
  const urlParams: any = useParams()
  const curricularId = urlParams.curricularId;
  const topicId = urlParams.id;

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState({
    id: topicId, name: '', description: '', curriculumID: curricularId, learning: { id: '', name: '', value: '' }
  })
  const [learnings, setLearnings] = useState([]);
  const [validation, setValidation] = useState({ name: '', learning: '' })

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Edit Topic', url: `/dashboard/curricular/${curricularId}/topic/edit/${topicId}`, last: true }
  ];

  const onInputChange = (e: any) => {
    const value = e.target.value
    if (e.target.name === 'name') {
      setTopic({ ...topic, name: value})
      if (value.length && validation.name) setValidation({ ...validation, name: '' })
    }
    if (e.target.name === 'description') setTopic({ ...topic, description: value})
  }

  const validateForm = () => {
    let isValid = true
    const msgs = validation;
    if (!topic.name.length) {
      isValid = false;
      msgs.name = 'Name is required';
    } else {
      msgs.name = ''
    }
    if (!topic.learning.id) {
      isValid = false;
      msgs.learning = 'learning objective is required';
    } else {
      msgs.learning = ''
    }
    setValidation({ ...msgs });
    return isValid;
  }

  const saveTopicDetails = async () => {
    const isValid = validateForm()
    if (isValid) {
      const input = {
        id: topic.id,
        name: topic.name,
        description: topic.description,
        learningObjectiveID: topic.learning.id
      };
      const item: any = await API.graphql(graphqlOperation(customMutations.updateTopic, { input }));
      const updatedItem = item.data.updateTopic
      if (updatedItem) {
        history.push(`/dashboard/manage-institutions/curricular?id=${curricularId}`);
      } else {
        console.log('Could not update topic');
      }
    }
  }

  const selectLearning = (val: string, name: string, id: string) => {
    if (validation.learning) {
      setValidation({ ...validation, learning: '' })
    }
    setTopic({ ...topic, learning: {...topic.learning, id, name, value: val} })
  }

  const fetchTopic = async () => {
    setLoading(true)
    let item: any = await API.graphql(graphqlOperation(customQueries.getTopicDetails, { id: topicId }));
    item = item.data.getTopic
    if (item.curriculumID === curricularId) {
      setTopic({
        ...topic,
        name: item.name,
        description: item.description,
        learning: { id: item.learningObjective.id, name: item.learningObjective.name, value: item.learningObjective.name }
      })
      setLoading(false)
    } else {
      console.log('wrong cr')
      setLoading(false)
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

  useEffect(() => {
    fetchLearningObjectives()
    fetchTopic()
  }, [])

  return (
    <div className="w-8/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Edit Topic" subtitle="Edit curricular topic." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-6/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">TOPIC INFORMATION</h3>
        </div>
        { !loading ? <>
        <div className="w-6/10 m-auto">
          <div className="">
            <div className="px-3 py-4">
              <FormInput value={topic.name} id='name' onChange={onInputChange} name='name' label="Topic Name" isRequired />
              {
                validation.name && <p className="text-red-600">{validation.name}</p>
              }
            </div>

            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Select Learning objective <span className="text-red-500">*</span>
              </label>
              <Selector selectedItem={topic.learning.value} placeholder="Learning objective" list={learnings} onChange={selectLearning}/>
              {
                validation.learning && <p className="text-red-600">{validation.learning}</p>
              }
            </div>

            {/* <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Select Sequence
              </label>
              <Selector placeholder="Sequence" list={sequenceList} onChange={() => console.log('')} />
            </div> */}

            <div className="px-3 py-4">
              <TextArea id='description' value={topic.description} onChange={onInputChange} name='description' label="Description" />
            </div>
          </div>
        </div>
        <div className="flex my-8 justify-center">
          <Buttons btnClass="py-3 px-10 mr-4" label="Cancel" onClick={history.goBack} transparent />
          <Buttons btnClass="py-3 px-10 ml-4" label="Save" onClick={saveTopicDetails} />
        </div>
        </> : <div>Fetching data...</div> }
      </PageWrapper>
    </div>
  )
}

export default EditTopic
