import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api'

import * as queries from '../../../../graphql/queries';
import * as mutations from '../../../../graphql/mutations';

import Buttons from '../../../Atoms/Buttons';
import Selector from '../../../Atoms/Form/Selector';
import MultipleSelector from '../../../Atoms/Form/MultipleSelector';
import FormInput from '../../../Atoms/Form/FormInput';
import TextArea from '../../../Atoms/Form/TextArea';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageWrapper from '../../../Atoms/PageWrapper';

interface InitialState {
  question: string
  notes: string
  label: string
}

const QuestionEdit = () => {
  const history = useHistory();
  const location = useLocation();

  const initialState = {
    question: '',
    notes: '',
    label: ''
  }
  const [questionData, setQuestionData] = useState<InitialState>(initialState)
  const [validation, setValidation] = useState({
    question: '',
    label: '',
    message: '',
    isError: true
  });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const params = useQuery();
  const questionId = params.get('id')
  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Question Bank', url: '/dashboard/question-bank', last: false },
    { title: 'Edit Question', url: `/dashboard/question-bank/question/edit?id=${questionId}`, last: true },   //add ID in route
  ]
  const selectedDesigners: any = [];
  const designersList: any = [];
  const topicsList: any = [];
  const sourceList: any = [];
  const typeList: any = [];
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

  const selectDesigner = () => {

  }
  const selectLanguage = () => {

  }
  const selectTopic = () => {

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
          id: questionId,
          question: questionData.question,
          label: questionData.label,
          note: questionData.notes,
        }
        const results: any = await API.graphql(
          graphqlOperation(mutations.updateQuestion, { input: input })
        );
        const savedData = results?.data?.updateQuestion;
        if (savedData) {
          setValidation({
            question: '',
            label: '',
            message: 'Question details updated successfully.',
            isError: false
          })
        }
        setLoading(false);
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

  const fetchQuestionData = async () => {
    try {
      const results: any = await API.graphql(
        graphqlOperation(queries.getQuestion, { id: questionId })
      );
      const savedData = results?.data?.getQuestion;
      setQuestionData({
        question: savedData.question,
        notes: savedData.note,
        label: savedData.label
      })
    } catch{
      setValidation({
        question: '',
        label: '',
        message: 'Unable to fetch Question details, Please try again later.',
        isError: true
      });
      setDisabled(true)
    }
  }

  useEffect(() => {
    if (questionId) {
      fetchQuestionData()
    } else {
      history.push('/dashboard/question-bank')
    }
  }, [])

  const { question, notes, label } = questionData;
  return (
    <div className="w-9/10 h-full p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="EDIT QUESTION" subtitle="Edit current question" />
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
                <Selector selectedItem={''} placeholder="Topics" list={topicsList} onChange={selectTopic} />
              </div>
            </div>

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  Select Source
                </label>
                <Selector selectedItem={''} placeholder="Source" list={sourceList} onChange={selectLanguage} />
              </div>
              <div>
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  Select Type
                </label>
                <Selector selectedItem={''} placeholder="Type" list={typeList} onChange={selectLanguage} />
              </div>
            </div>

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  Select Language
                </label>
                <Selector selectedItem={''} placeholder="Language" list={languageList} onChange={selectLanguage} />
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
          <Buttons btnClass="py-3 px-10" label={loading ? 'Saving...' : 'Save'} onClick={saveQuestion} disabled={(loading || disabled) ? true : false} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default QuestionEdit
