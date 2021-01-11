import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api';

import * as customMutations from '../../../../../customGraphql/customMutations';
import * as customQueries from '../../../../../customGraphql/customQueries';
import * as mutation from '../../../../../graphql/mutations';
import * as queries from '../../../../../graphql/queries';

import { languageList } from '../../../../../utilities/staticData';
import SectionTitle from '../../../../Atoms/SectionTitle';
import PageWrapper from '../../../../Atoms/PageWrapper'
import BreadCrums from '../../../../Atoms/BreadCrums';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import Selector from '../../../../Atoms/Form/Selector';
import MultipleSelector from '../../../../Atoms/Form/MultipleSelector';
import TextArea from '../../../../Atoms/Form/TextArea';

interface EditCurricularProps {

}

const EditCurricular = (props: EditCurricularProps) => {
  const { } = props;
  const initialData = {
    id: '',
    name: '',
    description: '',
    languages: [{ id: '1', name: "English", value: 'EN' }],
    objectives: '',
    institute: {
      id: '',
      name: '',
      value: ''
    }
  }
  const history = useHistory();
  const location = useLocation();
  const [institutionList, setInstitutionList] = useState(null);
  const [curricularData, setCurricularData] = useState(initialData);
  const [designersList, setDesignersList] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [previousName, setPreviousName] = useState('');
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
    { title: 'Edit Curricular', url: `/dashboard/manage-institutions/curricular/edit?id=${params.get('id')}`, last: true }
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
  const saveCurriculum = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        const languagesCode = curricularData.languages.map((item: { value: string }) => item.value);
        const input = {
          id: curricularData.id,
          name: curricularData.name,
          institutionID: curricularData.institute.id,
          description: curricularData.description,
          objectives: [curricularData.objectives],
          languages: languagesCode,
        }
        const newCurricular = await API.graphql(graphqlOperation(mutation.updateCurriculum, { input: input }));
        setMessages({
          show: true,
          message: 'Curricular changes has been saved.',
          isError: false
        })
      } catch{
        setMessages({
          show: true,
          message: 'Error while updating curricular data please try later.',
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
    } else if (curricularData.name.trim() !== '' && previousName !== curricularData.name) {
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

  // This function will be removed. Will get data from props.
  // will create parent for curricular view and this edit page.

  const fetchCurricularData = async () => {
    const currID = params.get('id');
    if (currID) {
      try {
        const result: any = await API.graphql(graphqlOperation(queries.getCurriculum, { id: currID }))
        const savedData = result.data.getCurriculum;
        setCurricularData({
          ...curricularData,
          id: savedData.id,
          name: savedData.name,
          institute: {
            id: savedData.institution.id,
            name: savedData.institution.name,
            value: savedData.institution.name,
          },
          description: savedData.description,
          objectives: savedData.objectives[0],
          languages: languageList.filter(item => savedData.languages.includes(item.value))
        })
        setPreviousName(savedData.name);
      } catch {
        setMessages({
          show: true,
          message: 'Error while fetching curricular data,please try again later.',
          isError: true
        })
      }
    } else {
      history.push('/dashboard/manage-institutions')
    }
  }

  useEffect(() => {
    fetchCurricularData()
    getInstitutionList()
    fetchPersonsList();
  }, [])

  const { name, description, objectives, languages, institute } = curricularData;
  return (
    <div className="w-8/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Edit Curricular" subtitle="Edit curricular information" />
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
              <MultipleSelector selectedItems={languages} placeholder="Select Languages" list={languageList} onChange={selectLanguage} />
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
        <div className="flex my-8 mt-12 justify-center">
          <Buttons btnClass="py-3 px-12 text-sm mr-4" label="Cancel" onClick={history.goBack} transparent />
          <Buttons btnClass="py-3 px-12 text-sm ml-4" label="Save" onClick={saveCurriculum} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default EditCurricular
