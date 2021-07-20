import React, {useContext} from 'react';
import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';

import Loader from '../../../../../Atoms/Loader';
import CheckBox from '../../../../../Atoms/Form/CheckBox';

interface IMeasurementList {
  setAddModalShow?: any;
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>,rubricId: string) => void;
  learningEvidenceList: any[];
  loading: boolean;
  selectedMeasurements: any[];
}

const MeasurementsList = ({
  setAddModalShow,
  handleCheckboxChange,
  learningEvidenceList,
  loading,
  selectedMeasurements,
}: IMeasurementList) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {LessonBuilderDict} = useDictionary(clientKey);

  return (
    <>
      {/* <div className="pl-4">
        <span className="w-auto pt-5 font-bold text-lg items-center flex justify-end">
          <Buttons
            btnClass="mx-4"
            label={LessonBuilderDict[userLanguage]['BUTTON']['ADD_EVIDENCE']}
            onClick={() => setAddModalShow(true)}
          />
        </span>
      </div> */}
      <div className="w-full flex justify-between border-b-0 border-gray-200 mt-4">
        <div className="w-6/10 px-4 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {
              LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS'][
                'LEARNING_OBJECTIVE'
              ]
            }
          </span>
        </div>
        <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS']['TOPICS']}
          </span>
        </div>
        <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS']['MEASUREMENTS']}
          </span>
        </div>
        <div className="w-3/10 px-8 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS']['ACTION']}
          </span>
        </div>
      </div>
      {loading ? (
        <div className="mt-4">
          <Loader />
        </div>
      ) : (
        learningEvidenceList?.map((item: any) => (
          <div
            className="mb-8 w-full m-auto max-h-88 overflow-y-auto"
            key={item.rubricId}>
            <div className="flex justify-between bg-white w-full border-b-0 border-gray-200">
              <div className="w-6/10 flex items-center px-4 py-3 hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900 whitespace-normal">
                <span>{item.learningObjectiveName}</span>
              </div>
              <div className="w-3/10 flex items-center px-8 py-3 hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium whitespace-normal text-gray-500">
                <span>{item.topicName}</span>
              </div>
              <div className="w-3/10 flex items-center px-8 py-3 hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium whitespace-normal text-gray-500">
                <span>{item.measurementName}</span>
              </div>
              <div className="w-3/10 flex items-center px-8 py-3 whitespace-normal text-sm leading-5 text-gray-500">
                <CheckBox
                  value={
                    selectedMeasurements.find(
                      (measurement:any) => measurement.rubricID === item.rubricId
                    )?.checked
                  }
                  onChange={(e) => handleCheckboxChange(e, item.rubricId)}
                  name="rubricId"
                />
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default MeasurementsList;
