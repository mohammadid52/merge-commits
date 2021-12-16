import Tooltip from '@components/Atoms/Tooltip';
import React from 'react';
import {FaGraduationCap} from 'react-icons/fa';
import {HiOutlineArrowRight, HiPlus} from 'react-icons/hi';
import {getImageFromS3Static} from '@utilities/services';
import CheckBox from '@atoms/Form/CheckBox';

interface ICourseMeasurementsProps {
  curriculum: any;
  handleCheckboxChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    rubricId: string
  ) => void;
  editLearningObj: (data: any) => void;
  addLearningObjective: (courseId: string) => void;
  setAddModalShow?: any;
  selectedMeasurements: any[];
}

const Empty = ({text}: {text: string}) => (
  <h5
    className={
      'text-sm text-gray-500 text-center mt-2 border-0 border-gray-400 rounded-lg p-2 border-dashed'
    }>
    {text}
  </h5>
);

const CourseMeasurementsCard = ({
  curriculum,
  handleCheckboxChange,
  addLearningObjective,
  editLearningObj,
  selectedMeasurements,
}: ICourseMeasurementsProps) => {
  return (
    <div
      className="flex shadow flex-col white_back overflow-hidden mx-2"
      key={curriculum.id}>
      <div className="flex-shrink-0">
        <div className="">
          <div className="flex p-4 text-white items-center iconoclast:bg-main curate:bg-main">
            <div className="flex-shrink-0 h-14 w-14 flex items-center">
              {curriculum.image ? (
                <img
                  src={getImageFromS3Static(curriculum.image)}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <span className="inline-flex items-center rounded-full border-2 border-gray-200 h-12 w-12 ">
                  <FaGraduationCap />
                </span>
              )}
            </div>
            <div className="text-xl font-bold inline-flex items-center">
              {curriculum.name}
            </div>
            <div className="rounded-full flex items-center transition-all hover:iconoclast:bg-400 hover:curate:bg-400 h-9 w-9 cursor-pointer">
              <HiPlus
                className="h-8 w-8"
                onClick={() => addLearningObjective(curriculum.id)}
              />
            </div>
          </div>
          <div className="mt-5 max-h-96 overflow-y-auto p-4 px-6  pt-0">
            {curriculum.learningObjectiveData.length ? (
              curriculum.learningObjectiveData.map(
                (objective: any, objectiveIndex: number) => (
                  <div key={objective.id} className="pr-1 mb-2">
                    <div
                      onClick={() => editLearningObj(objective)}
                      className="flex cursor-pointer justify-between group items-center">
                      <Tooltip text="Edit details">
                        <span
                          className={`text-lg group-hover:underline hover:underline font-bold pr-2`}>
                          {objectiveIndex + 1}. {objective.name}
                        </span>
                      </Tooltip>
                    </div>
                    {objective.associatedTopics?.length ? (
                      objective.associatedTopics.map((topic: any, topicIndex: number) => {
                        return (
                          <div className="ml-2" key={topic.id}>
                            <div className="text-lg font-medium mb-1">
                              <div className="w-auto mt-1 mr-2 flex items-center text-gray-700 justify-start">
                                <HiOutlineArrowRight
                                  className={`arrow-icon mr-2 w-auto `}
                                />
                                {topic.name}
                              </div>
                            </div>
                            <ul className="pl-4">
                              {topic.associatedRubrics?.length ? (
                                <>
                                  {topic.associatedRubrics.map(
                                    (rubric: any, rubricIndex: number) => (
                                      <li
                                        className="flex group hover:border-gray-300 border-0 border-transparent transition-all   justify-between rounded-md  px-2 items-center truncate"
                                        key={rubric.id}>
                                        <span className="pr-2 text-lg truncate flex items-center">
                                          <div
                                            className={`w-2 mt-1 h-2 mr-2 rounded-full bg-red-500`}></div>{' '}
                                          {rubric.name}
                                        </span>
                                        <span className="w-auto mr-4">
                                          <CheckBox
                                            className="group:hover:bg-gray-500"
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
                                <Empty text="No measurement added" />
                              )}
                            </ul>
                          </div>
                        );
                      })
                    ) : (
                      <Empty text="No Topic added" />
                    )}
                  </div>
                )
              )
            ) : (
              <Empty text="No objective added for the course or unit" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseMeasurementsCard;
