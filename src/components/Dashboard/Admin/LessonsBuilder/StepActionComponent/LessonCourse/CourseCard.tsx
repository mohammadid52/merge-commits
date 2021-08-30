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
import {uniqBy} from 'lodash';

const CourseCard = ({
  curriculum,
  lessonId,
  loading,
  postDeletion,
  institutionCollection,
}: any) => {
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

  const institutions = institutionCollection.filter(
    (item: any) => item.curriculumId === curriculum.id
  );

  const uInstitutions: any[] = uniqBy(institutions, 'institutionId');

  const colors = ['#FBC6A4', '#FBC6A4', '#CE97B0'];

  return (
    <div className="relative bg-white py-3 px-6 rounded-xl w-full border-0 border-gray-200">
      <div>
        <p className="text-l font-semibold mt-2">{curriculum.name}</p>
        <div className="my-1 mb-4 flex flex-wrap -m-1">
          {curriculum.assignedSyllabi.map((syllabus: any, index: number) => (
            <span
              key={index}
              style={{background: colors[Math.floor(Math.random() * colors.length)]}}
              className="mb-1 w-auto bg-gray-200 rounded-full px-2 text-xs leading-loose cursor-pointer">
              {syllabus.name}
            </span>
          ))}
        </div>
        {uInstitutions.length > 0 && (
          <>
            <div className="border-t-2"></div>
            <div className="mb-4 flex">
              <table className="border-collapse w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 w-auto text-sm text-left font-regular text-gray-600 border border-gray-300 table-cell">
                      Institution
                    </th>
                    <th className="p-3 w-auto text-sm text-left font-regular text-gray-600 border border-gray-300 table-cell">
                      Classroom
                    </th>
                    <th className="p-3 w-auto text-sm text-left font-regular text-gray-600 border border-gray-300 table-cell">
                      Teacher
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {uInstitutions.map((d: any, index) => {
                    return (
                      <tr
                        key={d.institutionId}
                        className={`${
                          (index + 1) % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                        } flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0`}>
                        <td className="w-auto p-3  text-sm text-gray-800 border border-b block lg:table-cell relative lg:static">
                          <span
                            onClick={() =>
                              history.push(
                                `/manage-institutions/institution?id=${d.institutionId}`
                              )
                            }
                            className="cursor-pointer hover:text-blue-500">
                            {d.institutionName}
                          </span>
                        </td>
                        <td className="w-auto p-3  text-sm text-gray-800 border border-b block lg:table-cell relative lg:static">
                          <span
                            onClick={() =>
                              history.push(
                                `/dashboard/manage-institutions/room-edit?id=${d.roomId}`
                              )
                            }
                            className="cursor-pointer hover:text-blue-500">
                            {d.roomName}
                          </span>
                        </td>
                        <td className="w-auto p-3  text-sm text-gray-800 border border-b block lg:table-cell relative lg:static">
                          <span
                            onClick={() =>
                              history.push(
                                `/dashboard/manage-users/user?id=${d.teacher.id}`
                              )
                            }
                            className="cursor-pointer  hover:text-blue-500">{`${d.teacher.firstName} ${d.teacher.lastName}`}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>

    // <div
    //   className="flex justify-between shadow flex-col white_back overflow-hidden"
    //   key={curriculum.id}>
    //   <div className="border-b-0 border-gray-200 p-4 pb-0 bg-gray-200">
    //     <div className="flex">
    //       <div className="flex-shrink-0 h-14 w-14 flex items-center">
    //         {curriculum.image ? (
    //           <img
    //             src={getImageFromS3Static(curriculum.image)}
    //             className="h-12 w-12 rounded-full"
    //           />
    //         ) : (
    //           <span className="inline-flex items-center rounded-full border-0 border-gray-400 h-12 w-12 ">
    //             <FaGraduationCap />
    //           </span>
    //         )}
    //       </div>
    //       <div className="text-lg font-bold inline-flex items-center">{curriculum.name}</div>
    //     </div>
    //     <span
    //       className={`w-full py-2 font-medium text-md items-center inline-flex ${
    //         curriculum.assignedSyllabi?.length > 1 ? 'flex-col' : ''
    //       }`}>
    //       <span className={curriculum.assignedSyllabi?.length === 1 ? "w-auto mr-2" : 'ml-1'}>Unit{curriculum.assignedSyllabi?.length > 1 && '(s)'}: </span>
    //       <ul className="flex flex-wrap	w-full items-center">
    //         {curriculum.assignedSyllabi.map((syllabus: any, index: number) => (
    //           <li
    //             className="w-auto bg-indigo-500 text-white px-2 m-1 flex rounded"
    //             key={index}>
    //             <span className="inline-flex w-auto items-center text-sm">
    //               {syllabus.name}
    //             </span>
    //             <span
    //               className="inline-flex w-auto items-center cursor-pointer"
    //               onClick={() => toggleModal(syllabus)}>
    //               <IoIosClose className="w-6 h-6" />
    //             </span>
    //           </li>
    //         ))}
    //       </ul>
    //     </span>
    //   </div>
    //   <div className="p-4 pt-0">
    //     <div className="flex items-center py-1  my-4 whitespace-normal text-sm leading-5 text-gray-900">
    //       <span className="w-auto">
    //         <FaHotel className="w-4 h-4" />
    //       </span>
    //       <span className="w-auto pl-2 font-bold text-lg">
    //         {curriculum.institution.name}
    //       </span>
    //     </div>
    //     <div className="h-48 overflow-y-auto">
    //       {curriculum.associatedClassRoomData?.map(
    //         (classRoom: any, roomIndex: number) => (
    //           <div
    //             key={classRoom.id}>
    //             <div
    //               className="flex items-center py-1 whitespace-normal text-sm leading-5 text-gray-900 cursor-pointer"
    //               onClick={() =>
    //                 history.push(
    //                   `/dashboard/manage-institutions/room-edit?id=${classRoom.id}&from=lesson-course`
    //                 )
    //               }>
    //               <span className="w-auto">{roomIndex + 1}.</span>
    //               <span className="w-auto pl-2 font-medium">
    //                 <span className="w-auto">
    //                   <span className="inline-flex items-center">
    //                     <FaDoorOpen className="pr-1 w-4 h-4" />
    //                     {classRoom.name}
    //                   </span>
    //                 </span>
    //               </span>
    //             </div>

    //             {/* <div className="flex items-center py-1 whitespace-normal text-sm leading-5 text-gray-900">
    //               <span className="w-auto">
    //                 <FaUser className="w-4 h-4" />
    //               </span>
    //               <span className="w-auto pl-2">
    //                 {classRoom?.teacher
    //                   ? [classRoom.teacher.firstName, classRoom.teacher.lastName].join(
    //                       ' '
    //                     )
    //                   : '-'}
    //               </span>
    //             </div> */}
    //           </div>
    //         )
    //       )}
    //     </div>
    //   </div>
    //   {showDeleteModal.state && (
    //     <ModalPopUp
    //       deleteModal
    //       deleteLabel="Yes"
    //       closeAction={toggleModal}
    //       saveAction={() => deleteSyllabus(showDeleteModal.id)}
    //       message={showDeleteModal.message}
    //     />
    //   )}
    // </div>
  );
};

export default CourseCard;
