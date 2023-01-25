import React from 'react';
import ContentCard from 'atoms/ContentCard';
import ImageAlternate from 'atoms/ImageAlternative';
import {filter, orderBy} from 'lodash';
import {PersonStatus} from 'API';

interface Teacher {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  status: PersonStatus;
  image: string | null;
}

const TeacherRows = (props: {coTeachersList: Teacher[]; teachersList: Teacher[]}) => {
  const {coTeachersList = [], teachersList = []} = props;
  const allTeachers = orderBy(
    filter(
      [...teachersList, ...coTeachersList],
      (d) => d.status !== PersonStatus.INACTIVE
    ),
    ['firstName'],
    ['asc']
  );

  return (
    <ContentCard hasBackground={false}>
      <div className="overflow-hidden">
        {
          allTeachers && allTeachers.length > 0 ? (
            <ul className="grid grid-cols-1 ">
              {allTeachers.map((teacher, idx: number) => {
                return (
                  <li
                    key={`home__teacher-${idx}`}
                    className={`border-b-0 ${
                      allTeachers.length - 1 === idx ? 'rounded-b-xl' : ''
                    }`}>
                    <a
                      href="#"
                      className="block hover:bg-gray-200 "
                      style={{borderRadius: 'inherit'}}>
                      <div className="flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 flex items-center">
                          {teacher.image ? (
                            <img
                              className="h-12 w-12 rounded-full"
                              src={teacher?.image}
                              alt=""
                            />
                          ) : (
                            <ImageAlternate
                              user={teacher}
                              styleClass="h-12 w-12 rounded-full"
                            />
                          )}

                          <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                            <div>
                              <p className="text-sm font-medium text-indigo-600 truncate">
                                {teacher.firstName + ' ' + teacher.lastName}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500">
                                <svg
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true">
                                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <span className="truncate">{teacher.email}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null
          // <div className="flex justify-center items-center p-12">No teachers found</div>
        }
      </div>
    </ContentCard>
  );
};

export default TeacherRows;
