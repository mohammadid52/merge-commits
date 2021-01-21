import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api'

import * as customQueries from '../../../../customGraphql/customQueries';
import * as mutations from '../../../../graphql/mutations';

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
  label: string
  type: InputValue
  language: InputValue
}
interface InputValue {
  id: string,
  name: string,
  value: string
}

const QuestionAdd = (props: QuestionAddProps) => {
  const { } = props;
  const history = useHistory();
  const initialState = {
    question: '',
    notes: '',
    label: '',
    type: { id: '', name: '', value: '' },
    language: { id: '', name: '', value: '' },
  }
  const [questionData, setQuestionData] = useState<InitialState>(initialState)
  const [validation, setValidation] = useState({
    question: '',
    label: '',
    message: '',
    isError: true
  });
  const [loading, setLoading] = useState(false);
  const [designersList, setDesignersList] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Question Bank', url: '/dashboard/question-bank', last: false },
    { title: 'Add New Question', url: '/dashboard/question-bank/question/add', last: true },
  ]
  const topicsList: any = [];
  const sourceList: any = [];
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
  const onInputChange = (e: any) => {
    setQuestionData({
      ...questionData,
      [e.target.name]: e.target.value
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
    setSelectedDesigners(updatedList)
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

  const validateForm = () => {
    let isValid = true
    const msgs = validation;
    if (!questionData.question?.trim().length) {
      isValid = false;
      msgs.question = 'Question is required';
    } else {
      msgs.question = ''
    }
    if (!questionData.label?.trim().length) {
      isValid = false;
      msgs.label = 'Label is required';
    } else {
      msgs.label = ''
    }
    // TODO: Add validation for repeating questions.
    setValidation({ ...msgs });
    return isValid;
  }

  const saveQuestion = async () => {
    const isValid = validateForm();
    if (isValid) {
      try {
        setLoading(true)
        const input = {
          question: questionData.question,
          label: questionData.label,
          note: questionData.notes,
          type: questionData.type.value,
          language: questionData.language.value,
          designers: selectedDesigners.map(item => item.id)
        }
        const results: any = await API.graphql(
          graphqlOperation(mutations.createQuestion, { input: input })
        );
        const savedData = results?.data?.createQuestion;
        setLoading(false);
        if (savedData) {
          setValidation({
            question: '',
            label: '',
            message: 'Question details saved successfully.',
            isError: false
          })
        }
        setQuestionData(initialState);
        setSelectedDesigners([])
      } catch{
        setValidation({
          question: '',
          label: '',
          message: 'Unable to save Question details, Please try again later.',
          isError: true
        });
        setLoading(false)
      }
    }
  }

  const fetchPersonsList = async () => {
    try {
      const result: any = await API.graphql(graphqlOperation(customQueries.listPersons, {
        filter: { or: [{ role: { eq: "TR" } }, { role: { eq: "BLD" } }] }
      }))
      const savedData = result.data.listPersons;
      const updatedList = savedData?.items.map((item: { id: string, firstName: string, lastName: string }) => ({
        id: item?.id,
        name: `${item?.firstName || ''} ${item.lastName || ''}`,
        value: `${item?.firstName || ''} ${item.lastName || ''}`
      }))
      setDesignersList(updatedList);
    } catch {
      setValidation({
        question: '',
        label: '',
        message: 'Error while fetching designers list, you can add them later.',
        isError: true
      });
    }
  }

  useEffect(() => {
    fetchPersonsList();
  }, [])

  const { question, notes, label, type, language } = questionData;
  return (
    <div className="w-9/10 h-full">

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
                <TextArea value={question} rows={3} id='question' onChange={onInputChange} name='question' label="Question" isRequired />
                {validation.question && <p className="text-red-600 text-sm">{validation.question}</p>}
              </div>
              <div>
                <TextArea value={notes} rows={3} id='notes' onChange={onInputChange} name='notes' label="Notes" />
              </div>
            </div>

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <FormInput value={label} id='Label' onChange={onInputChange} name='label' label="Question Label" isRequired />
                {validation.label && <p className="text-red-600 text-sm">{validation.label}</p>}
              </div>
              <div>
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  Select Topics
                </label>
                <Selector selectedItem={''} placeholder="Topics" list={topicsList} onChange={(val, name, id) => onSelectOption(val, name, id, 'topics')} />
              </div>
            </div>

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  Select Source
                </label>
                <Selector selectedItem={''} placeholder="Source" list={sourceList} onChange={(val, name, id) => onSelectOption(val, name, id, 'source')} />
              </div>
              <div>
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  Select Type
                </label>
                <Selector selectedItem={type.name} placeholder="Type" list={typeList} onChange={(val, name, id) => onSelectOption(val, name, id, 'type')} />
              </div>
            </div>

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  Select Language
                </label>
                <Selector selectedItem={language.name} placeholder="Language" list={languageList} onChange={(val, name, id) => onSelectOption(val, name, id, 'language')} />
              </div>
              <div>
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  Select Designers
                </label>
                <MultipleSelector selectedItems={selectedDesigners} placeholder="Designers" list={designersList} onChange={selectDesigner} />
              </div>
            </div>
          </div>
        </div>
        {validation.message && <div className="py-2 m-auto mt-2 text-center">
          <p className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>{validation.message}</p>
        </div>}
        <div className="flex mb-8 mt-4 justify-center">
          <Buttons btnClass="py-3 px-10" label={loading ? 'Saving...' : 'Save'} onClick={saveQuestion} disabled={loading ? true : false} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default QuestionAdd
