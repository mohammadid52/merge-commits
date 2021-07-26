import React, {useContext, useState} from 'react';
import {IoIosClose} from 'react-icons/io';
import {API, graphqlOperation} from 'aws-amplify';

import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';
import * as mutations from '../../../../../../graphql/mutations';

import Loader from '../../../../../Atoms/Loader';
import ModalPopUp from '../../../../../Molecules/ModalPopUp';

interface IDetailTableProps {
  curriculum: any;
  lessonId: string;
  loading: boolean;
  postDeletion: () => void;
}

const DetailTable = ({
  curriculum,
  lessonId,
  loading,
  postDeletion,
}: IDetailTableProps) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {LessonBuilderDict} = useDictionary(clientKey);
  const {assignedSyllabi, associatedClassRoomData, institution} = curriculum;

  const [showDeleteModal, setShowDeleteModal] = useState({
    id: '',
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
      console.log(results, 'inside delete syllabus');
      toggleModal();
      postDeletion();
    } catch (e) {
      console.log(e, 'e inside catch');
    }
  };

  return (
    <>
      <div className="pl-4">
        <span className="w-full pt-5 font-medium text-md items-center inline-flex">
          Unit(s):{' '}
          <ul className="flex w-full ml-2 items-center">
            {assignedSyllabi.map((syllabus: any, index: number) => (
              <li
                className="w-auto bg-indigo-500 text-white px-2 mx-1 flex rounded"
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
      <div className="w-full flex justify-between border-b-0 border-gray-200 mt-4">
        <div className="w-3/10 px-4 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {
              LessonBuilderDict[userLanguage]['LESSON_COURSES_UNIT_DETAIL_VIEW'][
                'INSTITUTION'
              ]
            }
          </span>
        </div>
        <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {
              LessonBuilderDict[userLanguage]['LESSON_COURSES_UNIT_DETAIL_VIEW'][
                'CLASSROOM'
              ]
            }
          </span>
        </div>
        <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {
              LessonBuilderDict[userLanguage]['LESSON_COURSES_UNIT_DETAIL_VIEW'][
                'LEAD_INSTRUCTOR'
              ]
            }
          </span>
        </div>
      </div>
      <div className="mb-8 w-full m-auto max-h-88 overflow-y-auto">
        {loading ? (
          <div className="mt-4">
            <Loader />
          </div>
        ) : associatedClassRoomData.length ? (
          associatedClassRoomData?.map((classRoom: any) => (
            <div
              className="flex justify-between bg-white w-full border-b-0 border-gray-200"
              key={classRoom.id}>
              <div className="w-3/10 flex items-center px-4 py-3 hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900 whitespace-normal text-gray-500">
                <span>{institution?.name}</span>
              </div>
              <div className="w-3/10 flex items-center px-8 py-3 whitespace-normal text-sm leading-5 text-gray-900">
                <span className="w-auto">{classRoom.name}</span>
              </div>

              <div className="w-3/10 flex items-center px-8 py-3 whitespace-normal text-sm leading-5 text-gray-900">
                <span className="w-auto">
                  {classRoom?.teacher
                    ? [classRoom.teacher.firstName, classRoom.teacher.lastName].join(' ')
                    : '-'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 mt-4">
            <p className="text-gray-600 font-medium">
              No classroom associated with this curriculum
            </p>
          </div>
        )}
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
    </>
  );
};

export default DetailTable;
