import React from 'react';

import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import { UserInfo } from './User';
import UserStatus from './UserStatus';
import UserRole from './UserRole';

interface UserInfoProps {
  user: UserInfo
  status: string
}

const UserInformation = (props: UserInfoProps) => {
  const { user, status } = props;

  let created = () => {
    let date = new Date(user.createdAt);
    return (
      (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
    )
  }

  if (status !== 'done') {
    return (<LessonLoading />)
  }
  {
    return (
      <div className="w-full md:px-2 pt-2">
        <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Personal Information
            </h3>
          </div>

          <div className="px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 col-gap-4 row-gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  Full Name
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  {`${user.firstName} ${user.lastName}`}
                </dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  Nickname
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  {`${user.preferredName ? user.preferredName : 'not set'}`}
                </dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  Role
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  <UserRole
                    role={user.role} />
                </dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  Status
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  <UserStatus
                    status={user.status} />
                </dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  Birthday
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  {`${user.birthdate ? user.birthdate : 'not set'}`}
                </dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  Email Address
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  {`${user.email}`}
                </dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  Contact Number
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  {`${user.phone}`}
                </dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  Account Created
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  {created()}
                </dd>
              </div>
            </dl>
          </div>

        </div>

        <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Institution Information
            </h3>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 col-gap-4 row-gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  Institution
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  {`${user.institution ? user.institution : 'not set'}`}
                </dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  Grade
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  {`${user.grade ? user.grade : 'not set'}`}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    )
  }
}
export default UserInformation;