import React, {useContext, useEffect, useState} from 'react';
import {API, graphqlOperation} from 'aws-amplify';

import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';

import * as customQueries from '../../../../../../customGraphql/customQueries';
import * as mutations from '../../../../../../graphql/mutations';

import Buttons from '../../../../../Atoms/Buttons';
import Loader from '../../../../../Atoms/Loader';
import Modal from '../../../../../Atoms/Modal';
import PageWrapper from '../../../../../Atoms/PageWrapper';

import DetailTable from './DetailTable';
import AddCourse from './AddCourse';
import CourseCard from './CourseCard';

interface ILessonCourseProps {
  curriculumList: any[];
  fetchCurriculum: () => void;
  institution: any;
  lessonId: string;
  lessonType: string;
  lessonPlans: any[];
  loading: boolean;
  selectedCurriculums: any[];
  institutionCollection: any[];
}

const LessonCourse = ({
  curriculumList,
  fetchCurriculum,
  institution,
  lessonId,
  lessonType,
  lessonPlans,
  loading,
  selectedCurriculums,
  institutionCollection,
}: ILessonCourseProps) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {UnitLookupDict} = useDictionary(clientKey);
  const [addModalShow, setAddModalShow] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [roomLoading, setRoomLoading] = useState(false);
  // const [curriculumList, setCurriculumList] = useState([]);
  const [selectedCurriculumList, setSelectedCurriculumList] = useState([]);

  // useEffect(() => {
  //   fetchCurriculum();
  // }, [institution]);

  useEffect(() => {
    if(selectedCurriculums?.length){
      setSelectedCurriculumList(selectedCurriculums);
    }
  }, [selectedCurriculums]);

  // useEffect(() => {
  //   console.log(curriculumList, 'curriculumList inside useeffect');
  //   if (curriculumList.length) {
  //     fetchClassRoomDetails();
  //   }
  // }, [curriculumList]);

  const fetchClassRoomDetails = async () => {
    setRoomLoading(true);
    const classroomsResult: any = await API.graphql(
      graphqlOperation(customQueries.getInstClassRooms, {id: institution?.id})
    );
    const classRooms = classroomsResult?.data.getInstitution?.rooms.items;
    setSelectedCurriculumList((prevSelectedCurriculums) =>
      prevSelectedCurriculums.map((selectedCurriculum) => {
        const associatedClassRoomData = classRooms.filter(
          (classRoom: any) =>
            classRoom.curricula.items.filter(
              (e: any) => e.curriculumID === selectedCurriculum.id
            ).length
        );
        selectedCurriculum.associatedClassRoomData = associatedClassRoomData;
        return selectedCurriculum;
      })
    );
    setRoomLoading(false);
  };

  const deleteSyllabus = async (id: string) => {
    try {
      const input = {
        id,
      };
      const results: any = await API.graphql(
        graphqlOperation(mutations.deleteUniversalSyllabus, {input: input})
      );
      const lessonRubric = results.data.deleteLessonRubrics;
      // if (lessonRubric?.id) {
      //   setLessonMeasurements((prevLessonMeasurements: any) =>
      //     prevLessonMeasurements.filter((item: any) => item.id !== lessonRubric?.id)
      //   );
      // }
      // toggleModal();
    } catch {
      // setMessages({
      //   measurementError: '',
      //   serverError: GeneralInformationDict[userLanguage]['MESSAGES']['DELETEERR'],
      //   addSuccess: '',
      // });
    }
  };

  const onAddModalClose = () => {
    setAddModalShow(false);
    fetchCurriculum();
  };

  const postDeletion = () => {
    fetchCurriculum();
  };

  const renderTableView = (curriculum: any) => {
    return (
      <DetailTable
        curriculum={curriculum}
        lessonId={lessonId}
        loading={roomLoading}
        postDeletion={postDeletion}
      />
    );
  };

  const titleList = selectedCurriculumList.map((curriculum, index) => ({
    id: index,
    title: curriculum.name,
    content: renderTableView(curriculum),
    uniqueId: curriculum.id,
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
            <div className="grid gap-5 md:grid-cols-2 grid-cols-2 xl:grid-cols-2 lg:max-w-none mt-8">
              {selectedCurriculumList.map((curriculum) => (
                <CourseCard
                  institutionCollection={institutionCollection}
                  curriculum={curriculum}
                  lessonId={lessonId}
                  loading={roomLoading}
                  postDeletion={postDeletion}
                  key={curriculum.id}
                />
              ))}
            </div>
          ) : (
            // <div className="w-full flex justify-between border-b-0 border-gray-200 mt-8">
            //   <Accordion
            //     titleList={titleList}
            //     actionOnAccordionClick={fetchClassRoomDetails}
            //   />
            // </div>
            <div className="text-center p-16 mt-4">
              <p className="text-gray-600 font-medium">
                {UnitLookupDict[userLanguage]['NOTADDED']}
              </p>
            </div>
          )}
        </PageWrapper>
        {addModalShow && (
          <Modal
            showHeader
            showFooter={false}
            showHeaderBorder
            title={'Add Lesson to Syllabus'}
            closeOnBackdrop
            closeAction={onAddModalClose}>
            <div className="min-w-256">
              <AddCourse
                curriculumList={curriculumList}
                institutionID={institution?.id}
                lessonId={lessonId}
                lessonType={lessonType}
                lessonPlans={lessonPlans}
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
