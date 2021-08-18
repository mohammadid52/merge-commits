import React, {useState} from 'react';
import {FaDoorOpen, FaGraduationCap, FaHotel, FaUser} from 'react-icons/fa';
import {IoIosClose} from 'react-icons/io';
import {API, graphqlOperation} from 'aws-amplify';

import {getImageFromS3Static} from '../../../../../../utilities/services';
import * as mutations from '../../../../../../graphql/mutations';
import * as customQueries from '../../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../../customGraphql/customMutations';
import ModalPopUp from '../../../../../Molecules/ModalPopUp';
import {useHistory} from 'react-router';
import {useEffect} from 'react';

const CourseCard = ({curriculum, lessonId, loading, postDeletion}: any) => {
  const {
    assignedSyllabi,
    associatedClassRoomData,
    institution,
    universalSyllabus,
  } = curriculum;
  const history = useHistory();
  const [showDeleteModal, setShowDeleteModal] = useState({
    id: '',
    syllabusId: '',
    state: false,
    message: 'This will remove the lesson from the unit, do you want to continue?',
  });

  const toggleModal = (syllabus?: any) => {
    setShowDeleteModal({
      ...showDeleteModal,
      message:
        assignedSyllabi.length === 1
          ? 'This will remove the lesson from the course, do you want to continue'
          : 'This will remove the lesson from the unit, do you want to continue?',
      id: syllabus
        ? syllabus.lessons.items.find((lesson: any) => lesson.lessonID === lessonId)?.id
        : '',
      syllabusId: syllabus ? syllabus.id : '',
      state: !showDeleteModal.state,
    });
  };

  const deleteSyllabus = async (id: string) => {
    try {
      const input = {
        id,
      };
      const results: any = await API.graphql(
        graphqlOperation(mutations.deleteUniversalSyllabusLesson, {input: input})
      );
      await updateLessonSequence();
      toggleModal();
      postDeletion();
    } catch (e) {
      console.log(e, 'e inside catch');
    }
  };

  const updateLessonSequence = async () => {
    const selectedItem = universalSyllabus?.items?.find(
      (unit: any) => unit.id === showDeleteModal.syllabusId
    );
    await API.graphql(
      graphqlOperation(customMutations.updateUniversalSyllabusLessonSequence, {
        input: {
          id: showDeleteModal.syllabusId,
          universalLessonsSeq: selectedItem.universalLessonsSeq.filter(
            (lesson: any) => lesson !== lessonId
          ),
        },
      })
    );
  };

  useEffect(() => {
    fetchCurriculumsRoom();
  }, []);

  const fetchCurriculumsRoom = async () => {
    const result = await API.graphql(
      graphqlOperation(customQueries.getCurriculumRooms, {
        id: '1b7308ae-f850-4207-8d79-e122761bf5a7',
      })
    );
    console.log(result, 'result for fetchCurriculumsRoom');
  };

  return (
    <div
      className="flex justify-between shadow flex-col white_back overflow-hidden"
      key={curriculum.id}>
      <div className="border-b-0 border-gray-200 p-4 pb-0 bg-gray-200">
        <div className="flex">
          <div className="flex-shrink-0 h-10 w-10 flex items-center">
            {curriculum.image ? (
              <img
                src={getImageFromS3Static(curriculum.image)}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <span className="inline-flex items-center rounded-full border-0 border-gray-400 h-8 w-8 ">
                <FaGraduationCap />
              </span>
            )}
          </div>
          <div className="text-lg inline-flex items-center">{curriculum.name}</div>
        </div>
        <span
          className={`w-full py-2 font-medium text-md items-center inline-flex ${
            curriculum.assignedSyllabi?.length > 1 ? 'flex-col' : ''
          }`}>
          <span className="w-auto mr-2">Unit{curriculum.assignedSyllabi?.length > 1 && '(s)'}: </span>
          <ul className="flex flex-wrap	w-full items-center">
            {curriculum.assignedSyllabi.map((syllabus: any, index: number) => (
              <li
                className="w-auto bg-indigo-500 text-white px-2 m-1 flex rounded"
                key={index}>
                <span className="inline-flex w-auto items-center text-sm">
                  {syllabus.name}
                </span>
                <span
                  className="inline-flex w-auto items-center cursor-pointer"
                  onClick={() => toggleModal(syllabus)}>
                  <IoIosClose className="w-6 h-6" />
                </span>
              </li>
            ))}
          </ul>
        </span>
      </div>
      {/* <span
                    className="inline-flex items-center w-auto">
                    <IoIosAdd className="w-10 h-10" />
                  </span> */}
      <div className="p-4 pt-0">
        <div className="flex items-center py-1  my-4 whitespace-normal text-sm leading-5 text-gray-900">
          <span className="w-auto">
            <FaHotel className="w-4 h-4" />
          </span>
          <span className="w-auto pl-2 font-bold text-lg">
            {curriculum.institution.name}
          </span>
        </div>
        <div className="h-48 overflow-y-auto">
          {curriculum.associatedClassRoomData?.map(
            (classRoom: any, roomIndex: number) => (
              <div
                // className={`border-b-0`}
                key={classRoom.id}>
                <div
                  className="flex items-center py-1 whitespace-normal text-sm leading-5 text-gray-900 cursor-pointer"
                  onClick={() =>
                    history.push(
                      `/dashboard/manage-institutions/room-edit?id=${classRoom.id}&from=lesson-course`
                    )
                  }>
                  <span className="w-auto">{roomIndex + 1}.</span>
                  <span className="w-auto pl-2 font-medium">
                    <span className="w-auto">
                      <span className="inline-flex items-center">
                        <FaDoorOpen className="pr-1 w-4 h-4" />
                        {classRoom.name}
                      </span>
                    </span>
                  </span>
                </div>

                {/* <div className="flex items-center py-1 whitespace-normal text-sm leading-5 text-gray-900">
                  <span className="w-auto">
                    <FaUser className="w-4 h-4" />
                  </span>
                  <span className="w-auto pl-2">
                    {classRoom?.teacher
                      ? [classRoom.teacher.firstName, classRoom.teacher.lastName].join(
                          ' '
                        )
                      : '-'}
                  </span>
                </div> */}
              </div>
            )
          )}
        </div>
      </div>
      {showDeleteModal.state && (
        <ModalPopUp
          deleteModal
          deleteLabel="Yes"
          closeAction={toggleModal}
          saveAction={() => deleteSyllabus(showDeleteModal.id)}
          message={showDeleteModal.message}
        />
      )}
    </div>
  );
};

export default CourseCard;
