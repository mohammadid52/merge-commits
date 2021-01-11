import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api';

import * as customMutations from '../../../../../customGraphql/customMutations';
import * as customQueries from '../../../../../customGraphql/customQueries';
import * as queries from '../../../../../graphql/queries';
import { languageList } from '../../../../../utilities/staticData';

import SectionTitle from '../../../../Atoms/SectionTitle';
import PageWrapper from '../../../../Atoms/PageWrapper'
import BreadCrums from '../../../../Atoms/BreadCrums';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import MultipleSelector from '../../../../Atoms/Form/MultipleSelector';
import TextArea from '../../../../Atoms/Form/TextArea';

interface CurricularBuilderProps {

}
interface InitialData {
  id: string,
  name: string,
  description: string,
  objectives: string,
  languages: { id: string, name: string, value: string }[],
  institute: {
    id: string,
    name: string,
    value: string
  }
}
const CurricularBuilder = (props: CurricularBuilderProps) => {
  const { } = props;
  const initialData = {
    id: '',
    name: '',
    description: '',
    objectives: '',
    languages: [{ id: '1', name: "English", value: 'EN' }],
    institute: {
      id: '',
      name: '',
      value: ''
    }
  }
  const history = useHistory();
  const location = useLocation();
  const [institutionList, setInstitutionList] = useState(null);
  const [designersList, setDesignersList] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [curricularData, setCurricularData] = useState<InitialData>(initialData);
  const [loading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false
  });
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const params = useQuery();

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Curricular Creation', url: '/dashboard/curricular-creation', last: true }
  ];

  const onChange = (e: any) => {
    setCurricularData({
      ...curricularData,
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
    const currentLanguages = curricularData.languages;
    const selectedItem = currentLanguages.find(item => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentLanguages, { id, name, value }];
    } else {
      updatedList = currentLanguages.filter(item => item.id !== id);
    }
    setCurricularData({
      ...curricularData,
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
  const selectInstitute = (val: string, name: string, id: string) => {
    setCurricularData({
      ...curricularData,
      institute: {
        id: id,
        name: name,
        value: val
      }
    })
    if (messages.show) {
      setMessages({
        show: false,
        message: '',
        isError: false
      })
    }
  }

  const saveCurriculum = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        setIsLoading(true);
        const languagesCode = curricularData.languages.map((item: { value: string }) => item.value);
        const input = {
          name: curricularData.name,
          institutionID: curricularData.institute.id,
          description: curricularData.description,
          objectives: [curricularData.objectives],
          languages: languagesCode
        }
        const newCurricular = await API.graphql(graphqlOperation(customMutations.createCurriculum, { input: input }));
        setMessages({
          show: true,
          message: 'New curriculum has been saved.',
          isError: false
        })
        setCurricularData(initialData);
        setIsLoading(false);
      } catch{
        setMessages({
          show: true,
          message: 'Unable to save new curriculum please try again later.',
          isError: true
        })
      }
    }
  }

  const getInstitutionList = async () => {
    try {
      const list: any = await API.graphql(graphqlOperation(queries.listInstitutions));
      const sortedList = list.data.listInstitutions?.items.sort((a: any, b: any) => (a.name?.toLowerCase() > b.name?.toLowerCase()) ? 1 : -1);
      const InstituteList = sortedList.map((item: any, i: any) => ({
        id: item.id,
        name: `${item.name ? item.name : ''}`,
        value: `${item.name ? item.name : ''}`
      }));
      setInstitutionList(InstituteList);
    } catch{
      setMessages({
        show: true,
        message: 'Unable to fetch institution list pleas try later.',
        isError: true
      })
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
      setMessages({
        show: true,
        message: 'Error while fetching Designers list Please try again later.',
        isError: true,
      })
    }
  }

  const checkUniqCurricularName = async () => {
    try {
      const list: any = await API.graphql(graphqlOperation(queries.listCurriculums, {
        filter: {
          institutionID: { eq: curricularData.institute.id },
          name: { eq: curricularData.name }
        }
      }))
      return list.data.listCurriculums.items.length === 0 ? true : false;

    } catch {
      setMessages({
        show: true,
        message: 'Error while processing please Try again later.',
        isError: true
      })
    }
  }

  const validateForm = async () => {
    if (curricularData.name.trim() === '') {
      setMessages({
        show: true,
        message: 'Curricular name is required please enter name.',
        isError: true
      })
      return false;
    } else if (curricularData.institute.id === '') {
      setMessages({
        show: true,
        message: 'Please select an institute to add curricular.',
        isError: true
      })
      return false;
    } else if (curricularData.name.trim() !== '') {
      const isUniq = await checkUniqCurricularName()
      if (!isUniq) {
        setMessages({
          show: true,
          message: 'This curricular name is already exist, please add another name.',
          isError: true
        })
        return false;
      } else {
        return true
      }
    } else {
      return true
    }
  }

  useEffect(() => {

    const instId = params.get('id');
    if (instId) {
      setCurricularData({
        ...curricularData,
        institute: {
          ...institute,
          id: instId,
          name: '',
          value: ''
        }
      })
      getInstitutionList();
      fetchPersonsList();
    } else {
      history.push('/dashboard/manage-institutions')
    }
  }, [])

  useEffect(() => {
    if (curricularData.institute.id) {
      const instName = institutionList.find((item: { id: string }) => item.id === curricularData.institute.id).name
      if (instName) {
        setCurricularData({
          ...curricularData,
          institute: {
            ...institute,
            id: curricularData.institute.id,
            name: instName,
            value: instName
          }
        })
      } else {
        setMessages({
          show: true,
          message: 'Invalid path please go back to institution selection page to select your institute.',
          isError: true
        })
      }
    }
  }, [institutionList])

  const { name, description, objectives, languages, institute } = curricularData;
  return (
    <div className="w-8/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Create New Curricular" subtitle="Add new curricular to the list" />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-6/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">CURRICULAR INFORMATION</h3>
          <div className="">
            <div className="px-3 py-4">
              <FormInput value={name} id='curricularName' onChange={onChange} name='name' label="Curricular Name" isRequired />
            </div>

            {/* 
              **
              * Hide institution drop down since all the things are tied to the 
              * Institute, will add this later if need to add builders saperately.
            */}
            {/* <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Institute
              </label>
              <Selector selectedItem={institute.value} placeholder="Select Institute" list={institutionList} onChange={selectInstitute} />
            </div> */}

            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Select Language
              </label>
              <MultipleSelector selectedItems={languages} placeholder="Select Language" list={languageList} onChange={selectLanguage} />
            </div>
            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Select Designers
              </label>
              <MultipleSelector selectedItems={selectedDesigners} placeholder="Designers" list={designersList} onChange={selectDesigner} />
            </div>
            <div className="px-3 py-4">
              <TextArea value={description} id='description' onChange={onChange} name='description' label="Description" />
            </div>
            <div className="px-3 py-4">
              <TextArea value={objectives} id='objectives' onChange={onChange} name='objectives' label="Objective" />
            </div>
          </div>
        </div>
        {messages.show ? (<div className="py-2 m-auto text-center">
          <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>{messages.message && messages.message}</p>
        </div>) : null}
        <div className="flex my-8 justify-center">
          <Buttons btnClass="py-3 px-12 text-sm" label={loading ? 'Saving...' : 'Save'} onClick={saveCurriculum} disabled={loading ? true : false} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default CurricularBuilder
