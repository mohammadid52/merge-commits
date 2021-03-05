import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router'
import { IoArrowUndoCircleOutline } from 'react-icons/io5'
import API, { graphqlOperation } from '@aws-amplify/api'

import BreadCrums from '../../../../../../Atoms/BreadCrums'
import SectionTitle from '../../../../../../Atoms/SectionTitle'
import Buttons from '../../../../../../Atoms/Buttons'
import PageWrapper from '../../../../../../Atoms/PageWrapper'
import FormInput from '../../../../../../Atoms/Form/FormInput'
import TextArea from '../../../../../../Atoms/Form/TextArea'
import Selector from '../../../../../../Atoms/Form/Selector'
import MultipleSelector from '../../../../../../Atoms/Form/MultipleSelector'

import { languageList } from '../../../../../../../utilities/staticData'
import * as queries from '../../../../../../../graphql/queries'
import * as mutations from '../../../../../../../graphql/mutations'
import * as customQueries from '../../../../../../../customGraphql/customQueries'

interface AddSyllabusProps {

}
interface InitialData {
  name: string
  description: string
  methodology: string
  policies: string
  purpose: string
  objectives: string
  languages: { id: string, name: string, value: string }[]
}

const AddSyllabus = (props: AddSyllabusProps) => {
  const { } = props;
  const history = useHistory();
  const urlParams: any = useParams()
  const curricularId = urlParams.curricularId;
  const initialData = {
    name: '',
    description: '',
    methodology: '',
    policies: '',
    purpose: '',
    objectives: '',
    languages: [{ id: '1', name: "English", value: 'EN' }]
  }
  const [syllabusData, setSyllabusData] = useState<InitialData>(initialData);
  const [designersList, setDesignersList] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [syllabusIds, setSyllabusIds] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false
  });

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Unit Builder', url: `/dashboard/manage-institutions/curricular/${curricularId}/syllabus/add`, last: true }
  ];

  const onInputChange = (e: any) => {
    setSyllabusData({
      ...syllabusData,
      [e.target.name]: e.target.value
    })
    if (messages.show) {
      setMessages({
        show: false,
        message: '',
        isError: false
      })
    }
  }

  const selectLanguage = (id: string, name: string, value: string) => {
    let updatedList;
    const currentLanguages = syllabusData.languages;
    const selectedItem = currentLanguages.find(item => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentLanguages, { id, name, value }];
    } else {
      updatedList = currentLanguages.filter(item => item.id !== id);
    }
    setSyllabusData({
      ...syllabusData,
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
      setMessages({
        show: true,
        message: 'Error while fetching Designers list Please try again later.',
        isError: true,
      })
    }
  }

  const fetchSyllabusSequence = async () => {
    let item: any = await API.graphql(graphqlOperation(queries.getCSequences,
      { id: `s_${curricularId}` }))
    item = item?.data.getCSequences?.sequence || []
    if (item) {
      setSyllabusIds(item)
    }
  }

  const saveSyllabusDetails = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        setIsLoading(true);
        const languagesCode = syllabusData.languages.map((item: { value: string }) => item.value);
        const designers = selectedDesigners.map(item => (item.id))
        const input = {
          name: syllabusData.name,
          curriculumID: curricularId,
          description: syllabusData.description,
          methodology: syllabusData.methodology,
          policies: syllabusData.policies,
          pupose: syllabusData.purpose,
          objectives: syllabusData.objectives,
          languages: languagesCode,
          designers: designers
        }
        const newSyllabus: any = await API.graphql(graphqlOperation(mutations.createSyllabus, { input: input }));
        const newItem = newSyllabus.data.createSyllabus
        if (!syllabusIds.length) {
          let seqItem: any = await API.graphql(graphqlOperation(mutations.createCSequences, { input: { id: `s_${curricularId}`, sequence: [newItem.id] } }));
          seqItem = seqItem.data.createCSequences
          console.log('seqItem', seqItem)
        } else {
          let seqItem: any = await API.graphql(graphqlOperation(mutations.updateCSequences, { input: { id: `s_${curricularId}`, sequence: [...syllabusIds, newItem.id] } }));
          seqItem = seqItem.data.updateCSequences
          console.log('seqItem', seqItem)
        }
        setMessages({
          show: true,
          message: 'New unit has been saved.',
          isError: false
        })
        setSyllabusData(initialData);
        setIsLoading(false);
        if (newItem) {
          history.push(`/dashboard/manage-institutions/curricular?id=${curricularId}`);
        } else {
          console.log('Could not add unit');
        }
      } catch {
        setMessages({
          show: true,
          message: 'Unable to save new unit please try again later.',
          isError: true
        })
      }
    }
  }

  const validateForm = async () => {
    if (syllabusData.name.trim() === '') {
      setMessages({
        show: true,
        message: 'Unit name is required please enter name.',
        isError: true
      })
      return false;
    }
    // TODO: Need to confirm that syllabus name should be uniq or not?

    // else if (syllabusData.name.trim() !== '') {
    //   const isUniq = await checkUniqSyllabusName()
    //   if (!isUniq) {
    //     setMessages({
    //       show: true,
    //       message: 'This syllabus name is already exist, please add another name.',
    //       isError: true
    //     })
    //     return false;
    //   } else {
    //     return true
    //   }
    // }
    else {
      return true
    }
  }

  useEffect(() => {
    fetchPersonsList();
    fetchSyllabusSequence();
  }, [])

  const { name, languages, description, purpose, objectives, methodology, policies } = syllabusData;

  return (
    <div className="w-9/10 h-full p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Unit Builder" subtitle="Create curriculum units here." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">UNIT INFORMATION</h3>
          <div className="">

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <FormInput value={name} id='name' onChange={onInputChange} name='name' label="Unit Name" isRequired />
              </div>
              <div>
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  Select Designers
                </label>
                <MultipleSelector selectedItems={selectedDesigners} placeholder="Designers" list={designersList} onChange={selectDesigner} />
              </div>
            </div>
            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  Select Language
              </label>
                <MultipleSelector selectedItems={languages} placeholder="Language" list={languageList} onChange={selectLanguage} />
              </div>
            </div>

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <TextArea value={description} rows={5} id='description' onChange={onInputChange} name='description' label="Description" />
              </div>
              <div>
                <TextArea value={purpose} rows={5} id='purpose' onChange={onInputChange} name='purpose' label="Purpose" />
              </div>
            </div>

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <TextArea value={objectives} rows={5} id='objectives' onChange={onInputChange} name='objectives' label="Objectives" />
              </div>
              <div>
                <TextArea value={methodology} rows={5} id='methodology' onChange={onInputChange} name='methodology' label="Methodology" />
              </div>
            </div>
            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <TextArea value={policies} rows={5} id='policies' onChange={onInputChange} name='policies' label="Policies" />
              </div>

            </div>
          </div>
        </div>
        {messages.show ? (<div className="py-2 m-auto text-center">
          <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>{messages.message && messages.message}</p>
        </div>) : null}
        <div className="flex my-8 justify-center">
          <Buttons btnClass="py-3 px-10" label={loading ? 'Saving...' : 'Save'} onClick={saveSyllabusDetails} disabled={loading ? true : false} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default AddSyllabus
