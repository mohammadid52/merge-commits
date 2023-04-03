import CheckBox from 'atoms/Form/CheckBox';
import Loader from 'atoms/Loader';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import React from 'react';

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
  selectedMeasurements
}: IMeasurementList) => {
  const {userLanguage} = useGlobalContext();
  const {LessonBuilderDict} = useDictionary();

  return (
    <>
      <div className="w-full flex justify-between border-b-0 border-lightest mt-4">
        <div className="w-6/10 px-4 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
          <span>
            {
              LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS'][
                'LEARNING_OBJECTIVE'
              ]
            }
          </span>
        </div>
        <div className="w-4/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
          <span>
            {LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS']['TOPICS']}
          </span>
        </div>
        <div className="w-4/10 px-8 py-3 bg-lightest text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
          <span>
            {LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS']['MEASUREMENTS']}
          </span>
        </div>
        <div className="w-2/10 px-8 py-3 bg-lightest text-center text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
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
                index % 2 === 0 ? 'bg-white' : 'bg-lightest '
              }`}>
              <div className="w-6/10 flex items-center px-4 py-3 hover:text-medium  cursor-pointer text-sm leading-5 font-medium text-darkest   whitespace-normal">
                <span>{item.learningObjectiveName}</span>
              </div>
              <div className="w-4/10 flex items-center px-8 py-3 hover:text-medium  cursor-pointer text-sm leading-5 font-medium whitespace-normal text-medium ">
                <span>{item.topicName}</span>
              </div>
              <div className="w-4/10 flex items-center px-8 py-3 hover:text-medium  cursor-pointer text-sm leading-5 font-medium whitespace-normal text-medium ">
                <span>{item.measurementName}</span>
              </div>
              <div className="w-2/10 flex items-center px-8 py-3 whitespace-normal text-sm leading-5 text-medium ">
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
