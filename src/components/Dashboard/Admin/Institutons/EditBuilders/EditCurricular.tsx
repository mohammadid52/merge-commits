import React, { useState, useEffect, useContext } from 'react';
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
import useDictionary from '../../../../../customHooks/dictionary';
import { GlobalContext } from '../../../../../contexts/GlobalContext';

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
  const [designerIds, setDesignerIds] = useState([]);
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
  const { clientKey, userLanguage, theme } = useContext(GlobalContext);
  const { BreadcrumsTitles,EditCurriculardict } = useDictionary(clientKey);

  const breadCrumsList = [
    { title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false },
    { title: BreadcrumsTitles[userLanguage]['EDITCURRICULUM'], url: `/dashboard/manage-institutions/curricular/edit?id=${params.get('id')}`, last: true }
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
        message: EditCurriculardict[userLanguage]['messages']['fetcherr'],
        isError: true,
      })
    }
  }
  const saveCurriculum = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        const languagesCode = curricularData.languages.map((item: { value: string }) => item.value);
        const designers = selectedDesigners.map(item => item.id)
        const input = {
          id: curricularData.id,
          name: curricularData.name,
          institutionID: curricularData.institute.id,
          description: curricularData.description,
          objectives: [curricularData.objectives],
          languages: languagesCode,
          designers: designers
        }
        const newCurricular = await API.graphql(graphqlOperation(mutation.updateCurriculum, { input: input }));
        setMessages({
          show: true,
          message:EditCurriculardict[userLanguage]['messages']['curricularchange'] ,
          isError: false
        })
      } catch{
        setMessages({
          show: true,
          message: EditCurriculardict[userLanguage]['messages']['updateerror'] ,
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
        name: `${item.name || ''}`,
        value: `${item.name || ''}`
      }));
      setInstitutionList(InstituteList);
    } catch{
      setMessages({
        show: true,
        message: EditCurriculardict[userLanguage]['messages']['unablefetch'],
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
        message: EditCurriculardict[userLanguage]['messages']['processerr'],
        isError: true
      })
    }
  }

  const validateForm = async () => {
    if (curricularData.name.trim() === '') {
      setMessages({
        show: true,
        message: EditCurriculardict[userLanguage]['messages']['namerequired'],
        isError: true
      })
      return false;
    } else if (curricularData.institute.id === '') {
      setMessages({
        show: true,
        message: EditCurriculardict[userLanguage]['messages']['selectinstitute'],
        isError: true
      })
      return false;
    } else if (curricularData.name.trim() !== '' && previousName !== curricularData.name) {
      const isUniq = await checkUniqCurricularName()
      if (!isUniq) {
        setMessages({
          show: true,
          message: EditCurriculardict[userLanguage]['messages']['nameexist'],
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
        });
        if (savedData && savedData.designers && savedData.designers.length) {
          setDesignerIds([...savedData?.designers])
        }
        setPreviousName(savedData.name);
      } catch (err) {
        console.log('err', err)
        setMessages({
          show: true,
          message:EditCurriculardict[userLanguage]['messages']['fetchinger'],
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

  useEffect(() => {
    if (designersList && Array.isArray(designersList) && designersList.length > 0) {
      const designers = [...designerIds].map((desID: string) => {
        const personData = designersList.find(per => per.id === desID)
        const personObj = {
          id: personData?.id,
          name: personData?.name,
          value: personData?.name
        }
        return personObj
      })
      setSelectedDesigners(designers);
    }
  }, [designersList, designerIds])


  const { name, description, objectives, languages, institute } = curricularData;
  return (
    <div className="w-8/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title={EditCurriculardict[userLanguage]['TITLE']} subtitle={EditCurriculardict[userLanguage]['SUBTITLE']} />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-6/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">{EditCurriculardict[userLanguage]['HEADING']}</h3>
          <div className="">
            <div className="px-3 py-4">
              <FormInput value={name} id='curricularName' onChange={onChange} name='name' label={EditCurriculardict[userLanguage]['NAME']} isRequired />
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
              <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
              {EditCurriculardict[userLanguage]['LANGUAGE']}
              </label>
              <MultipleSelector selectedItems={languages} placeholder={EditCurriculardict[userLanguage]['LANGUAGE']} list={languageList} onChange={selectLanguage} />
            </div>
            <div className="px-3 py-4">
              <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
              {EditCurriculardict[userLanguage]['DESIGNER']}
              </label>
              <MultipleSelector selectedItems={selectedDesigners} placeholder={EditCurriculardict[userLanguage]['DESIGNER']} list={designersList} onChange={selectDesigner} />
            </div>
            <div className="px-3 py-4">
              <TextArea value={description} id='description' onChange={onChange} name="description" label={EditCurriculardict[userLanguage]['DESCRIPTION']} />
            </div>
            <div className="px-3 py-4">
              <TextArea value={objectives} id='objectives' onChange={onChange} name='objectives' label={EditCurriculardict[userLanguage]['OBJECTIVE']} />
            </div>

          </div>
        </div>
        {messages.show ? (<div className="py-2 m-auto text-center">
          <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>{messages.message && messages.message}</p>
        </div>) : null}
        <div className="flex my-8 mt-12 justify-center">
          <Buttons btnClass="py-3 px-12 text-sm mr-4" label={EditCurriculardict[userLanguage]['BUTTON']['CANCEL']} onClick={history.goBack} transparent />
          <Buttons btnClass="py-3 px-12 text-sm ml-4" label={EditCurriculardict[userLanguage]['BUTTON']['SAVE']} onClick={saveCurriculum} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default EditCurricular
