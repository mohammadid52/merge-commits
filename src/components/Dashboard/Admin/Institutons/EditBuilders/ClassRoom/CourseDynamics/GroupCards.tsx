import React from 'react';
import {AiOutlineUser} from 'react-icons/ai';
import {HiPencil} from 'react-icons/hi';
import {IoLocationOutline} from 'react-icons/io5';
import {useHistory} from 'react-router';
import {getImageFromS3Static} from '../../../../../../../utilities/services';
import {initials} from '../../../../../../../utilities/strings';
import { DeleteActionBtn } from '../../../../../../Atoms/Buttons/DeleteActionBtn';

interface IGroupCardProps {
  group: any;
  handleDelete: () => void;
  handleEditClick: (data: any) => void;
  redirectToUserPage: (studentId:string) => void;
}

const GroupCard = ({group, handleDelete,handleEditClick,redirectToUserPage}: IGroupCardProps) => {

  const stringToHslColor = (str: string) => {
    let hash = 0;
    let i;
    for (i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let h = hash % 360;
    return 'hsl(' + h + ', 70%, 72%)';
  };

  return (
    <div className="flex shadow flex-col white_back overflow-hidden">
      <div className="flex-shrink-0">
        <div className="p-4 bg-gray-200">
          <div className="flex">
            <div className="text-xl font-bold flex items-center justify-center">
              {group.groupName}
              <span
                className="w-auto cursor-pointer"
                onClick={() => handleEditClick(group)}>
                <HiPencil className="w-6 h-6 pl-2" />
              </span>
              <DeleteActionBtn handleClick={handleDelete} />
            </div>
          </div>
          <div className="flex mt-2">
            <div className="flex items-center justify-center">
              <div className="w-auto">
                <AiOutlineUser className="w-6 h-6" />
              </div>
              <div className="w-auto text-lg mx-2">{`${group.groupAdvisor?.lastName}, ${
                group.groupAdvisor?.preferredName
                  ? group.groupAdvisor?.preferredName
                  : group.groupAdvisor?.firstName
              }`}</div>
              {group.groupLocation ? (
                <>
                  <div className="w-auto">
                    <IoLocationOutline className="w-6 h-6" />
                  </div>
                  <div className="ml-2 w-auto">{group.groupLocation}</div>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div className="my-2 h-52 overflow-y-auto px-4">
          {group.classroomGroupsStudents?.items?.length ? (
            <div className="grid grid-cols-2 2xl:grid-cols-3 gap-2">
              {group.classroomGroupsStudents.items.map((student: any) => (
                <div
                  key={student.id}
                  className="w-full p-2 cursor-pointer hover:bg-gray-200 rounded-md"
                  onClick={() => redirectToUserPage(student.id)}>
                  <div className="w-full">
                    <div className="flex items-center justify-center">
                      <div className="flex-shrink-0 h-10 w-10 lg:w-14 lg:h-14">
                        {student.student?.image ? (
                          <img
                            src={getImageFromS3Static(student.student?.image)}
                            className="transform hover:scale-105 cursor-pointer transition duration-150 ease-in-out mx-auto h-10 w-10 rounded-full lg:w-14 lg:h-14"
                          />
                        ) : (
                          <div
                            className="transform hover:scale-105 cursor-pointer transition duration-150 ease-in-out mx-auto h-10 w-10 rounded-full lg:w-14 lg:h-14 flex justify-center items-center text-white text-sm text-bold"
                            style={{
                              background: `${stringToHslColor(
                                student.student?.firstName +
                                  ' ' +
                                  student.student?.lastName
                              )}`,
                              textShadow: '0.1rem 0.1rem 2px #423939b3',
                            }}>
                            {initials(
                              student.student?.preferredName
                                ? student.student?.preferredName
                                : student.student?.firstName,
                              student.student?.lastName
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="text-xs font-medium lg:text-sm">
                      <h3 className="font-medium">
                        {`${student.student?.lastName}, ${
                          student.student?.preferredName
                            ? student.student?.preferredName
                            : student.student?.firstName
                        }`}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-sm w-auto">No Student added</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
