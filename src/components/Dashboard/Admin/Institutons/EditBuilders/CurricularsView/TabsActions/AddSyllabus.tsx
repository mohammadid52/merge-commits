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

interface AddSyllabusProps {

}

const AddSyllabus = (props: AddSyllabusProps) => {
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
    { title: 'Add Syllabus', url: `/dashboard/curricular/syllabus/add?id=${'_blank_'}`, last: true }
  ];

  const sequenceList: any[] = [];
  const languageList: any[] = [];
  const designersList: any[] = [];

  const onInputChange = () => {

  }
  const saveSyllabusDetails = () => {

  }

  return (
    <div className="w-9/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Add Syllabus" subtitle="Add new syllabus to curricular." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">SYLLABUS INFORMATION</h3>
          <div className="">

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <FormInput id='name' onChange={onInputChange} name='name' label="Syllabus Name" isRequired />
              </div>
              <div>
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  Select Designers
                </label>
                <Selector placeholder="Designers" list={designersList} onChange={() => console.log('')} />
              </div>
            </div>
            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  Select Sequence
                </label>
                <Selector placeholder="Sequence" list={sequenceList} onChange={() => console.log('')} />
              </div>
              <div>
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  Select Language
              </label>
                <Selector placeholder="Language" list={languageList} onChange={() => console.log('')} />
              </div>
            </div>

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <TextArea rows={2} id='description' onChange={onInputChange} name='description' label="Description" />
              </div>
              <div>
                <TextArea rows={2} id='purpose' onChange={onInputChange} name='purpose' label="Purpose" />
              </div>
            </div>

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <TextArea rows={2} id='objectives' onChange={onInputChange} name='objectives' label="Objectives" />
              </div>
              <div>
                <TextArea rows={2} id='methodologies' onChange={onInputChange} name='methodologies' label="Methodologies" />
              </div>
            </div>
            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <TextArea rows={2} id='policies' onChange={onInputChange} name='policies' label="Policies" />
              </div>

            </div>


          </div>
        </div>
        <div className="flex my-8 justify-center">
          <Buttons btnClass="py-3 px-10" label="Save" onClick={saveSyllabusDetails} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default AddSyllabus
