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
import * as queries from '../../../../../../../graphql/queries';
import * as mutations from '../../../../../../../graphql/mutations';
import * as customMutations from '../../../../../../../customGraphql/customMutations'
interface AddMeasurementProps {

}

const AddMeasurement = (props: AddMeasurementProps) => {
  const { } = props;
  const history = useHistory();
  const urlParams: any = useParams()
  const curricularId = urlParams.curricularId;
  const [topics, setTopics] = useState([]);

  const [name, setName] = useState('');
  const [criteria, setCriteria] = useState('');
  const [topic, setTopic] = useState({ id: '', name: '', value: '' })
  const [validation, setValidation] = useState({ name: '', topic: '' })
  const [measurementIds, setMeasurementIds] = useState([]);

  const useQuery = () => {
    return new URLSearchParams(location.search);
  };

  const urlGetParams: any = useQuery();
  const topicId = urlGetParams.get('tid'); // Find a code from params.


  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: topic?.value, url: `/dashboard/manage-institutions/:instituteID/curricular?id=${curricularId}`, last: false, goBack: true },
    { title: 'Add Measurement', url: `/dashboard/curricular/${curricularId}/measurement/add`, last: true }
  ];

  const onInputChange = (e: any) => {
    const value = e.target.value
    if (e.target.name === 'name') {
      setName(value)
      if (value.length && validation.name) setValidation({ ...validation, name: '' });
    }
    if (e.target.name === 'criteria') setCriteria(value)
  }

  const selectTopic = (val: string, name: string, id: string) => {
    if (validation.topic) {
      setValidation({ ...validation, topic: '' })
    }
    setTopic({ id, name, value: val })
  }

  const fetchTopics = async () => {
    let list: any = await API.graphql(graphqlOperation(queries.listTopics, {
      filter: { curriculumID: { eq: curricularId } },
    }));
    list = list.data.listTopics?.items || []
    list = list.map((item: any) => ({
      id: item.id,
      name: item.name,
      value: item.name
    }));
    setTopics(list)
    if (topicId) {
      setTopic(list.find((item: any) => item.id === topicId))
    }
  }
  const fetchMeasurementSequence = async (topicId: string) => {
    let item: any = await API.graphql(graphqlOperation(queries.getCSequences,
      { id: `m_${topicId}` }))
    item = item?.data.getCSequences?.sequence || []
    if (item) {
      setMeasurementIds(item)
    }
  }

  const validateForm = () => {
    let isValid = true
    const msgs = validation;
    if (!name.length) {
      isValid = false;
      msgs.name = 'Name is required';
    } else {
      msgs.name = ''
    }
    if (!topic.id) {
      isValid = false;
      msgs.topic = 'topic is required';
    } else {
      msgs.topic = ''
    }
    setValidation({ ...msgs });
    return isValid;
  }

  const saveMeasurementDetails = async () => {
    const isValid = validateForm()
    if (isValid) {
      const input = {
        name, topicID: topic.id,
        criteria,
        curriculumID: curricularId
      };
      const item: any = await API.graphql(graphqlOperation(customMutations.createRubric, { input }));
      const addedItem = item.data.createRubric
      if (!measurementIds.length) {
        let seqItem: any = await API.graphql(graphqlOperation(mutations.createCSequences, { input: { id: `m_${topic.id}`, sequence: [addedItem.id] } }));
        seqItem = seqItem.data.createCSequences
        console.log('seqItem', seqItem)
      } else {
        let seqItem: any = await API.graphql(graphqlOperation(mutations.updateCSequences, { input: { id: `m_${topic.id}`, sequence: [...measurementIds, addedItem.id] } }));
        seqItem = seqItem.data.updateCSequences
        console.log('seqItem', seqItem)
      }
      if (addedItem) {
        history.goBack()
      } else {
        console.log('Could not add measurement');
      }
    }
  }

  useEffect(() => {
    fetchTopics()
  }, [])

  useEffect(() => {
    if (topic?.id) {
      fetchMeasurementSequence(topic.id)
    }
  }, [topic.id])

  return (
    <div className="w-8/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Add Measurement" subtitle="Add new measurement to curricular." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons label="Go Back" btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-6/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">MEASUREMENT INFORMATION</h3>
        </div>
        <div className="w-6/10 m-auto">
          <div className="">

            <div className="px-3 py-4">
              <FormInput id='name' value={name} onChange={onInputChange} name='name' label="Measurement Name" isRequired />
              {
                validation.name && <p className="text-red-600">{validation.name}</p>
              }
            </div>
            {/* <div className="px-3 py-4">
              <div>
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  Select Topic <span className="text-red-500">*</span>
                </label>
                <Selector selectedItem={topic.value} placeholder="Topic" list={topics} onChange={selectTopic} />
                {
                  validation.topic && <p className="text-red-600">{validation.topic}</p>
                }
              </div>
            </div> */}

            <div className="px-3 py-4">
              <TextArea rows={3} id='criteria' value={criteria} onChange={onInputChange} name='criteria' label="Criteria" />
            </div>
          </div>
        </div>
        <div className="flex my-8 justify-center">
          <Buttons btnClass="py-3 px-10 mr-4" label="cancel" onClick={history.goBack} transparent />
          <Buttons btnClass="py-3 px-10 ml-4" label="Save" onClick={saveMeasurementDetails} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default AddMeasurement
