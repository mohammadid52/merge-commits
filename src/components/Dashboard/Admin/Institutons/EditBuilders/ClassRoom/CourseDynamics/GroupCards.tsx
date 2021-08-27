import React from 'react';
import {AiOutlineUser} from 'react-icons/ai';
import {FaTimes} from 'react-icons/fa';
import {HiPencil} from 'react-icons/hi';
import {IoLocationOutline} from 'react-icons/io5';
import {useHistory} from 'react-router';
import {initials} from '../../../../../../../utilities/strings';

interface IGroupCardProps {
  group: any;
}

const GroupCard = ({group}: IGroupCardProps) => {
  const history = useHistory();

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
    <div className="flex shadow flex-col white_back overflow-hidden mx-2">
      <div className="flex-shrink-0">
        <div className="p-4 bg-gray-200">
          <div className="flex">
            <div className="text-xl font-bold flex items-center justify-center">
              {group.name}
              <span className="w-auto">
                <HiPencil className="w-6 h-6 pl-2" />
              </span>
            </div>
          </div>
          <div className="flex mt-2">
            <div className="flex items-center justify-center">
              <div className="w-auto">
                <AiOutlineUser className="w-6 h-6" />
              </div>
              <div className="w-auto text-lg mx-2">John Doe</div>
              <div className="w-auto">
                <IoLocationOutline className="w-6 h-6" />
              </div>
              <div className="ml-2 w-auto">Florida</div>
            </div>
          </div>
        </div>
        <div className="mt-5 h-48 overflow-y-auto p-4 pt-0">
          <div className="grid grid-cols-2 gap-2">
            {group.students?.length ? (
              group.students.map((student: any, studentIndex: number) => (
                <div
                  key={student.id}
                  className="w-full p-2 cursor-pointer hover:bg-gray-200 rounded-md"
                  onClick={() =>
                    history.push(
                      `/dashboard/manage-users/user?id=${student.id}&from=group`
                    )
                  }>
                  <div className="w-full">
                    <div className="flex items-center justify-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {student.image ? (
                          <img src={''} className="h-8 w-8 rounded-full" />
                        ) : (
                          <div
                            className="h-8 w-8 rounded-full flex justify-center items-center text-white text-sm text-bold"
                            style={{
                              background: `${stringToHslColor(
                                student.firstName + ' ' + student.lastName
                              )}`,
                              textShadow: '0.1rem 0.1rem 2px #423939b3',
                            }}>
                            {initials(
                              student.preferredName
                                ? student.preferredName
                                : student.firstName,
                              student.lastName
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      id={student.id}
                      className="hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900">
                      {`${student.lastName}, ${
                        student.preferredName ? student.preferredName : student.firstName
                      }`}
                    </div>
                    <div id={student.id} className="text-sm leading-5 text-gray-500">
                      {student.email}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm">No Student added</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
