import React, { useState, useEffect, Fragment } from 'react';
import { useHistory, useParams } from 'react-router';
import { IoArrowUndoCircleOutline, IoOptionsOutline } from 'react-icons/io5';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import API, { graphqlOperation } from '@aws-amplify/api'

import * as mutations from '../../../../../../../graphql/mutations';
import { getTypeString } from '../../../../../../../utilities/strings';

import MultipleSelector from '../../../../../../Atoms/Form/MultipleSelector';
import SectionTitle from '../../../../../../Atoms/SectionTitle';
import PageWrapper from '../../../../../../Atoms/PageWrapper';
import BreadCrums from '../../../../../../Atoms/BreadCrums';
import FormInput from '../../../../../../Atoms/Form/FormInput';
import Selector from '../../../../../../Atoms/Form/Selector';
import CheckBox from '../../../../../../Atoms/Form/CheckBox';
import Buttons from '../../../../../../Atoms/Buttons';
import Modal from '../../../../../../Atoms/Modal';

interface AddProfileCheckpointProps {

}

interface AddQuestionModalProps {
  closeAction: () => void
  saveAction: () => void
}

interface InitialState {
  question: string
  notes: string
  label: string
  type: InputValue
  language: InputValue
  isRequired: boolean
  options: { label: string, text: string }[] | null
  otherOpt: boolean
  noneOfAbove: boolean
}
interface InputValue {
  id: string,
  name: string,
  value: string
}

const AddProfileCheckpoint = (props: AddProfileCheckpointProps) => {
  const { } = props;
  const history = useHistory();
  const urlParams: any = useParams()
  const curricularId = urlParams.curricularId;

  const initialData = {
    title: '',
    label: '',
    language: { id: '1', name: "English", value: 'EN' }
  }
  const tempQuestionData: any = [
    { id: '1', question: 'Question one', type: 'text' },
    { id: '2', question: 'Question two', type: 'text' },
    { id: '3', question: 'Question three', type: 'selectMany' },
    { id: '4', question: 'Question four', type: 'text' },
  ]
  const [checkpointData, setCheckpointData] = useState(initialData);
  const [selectedDesigners, setSelectedDesigner] = useState([]);
  const [checkpQuestions, setCheckpQuestions] = useState(tempQuestionData);
  const [questionOptions, setQuestionOptions] = useState({ quesId: '', options: [] });
  const [showModal, setShowModal] = useState(false);

  const designersList: any = [];

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Add Checkpoint', url: `/dashboard/curricular/${curricularId}/checkpoint/add`, last: true }
  ];

  const languageList = [
    { id: 1, name: 'English', value: 'EN' },
    { id: 2, name: 'Spanish', value: 'ES' },
  ];


  const onInputChange = (e: any) => {
    setCheckpointData({
      ...checkpointData,
      [e.target.name]: e.target.value
    })
    // if (validation.title || validation.label) {
    //   setValidation({
    //     ...validation,
    //     title: '',
    //     label: ''
    //   })
    // }
  }

  const selectLanguage = (value: string, name: string, id: string) => {
    setCheckpointData({
      ...checkpointData,
      language: {
        id,
        name,
        value
      }
    })
  }

  const selectDesigner = (id: string, name: string, value: string) => {
    let updatedList;
    const currentDesigners = selectedDesigners;
    const selectedItem = currentDesigners.find(item => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentDesigners, { id, name, value }];
    } else {
      updatedList = currentDesigners.filter(item => item.id !== id);
    }
    setSelectedDesigner(updatedList)
  }

  const showOptions = (quesId: string, options: any[]) => {
    if (questionOptions.quesId !== quesId) {
      setQuestionOptions({ quesId, options })
    } else {
      setQuestionOptions({ quesId: '', options: [] })
    }
  }
  const toggleModal = () => {
    setShowModal(!showModal);
  }
  const addNewQuestion = () => {
    // Add new Question here.
    toggleModal();
  }
  const { title, language, label } = checkpointData;

  return (
    <div className="w-full h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Add Checkpoint" subtitle="Add new checkpoint to curricular." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-8/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">ADD NEW CHECKPOINT</h3>
        </div>
        <div className="w-9/10 m-auto">
          <div className="">

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <FormInput value={title} id='title' onChange={onInputChange} name='title' label='Title' isRequired />
                {/* {validation.title && <p className="text-red-600 text-sm">{validation.title}</p>} */}
              </div>
              <div>
                <FormInput value={label} id='label' onChange={onInputChange} name='label' label="Checkpoint Label" isRequired />
                {/* {validation.label && <p className="text-red-600 text-sm">{validation.label}</p>} */}
              </div>
            </div>

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  Select Designers
                </label>
                <MultipleSelector selectedItems={selectedDesigners} placeholder="Designers" list={designersList} onChange={selectDesigner} />
              </div>
              <div>
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  Select Language
                </label>
                <Selector selectedItem={language.name} placeholder="Language" list={languageList} onChange={selectLanguage} />
              </div>
            </div>


            {/* Question table */}
            <div className="p-6 border-gray-400 border my-4 border-dashed">
              <p className="text-m font-medium leading-5 text-gray-700 my-2 text-center">Checkpoint Questions: </p>
              {!checkpQuestions?.length ? (
                <div className="my-8">
                  <p className="text-center p-8"> Please add questions to this checkpoint.</p>
                  <div className="flex w-full mx-auto p-8 justify-center ">
                    <Buttons btnClass="mr-4" onClick={() => console.log('QuestionLookup')} label="Add Existing Questions" />
                    <Buttons btnClass="ml-4" onClick={toggleModal} label="Create New Question" />
                  </div>
                </div>
              ) : (
                  <Fragment>
                    <div className="max-h-112 overflow-auto">
                      <div className="flex justify-between w-full px-8 py-4 mx-auto whitespace-no-wrap border-b border-gray-200">
                        <div className="w-.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>No.</span>
                        </div>
                        <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Question</span>
                        </div>
                        <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Type</span>
                        </div>
                        <div className="w-1.5/10 px-8 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Options</span>
                        </div>
                      </div>

                      <div className="w-full m-auto">
                        {checkpQuestions.length > 0 ? checkpQuestions.map((item: any, index: number) => (
                          <Fragment key={item.id}>
                            <div key={item.id} className={`flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200 ${questionOptions.quesId === item.id && 'bg-gray-200'}`}>
                              <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4"> {index + 1}.</div>
                              <div className="flex w-6/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal"> {item.question} </div>
                              <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{item.type ? getTypeString(item.type) : '--'}</div>
                              {/* <div className="flex w-1.5/10 px-6 py-3 text-s leading-4 items-center justify-center">
                                <span className="cursor-pointer">
                                  <CheckBox value={item.required ? true : false} onChange={() => console.log(item.id)} name='isRequired' />
                                </span>
                              </div> */}
                              <div className="flex w-1.5/10 px-6 py-1 text-s leading-4 items-center justify-center">
                                {(item.type === 'selectMany' || item.type === 'selectOne') && (<div className="w-6 h-6 cursor-pointer text-indigo-600" onClick={() => showOptions(item.id, item.options)}>
                                  <IconContext.Provider value={{ size: '1.5rem', color: '#667eea' }}>
                                    <IoOptionsOutline />
                                  </IconContext.Provider>
                                </div>)}
                              </div>
                            </div>
                            {(questionOptions.quesId === item.id) && (<div className="px-16 py-4 flex flex-col text-gray-700 font-medium text-sm border-b border-gray-200">
                              <p className="text-gray-900 px-2 py-2 text-base">Options:</p>
                              {questionOptions.options?.map((item, index) => (
                                <span className="px-12 py-2" key={item.label}>{index + 1}. {item.text}</span>
                              ))}
                            </div>)}
                          </Fragment>
                        )) : (
                            <div className="py-12 my-6 text-center">
                              <p> This checkpoint does not have any questions</p>
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="flex w-full mx-auto p-8 justify-center ">
                      <Buttons btnClass="mr-4" onClick={() => console.log('QuestionLookup')} label="Add Existing Questions" />
                      <Buttons btnClass="ml-4" onClick={toggleModal} label="Create New Question" />
                    </div>
                    {showModal && <AddQuestionModal closeAction={toggleModal} saveAction={addNewQuestion} />}
                  </Fragment>
                )}
            </div>

          </div>
        </div>
      </PageWrapper>
    </div>
  )
}

export default AddProfileCheckpoint

const AddQuestionModal = (props: AddQuestionModalProps) => {
  const { closeAction, saveAction } = props;

  const initialState = {
    question: '',
    notes: '',
    label: '',
    type: { id: '', name: '', value: '' },
    language: { id: '1', name: "English", value: 'EN' },
    isRequired: false,
    options: [{ label: '1', text: '' }, { label: '2', text: '' }],
    otherOpt: false,
    noneOfAbove: false
  }
  const [questionData, setQuestionData] = useState<InitialState>(initialState)
  // const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    question: '',
    label: '',
    type: '',
    options: '',
    message: '',
    isError: true
  });
  const typeList: any = [
    { id: '1', name: 'Text', value: 'text' },
    { id: '2', name: 'Input', value: 'input' },
    { id: '3', name: 'Select Many', value: 'selectMany' },
    { id: '4', name: 'Select One', value: 'selectOne' },
  ];

  const languageList = [
    { id: 1, name: 'English', value: 'EN' },
    { id: 2, name: 'Spanish', value: 'ES' },
  ];

  const selectOneOptions = [
    {
      label: "1",
      text: "Very Difficult"
    },
    {
      label: "2",
      text: "Difficult"
    },
    {
      label: "3",
      text: "Easy"
    },
    {
      label: "4",
      text: "Very Easy"
    }
  ]

  const onInputChange = (e: any) => {
    setQuestionData({
      ...questionData,
      [e.target.name]: e.target.value
    })
  }
  const toggleCheckBoxState = (field: string, value: boolean) => {
    setQuestionData({
      ...questionData,
      [field]: !value
    })
  }
  const optionInputChange = (index: number, e: any) => {
    const currentOptions = [...questionData.options]
    currentOptions[index].text = e.target.value
    setQuestionData({
      ...questionData,
      options: currentOptions
    })
  }
  const onOptionAdd = (index: number) => {

    // adding new option field after selected options index.
    const currentOptions = [...questionData.options]
    const newItem = { label: (index + 2).toString(), text: '' }
    currentOptions.splice(index + 1, 0, newItem)
    let updatedOptions = currentOptions.map((item, i) => {
      if (i > (index + 1)) {
        item.label = (i + 1).toString();
        return item
      } else {
        return item;
      }
    })
    setQuestionData({
      ...questionData,
      options: updatedOptions
    })
  }
  const onOptionRemove = (index: number) => {

    // Removing option field from specific index
    if (questionData.options.length > 1) {
      const currentOptions = [...questionData.options]
      currentOptions.splice(index, 1)
      let updatedOptions = currentOptions.map((item, i) => {
        if (i >= index) {
          item.label = (i + 1).toString();
          return item
        } else {
          return item;
        }
      })
      setQuestionData({
        ...questionData,
        options: updatedOptions
      })
    }
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
  };
  const filteredOptions = (options: { label: string, text: string }[]) => {
    let optionsObj = [...options];
    if (questionData.otherOpt) {
      optionsObj.push({ label: 'other', text: 'Other' })
    }
    if (questionData.noneOfAbove) {
      optionsObj.push({ label: 'none', text: 'None of the above' })
    }
    return optionsObj;
  }

  const validateForm = () => {
    let isValid = true
    const msgs = validation;
    if (!questionData.question?.trim().length) {
      isValid = false;
      msgs.question = 'Question input is required';
    } else {
      msgs.question = ''
    }
    if (!questionData.type.value?.trim().length) {
      isValid = false;
      msgs.type = 'Question type is required';
    } else {
      msgs.type = ''
    }
    if (!questionData.label?.trim().length) {
      isValid = false;
      msgs.label = 'Question label is required';
    } else {
      msgs.label = ''
    }
    setValidation({ ...msgs });
    return isValid;
  }

  const saveNewQuestion = async () => {
    const isValid = validateForm();
    if (isValid) {
      try {
        setLoading(true)
        const questOptions = questionData.options
        const input = {
          label: questionData.label,
          type: questionData.type.value,
          question: questionData.question,
          // designers: selectedDesigners.map(item => item.id),
          language: questionData.language.value,
          options: filteredOptions(questionData.options)
        }
        const results: any = await API.graphql(
          graphqlOperation(mutations.createQuestion, { input: input })
        );
        const newQuestion = results?.data?.createQuestion;
        if (newQuestion.id) {
          newQuestion.required = questionData.isRequired;
          // setCheckpQuestions(newQuestion)
          setValidation({
            question: '',
            type: '',
            label: '',
            options: '',
            message: 'Question details has been saved.',
            isError: false
          });
          saveAction();
        }
        setLoading(false)
      } catch {
        setValidation({
          question: '',
          type: '',
          label: '',
          options: '',
          message: 'Unable to save Question details, Please try again later.',
          isError: true
        });
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (questionData.type?.value === 'selectOne') {
      setQuestionData({
        ...questionData,
        options: selectOneOptions
      })
    } else if (questionData.type?.value === 'selectMany') {
      setQuestionData({
        ...questionData,
        options: [{ label: '1', text: '' }, { label: '2', text: '' }]
      })
    }
  }, [questionData.type])

  const { question, label, type, language, options, otherOpt, noneOfAbove } = questionData;
  return (
    // <Modal showHeader={true} showHeaderBorder={false} showFooter={false} closeAction={closeAction}>
    <div className="w-168 text-center my-8">
      <p className="my-4 px-6 text-gray-800 text-lg font-medium leading-8">Add new checkpoint</p>
      <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
        <div>
          <FormInput value={question} id='question' onChange={onInputChange} name='question' label="Question" isRequired />
          {validation.question && <p className="text-red-600 text-sm">{validation.question}</p>}
        </div>
        <div>
          <FormInput value={label} id='Label' onChange={onInputChange} name='label' label="Question Label" isRequired />
          {validation.label && <p className="text-red-600 text-sm">{validation.label}</p>}
        </div>
      </div>

      <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
        <div>
          <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
            Select Type <span className="text-red-500">*</span>
          </label>
          <Selector selectedItem={type.name} placeholder="Type" list={typeList} onChange={(val, name, id) => onSelectOption(val, name, id, 'type')} />
          {/* {validation.type && <p className="text-red-600 text-sm">{validation.type}</p>} */}
        </div>
        <div>
          <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
            Select Language
            </label>
          <Selector selectedItem={language.name} placeholder="Language" list={languageList} onChange={(val, name, id) => onSelectOption(val, name, id, 'language')} />
        </div>
      </div>



      {(type.value === 'selectOne' || type.value === 'selectMany') && (<div className="p-6">
        <div className="p-6 border-gray-400 border border-dashed">
          <p className="text-m font-medium leading-5 text-gray-700 mb-1">Add Options: </p>

          {/* Options input fields */}
          {options?.length && options.map((item, index) => (
            <div className="flex w-9/10 mx-auto mt-4">
              <div className="w-8/10">
                <FormInput value={item.text} id={item.label} onChange={(e) => optionInputChange(index, e)} name={item.label} />
              </div>
              <div className="w-1/10 flex items-center">
                <span className="w-auto cursor-pointer text-indigo-600" onClick={() => onOptionAdd(index)}>
                  <IconContext.Provider value={{ size: '2rem', color: '#667eea' }}>
                    <IoMdAddCircleOutline />
                  </IconContext.Provider>
                </span>
                <span className="w-auto cursor-pointer text-indigo-600" onClick={() => onOptionRemove(index)}>
                  <IconContext.Provider value={{ size: '2rem', color: '#667eea' }}>
                    <IoMdRemoveCircleOutline />
                  </IconContext.Provider>
                </span>
              </div>
            </div>
          ))}

          {/* Other options checkboxes */}
          <div className="flex w-9/10 mx-auto mt-4">
            <div className="w-2/4 flex items-center">
              <CheckBox value={otherOpt} onChange={() => toggleCheckBoxState("otherOpt", otherOpt)} name='otherOpt' label={`Add an "Other" Answer Option and Comment Field`} />
            </div>
            <div className="w-2/4 flex items-center">
              <CheckBox value={noneOfAbove} onChange={() => toggleCheckBoxState("noneOfAbove", noneOfAbove)} name='noneOfAbove' label={`Add a "None of the above" Answer Option`} />
            </div>
          </div>
        </div>
      </div>)}

      {validation.message && <div className="py-4 m-auto mt-2 text-center">
        <p className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>{validation.message}</p>
      </div>}
      <div className="flex justify-around mt-16 w-5/10 mx-auto">
        <Buttons label="Cancel" btnClass='px-8 py-3 mr-4' onClick={closeAction} transparent />

        <Buttons label={"Save"} btnClass='px-10 py-3 ml-4' onClick={saveNewQuestion} />
      </div>
    </div>
    // </Modal>
  )
}