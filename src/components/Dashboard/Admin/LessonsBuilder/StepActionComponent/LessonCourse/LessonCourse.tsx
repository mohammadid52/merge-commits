import React, {useContext, useEffect, useState} from 'react';
import {API, graphqlOperation} from 'aws-amplify';

import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';

import * as customQueries from '../../../../../../customGraphql/customQueries';

import Accordion from '../../../../../Atoms/Accordion';
import Buttons from '../../../../../Atoms/Buttons';
import Loader from '../../../../../Atoms/Loader';
import Modal from '../../../../../Atoms/Modal';
import PageWrapper from '../../../../../Atoms/PageWrapper';

import DetailTable from './DetailTable';
import AddCourse from './AddCourse';

const LessonCourse = ({institution, lessonId}: any) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {UnitLookupDict} = useDictionary(clientKey);
  const [addModalShow, setAddModalShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [curriculumList, setCurriculumList] = useState([]);
  const [selectedCurriculumList, setSelectedCurriculumList] = useState([]);

  useEffect(() => {
    fetchCurriculum();
  }, [institution]);

  const fetchCurriculum = async () => {
    try { 
      setLoading(true);
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listCurriculumsForLessons, {
          filter: {
            institutionID: {eq: institution?.id},
          },
        })
      );
      const curriculums = list.data?.listCurriculums?.items;
      setCurriculumList(curriculums);
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

  const onAddModalClose = () => {
    setAddModalShow(false);
    fetchCurriculum();
  };

  const renderTableView = (curriculum: any) => {
    return <DetailTable curriculum={curriculum} />;
  };
  const titleList = selectedCurriculumList.map((curriculum, index) => ({
    id: index,
    title: curriculum.name,
    content: renderTableView(curriculum),
  }));
  return (
    <div className="flex m-auto justify-center">
      <div className="">
        <PageWrapper defaultClass="px-8 border-0 border-gray-200">
          <div className="flex justify-end w-full m-auto ">
            <Buttons
              btnClass="mx-4"
              label={
                'Add Lesson to Syllabus'
                // LessonBuilderDict[userLanguage]['LESSON_CLASSROOM_ACTIVITY_TABLE'][
                //   'ADD_NEW_ACTIVITY'
                // ]
              }
              onClick={() => setAddModalShow(true)}
            />
          </div>
          {loading ? (
            <div className="mt-4">
              <Loader />
            </div>
          ) : titleList.length ? (
            <div className="w-full flex justify-between border-b-0 border-gray-200 mt-8">
              <Accordion
                titleList={titleList}
                // titleList={[
                //   {
                //     id: '1',
                //     title: 'Introduction to ICONOCLAST Artist',
                //     content: <>Hello</>,
                //   },
                //   {
                //     id: '2',
                //     title: 'ICONOCLAST Artist Summer Program',
                //     content: <>Hello</>,
                //   },
                // ]}
              />
            </div>
          ): <div className="text-center p-16 mt-4">
              <p className="text-gray-600 font-medium">
                {UnitLookupDict[userLanguage]['NOTADDED']}
              </p>
            </div>}
        </PageWrapper>
        {addModalShow && (
          <Modal
            showHeader
            showFooter={false}
            showHeaderBorder
            title={'Add Lesson to Course'}
            closeOnBackdrop
            closeAction={onAddModalClose}>
            <div className="min-w-256">
              <AddCourse
                curriculumList={curriculumList}
                fetchCurriculum={fetchCurriculum}
                institutionID={institution?.id}
                lessonId={lessonId}
                selectedCurriculumList={selectedCurriculumList}
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default LessonCourse;
