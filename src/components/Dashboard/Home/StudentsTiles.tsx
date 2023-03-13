import SearchInput from '@components/Atoms/Form/SearchInput';
import Highlighted from '@components/Atoms/Highlighted';
import useAuth from '@customHooks/useAuth';
import useSearch from '@customHooks/useSearch';
import Buttons from 'atoms/Buttons';
import ContentCard from 'atoms/ContentCard';
import ImageAlternate from 'atoms/ImageAlternative';
import Loader from 'atoms/Loader';
import SectionTitleV3 from 'atoms/SectionTitleV3';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {orderBy} from 'lodash';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';

const StudentsTiles = (props: {
  studentsList: any;
  title: string;
  isTeacher?: boolean;
  loading?: boolean;
}) => {
  const {studentsList, title, isTeacher = false, loading = false} = props;

  const {userLanguage} = useGlobalContext();
  const {StudentDict} = useDictionary();

  const {user} = useAuth();

  const [viewMore, setViewMore] = useState(false);
  const history = useHistory();

  // const [searchInput, setSearchInput] = useState({
  //   value: '',
  //   isActive: false
  // });

  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    if (studentsList && studentsList.length > 0) {
      const filtered = studentsList.filter(
        ({student}: any) => student.id !== user.authId
      );
      setList(
        filtered.map((item: any) => {
          return {
            ...item,
            name: `${item.student.firstName} ${item.student.lastName}`
          };
        })
      );
    }
  }, [studentsList]);

  const {
    searchAndFilter,

    searchInput,
    removeSearchAction,
    setSearch,
    setSearchInput
  } = useSearch([...list], ['name']);

  const [filteredList, setFilteredList] = useState<any[]>([...list]);

  const searchStudents = () => {
    const searched = searchAndFilter(searchInput.value, false);

    if (Boolean(searched)) {
      setViewMore(false);
      setFilteredList(searched);
    } else {
      removeSearchAction(() => {}, false);
    }
  };

  const finalList = orderBy(
    searchInput.isActive ? filteredList : list,
    ['name'],
    ['asc']
  );

  return (
    <>
      <SectionTitleV3
        title={title}
        extraContainerClass="lg:max-w-192 md:max-w-none px-6 2xl:max-w-256 "
        fontSize="xl"
        fontStyle="semibold"
        borderBottom
        extraClass="leading-6  text-gray-900"
        withButton={
          <div className={`flex items-center w-auto justify-end`}>
            {isTeacher && (
              <div className="w-auto">
                <SearchInput
                  dataCy="student-loookup-search"
                  value={searchInput.value}
                  onChange={setSearch}
                  onKeyDown={searchStudents}
                  isActive={searchInput.isActive}
                  closeAction={removeSearchAction}
                />
              </div>
            )}
            {list.length > 12 && (
              <div className="flex justify-end ml-4 w-auto">
                <Buttons
                  label={!viewMore ? 'Show All' : 'Show Few'}
                  onClick={() => {
                    if (!viewMore) {
                      setSearchInput({...searchInput, isActive: false});
                    }
                    setViewMore(!viewMore);
                  }}
                  type="button"
                />
              </div>
            )}
          </div>
        }
      />
      <ContentCard hasBackground={false}>
        <div className="py-12 px-4 text-center sm:px-6 lg:px-8">
          <div className="space-y-8 sm:space-y-12">
            {finalList?.length ? (
              <ul className="grid grid-cols-2 justify-center gap-x-4 gap-y-8 sm:grid-cols-4 md:gap-x-6 lg:max-w-5xl lg:gap-x-8 lg:gap-y-12 xl:grid-cols-6">
                {finalList &&
                  finalList.length > 0 &&
                  finalList.slice(0, viewMore ? finalList.length - 1 : 12).map(
                    (
                      {
                        student
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
                          onClick={() => {
                            if (student.id && isTeacher) {
                              history.push(
                                `/dashboard/manage-institutions/institution/${user.associateInstitute[0].institution.id}/manage-users/${student.id}?from=dashboard`
                              );
                            }
                          }}>
                          <div className="space-y-4">
                            {student.image ? (
                              <img
                                className="transform hover:theme-card-shadow hover:scale-105 cursor-pointer transition duration-150 ease-in-out mx-auto h-20 w-20 rounded-full lg:w-24 lg:h-24"
                                src={student?.image}
                                alt=""
                              />
                            ) : (
                              <ImageAlternate
                                user={student}
                                textSize={'text-3xl'}
                                styleClass="transform hover:theme-card-shadow hover:scale-105 cursor-pointer transition duration-150 ease-in-out mx-auto h-20 w-20 rounded-full lg:w-24 lg:h-24"
                              />
                            )}
                            <div className="space-y-2">
                              <div className="text-xs font-medium lg:text-sm">
                                <h3 className="font-medium">
                                  <Highlighted
                                    text={student.firstName + ' ' + student.lastName}
                                    highlight={searchInput.value}
                                  />
                                </h3>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    }
                  )}
              </ul>
            ) : loading ? (
              <div className="min-h-56 flex items-center justify-center ">
                <Loader className="w-auto text-gray-400" withText="Loading students..." />
              </div>
            ) : (
              <div className="grid justify-center text-gray-500 items-center">
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
