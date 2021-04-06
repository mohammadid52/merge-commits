import React, { useContext, useState } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';

import Modal from '../../../../Atoms/Modal';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import TextArea from '../../../../Atoms/Form/TextArea';
import CheckBox from '../../../../Atoms/Form/CheckBox';
import Selector from '../../../../Atoms/Form/Selector';
import { getAsset } from '../../../../../assets';
import { GlobalContext } from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';

interface AddQuestionModalProps {
  closeAction: () => void
  saveAction: () => void
  setActiveStep: (step: string) => void
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

const AddQuestionModal = (props: AddQuestionModalProps) => {

  const { closeAction, saveAction, setActiveStep } = props;

  const { theme, clientKey,userLanguage } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const { AddQuestionModalDict ,BreadcrumsTitles } = useDictionary(clientKey);
  
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
    <Modal showHeader={true} title={AddQuestionModalDict[userLanguage]['TITLE']} showHeaderBorder={true} showFooter={false}
      closeAction={closeAction}
    >
      <div className="">
        <a className="text-sm text-indigo-600 px-6 cursor-pointer" onClick={() => setActiveStep('Previously Used Questions')}>{AddQuestionModalDict[userLanguage]['HEADING']}</a>
        <div className="grid grid-cols-2 min-w-256 py-4">
          <div className="px-6">
            <TextArea value={""} rows={3} id='question' onChange={onInputChange} name='question' label={AddQuestionModalDict[userLanguage]['QUESTION']} isRequired />
          </div>
          <div className="px-6">
            <TextArea value={""} rows={3} id='notes' onChange={onInputChange} name='notes' label={AddQuestionModalDict[userLanguage]['NOTELABEL']} />
          </div>
        </div>

        <div className="grid grid-cols-2 min-w-256 py-4">
          <div className="px-6">
            <FormInput value={""} id='Label' onChange={onInputChange} name='label' label={AddQuestionModalDict[userLanguage]['QUESTIONLABEL']} isRequired />
          </div>

          <div className="px-6">
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              Select Language
            </label>
            <Selector selectedItem={""} placeholder={AddQuestionModalDict[userLanguage]['LANGUAGE']} list={languageList} onChange={(val, name, id) => onSelectOption(val, name, id, 'language')} />
          </div>
        </div>

        <div className="grid grid-cols-2 min-w-256 py-4">
          <div className="px-6">
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              Select Type
            </label>
            <Selector selectedItem={type.name} placeholder={AddQuestionModalDict[userLanguage]['TYPE']} list={typeList} onChange={(val, name, id) => onSelectOption(val, name, id, 'type')} />
          </div>
          <div className="px-6 flex items-center">
            <CheckBox value={true} onChange={() => console.log("onChange")} name='isRequired' label={AddQuestionModalDict[userLanguage]['MAKEQUESTIONREQUIRED']} />
          </div>
        </div>

        {(type.id === '3' || type.id === '4') && (<div className="p-6">
          <div className="p-6 border-gray-400 border">
            <p className="text-m font-medium leading-5 text-gray-700 mb-1">{AddQuestionModalDict[userLanguage]['ADDOPTION']} </p>

            <div className="flex w-9/10 mx-auto mt-4">
              <div className="w-8/10">
                <FormInput value={""} id='option' onChange={() => console.log("onInputChange")} name='label' />
              </div>
              <div className="w-1/10 flex items-center">
                <span className="w-auto cursor-pointer text-indigo-600">
                  <IconContext.Provider value={{ size: '2rem', color: theme.iconColor[themeColor] }}>
                    <IoMdAddCircleOutline />
                  </IconContext.Provider>
                </span>
                <span className="w-auto cursor-pointer text-indigo-600">
                  <IconContext.Provider value={{ size: '2rem', color: theme.iconColor[themeColor] }}>
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
                  <IconContext.Provider value={{ size: '2rem', color: theme.iconColor[themeColor] }}>
                    <IoMdAddCircleOutline />
                  </IconContext.Provider>
                </span>
                <span className="w-auto cursor-pointer text-indigo-600">
                  <IconContext.Provider value={{ size: '2rem', color: theme.iconColor[themeColor] }}>
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
                  <IconContext.Provider value={{ size: '2rem', color: theme.iconColor[themeColor] }}>
                    <IoMdAddCircleOutline />
                  </IconContext.Provider>
                </span>
                <span className="w-auto cursor-pointer text-indigo-600">
                  <IconContext.Provider value={{ size: '2rem', color: theme.iconColor[themeColor] }}>
                    <IoMdRemoveCircleOutline />
                  </IconContext.Provider>
                </span>
              </div>
            </div>

            <div className="flex w-9/10 mx-auto mt-4">
              <div className="w-2/4 flex items-center">
                <CheckBox value={true} onChange={() => console.log("onChange")} name='otherOpt' label={AddQuestionModalDict[userLanguage]['ADDOTHEROPTION']} />
              </div>
              <div className="w-2/4 flex items-center">
                <CheckBox value={true} onChange={() => console.log("onChange")} name='isRequired' label={AddQuestionModalDict[userLanguage]['ADDNOTEABOVE']} />
              </div>
            </div>
          </div>
        </div>)}

        <div className="flex mt-8 justify-center px-6 pb-4">
          <div className="">
            <Buttons btnClass="py-1 px-2 text-xs ml-4" label={AddQuestionModalDict[userLanguage]['BUTTON']['NEXT']} onClick={saveAction} Icon={IoMdAddCircleOutline} />
          </div>
          <div className="flex justify-end">
            <Buttons btnClass="py-1 px-4 text-xs mr-2" label={AddQuestionModalDict[userLanguage]['BUTTON']['CANCEL']} onClick={closeAction} transparent />
            <Buttons btnClass="py-1 px-8 text-xs ml-2" label={AddQuestionModalDict[userLanguage]['BUTTON']['SAVE']} onClick={saveAction} />
          </div>
        </div>
      </div>
    </Modal>

  )
}

export default AddQuestionModal