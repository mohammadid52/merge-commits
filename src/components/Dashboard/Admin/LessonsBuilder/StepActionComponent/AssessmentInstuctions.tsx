import React, { useState } from 'react'

import { languageList } from '../../../../../utilities/staticData'

import MultipleSelector from '../../../../Atoms/Form/MultipleSelector';
import FormInput from '../../../../Atoms/Form/FormInput';
import Buttons from '../../../../Atoms/Buttons';
import RichTextEditor from '../../../../Atoms/RichTextEditor';

interface InitialData {
  instructionTitle: string,
  instructionDesc: string,
  openingMessage: string,
  closingMessage: string
}

const AssessmentInstuctions = () => {

  const initialData = {
    instructionTitle: '',
    instructionDesc: '',
    openingMessage: '',
    closingMessage: ''
  }

  const [formData, setFormData] = useState<InitialData>(initialData);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    name: '',
    type: '',
    message: '',
    isError: true
  });

  const onInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (validation.name) {
      setValidation({
        ...validation,
        name: ''
      })
    }
  }

  const setEditorContent = (html: string, text: string, fieldHtml: string) => {
    setFormData({
      ...formData,
      [fieldHtml]: html
    })
  }

  const updateInstructions = () => {

  }
  const { instructionTitle, instructionDesc, openingMessage, closingMessage } = formData;
  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>

      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900"> Assessment Instruction </h3>
      </div>

      <div className="p-4">

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <FormInput value={instructionTitle} id='instructionTitle' onChange={onInputChange} name='instructionTitle' label="Instruction title" />
          </div>
          <div>
            <FormInput value={instructionDesc} id='instructionDesc' onChange={onInputChange} name='instructionDesc' label="Instruction description" />
          </div>
        </div>

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
              Introductory Message
            </label>
            <RichTextEditor initialValue={openingMessage} onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, 'openingMessage')} />
          </div>

          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
              Closing Message
        </label>
            <RichTextEditor initialValue={closingMessage} onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, 'closingMessage')} />
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
