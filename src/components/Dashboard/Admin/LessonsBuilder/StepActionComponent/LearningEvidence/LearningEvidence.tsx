import React, {useContext, useEffect, useState} from 'react';
import {API, graphqlOperation} from 'aws-amplify';

import * as queries from '../../../../../../graphql/queries';
import * as customQueries from '../../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../../customGraphql/customMutations';

import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';

import Accordion from '../../../../../Atoms/Accordion';
import PageWrapper from '../../../../../Atoms/PageWrapper';
import Modal from '../../../../../Atoms/Modal';
import Loader from '../../../../../Atoms/Loader';

import AddEvidence from './AddEvidence';
import MeasurementsList from './MeasurementsList';

interface ILearningEvidence {
  lessonId: string;
  institutionId: string;
  rubrics: string[] | null;
} 

const LearningEvidence = ({lessonId, institutionId, rubrics}: ILearningEvidence) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {AddNewLessonFormDict} = useDictionary(clientKey);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedCurriculumList, setSelectedCurriculumList] = useState([]);
  const [selectedMeasurements, setSelectedMeasurements] = useState<string[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [evidenceListLoading, setEvidenceListLoading] = useState(false);

  useEffect(() => {
    fetchCurriculum();
  }, []);

  useEffect(() => {
    setSelectedMeasurements(rubrics);
  }, [rubrics]);

  const fetchObjectives = async (curricularId: string) => {
    setEvidenceListLoading(true);
    const learningEvidenceList: any[] = [];
    const activeIndex = selectedCurriculumList.findIndex(
      (item) => item.id === curricularId
    );
    const temp = [...selectedCurriculumList];

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
    let rubrics = [];
    if (checked) {
      rubrics = [...selectedMeasurements, rubricId];
      setSelectedMeasurements((prev) => [...prev, rubricId]);
    } else {
      rubrics = selectedMeasurements.filter((item) => item !== rubricId);
      setSelectedMeasurements((prev) => prev.filter((item) => item !== rubricId));
    }
    updateMeasurementList(rubrics);
  };

  const updateMeasurementList = async (rubrics: string[] | null) => {
    await API.graphql(
      graphqlOperation(customMutations.updateUniversalLesson, {
        input: {
          id: lessonId,
          rubrics,
        },
      })
    );
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
            <div className="w-full flex justify-between border-b-0 border-gray-200 mt-8">
              <Accordion titleList={titleList} actionOnAccordionClick={fetchObjectives} />
            </div>
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
