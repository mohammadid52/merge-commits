import React, { Fragment } from 'react';
import { FaGraduationCap,} from 'react-icons/fa';

import {getImageFromS3Static} from '../../../../../../utilities/services';
import CheckBox from '../../../../../Atoms/Form/CheckBox';

interface ICourseMeasurementsProps {
  curriculum: any;
  handleCheckboxChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    rubricId: string
  ) => void;
  setAddModalShow?: any;
  selectedMeasurements: any[];
}

const CourseMeasurementsCard = ({
  curriculum,
  handleCheckboxChange,
  selectedMeasurements,
}: ICourseMeasurementsProps) => {
  return (
    <div
      className="flex shadow flex-col white_back overflow-hidden mx-2"
      key={curriculum.id}>
      <div className="flex-shrink-0">
        <div className="">
          <div className="flex p-4 bg-gray-200">
            <div className="flex-shrink-0 h-14 w-14 flex items-center">
              {curriculum.image ? (
                <img
                  src={getImageFromS3Static(curriculum.image)}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <span className="inline-flex items-center rounded-full border-0 border-gray-400 h-12 w-12 ">
                  <FaGraduationCap />
                </span>
              )}
            </div>
            <div className="text-xl font-bold inline-flex items-center">{curriculum.name}</div>
          </div>
          <div className="mt-5 h-96 overflow-y-auto p-4 pt-0">
            {curriculum.learningObjectiveData.map(
              (objective: any, objectiveIndex: number) => (
                <div key={objective.id} className="pr-1 mb-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-lg font-bold pr-2`}>
                      {objectiveIndex + 1}. {objective.name}
                    </span>
                  </div>
                  {objective.associatedTopics?.length ? (
                    objective.associatedTopics.map((topic: any, topicIndex: number) => (
                      <Fragment key={topic.id}>
                        <div className="text-lg font-medium mb-1">
                          {objectiveIndex + 1}.{topicIndex + 1}. {topic.name}
                        </div>
                        <ul className="pl-3">
                          {topic.associatedRubrics?.length ? (
                            <>
                              {topic.associatedRubrics.map(
                                (rubric: any, rubricIndex: number) => (
                                  <li
                                    className="flex justify-between items-center truncate"
                                    key={rubric.id}>
                                    <span className="pr-2 text-lg truncate">
                                      {objectiveIndex + 1}.{topicIndex + 1}.
                                      {rubricIndex + 1} {rubric.name}
                                    </span>
                                    <span className="w-auto">
                                      <CheckBox
                                        value={
                                          selectedMeasurements.find(
                                            (measurement: any) =>
                                              measurement.rubricID === rubric.id
                                          )?.checked
                                        }
                                        onChange={(e) =>
                                          handleCheckboxChange(e, rubric.id)
                                        }
                                        name="rubricId"
                                      />
                                    </span>
                                  </li>
                                )
                              )}
                            </>
                          ) : (
                            <div className="text-sm">No measurement added</div>
                          )}
                        </ul>
                      </Fragment>
                    ))
                  ) : (
                    <div className="text-sm">No Topic added</div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseMeasurementsCard;
