import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api';
import { v4 as uuidv4 } from 'uuid';

import * as customMutations from '../../../../../customGraphql/customMutations';
import * as queries from '../../../../../graphql/queries';
import SectionTitle from '../../../../Atoms/SectionTitle';
import PageWrapper from '../../../../Atoms/PageWrapper'
import BreadCrums from '../../../../Atoms/BreadCrums';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import Selector from '../../../../Atoms/Form/Selector';

interface CurricularBuilderProps {

}

const CurricularBuilder = (props: CurricularBuilderProps) => {
  const { } = props;
  const history = useHistory();
  const [institutionList, setInstitutionList] = useState(null);
  const [curricularData, setCurricularData] = useState({
    id: '',
    name: '',
    institute: {
      id: '',
      name: '',
      value: ''
    }
  });

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Curricular Creation', url: '/dashboard/curricular-creation', last: true }
  ];

  const onChange = (e: any) => {
    setCurricularData({
      ...curricularData,
      name: e.target.value
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
  }

  const saveCurriculum = async () => {
    try {
      const input = {
        id: curricularData.id,
        name: curricularData.name,
        institutionID: curricularData.institute.id
      }
      const newCurricular = await API.graphql(graphqlOperation(customMutations.createCurriculum, { input: input }));
      console.log("newCurricular", newCurricular)
    } catch{
      console.log('error while creating curriculum')
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
      console.log('Error while fetching institute lists')
    }
  }

  useEffect(() => {
    setCurricularData({
      ...curricularData,
      id: uuidv4()
    })
    getInstitutionList()
  }, [])

  const { name, institute } = curricularData;
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
              <FormInput value={name} id='curricularName' onChange={onChange} name='name' label="Curricular Name" />
            </div>
            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Institute
              </label>
              <Selector selectedItem={institute.value} placeholder="Select Institute" list={institutionList} onChange={selectInstitute} />
            </div>
          </div>
        </div>

        <div className="flex my-8 justify-center">
          <Buttons btnClass="py-3 px-12 text-sm" label="Save" onClick={saveCurriculum} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default CurricularBuilder
