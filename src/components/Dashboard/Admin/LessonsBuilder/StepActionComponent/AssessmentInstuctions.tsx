import React, { useState, useEffect } from 'react'
import API, { graphqlOperation } from '@aws-amplify/api'

import * as customMutations from '../../../../../customGraphql/customMutations';

import FormInput from '../../../../Atoms/Form/FormInput';
import Buttons from '../../../../Atoms/Buttons';
import RichTextEditor from '../../../../Atoms/RichTextEditor';
import { InstructionInitialState } from '../LessonEdit';

interface AssessmentInstuctionsProps {
  savedInstructions?: InstructionInitialState
  lessonId: string
  updateParentState?: (obj: InstructionInitialState) => void
}


const AssessmentInstuctions = (props: AssessmentInstuctionsProps) => {

  const { savedInstructions, lessonId, updateParentState } = props;


  const [formData, setFormData] = useState<InstructionInitialState>(savedInstructions);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    message: '',
    isError: true
  });

  const onInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (validation.message) {
      setValidation({
        ...validation,
        message: '',
        isError: true
      })
    }
  }

  const setEditorContent = (html: string, text: string, fieldHtml: string) => {
    setFormData({
      ...formData,
      [fieldHtml]: html
    })
    if (validation.message) {
      setValidation({
        ...validation,
        message: '',
        isError: true
      })
    }
  }

  const updateInstructions = async () => {
    try {
      setLoading(true)
      const input = {
        id: lessonId,
        introductionTitle: formData.introductionTitle,
        instructionsTitle: formData.instructionsTitle,
        summaryTitle: formData.summaryTitle,
        introduction: formData.introduction,
        instructions: [formData.instructions],
        summary: formData.summary,
      }
      const results: any = await API.graphql(
        graphqlOperation(customMutations.updateLesson, { input: input })
      );
      const lessonsData = results?.data?.updateLesson;
      setValidation({
        ...validation,
        message: 'Instructions details saved.',
        isError: false
      });
      updateParentState(formData);
      setLoading(false)
    } catch{
      setValidation({
        ...validation,
        message: 'Error while updating instructions, please try again later.',
        isError: true
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    setFormData({ ...savedInstructions })
  }, [savedInstructions])

  const { introductionTitle, instructionsTitle, summaryTitle, introduction, instructions, summary } = formData;
  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>

      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900"> Assessment Instruction </h3>
      </div>

      <div className="p-4">

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <FormInput value={introductionTitle} id='introductionTitle' onChange={onInputChange} name='introductionTitle' label="Introduction title" />
          </div>
          <div>
            <FormInput value={instructionsTitle} id='instructionsTitle' onChange={onInputChange} name='instructionsTitle' label="Instruction title" />
          </div>
        </div>

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <FormInput value={summaryTitle} id='summaryTitle' onChange={onInputChange} name='summaryTitle' label="Closing Message title" />
          </div>
        </div>

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
              Introductory Message
            </label>
            <RichTextEditor initialValue={introduction} onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, 'introduction')} />
          </div>
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
              Instructions
            </label>
            <RichTextEditor initialValue={typeof instructions === 'object' ? instructions[0] : instructions} onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, 'instructions')} />
          </div>
        </div>

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
              Closing Message
            </label>
            <RichTextEditor initialValue={summary} onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, 'summary')} />
          </div>
        </div>

        {validation.message && <div className="py-4 m-auto mt-2 text-center">
          <p className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>{validation.message}</p>
        </div>}
        <div className="flex mb-8 mt-4 justify-center">
          <Buttons btnClass="py-3 px-10" label={loading ? 'Saving...' : 'Save'} onClick={updateInstructions} disabled={loading ? true : false} />
        </div>
      </div>

    </div>
  )
}

export default AssessmentInstuctions
