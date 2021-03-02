import React, { useState, useEffect, Fragment } from 'react'
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
  lessonType: string
}


const AssessmentInstuctions = (props: AssessmentInstuctionsProps) => {

  const { savedInstructions, lessonId, updateParentState, lessonType } = props;


  const [formData, setFormData] = useState<InstructionInitialState>(savedInstructions);
  const [loading, setLoading] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState('1')
  const [validation, setValidation] = useState({
    message: '',
    isError: true
  });
  const accordionSteps = [
    {
      id: '1',
      name: 'introduction',
      header: 'Welcome Message',
      title: 'introductionTitle',
      titleValue: formData.introductionTitle,
      titleLabel: 'Welcome Message Title',
      textEditorName: 'introduction',
      textEditorValue: formData.introduction
    },
    {
      id: '2',
      name: 'instructions',
      header: `${lessonType === 'survey' ? 'Survey' : 'Assessment'} Instructions`,
      title: 'instructionsTitle',
      titleValue: formData.instructionsTitle,
      titleLabel: `${lessonType === 'survey' ? 'Survey' : 'Assessment'} Instructions Title`,
      textEditorName: 'instructions',
      textEditorValue: (typeof formData.instructions === 'object' && formData.instructions) ? formData.instructions[0] : formData.instructions
    },
    {
      id: '3',
      name: 'summary',
      header: 'Closing Message',
      title: 'summaryTitle',
      titleValue: formData.summaryTitle,
      titleLabel: 'Closing Message title',
      textEditorName: 'summary',
      textEditorValue: formData.summary
    }
  ]

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
        <h3 className="text-lg leading-6 font-medium text-gray-900"> {lessonType === 'survey' ? 'Survey' : 'Assessment'} Instruction </h3>
      </div>

      <div className="p-4">
        <div className="flex justify-between">
          <p className="text-sm text-gray-500 flex items-center px-4 my-6">INSTRUCTIONS: Complete the following to provide information about your {lessonType === 'survey' ? 'Survey' : 'Assessment'}.</p>
        </div>

        {/* New accordion */}
        <div className="bg-white mx-auto border border-gray-200 rounded-xl">
          <ul className="rounded-xl">
            {accordionSteps.map((item: { id: string, title: string, header: string, titleLabel: string, titleValue: string, textEditorName: string, textEditorValue: string }, index) => (
              <Fragment key={item.id}>
                <li className={`relative border-b border-gray-200 ${selectedBlock === item.id ? 'rounded-lg' : ''}`}>
                  <div className={`w-full px-8 py-6 text-left ${selectedBlock === item.id ? 'border border-indigo-400 rounded-lg' : ''}`}>
                    <div className="flex items-center justify-center">
                      <span className={`text-xs md:text-base font-medium cursor-pointer text-center text-indigo-500 ${selectedBlock === item.id && 'text-indigo-600'}`} onClick={() => setSelectedBlock(item.id)}>
                        {item.header}
                      </span>
                    </div>
                  </div>

                  {(selectedBlock === item.id) && (
                    <div className="px-8 py-6 max-h-140 overflow-auto">
                      <div className="w-8/10 mx-auto my-4">
                        <FormInput value={item.titleValue} id={item.title} onChange={onInputChange} name={item.title} label={item.titleLabel} />
                      </div>
                      <div className="w-8/10 mx-auto">
                        <RichTextEditor initialValue={item.textEditorValue} onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, item.textEditorName)} />
                      </div>
                    </div>
                  )}

                </li>
              </Fragment>
            ))}
          </ul>
        </div>

        {validation.message && <div className="py-4 m-auto mt-4 text-center">
          <p className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>{validation.message}</p>
        </div>}
        <div className="flex my-8 justify-center">
          <Buttons btnClass="py-3 px-10" label={loading ? 'Saving...' : 'Save'} onClick={updateInstructions} disabled={loading ? true : false} />
        </div>
      </div>

    </div>
  )
}

export default AssessmentInstuctions
