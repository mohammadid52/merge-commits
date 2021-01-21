import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api'

import * as customQueries from '../../../../customGraphql/customQueries';

import Buttons from '../../../Atoms/Buttons';
import Selector from '../../../Atoms/Form/Selector';
import MultipleSelector from '../../../Atoms/Form/MultipleSelector';
import FormInput from '../../../Atoms/Form/FormInput';
import TextArea from '../../../Atoms/Form/TextArea';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageWrapper from '../../../Atoms/PageWrapper';

import { languageList } from '../../../../utilities/staticData'

interface InitialData {
  name: string
  type: InputValue,
  purpose: string,
  objectives: string,
  languages: { id: string, name: string, value: string }[]
}
interface InputValue {
  id: string,
  name: string,
  value: string
}
const LessonBuilder = () => {
  const history = useHistory();

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: '**', url: '**', last: false },
    { title: '**', url: '**', last: true },
  ]
  const initialData = {
    name: '',
    type: { id: '', name: '', value: '' },
    purpose: '',
    objectives: '',
    languages: [{ id: '1', name: "English", value: 'EN' }]
  }
  const [formData, setFormData] = useState<InitialData>(initialData);
  const [designersList, setDesignersList] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    question: '',
    label: '',
    message: '',
    isError: true
  });
  const typeList: any = [
    { id: '1', name: 'Lesson', value: 'lesson' },
    { id: '2', name: 'Assessment', value: 'assessment' },
    { id: '3', name: 'Survey', value: 'survey' }
  ];

  const onInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const onSelectOption = (val: string, name: string, id: string, field: string) => {
    setFormData({
      ...formData,
      [field]: {
        id: id,
        name: name,
        value: val
      }
    })
  }

  const selectLanguage = (id: string, name: string, value: string) => {
    let updatedList;
    const currentLanguages = formData.languages;
    const selectedItem = currentLanguages.find(item => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentLanguages, { id, name, value }];
    } else {
      updatedList = currentLanguages.filter(item => item.id !== id);
    }
    setFormData({
      ...formData,
      languages: updatedList
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
  const saveFormData = () => {

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

  const { name, type, languages } = formData;
  return (
    <div className="w-full h-full">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="**TITLE--" subtitle="**Subtitle--" />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body */}
      <PageWrapper>
        <div className="m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">** TITLE ** </h3>
          <div className="">

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <FormInput value={name} id='name' onChange={onInputChange} name='name' label="Name" isRequired />
                {/* {validation.question && <p className="text-red-600 text-sm">{validation.question}</p>} */}
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
                  Select Designers
                </label>
                <MultipleSelector selectedItems={selectedDesigners} placeholder="Designers" list={designersList} onChange={selectDesigner} />
              </div>
              <div>
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  Select Language
              </label>
                <MultipleSelector selectedItems={languages} placeholder="Language" list={languageList} onChange={selectLanguage} />
              </div>
            </div>

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>

              </div>
              <div>

              </div>
            </div>

          </div>
        </div>
        {/* {validation.message && <div className="py-2 m-auto mt-2 text-center">
          <p className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>{validation.message}</p>
        </div>} */}
        <div className="flex mb-8 mt-4 justify-center">
          <Buttons btnClass="py-3 px-10" label={loading ? 'Saving...' : 'Save'} onClick={saveFormData} disabled={loading ? true : false} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default LessonBuilder
