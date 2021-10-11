import {GlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Buttons from '../../Atoms/Buttons';
import ContentCard from '../../Atoms/ContentCard';
import SearchInput from '../../Atoms/Form/SearchInputToggle';
import ImageAlternate from '../../Atoms/ImageAlternative';
import SectionTitleV3 from '../../Atoms/SectionTitleV3';

const StudentsTiles = (props: {
  studentsList: any;
  state: any;
  title: string;
  isTeacher?: boolean;
}) => {
  const {studentsList, title, state, isTeacher = false} = props;

  const {
    clientKey,
    userLanguage,
    state: {user},
  } = useContext(GlobalContext);
  const {StudentDict} = useDictionary(clientKey);

  const [viewMore, setViewMore] = useState(false);
  const history = useHistory();

  const [searchInput, setSearchInput] = useState({
    value: '',
    isActive: false,
  });

  const [list, setList] = useState([]);

  useEffect(() => {
    if (studentsList && studentsList.length > 0) {
      setList(studentsList.filter(({student}: any) => student.id !== state.user.id));
    }
  }, [studentsList]);

  const setSearch = (str: string) => {
    setSearchInput({
      ...searchInput,
      value: str,
    });
  };

  const searchStudentFromList = () => {
    if (searchInput.value) {
      const currentStudentList = [...studentsList];
      const newList = currentStudentList.filter(({student}: any) => {
        // Search on name for match.
        const {firstName, lastName} = student;
        const fullName = `${firstName} ${lastName}`?.toLowerCase();
        const searchValue = searchInput.value.toLowerCase();
        return (
          student.firstName?.toLowerCase().includes(searchValue) ||
          student.lastName?.toLowerCase().includes(searchValue) ||
          fullName.includes(searchValue)
        );
      });
      setSearchInput({
        ...searchInput,
        isActive: true,
      });
      setList(newList);
    } else {
      // reset search state
      removeSearchAction();
    }
  };

  const removeSearchAction = () => {
    setSearchInput({value: '', isActive: false});
    if (studentsList && studentsList.length > 0) {
      setList(studentsList);
    }
  };

  return (
    <>
      <SectionTitleV3
        title={title}
        extraContainerClass="lg:max-w-192 md:max-w-none 2xl:max-w-256 px-6"
        fontSize="xl"
        fontStyle="semibold"
        borderBottom
        extraClass="leading-6 text-gray-900"
        withButton={
          <div
            className={`flex items-center justify-${
              list.length > 12 && isTeacher ? 'end' : 'end'
            } w-full`}>
            {isTeacher && (
              <div className="w-auto">
                <SearchInput
                  value={searchInput.value}
                  onChange={setSearch}
                  onKeyDown={searchStudentFromList}
                  closeAction={removeSearchAction}
                  style="w-full"
                />
              </div>
            )}
            {list.length > 12 && (
              <div className="flex justify-end w-3/10">
                <Buttons
                  label={!viewMore ? 'Show All' : 'Show Few'}
                  onClick={() => setViewMore(!viewMore)}
                  type="button"
                />
              </div>
            )}
          </div>
        }
      />
      <ContentCard
        hasBackground={false}
        additionalClass="shadow bg-white mb-20 rounded-b-lg">
        <div className="py-12 px-4 text-center sm:px-6 lg:px-8">
          <div className="space-y-8 sm:space-y-12">
            {list?.length ? (
              <ul className="grid justify-center items-center gap-x-4 gap-y-8 sm:grid-cols-4 md:gap-x-6 lg:max-w-5xl lg:gap-x-8 lg:gap-y-12 xl:grid-cols-6">
                {list &&
                  list.length > 0 &&
                  list.slice(0, viewMore ? list.length - 1 : 12).map(
                    (
                      {
                        student,
                      }: {
                        student: {
                          image?: string;
                          firstName: string;
                          lastName: string;
                          id: string;
                        };
                      },
                      idx: number
                    ) => {
                      return (
                        <li
                          key={`homepage__student-${idx}`}
                          className=""
                          onClick={() => {
                            if (student.id && isTeacher) {
                              history.push(
                                `/dashboard/manage-institutions/institution/${user.associateInstitute[0].institution.id}/manage-users/${student.id}`
                              );
                            }
                          }}>
                          <div className="space-y-4">
                            {student.image ? (
                              <img
                                className="transform hover:scale-105 cursor-pointer transition duration-150 ease-in-out mx-auto h-20 w-20 rounded-full lg:w-24 lg:h-24"
                                src={student.image}
                                alt=""
                              />
                            ) : (
                              <ImageAlternate
                                user={student}
                                textSize={'text-3xl'}
                                styleClass="transform hover:scale-105 cursor-pointer transition duration-150 ease-in-out mx-auto h-20 w-20 rounded-full lg:w-24 lg:h-24"
                              />
                            )}
                            <div className="space-y-2">
                              <div className="text-xs font-medium lg:text-sm">
                                <h3 className="font-medium">
                                  {student.firstName + ' ' + student.lastName}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    }
                  )}
              </ul>
            ) : (
              <div className="grid grid-cols-2 justify-center items-center">
                {StudentDict[userLanguage].NO_STUDENT}
              </div>
            )}
          </div>
        </div>
      </ContentCard>
    </>
  );
};

export default StudentsTiles;
