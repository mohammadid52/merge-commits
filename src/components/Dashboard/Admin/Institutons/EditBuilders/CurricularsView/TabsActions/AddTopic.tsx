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
import * as customMutations from '../../../../../../../customGraphql/customMutations'
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
  const [validation, setValidation] = useState({ name: '', learning: '' })
  const [learnings, setLearnings] = useState([]);
  const [topicIds, setTopicIds] = useState([]);

  const onInputChange = (e: any) => {
    if (e.target.name === 'name') {
      const value = e.target.value
      setName(value)
      if (value.length && validation.name) setValidation({ ...validation, name: '' });
    }
    if (e.target.name === 'description') setDescription(e.target.value)
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
    if (!learning.id) {
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
        name, description, curriculumID: curricularId, learningObjectiveID: learning.id
      };
      const item: any = await API.graphql(graphqlOperation(customMutations.createTopic, { input }));
      const addedItem = item.data.createTopic
      if (!topicIds.length) {
        let seqItem: any = await API.graphql(graphqlOperation(mutations.createCSequences, { input: { id: `t_${curricularId}`, sequence: [addedItem.id] } }));
        seqItem = seqItem.data.createCSequences
        console.log('seqItem', seqItem)
      } else {
        let seqItem: any = await API.graphql(graphqlOperation(mutations.updateCSequences, { input: { id: `t_${curricularId}`, sequence: [...topicIds, addedItem.id] } }));
        seqItem = seqItem.data.updateCSequences
        console.log('seqItem', seqItem)
      }
      if (addedItem) {
        history.push(`/dashboard/manage-institutions/curricular?id=${curricularId}`);
      } else {
        console.log('Could not add topic');
      }
    }
  }

  // const fetchLearningObjectives = async () => {
  //   console.log('jerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
  //   let list: any = await API.graphql(graphqlOperation(queries.listLearningObjectives, {
  //     filter: { curriculumID: { eq: curricularId } },
  //   }));
  //   list = list.data.listLearningObjectives?.items || []
  //   list = list.map((item: any) => ({
  //     id: item.id,
  //     name: item.name,
  //     value: item.name
  //   }));
  //   setLearnings(list)
  // }

  const selectLearning = (val: string, name: string, id: string) => {
    if (validation.learning) {
      setValidation({ ...validation, learning: '' })
    }
    setLearning({ id, name, value: val })
  }

  // const fetchTopicsSequence = async () => {
  //   let item: any = await API.graphql(graphqlOperation(queries.getCSequences,
  //     { id: `t_${curricularId}` }))
  //   item = item?.data.getCSequences?.sequence || []
  //   if (item) {
  //     setTopicIds(item)
  //   }
  // }

  const fetchData = async () => {
    let [list, seq]:any = await Promise.all([
      await API.graphql(graphqlOperation(queries.listLearningObjectives, {
        filter: { curriculumID: { eq: curricularId } },
      })),
      await API.graphql(graphqlOperation(queries.getCSequences,
        { id: `t_${curricularId}` })),
    ]);
    list = list?.data?.listLearningObjectives?.items || []
    list = list.map((item: any) => ({ id: item.id, name: item.name, value: item.name }));
    seq = seq?.data?.getCSequences?.sequence || []
    setLearnings(list)
    setTopicIds(seq)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const cancelEvent = () => {
    history.push(`/dashboard/manage-institutions/curricular?id=${curricularId}`);
  }

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
              {
                validation.name && <p className="text-red-600">{validation.name}</p>
              }
            </div>

            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Select Learning objective <span className="text-red-500">*</span>
              </label>
              <Selector selectedItem={learning.value} placeholder="Learning objective" list={learnings} onChange={selectLearning} />
              {
                validation.learning && <p className="text-red-600">{validation.learning}</p>
              }
            </div>

            <div className="px-3 py-4">
              <TextArea id='description' value={description} onChange={onInputChange} name='description' label="Description" />
            </div>

          </div>
        </div>
        <div className="flex my-8 justify-center">
          <Buttons btnClass="py-3 px-10 mr-4" label="Cancel" onClick={cancelEvent} transparent />
          <Buttons btnClass="py-3 px-10 ml-4" label="Save" onClick={saveTopicDetails} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default AddTopic
