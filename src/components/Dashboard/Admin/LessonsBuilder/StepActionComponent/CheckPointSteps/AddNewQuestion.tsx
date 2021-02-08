import React, { Fragment, useState } from 'react'
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoIosKeypad, IoMdAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import { RiArrowRightLine } from 'react-icons/ri';

import Buttons from '../../../../../Atoms/Buttons';
import FormInput from '../../../../../Atoms/Form/FormInput';
import TextArea from '../../../../../Atoms/Form/TextArea';
import CheckBox from '../../../../../Atoms/Form/CheckBox';
import Selector from '../../../../../Atoms/Form/Selector';

interface AddNewQuestionProps {
  changeStep: (step: string) => void

}
interface InitialState {
  question: string
  notes: string
  label: string
  type: InputValue
  language: InputValue
}

interface InputValue {
  id: string,
  name: string,
  value: string
}

const AddNewQuestion = (props: AddNewQuestionProps) => {
  const { changeStep } = props;

  const initialState = {
    question: '',
    notes: '',
    label: '',
    type: { id: '', name: '', value: '' },
    language: { id: '', name: '', value: '' },
  }
  const [questionData, setQuestionData] = useState<InitialState>(initialState)
  const typeList: any = [
    { id: '1', name: 'Text', value: 'text' },
    { id: '2', name: 'Input', value: 'input' },
    { id: '3', name: 'Select Many', value: 'selectMany' },
    { id: '4', name: 'Select One', value: 'selectOne' },
  ];
  const languageList: any = [];

  const onInputChange = (e: any) => {
    setQuestionData({
      ...questionData,
      [e.target.name]: e.target.value
    })
  }

  const onSelectOption = (val: string, name: string, id: string, field: string) => {
    setQuestionData({
      ...questionData,
      [field]: {
        id: id,
        name: name,
        value: val
      }
    })
  }

  const { question, notes, label, type, language } = questionData;


  return (
    <Fragment>
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center">
        <span className="w-6 h-6 flex items-center mr-4" onClick={() => console.log('')}>
          <IconContext.Provider value={{ size: '1.5rem', color: 'darkgrey' }}>
            <IoIosKeypad />
          </IconContext.Provider>
        </span>

        {/* Breadcrums */}
        <h4 className="text-base leading-6 font-medium text-gray-900 flex items-center">
          <span className="w-auto flex-shrink-0 cursor-pointer" onClick={() => changeStep('SelectedCheckPointsList')}>Assessment Builder</span>
          <span className="w-6 h-6 flex items-center mx-4">
            <IconContext.Provider value={{ size: '1.5rem', color: 'darkgrey' }}>
              <RiArrowRightLine />
            </IconContext.Provider>
          </span>
          <span className="font-normal text-gray-600 w-auto flex-shrink-0">Checkpoints</span>
          <span className="w-6 h-6 flex items-center mx-4">
            <IconContext.Provider value={{ size: '1.5rem', color: 'darkgrey' }}>
              <RiArrowRightLine />
            </IconContext.Provider>
          </span>
          <span className="font-normal text-gray-600 w-auto flex-shrink-0">Add New Question</span>
        </h4>
      </div>

      {/* Component body */}
      <div className="p-4">
        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            {/* <TextArea value={""} rows={3} id='question' onChange={onInputChange} name='question' label="Question" isRequired /> */}
            <FormInput value={""} id='question' onChange={onInputChange} name='question' label="Question" isRequired />
          </div>
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              Select Language
            </label>
            <Selector selectedItem={""} placeholder="Language" list={languageList} onChange={(val, name, id) => onSelectOption(val, name, id, 'language')} />
          </div>
          {/* <div>
            <TextArea value={""} rows={3} id='notes' onChange={onInputChange} name='notes' label="Notes" />
          </div> */}
        </div>

        {/* <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <FormInput value={""} id='Label' onChange={onInputChange} name='label' label="Question Label" isRequired />
          </div>

          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              Select Language
            </label>
            <Selector selectedItem={""} placeholder="Language" list={languageList} onChange={(val, name, id) => onSelectOption(val, name, id, 'language')} />
          </div>
        </div> */}

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              Select Type
            </label>
            <Selector selectedItem={type.name} placeholder="Type" list={typeList} onChange={(val, name, id) => onSelectOption(val, name, id, 'type')} />
          </div>
          <div className=" flex items-center">
            <CheckBox value={true} onChange={() => console.log("onChange")} name='isRequired' label="Make this question required" />
          </div>
        </div>

        {(type.id === '3' || type.id === '4') && (<div className="p-6">
          <div className="p-6 border-gray-400 border border-dashed">
            <p className="text-m font-medium leading-5 text-gray-700 mb-1">Add Options: </p>

            <div className="flex w-9/10 mx-auto mt-4">
              <div className="w-8/10">
                <FormInput value={""} id='option' onChange={() => console.log("onInputChange")} name='label' />
              </div>
              <div className="w-1/10 flex items-center">
                <span className="w-auto cursor-pointer text-indigo-600">
                  <IconContext.Provider value={{ size: '2rem', color: '#667eea' }}>
                    <IoMdAddCircleOutline />
                  </IconContext.Provider>
                </span>
                <span className="w-auto cursor-pointer text-indigo-600">
                  <IconContext.Provider value={{ size: '2rem', color: '#667eea' }}>
                    <IoMdRemoveCircleOutline />
                  </IconContext.Provider>
                </span>
              </div>
            </div>


            <div className="flex w-9/10 mx-auto mt-4">
              <div className="w-8/10">
                <FormInput value={""} id='option' onChange={() => console.log("onInputChange")} name='label' />
              </div>
              <div className="w-1/10 flex items-center">
                <span className="w-auto cursor-pointer text-indigo-600">
                  <IconContext.Provider value={{ size: '2rem', color: '#667eea' }}>
                    <IoMdAddCircleOutline />
                  </IconContext.Provider>
                </span>
                <span className="w-auto cursor-pointer text-indigo-600">
                  <IconContext.Provider value={{ size: '2rem', color: '#667eea' }}>
                    <IoMdRemoveCircleOutline />
                  </IconContext.Provider>
                </span>
              </div>
            </div>

            <div className="flex w-9/10 mx-auto mt-4">
              <div className="w-8/10">
                <FormInput value={""} id='option' onChange={() => console.log("onInputChange")} name='label' />
              </div>
              <div className="w-1/10 flex items-center">
                <span className="w-auto cursor-pointer text-indigo-600">
                  <IconContext.Provider value={{ size: '2rem', color: '#667eea' }}>
                    <IoMdAddCircleOutline />
                  </IconContext.Provider>
                </span>
                <span className="w-auto cursor-pointer text-indigo-600">
                  <IconContext.Provider value={{ size: '2rem', color: '#667eea' }}>
                    <IoMdRemoveCircleOutline />
                  </IconContext.Provider>
                </span>
              </div>
            </div>

            <div className="flex w-9/10 mx-auto mt-4">
              <div className="w-2/4 flex items-center">
                <CheckBox value={true} onChange={() => console.log("onChange")} name='otherOpt' label={`Add an "Other" Answer Option or Comment Field`} />
              </div>
              <div className="w-2/4 flex items-center">
                <CheckBox value={true} onChange={() => console.log("onChange")} name='isRequired' label={`Add a "None of the above" Answer Option`} />
              </div>
            </div>
          </div>
        </div>)}

        <div className="flex mt-8 justify-center px-6 pb-4">
          {/* <div className="">
            <Buttons btnClass="py-1 px-2 text-xs ml-4" label="Next Question" onClick={saveAction} Icon={IoMdAddCircleOutline} />
          </div> */}
          <div className="flex justify-center my-6">
            <Buttons btnClass="py-1 px-4 text-xs mr-2" label="Cancel" onClick={() => changeStep('AddNewCheckPoint')} transparent />
            <Buttons btnClass="py-1 px-8 text-xs ml-2" label="Save" onClick={() => console.log('')} />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default AddNewQuestion;
