import React, {useContext, useEffect, useState} from 'react';

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
import {API, graphqlOperation} from 'aws-amplify';

const LessonCourse = ({institution, lessonId}: any) => {
  const {clientKey} = useContext(GlobalContext);
  const {LessonBuilderDict} = useDictionary(clientKey);
  const [addModalShow, setAddModalShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCurriculumList, setSelectedCurriculumList] = useState([]);

  useEffect(() => {
    fetchCurriculum();
  }, [institution]);

  const fetchCurriculum = async () => {
    setLoading(true);
    const list: any = await API.graphql(
      graphqlOperation(customQueries.listCurriculumsForLessons, {
        filter: {
          institutionID: {eq: institution?.id},
        },
      })
    );
    const curriculumList = list.data?.listCurriculums?.items;
    console.log(curriculumList, 'curriculumList', lessonId);
    
    let selectedCurriculums:any = [];
    curriculumList.map((curriculum: any) => {
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
        });
      }
    });
    setSelectedCurriculumList(selectedCurriculums);
    setLoading(false);
    console.log(list, 'list inside fetchCurriculum', selectedCurriculums);
  };
  const units = [
    {id: '1', name: 'Introduction to ICONOCLAST Artist'},
    {id: '2', name: 'ICONOCLAST Artist Summer Program'},
  ];

  const renderTableView = (curriculum:any) => {
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
          <div className="w-full flex justify-between border-b-0 border-gray-200 mt-8">
            {loading ? (
            <div className="mt-4"><Loader /></div>): 
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
            />}
          </div>
        </PageWrapper>
        {addModalShow && (
          <Modal
            showHeader
            showFooter={false}
            showHeaderBorder
            title={'Add Lesson to Course'}
            closeOnBackdrop
            closeAction={() => setAddModalShow(false)}>
            <div className="min-w-256">
              <AddCourse institutionID={institution?.id} />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default LessonCourse;
