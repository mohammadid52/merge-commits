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

interface AddMeasurementProps {

}

const AddMeasurement = (props: AddMeasurementProps) => {
  const { } = props;
  const history = useHistory();
  const [measurementData, setMeasurementData] = useState();
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false
  });
  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Add Measurement', url: `/dashboard/curricular/measurement/add?id=${'_blank_'}`, last: true }
  ];
  const sequenceList: any[] = [];
  const topicList: any[] = [];

  const onInputChange = () => {

  }
  const saveMeasurementDetails = () => {

  }
  return (
    <div className="w-8/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Add Measurement" subtitle="Add new measurement to curricular." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-6/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">MEASUREMENT INFORMATION</h3>
          <div className="">
            
            <div className="px-3 py-4">
              <FormInput id='name' onChange={onInputChange} name='name' label="Measurement Name" isRequired />
            </div>
            <div className="px-3 py-4 grid gap-x-4 grid-cols-2">
              <div>
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  Select Sequence
              </label>
                <Selector placeholder="Sequence" list={sequenceList} onChange={() => console.log('')} />
              </div>
              <div>
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  Select Topic
              </label>
                <Selector placeholder="Topic" list={topicList} onChange={() => console.log('')} />
              </div>
            </div>

            <div className="px-3 py-4">
              <TextArea rows={3} id='criteria' onChange={onInputChange} name='criteria' label="Criteria" />
            </div>
            <div className="px-3 py-4">
              <TextArea rows={3} id='distinguished' onChange={onInputChange} name='distinguished' label="Distinguished" />
            </div>
            <div className="px-3 py-4">
              <TextArea rows={3} id='excelled' onChange={onInputChange} name='excelled' label="Excelled" />
            </div>
            <div className="px-3 py-4">
              <TextArea rows={3} id='adequite' onChange={onInputChange} name='adequite' label="Adequite" />
            </div>
            <div className="px-3 py-4">
              <TextArea rows={3} id='basic' onChange={onInputChange} name='basic' label="Basic" />
            </div>
          </div>
        </div>
        <div className="flex my-8 justify-center">
          <Buttons btnClass="py-3 px-10" label="Save" onClick={saveMeasurementDetails} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default AddMeasurement
