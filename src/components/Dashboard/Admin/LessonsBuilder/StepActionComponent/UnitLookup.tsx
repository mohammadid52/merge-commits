import React, { useState } from 'react';
import Buttons from '../../../../Atoms/Buttons';

import Selector from '../../../../Atoms/Form/Selector';

interface UnitLookupProps {
  lessonName: string
}

const UnitLookup = (props: UnitLookupProps) => {
  const { lessonName } = props;
  const [formState, setFormState] = useState({
    curriculum: { name: '', value: '', id: '' },
    unit: { name: '', value: '', id: '' }
  });
  const [curriculaList, setCurriclaList] = useState([]);
  const [unitsList, setUnitsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSelectorChange = () => {

  }
  const addLessonToSyllabusLesson = () => {

  }
  const selectedCurricular = [
    { id: 1, curricular: 'Curricular 1', unit: 'Unit 1' },
    { id: 2, curricular: 'Curricular 2', unit: 'Unit 2' },
    { id: 3, curricular: 'Curricular 3', unit: 'Unit 3' },
  ]

  const { curriculum, unit } = formState;
  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>

      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Assign Unit - {lessonName}</h3>
      </div>

      <div className="p-4">
        <div className="px-3 py-4 grid gap-x-6 grid-cols-5">
          <div className="col-span-2">
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              Select Curriculum
            </label>
            <Selector selectedItem={curriculum.name} list={curriculaList} placeholder="Select Curriculumm" onChange={onSelectorChange} />
          </div>
          <div className="col-span-2">
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              Select Unit
            </label>
            <Selector selectedItem={unit.name} list={unitsList} placeholder="Select Unit" onChange={onSelectorChange} />
          </div>
          <div className="col-span-1 flex items-end">
            <Buttons btnClass="py-3 px-10" label='Add Unit' onClick={addLessonToSyllabusLesson} disabled={loading ? true : false} />
          </div>
        </div>
      </div>

      <div className="">
        <div className="flex justify-between w-full m-auto px-8 py-4 whitespace-no-wrap border-b border-gray-200">
          <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>No.</span>
          </div>
          <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>Curriculum Name</span>
          </div>
          <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>Unit Name</span>
          </div>
        </div>
        <div className="mb-8 w-full m-auto max-h-88 overflow-y-auto">
          {selectedCurricular?.map((item, index) => (
            <div key={index} className="flex justify-between items-center w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>
              <div className="flex w-6/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                {item.curricular ? item.curricular : ''}
              </div>
              <div className="flex w-3/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                {item.unit ? item.unit : ''}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center p-4">IN PROGRESS....</p>
      </div>


    </div>
  )
}

export default UnitLookup
