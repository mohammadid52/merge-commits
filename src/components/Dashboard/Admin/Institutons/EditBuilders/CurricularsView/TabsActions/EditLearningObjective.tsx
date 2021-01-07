import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { IoArrowUndoCircleOutline } from 'react-icons/io5'

import BreadCrums from '../../../../../../Atoms/BreadCrums'
import SectionTitle from '../../../../../../Atoms/SectionTitle'
import Buttons from '../../../../../../Atoms/Buttons'
import PageWrapper from '../../../../../../Atoms/PageWrapper'
import FormInput from '../../../../../../Atoms/Form/FormInput'
import TextArea from '../../../../../../Atoms/Form/TextArea'
import Selector from '../../../../../../Atoms/Form/Selector'

interface EditLearningObjectiveProps {

}

const EditLearningObjective = (props: EditLearningObjectiveProps) => {
  const { } = props;
  const history = useHistory();
  const [topicData, setTopicData] = useState();
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false
  });

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Edit Topic', url: `/dashboard/curricular/topic/edit?id=${'_blank_'}`, last: true }
  ];
  const sequenceList: any[] = [];
  const onInputChange = () => {

  }
  const saveTopicDetails = () => {

  }
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
          <div className="">
            <div className="px-3 py-4">
              <FormInput id='name' onChange={onInputChange} name='name' label="Topic Name" isRequired />
            </div>
            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Select Sequence
              </label>
              <Selector placeholder="Sequence" list={sequenceList} onChange={() => console.log('')} />
            </div>
            <div className="px-3 py-4">
              <TextArea id='description' onChange={onInputChange} name='description' label="Description" />
            </div>
          </div>
        </div>
        <div className="flex my-8 justify-center">
          <Buttons btnClass="py-3 px-10 mr-4" label="Cancel" onClick={history.goBack} transparent />
          <Buttons btnClass="py-3 px-10 ml-4" label="Save" onClick={saveTopicDetails} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default EditLearningObjective
