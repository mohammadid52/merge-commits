import Buttons from '@atoms/Buttons';
import Loader from '@atoms/Loader';
import Modal from '@atoms/Modal';
import PageWrapper from '@atoms/PageWrapper';
import AddLearningObjective from '@components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/AddLearningObjective';
import {GlobalContext} from '@contexts/GlobalContext';
import * as customQueries from '@customGraphql/customQueries';
import useDictionary from '@customHooks/dictionary';
import * as queries from '@graphql/queries';
import {API, graphqlOperation} from 'aws-amplify';
import React, {useContext, useEffect, useState} from 'react';
import AddEvidence from './AddEvidence';
import CourseMeasurementsCard from './CourseMeasurementsCard';
import MeasurementsList from './MeasurementsList';

interface ILearningEvidence {
  fetchLessonRubrics: () => void;
  lessonId: string;
  institutionId: string;
  serverMessage: {
    isError: boolean;
    message: string;
  };
  setUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMeasurements: any[];
  setSelectedMeasurements: React.Dispatch<React.SetStateAction<any>>;
  updating: boolean;
  updateMeasurementList: (rubrics: any) => void;
}

const LearningEvidence = ({
  fetchLessonRubrics,
  lessonId,
  institutionId,
  serverMessage,
  setUnsavedChanges,
  selectedMeasurements,
  setSelectedMeasurements,
  updating,
  updateMeasurementList,
}: ILearningEvidence) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {AddNewLessonFormDict, LearningEvidenceDict, BUTTONS} = useDictionary(clientKey);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedCurriculumList, setSelectedCurriculumList] = useState([]);
  // const [selectedMeasurements, setSelectedMeasurements] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [evidenceListLoading, setEvidenceListLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedObjectiveData, setSelectedObjectiveData] = useState<any>({});

  const addLearningObjective = (curricularId: string) => {
    setIsFormOpen(true);
    setSelectedObjectiveData({
      curricularId,
    });
  };

  const editLearningObj = (learningData: any) => {
    setIsFormOpen(true);
    setSelectedObjectiveData(learningData);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedObjectiveData({});
  };

  useEffect(() => {
    fetchCurriculum();
    fetchLessonRubrics();
  }, []);

  // useEffect(() => {
  //   // setSelectedMeasurements(rubrics);
  // }, [rubrics]);

  const fetchObjectives = async (curricularId: string) => {
    const learningEvidenceList: any[] = [];
    // const activeIndex = selectedCurriculumList.findIndex(
    //   (item) => item.id === curricularId
    // );
    // const temp = [...selectedCurriculumList];
    // if (!temp[activeIndex].learningEvidenceList) {
    setEvidenceListLoading(true);
    let rubricList: any = await API.graphql(
      graphqlOperation(customQueries.listRubrics, {
        filter: {
          curriculumID: {eq: curricularId},
        },
      })
    );
    rubricList = rubricList.data.listRubrics?.items || [];

    const [results, learningObjectiveSeqResult, topics]: any = await Promise.all([
      await API.graphql(
        graphqlOperation(queries.listLearningObjectives, {
          filter: {
            curriculumID: {eq: curricularId},
          },
        })
      ),
      await API.graphql(
        graphqlOperation(queries.getCSequences, {id: `l_${curricularId}`})
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
    const learningObjectiveSeq =
      learningObjectiveSeqResult?.data?.getCSequences?.sequence || [];

    const learningObjectiveData = learningObjectives?.map((objective: any) => {
      const associatedTopics = topicsList
        .filter((topic: any) => topic.learningObjectiveID === objective.id)
        .map((topic: any) => {
          const associatedRubrics = rubricList.filter(
            (rubric: any) => rubric.topicID === topic.id
          );
          topic.associatedRubrics = associatedRubrics;
          associatedRubrics.map((rubric: any) => {
            learningEvidenceList.push({
              learningObjectiveName: objective.name,
              topicName: topic.name,
              measurementName: rubric.name,
              rubricId: rubric.id,
            });
          });
          return topic;
        });
      objective.associatedTopics = associatedTopics;
      return objective;
    });
    setEvidenceListLoading(false);
    return {
      learningObjectiveData,
      learningEvidenceList: learningEvidenceList.sort((a: any, b: any) =>
        a.measurementName.toLowerCase() > b.measurementName.toLowerCase() ? 1 : -1
      ),
    };
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
            syllabus.unit.lessons?.items.filter(
              (lesson: any) => lesson.lessonID === lessonId
            ).length
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
      await Promise.all(
        selectedCurriculums.map(async (curriculum: any) => {
          const {learningObjectiveData, learningEvidenceList} = await fetchObjectives(
            curriculum.id
          );
          curriculum.learningObjectiveData = learningObjectiveData;
          curriculum.learningEvidenceList = learningEvidenceList;
        })
      );
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
    setUnsavedChanges(true);
    const checked: boolean = (event.target as HTMLInputElement).checked;
    let rubrics = [...selectedMeasurements];
    const index: number = selectedMeasurements.findIndex(
      (item: any) => item.rubricID === rubricId
    );

    if (index > -1) {
      rubrics[index] = {
        ...rubrics[index],
        checked,
      };
    } else {
      rubrics.push({
        rubricID: rubricId,
        checked,
      });
    }
    setSelectedMeasurements(rubrics);
  };

  const onSubmit = () => {
    updateMeasurementList(selectedMeasurements);
  };

  const postLearningObjectiveChange = (data: any) => {
    setSelectedCurriculumList((prevList) =>
      prevList.map((item) =>
        item.id === data.curriculumID
          ? {
              ...item,
              learningObjectiveData: selectedObjectiveData?.id
                ? item.learningObjectiveData.map((objective: any) =>
                    objective.id === data.id ? {...objective, ...data} : objective
                  )
                : [...item.learningObjectiveData, data],
            }
          : item
      )
    );
    setIsFormOpen(false);
    setSelectedObjectiveData({});
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
        <PageWrapper defaultClass="px-2 xl:px-8 border-0 border-gray-200">
          <div className="flex justify-between pb-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">
              {LearningEvidenceDict[userLanguage]['TITLE']}
            </h3>
            {/* <div className="flex justify-end w-72">
              <Buttons
                btnClass=""
                label={'Add Learning Objective'}
                onClick={() => setIsFormOpen(true)}
              />
            </div> */}
          </div>
          {loading ? (
            <div className="mt-4">
              <Loader />
            </div>
          ) : titleList.length ? (
            <>
              <div className="w-full flex justify-between">
                <div className="grid px-2 xl:px-6 gap-5 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 lg:max-w-none">
                  {selectedCurriculumList.map((curriculum) => (
                    <CourseMeasurementsCard
                      curriculum={curriculum}
                      handleCheckboxChange={handleCheckboxChange}
                      selectedMeasurements={selectedMeasurements}
                      setAddModalShow={setAddModalShow}
                      key={curriculum.id}
                      addLearningObjective={addLearningObjective}
                      editLearningObj={editLearningObj}
                    />
                  ))}
                </div>

                {/* <Accordion
                  titleList={titleList}
                  actionOnAccordionClick={fetchObjectives}
                /> */}
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
        {isFormOpen && (
          <Modal
            showHeader
            showFooter={false}
            showHeaderBorder
            title={'Learning Objective'}
            closeOnBackdrop
            closeAction={handleCancel}>
            <div className="min-w-120">
              <AddLearningObjective
                curricularId={selectedObjectiveData.curricularId}
                handleCancel={handleCancel}
                learningObjectiveData={selectedObjectiveData}
                postMutation={postLearningObjectiveChange}
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default LearningEvidence;
