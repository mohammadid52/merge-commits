import React, {useContext, useEffect, useState} from 'react';
import {API, graphqlOperation} from 'aws-amplify';

import * as queries from '../../../../../../graphql/queries';
import * as mutations from '../../../../../../graphql/mutations';
import * as customQueries from '../../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../../customGraphql/customMutations';

import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';

import Accordion from '../../../../../Atoms/Accordion';
import Buttons from '../../../../../Atoms/Buttons';
import Loader from '../../../../../Atoms/Loader';
import Modal from '../../../../../Atoms/Modal';
import PageWrapper from '../../../../../Atoms/PageWrapper';

import AddEvidence from './AddEvidence';
import MeasurementsList from './MeasurementsList';

interface ILearningEvidence {
  lessonId: string;
  institutionId: string;
  rubrics: string[] | null;
}

const LearningEvidence = ({lessonId, institutionId, rubrics}: ILearningEvidence) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {AddNewLessonFormDict, BUTTONS} = useDictionary(clientKey);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedCurriculumList, setSelectedCurriculumList] = useState([]);
  const [selectedMeasurements, setSelectedMeasurements] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [evidenceListLoading, setEvidenceListLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [serverMessage, setServerMessage] = useState({
    isError: false,
    message: '',
  });

  useEffect(() => {
    fetchCurriculum();
    fetchLessonRubrics();
  }, []);

  useEffect(() => {
    // setSelectedMeasurements(rubrics);
  }, [rubrics]);

  const fetchLessonRubrics = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listLessonRubricss, {
          filter: {
            lessonID: {eq: lessonId},
          },
        })
      );
      const rubricList = result.data?.listLessonRubricss.items.map((rubric: any) => ({
        ...rubric,
        checked: true,
      }));
      console.log(rubricList, 'rubricList+++++++++++');

      setSelectedMeasurements(rubricList);
    } catch (error) {}
  };

  const fetchObjectives = async (curricularId: string) => {
    const learningEvidenceList: any[] = [];
    const activeIndex = selectedCurriculumList.findIndex(
      (item) => item.id === curricularId
    );
    const temp = [...selectedCurriculumList];
    if (!temp[activeIndex].learningEvidenceList) {
      setEvidenceListLoading(true);
      let rubricList: any = await API.graphql(
        graphqlOperation(customQueries.listRubrics, {
          filter: {
            curriculumID: {eq: curricularId},
          },
        })
      );
      rubricList = rubricList.data.listRubrics?.items || [];

      const [results, topics]: any = await Promise.all([
        await API.graphql(
          graphqlOperation(queries.listLearningObjectives, {
            filter: {
              curriculumID: {eq: curricularId},
            },
          })
        ),
        await API.graphql(
          graphqlOperation(customQueries.listTopics, {
            filter: {
              curriculumID: {eq: curricularId},
            },
          })
        ),
      ]);

      const topicsList = topics.data?.listTopics?.items;
      const learningObjectives = results.data?.listLearningObjectives?.items;

      learningObjectives?.map((objective: any) => {
        const associatedTopics = topicsList.filter(
          (topic: any) => topic.learningObjectiveID === objective.id
        );
        associatedTopics.map((topic: any) => {
          const associatedRubrics = rubricList.filter(
            (rubric: any) => rubric.topicID === topic.id
          );
          associatedRubrics.map((rubric: any) => {
            learningEvidenceList.push({
              learningObjectiveName: objective.name,
              topicName: topic.name,
              measurementName: rubric.name,
              rubricId: rubric.id,
            });
          });
        });
      });
      temp[activeIndex] = {
        ...temp[activeIndex],
        learningEvidenceList,
      };
      setSelectedCurriculumList(temp);
      setEvidenceListLoading(false);
    }
  };

  const fetchCurriculum = async () => {
    try {
      setLoading(true);
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listCurriculumsForLessons, {
          filter: {
            institutionID: {eq: institutionId},
          },
        })
      );
      const curriculums = list.data?.listCurriculums?.items;
      let selectedCurriculums: any = [];
      curriculums.map((curriculum: any) => {
        const assignedSyllabi = curriculum.universalSyllabus?.items.filter(
          (syllabus: any) =>
            syllabus.lessons?.items.filter((lesson: any) => lesson.lessonID === lessonId)
              .length
        );
        const isCourseAdded = Boolean(assignedSyllabi.length);
        if (isCourseAdded) {
          selectedCurriculums.push({
            ...curriculum,
            assignedSyllabi: assignedSyllabi.map((syllabus: any) => syllabus.name),
            assignedSyllabusId: assignedSyllabi.map((syllabus: any) => syllabus.id),
          });
        }
      });
      setSelectedCurriculumList(selectedCurriculums);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    rubricId: string
  ) => {
    const checked: boolean = (event.target as HTMLInputElement).checked;
    let rubrics = [...selectedMeasurements];
    const index: number = selectedMeasurements.findIndex(
      (item: any) => item.rubricID === rubricId
    );
    console.log(rubricId, index, 'rubricId');

    if (index > -1) {
      rubrics[index] = {
        ...rubrics[index],
        checked,
      };
    } else {
      rubrics.push({
        rubricID: rubricId,
        checked
      });
    }
    setSelectedMeasurements(rubrics);
  };

  const onSubmit = () => {
    updateMeasurementList(selectedMeasurements);
  };

  const updateMeasurementList = async (rubrics: string[] | null) => {
    try {
      setUpdating(true);
      const newRubrics = rubrics.filter((rubric: any) => !rubric.id);
      if (newRubrics?.length) {
        await API.graphql(
          graphqlOperation(mutations.batchAddLessonRubrics, {
            lessonRubrics: newRubrics.map((rubric: any) => ({
              lessonID: lessonId,
              rubricID: rubric.rubricID,
            })),
          })
        );
      }
      const rubricsToBeRemoved = rubrics.filter(
        (rubric: any) => rubric.id && !rubric.checked
        );
      if (rubricsToBeRemoved?.length) {
        await API.graphql(
          graphqlOperation(mutations.batchDeleteLessonRubrics, {
            lessonRubrics: rubricsToBeRemoved.map((rubric: any) => ({
              id: rubric.id,
            })),
          })
        );
      }
      setServerMessage({
        isError: false,
        message: AddNewLessonFormDict[userLanguage]['MESSAGES']['MEASUREMENTADDSUCCESS'],
      });
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
      setServerMessage({
        isError: true,
        message: AddNewLessonFormDict[userLanguage]['MESSAGES']['UPDATEERR'],
      });
    }
  };

  const renderTableView = (learningEvidenceList: any) => {
    return (
      <MeasurementsList
        handleCheckboxChange={handleCheckboxChange}
        learningEvidenceList={learningEvidenceList}
        loading={evidenceListLoading}
        selectedMeasurements={selectedMeasurements}
        setAddModalShow={setAddModalShow}
      />
    );
  };

  const titleList = selectedCurriculumList.map((curriculum, index) => ({
    id: index,
    title: curriculum.name,
    content: renderTableView(curriculum.learningEvidenceList),
    uniqueId: curriculum.id,
  }));

  return (
    <div className="flex m-auto justify-center">
      <div className="">
        <PageWrapper defaultClass="px-8 border-0 border-gray-200">
          {loading ? (
            <div className="mt-4">
              <Loader />
            </div>
          ) : titleList.length ? (
            <>
              <div className="w-full flex justify-between border-b-0 border-gray-200 mt-8">
                <Accordion
                  titleList={titleList}
                  actionOnAccordionClick={fetchObjectives}
                />
              </div>
              <div className="flex justify-end mt-8">
                <Buttons
                  btnClass="py-1 px-8 text-xs ml-2"
                  label={
                    updating
                      ? BUTTONS[userLanguage]['SAVING']
                      : BUTTONS[userLanguage]['SAVE']
                  }
                  type="submit"
                  onClick={onSubmit}
                  disabled={updating}
                />
              </div>
              {serverMessage.message && (
                <div className="py-2 m-auto mt-2 text-center">
                  <p
                    className={`${
                      serverMessage.isError ? 'text-red-600' : 'text-green-600'
                    }`}>
                    {serverMessage.message}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 my-6 text-center">
              <p className="text-gray-600 font-medium">
                {AddNewLessonFormDict[userLanguage]['MESSAGES']['LESSONNOTHAVE']}
              </p>
            </div>
          )}
        </PageWrapper>
        {addModalShow && (
          <Modal
            showHeader
            showFooter={false}
            showHeaderBorder
            title={'Add Evidence'}
            closeOnBackdrop
            closeAction={() => setAddModalShow(false)}>
            <div className="min-w-256">
              <AddEvidence />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default LearningEvidence;
