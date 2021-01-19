import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';

import Buttons from '../../../Atoms/Buttons';
import Selector from '../../../Atoms/Form/Selector';
import MultipleSelector from '../../../Atoms/Form/MultipleSelector';
import FormInput from '../../../Atoms/Form/FormInput';
import TextArea from '../../../Atoms/Form/TextArea';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageWrapper from '../../../Atoms/PageWrapper';

interface QuestionAddProps {

}
interface InitialState {
  question: string
  notes: string
}

const QuestionAdd = (props: QuestionAddProps) => {
  const { } = props;
  const history = useHistory();
  const initialState = {
    question: '',
    notes: ''
  }
  const [questionData, setQuestionData] = useState<InitialState>(initialState)
  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Question Bank', url: '/dashboard/question-bank', last: false },
    { title: 'Add New Question', url: '/dashboard/question-bank/question/add', last: true },
  ]
  const selectedDesigners: any = [];
  const designersList: any = [];
  const languageList = [
    { id: 1, name: 'English', value: 'EN' },
    { id: 2, name: 'Spanish', value: 'ES' },
  ];
  const onInputChange = () => {

  }

  const selectDesigner = () => {

  }
  const selectLanguage = () => {

  }

  const { question, notes } = questionData;
  return (
    <div className="w-9/10 h-full p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="ADD QUESTION" subtitle="Add new question to the list" />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body */}
      <PageWrapper>
        <div className="m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">QUESTION DETAILS</h3>
          <div className="">

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <FormInput value={question} id='question' onChange={onInputChange} name='question' label="Question" isRequired />
              </div>
              <div>
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  Select Designers
                </label>
                <MultipleSelector selectedItems={selectedDesigners} placeholder="Designers" list={designersList} onChange={selectDesigner} />
              </div>
            </div>

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <Selector selectedItem={''} placeholder="Language" list={languageList} onChange={selectLanguage} />
              </div>
              <div>
                <Selector selectedItem={''} placeholder="Language" list={languageList} onChange={selectLanguage} />
              </div>
            </div>

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <Selector selectedItem={''} placeholder="Language" list={languageList} onChange={selectLanguage} />
              </div>
              <div>
                <Selector selectedItem={''} placeholder="Language" list={languageList} onChange={selectLanguage} />
              </div>
            </div>
            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <TextArea value={notes} rows={3} id='notes' onChange={onInputChange} name='notes' label="Notes" />
              </div>

            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}

export default QuestionAdd
