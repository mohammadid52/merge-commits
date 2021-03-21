import React, { useEffect, useState, useContext } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';

import Buttons from '../../../../Atoms/Buttons';
import Selector from '../../../../Atoms/Form/Selector';
import * as customQueries from '../../../../../customGraphql/customQueries';
import { GlobalContext } from '../../../../../contexts/GlobalContext';
import { getAsset } from '../../../../../assets';

interface UnitLookupProps {
  lessonName: string
  lessonId: string
  institution: { id: string, name: string, value: string }
}

const UnitLookup = (props: UnitLookupProps) => {
  const { lessonName, lessonId, institution } = props;

  const { clientKey, theme } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const [formState, setFormState] = useState({
    curriculum: { name: '', value: '', id: '' },
    unit: { name: '', value: '', id: '' }
  });
  const [curriculaList, setCurriclaList] = useState([]);
  const [unitsList, setUnitsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSelectorChange = (val: string, name: string, id: string, field: string) => {
    setFormState({
      ...formState,
      [field]: { id, name, value: val }
    })
  }

  const addLessonToSyllabusLesson = () => {

  }
  const selectedCurricular = [
    { id: 1, curricular: 'Curricular 1', unit: 'Unit 1', status: 'Active' },
    { id: 2, curricular: 'Curricular 2', unit: 'Unit 2', status: 'Active' },
    { id: 3, curricular: 'Curricular 3', unit: 'Unit 3', status: 'Active' },
  ]

  const fetchUnitsList = async () => {
    const result: any = await API.graphql(graphqlOperation(customQueries.getInstitutionCurriculars, {
      id: institution?.id
    }));
    const savedData = result.data.getInstitution;
    const curriculars: any = savedData?.curricula?.items?.map((curricular: any) => ({
      id: curricular?.id,
      curricularId: curricular?.id,
      name: curricular?.name,
      value: curricular?.name,
      unitList: curricular?.syllabi?.items
    }));
    setCurriclaList([...curriculars]);
  }
  const editCurrentUnit = () => {

  }

  useEffect(() => {
    if (formState?.curriculum?.id) {
      const selectedItem = curriculaList?.find((curricular: any) => curricular.curricularId === formState?.curriculum?.id)
      if (selectedItem) {
        const syllabusList: any = selectedItem?.unitList?.map((item: any) => ({ id: item.id, name: item.name, value: item.name }));
        setUnitsList([...syllabusList]);
      }
    }
  }, [formState?.curriculum?.id])

  useEffect(() => {
    fetchUnitsList();
  }, [])

  const { curriculum, unit } = formState;
  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>

      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Assign Unit - {lessonName}</h3>
      </div>

      <div className="p-4">

        <div className="px-4 py-4 grid gap-x-6 grid-cols-5">
          <div className="col-span-2">
            {/* <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              Select Curriculum
            </label> */}
            <Selector selectedItem={curriculum.name} list={curriculaList} placeholder="Select Curriculumm" onChange={(val, name, id) => onSelectorChange(val, name, id, 'curriculum')} />
          </div>
          <div className="col-span-2">
            {/* <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              Select Unit
            </label> */}
            <Selector selectedItem={unit.name} list={unitsList} placeholder="Select Unit" onChange={(val, name, id) => onSelectorChange(val, name, id, 'unit')} />
          </div>
          <div className="col-span-1 flex items-end">
            <Buttons btnClass="py-3 px-10" label='Add Unit' onClick={addLessonToSyllabusLesson} disabled={loading ? true : false} />
          </div>
        </div>

        <p className="text-sm p-8 text-gray-700">NOTE: Please select Curricular and then units to add current lesson to that unit.</p>

        <div className="px-4">
          <div className="flex justify-between w-full m-auto px-8 py-4 whitespace-no-wrap border-b border-gray-200">
            <div className="w-.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>No.</span>
            </div>
            <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>Curriculum Name</span>
            </div>
            <div className="w-2.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>Unit Name</span>
            </div>
            <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>Status</span>
            </div>
            <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>Action</span>
            </div>
          </div>
          <div className="mb-8 w-full m-auto max-h-88 overflow-y-auto">
            {selectedCurricular?.map((item, index) => (
              <div key={index} className="flex justify-between items-center w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200 cursor-pointer">
                <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>
                <div className="flex w-3/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                  {item.curricular ? item.curricular : ''}
                </div>
                <div className="flex w-2.5/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                  {item.unit ? item.unit : ''}
                </div>
                <div className="flex w-3/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                  {item.status ? item.status : ''}
                </div>
                <span className={`w-1/10 flex items-center text-left cursor-pointer px-8 py-3 ${theme.textColor[themeColor]}`} onClick={editCurrentUnit}>
                  edit
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>



    </div>
  )
}

export default UnitLookup
