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

interface EditSyllabusProps {

}

const EditSyllabus = (props: EditSyllabusProps) => {
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
    { title: 'Edit Syllabus', url: `/dashboard/curricular/syllabus/edit?id=${'_blank_'}`, last: true }
  ];

  const sequenceList: any[] = [];
  const languageList: any[] = [];
  const designersList: any[] = [];
  const selectedLessonsList: any[] = [];
  const lessonsList: any[] = [];

  const onInputChange = () => {

  }
  const saveSyllabusDetails = () => {

  }
  const editCurrentLesson = (id: string) => {

  }
  const addNewLesson = () => {

  }

  return (
    <div className="w-9/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Edit Syllabus" subtitle="Edit curricular syllabus." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>

        <div className="h-9/10 flex flex-col md:flex-row">
          <div className="w-full">
            <div className='bg-white shadow-5 sm:rounded-lg mb-4'>
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg text-center leading-6 font-medium text-gray-900">
                  GENERAL INFORMATION
                </h3>
              </div>
              <div className="w-9/10 m-auto p-4">

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
                <div className="flex my-8 justify-center">
                  <Buttons btnClass="py-3 px-10" label="Save" onClick={saveSyllabusDetails} />
                </div>
              </div>
            </div>


            <div className='bg-white shadow-5 sm:rounded-lg mb-4'>
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg text-center leading-6 font-medium text-gray-900">
                  LESSONS
                </h3>
              </div>
              <div className="w-9/10 m-auto p-4">

                {/* Add new lesson section */}
                <div className="my-12 w-8/10 m-auto grid grid-cols-8 gap-x-4">
                  <div className="col-span-2">
                    <Selector list={sequenceList} placeholder="Select Sequence" onChange={() => console.log('')} />
                  </div>
                  <div className="col-span-5">
                    <Selector list={lessonsList} placeholder="Select Lesson" onChange={() => console.log('')} />
                  </div>
                  <div className="col-span-1">
                    <Buttons btnClass="ml-4 py-1" label="Add" onClick={addNewLesson} />
                  </div>
                </div>

                {/* Lessons list  */}
                <div>
                  {(selectedLessonsList && selectedLessonsList.length > 0) ? (
                    <div>
                      <div className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                        <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>No.</span>
                        </div>
                        <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Lesson Name</span>
                        </div>
                        <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Type</span>
                        </div>
                        <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Status</span>
                        </div>
                        <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Actions</span>
                        </div>
                      </div>

                      <div className="max-h-88 overflow-y-scroll">
                        {selectedLessonsList.map((item, index) => (
                          // Modify fileds property as required.

                          <div key={index} className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                            <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>
                            <div className="flex w-3/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                              {item.name ? item.name : ''}
                            </div>
                            <div className="flex w-3/10 items-center px-8 py-3 text-left text-s text-gray-500 leading-4 font-medium ">
                              {item.type ? item.type : ''}
                            </div>
                            <div className="flex w-3/10 items-center px-8 py-3 text-left text-s text-gray-500 leading-4 font-medium ">
                              {item.status ? item.status : ''}
                            </div>
                            <span className="w-2/10 h-6 flex items-center text-left px-8 py-3 text-indigo-600 hover:text-indigo-900 cursor-pointer" onClick={() => editCurrentLesson(item.id)}>
                              edit
                      </span>
                          </div>
                        ))}

                      </div>

                    </div>
                  ) : (
                      <div className="text-center p-16 mt-4">
                        No lessons selected.
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>




      </PageWrapper>
    </div>
  )
}

export default EditSyllabus
