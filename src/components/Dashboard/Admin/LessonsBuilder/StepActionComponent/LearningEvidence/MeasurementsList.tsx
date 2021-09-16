import React, {useContext} from 'react';
import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';
import CheckBox from '../../../../../Atoms/Form/CheckBox';
import Loader from '../../../../../Atoms/Loader';

interface IMeasurementList {
  setAddModalShow?: any;
  handleCheckboxChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    rubricId: string
  ) => void;
  learningEvidenceList: any[];
  loading: boolean;
  selectedMeasurements: any[];
}

const MeasurementsList = ({
  handleCheckboxChange,
  learningEvidenceList,
  loading,
  selectedMeasurements,
}: IMeasurementList) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {LessonBuilderDict} = useDictionary(clientKey);

  return (
    <>
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
        <div className="w-4/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS']['TOPICS']}
          </span>
        </div>
        <div className="w-4/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS']['MEASUREMENTS']}
          </span>
        </div>
        <div className="w-2/10 px-8 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS']['MEASURED']}
          </span>
        </div>
      </div>
      {loading ? (
        <div className="mt-4">
          <Loader />
        </div>
      ) : (
        learningEvidenceList?.map((item: any, index: number) => (
          <div className="w-full m-auto max-h-88 overflow-y-auto" key={item.rubricId}>
            <div
              className={`flex justify-between bg-white w-full border-b-0 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
              }`}>
              <div className="w-6/10 flex items-center px-4 py-3 hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900 whitespace-normal">
                <span>{item.learningObjectiveName}</span>
              </div>
              <div className="w-4/10 flex items-center px-8 py-3 hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium whitespace-normal text-gray-500">
                <span>{item.topicName}</span>
              </div>
              <div className="w-4/10 flex items-center px-8 py-3 hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium whitespace-normal text-gray-500">
                <span>{item.measurementName}</span>
              </div>
              <div className="w-2/10 flex items-center px-8 py-3 whitespace-normal text-sm leading-5 text-gray-500">
                <CheckBox
                  value={
                    selectedMeasurements.find(
                      (measurement: any) => measurement.rubricID === item.rubricId
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
