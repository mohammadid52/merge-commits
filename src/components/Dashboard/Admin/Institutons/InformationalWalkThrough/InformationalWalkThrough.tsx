import React, {useContext, useEffect, useRef, useState} from 'react';
import {IoIosCheckmarkCircle} from 'react-icons/io';
import {Dialog} from '@headlessui/react';
import {XIcon} from '@heroicons/react/outline';
import API, {graphqlOperation} from '@aws-amplify/api';
import {useHistory} from 'react-router';
import {BsCircleFill} from 'react-icons/bs';
import {HiOutlineRefresh} from 'react-icons/hi';
import {FiAlertCircle} from 'react-icons/fi';

import * as queries from '../../../../../graphql/queries';
import * as customQueries from '../../../../../customGraphql/customQueries';

import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {ContextMenuProvider} from '../../../../../contexts/TreeContext';
import {
  getLocalStorageData,
  removeLocalStorageData,
  setLocalStorageData,
} from '../../../../../utilities/localStorage';

import Buttons from '../../../../Atoms/Buttons';
import Selector from '../../../../Atoms/Form/Selector';
import Loader from '../../../../Atoms/Loader';
import Modal from '../../../../Atoms/Modal';

import {Tree} from '../../../../TreeView/Tree';

const InformationalWalkThrough = ({open, onCancel}: any) => {
  const {state: {user: {associateInstitute = [], role = ''} = {}} = {}} = useContext(
    GlobalContext
  );
  const history = useHistory();
  const cancelButtonRef = useRef();
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(role === 'ADM' || role === 'BLD');
  const [sectionDetailsLoading, setSectionDetailsLoading] = useState(true);
  const [instListLoading, setInstListLoading] = useState(
    role === 'ADM' || role === 'BLD'
  );
  const [activeSection, setActiveSection] = useState<any>({
    id: 'inst',
    title: 'Institution Setup',
  });
  const [selectedInstitution, setSelectedInstitution] = useState<any>({});
  const [institutionList, setInstitutionList] = useState<any>([]);

  const data: any = {
    title: 'root',
    children: [
      (role === 'ADM' || role === 'BLD') && {
        title: `Institution Setup`,
        type: 'menu',
        id: 'inst',
        redirectionUrl: selectedInstitution?.institution?.id
          ? `/dashboard/manage-institutions/institution?id={institutionId}`
          : '/dashboard/manage-institutions',
        children: [
          {
            title: 'General Info',
            type: 'list',
            children: [],
            id: 'inst_general_info',
            redirectionUrl: `/dashboard/manage-institutions/institution?id={institutionId}`,
          },
          {
            title: 'Staff',
            type: 'list',
            children: [],
            id: 'inst_staff',
            redirectionUrl: `/dashboard/manage-institutions/institution?id={institutionId}&tab=0`,
          },
          {
            title: 'Classes',
            type: 'menu',
            children: [
              {
                title: 'Create Class',
                type: 'list',
                id: 'inst_classes_create',
                redirectionUrl: `/dashboard/manage-institutions/institution/class-creation?id={institutionId}`,
              },
              {
                title: 'Add Student',
                type: 'list',
                id: 'inst_classes_add_student',
                redirectionUrl: '/dashboard/registration',
              },
            ],
            id: 'inst_classes',
            redirectionUrl: `/dashboard/manage-institutions/institution?id={institutionId}&tab=1`,
          },
          {
            title: 'Curriculum',
            type: 'menu',
            id: 'inst_curriculum',
            redirectionUrl: `/dashboard/manage-institutions/institution?id={institutionId}&tab=2`,
            children: [
              {
                title: 'Add Curriculum Information',
                type: 'list',
                id: 'inst_curriculum_general_info',
                redirectionUrl: `/dashboard/manage-institutions/institution/curricular-creation?id={institutionId}`,
              },
              {
                title: 'Create Learning Objectives',
                type: 'list',
                children: [],
                id: 'inst_curriculum_learning_objectives',
                redirectionUrl: `/dashboard/manage-institutions/{institutionId}/curricular?id={curriculumId}`,
              },
              {
                title: 'Create Units',
                type: 'menu',
                children: [
                  {
                    title: 'General Information',
                    type: 'list',
                    id: 'inst_curriculum_units_general_info',
                    redirectionUrl: `/dashboard/manage-institutions/{institutionId}/curricular/{curriculumId}/syllabus/edit?id={syllabusId}&step=overview`,
                  },
                  {
                    title: 'Lesson Plan Manager',
                    type: 'list',
                    id: 'inst_curriculum_units_lesson_plan_manager',
                    redirectionUrl: `/dashboard/manage-institutions/{institutionId}/curricular/{curriculumId}/syllabus/edit?id={syllabusId}&step=lessons`,
                  },
                ],
                id: 'inst_curriculum_units',
                redirectionUrl: `/dashboard/manage-institutions/{institutionId}/curricular?id={curriculumId}&tab=1`,
              },
              {
                title: 'Demographics & Information',
                type: 'list',
                children: [],
                id: 'inst_curriculum_demographic_information',
                redirectionUrl: `/dashboard/manage-institutions/institution?id={institutionId}&tab=2`,
              },
            ],
          },
          {
            title: 'Classroom',
            type: 'menu',
            children: [
              {
                title: 'Class Details',
                type: 'list',
                id: 'inst_classroom_class_detail',
                redirectionUrl: `/dashboard/manage-institutions/room-edit?id={roomId}&step=overview`,
              },
              {
                title: 'Unit Planner',
                type: 'list',
                children: [],
                id: 'inst_classroom_unit_planner',
                redirectionUrl: `/dashboard/manage-institutions/room-edit?id={roomId}&step=unit-planner`,
              },
              {
                title: 'Class Dynamics (Optional)',
                type: 'list',
                id: 'inst_curriculum_class_dynamics',
                children: [],
                redirectionUrl: `/dashboard/manage-institutions/room-edit?id={roomId}&step=class-dynamics`,
              },
            ],
            id: 'inst_classroom',
            redirectionUrl: `/dashboard/manage-institutions/institution?id={institutionId}&tab=4`,
          },
        ],
      },
      (role === 'ADM' || role === 'BLD') && {
        title: `Lesson Builder`,
        type: 'menu',
        id: 'lesson_builder',
        redirectionUrl: `/dashboard/lesson-builder`,
        children: [
          {
            title: 'Lesson List',
            type: 'menu',
            id: 'lesson_builder_list',
            children: [
              {
                title: 'Create new lesson',
                type: 'list',
                id: 'lesson_builder_list_create_new_lesson',
                redirectionUrl: `/dashboard/lesson-builder`,
              },
            ],
            redirectionUrl: `/dashboard/lesson-builder`,
          },
          {
            title: 'Lesson Editor',
            type: 'menu',
            id: 'lesson_builder_editor',
            children: [
              {
                title: 'Overview',
                type: 'list',
                id: 'lesson_builder_overview',
                children: [],
                redirectionUrl: `/dashboard/lesson-builder/lesson/add`,
              },
              {
                title: 'Activities',
                type: 'menu',
                id: 'lesson_builder_activities',
                children: [
                  {
                    title: 'Lesson Planner',
                    type: 'list',
                    id: 'lesson_builder_activities_lesson_planner',
                    redirectionUrl: `/dashboard/lesson-builder/lesson/edit?lessonId={lessonId}&step=activities`,
                  },
                  {
                    title: 'Overlay',
                    type: 'list',
                    id: 'lesson_builder_activities_overlay',
                    redirectionUrl: `/dashboard/lesson-builder/lesson/edit?lessonId={lessonId}&step=activities`,
                  },
                ],
                redirectionUrl: `/dashboard/lesson-builder/lesson/edit?lessonId={lessonId}&step=activities`,
              },
              {
                title: 'Lesson Plan Builder',
                type: 'menu',
                id: 'lesson_builder_plan',
                children: [
                  {
                    title: 'Blocks & Components',
                    type: 'list',
                    id: 'lesson_builder_plan_block_and_component',
                    redirectionUrl: `/dashboard/lesson-builder/lesson/page-builder?lessonId={lessonId}&pageId={pageId}`,
                  },
                  {
                    title: 'Lesson Plan Manager',
                    type: 'list',
                    id: 'lesson_builder_plan_manager',
                    redirectionUrl: `/dashboard/lesson-builder/lesson/page-builder?lessonId={lessonId}&pageId={pageId}`,
                  },
                  {
                    title: 'Homework & Challenges (Coming Soon)',
                    type: 'list',
                    id: 'lesson_builder_plan_homework_and_challenges',
                    redirectionUrl: `/dashboard/lesson-builder`,
                  },
                ],
                redirectionUrl: `/dashboard/lesson-builder`,
              },
              {
                title: 'Courses',
                type: 'list',
                id: 'lesson_builder_courses',
                children: [],
                redirectionUrl: `/dashboard/lesson-builder/lesson/edit?lessonId={lessonId}&step=courses`,
              },
              {
                title: 'Learning Evidence',
                type: 'list',
                id: 'lesson_builder_learning_evidence',
                children: [],
                redirectionUrl: `/dashboard/lesson-builder/lesson/edit?lessonId={lessonId}&step=learning-evidence`,
              },
            ],
            redirectionUrl: `/dashboard/lesson-builder`,
          },
        ],
      },
      (role === 'ADM' || role === 'BLD') && {
        title: `Service Provider`,
        type: 'menu',
        id: 'service_provider',
        children: [
          {
            title: 'Provide service to another organization',
            type: 'list',
            id: 'service_provider_provide_service',
            redirectionUrl: `/dashboard/manage-institutions/institution/edit?id={institutionId}`,
          },
          {
            title: 'Request service from another organization',
            type: 'list',
            id: 'service_provider_request_service',
            redirectionUrl: `/dashboard/manage-institutions/institution?id={institutionId}&tab=3`,
          },
        ],
        redirectionUrl: `/dashboard/manage-institutions/institution?id={institutionId}&tab=3`,
      },
      (role === 'ADM' || role === 'BLD') && {
        title: `Research & Analytics`,
        type: 'menu',
        id: 'research_and_analytics',
        children: [
          {
            title: 'Survey Download',
            type: 'list',
            id: 'research_and_analytics_survey_download',
            redirectionUrl: `/dashboard/csv`,
          },
        ],
        redirectionUrl: `/dashboard/manage-institutions/institution?id={institutionId}`,
      },
      (role === 'FLW' || role === 'TR') && {
        title: 'Live Classroom',
        type: 'list',
        id: 'live_classroom',
        children: [
          {
            title: 'Roster',
            type: 'list',
            id: 'live_classroom_roaster',
            redirectionUrl: `/dashboard/csv`,
          },
          {
            title: 'Lesson Pace Setter',
            type: 'list',
            id: 'live_classroom_lesson_pace_SEtter',
            redirectionUrl: `/dashboard/csv`,
          },
          {
            title: 'View Student Page',
            type: 'list',
            id: 'live_classroom_view_student_page',
            redirectionUrl: `/dashboard/csv`,
          },
          {
            title: 'Share Student Page',
            type: 'list',
            id: 'live_classroom_student_share_page',
            redirectionUrl: `/dashboard/csv`,
          },
        ],
        redirectionUrl: `/dashboard/manage-institutions/institution?id={institutionId}`,
      },
      (role === 'FLW' || role === 'TR') && {
        title: 'Student Profile',
        type: 'list',
        id: 'live_classroom',
        children: [
          {
            title: 'Demographics & Information',
            type: 'list',
            id: 'live_classroom_roaster',
            redirectionUrl: `/dashboard/csv`,
          },
          {
            title: 'Attendance',
            type: 'list',
            id: 'live_classroom_lesson_pace_SEtter',
            redirectionUrl: `/dashboard/csv`,
          },
          {
            title: 'Notebooks',
            type: 'list',
            id: 'live_classroom_view_student_page',
            redirectionUrl: `/dashboard/csv`,
          },
        ],
        redirectionUrl: `/dashboard/manage-institutions/institution?id={institutionId}`,
      },
      role === 'ST' && {
        title: 'Dashboard',
        type: 'list',
        id: 'dashboard',
        children: [],
        redirectionUrl: `/dashboard/manage-institutions/institution?id={institutionId}`,
      },
      role === 'ST' && {
        title: 'Live Classroom',
        type: 'list',
        id: 'live_classroom',
        children: [
          {
            title: 'Survey Download',
            type: 'list',
            id: 'research_and_analytics_survey_download',
            redirectionUrl: `/dashboard/csv`,
          },
        ],
        redirectionUrl: `/dashboard/manage-institutions/institution?id={institutionId}`,
      },
      role === 'ST' && {
        title: 'Notebooks',
        type: 'menu',
        id: 'notebooks',
        children: [
          {
            title: 'Class Notebooks',
            type: 'list',
            id: 'class_notebooks',
            redirectionUrl: `/dashboard/csv`,
          },
          {
            title: 'Private Notebooks',
            type: 'menu',
            id: 'private_notebooks',
            children: [
              {
                title: 'Sentiment Tracking',
                type: 'list',
                id: 'class_notebooks',
                redirectionUrl: `/dashboard/csv`,
              },
              {
                title: 'Class work',
                type: 'list',
                id: 'class_notebooks',
                redirectionUrl: `/dashboard/csv`,
              },
              {
                title: 'Class notes',
                type: 'list',
                id: 'class_notebooks',
                redirectionUrl: `/dashboard/csv`,
              },
              {
                title: 'Attachments',
                type: 'list',
                id: 'class_notebooks',
                redirectionUrl: `/dashboard/csv`,
              },
            ],
            redirectionUrl: `/dashboard/csv`,
          },
        ],
        redirectionUrl: `/dashboard/manage-institutions/institution?id={institutionId}`,
      },
    ].filter(Boolean),
  };

  useEffect(() => {
    const selected_institution: any = getLocalStorageData('selected_institution');
    if (associateInstitute?.length) {
      if (!selected_institution?.institution?.id) {
        setLocalStorageData('selected_institution', selected_institution);
      }
      setInstitutionList(
        associateInstitute.map((item: any) => ({
          ...item,
          name: item.institution.name,
          id: item.institution.id,
        }))
      );
      setInstListLoading(false);
    }
    if (!associateInstitute?.length) {
      fetchInstListForAdmin();
    }
  }, [associateInstitute]);

  useEffect(() => {
    const setupActiveSection = async () => {
      const activeStep = getLocalStorageData('active_step_section');
      const selected_institution: any = getLocalStorageData('selected_institution');
      if (activeStep) {
        setSectionDetailsLoading(true);
        const data = await fetchDataOfActiveSection(
          activeStep.id,
          selected_institution?.institution?.id
        );
        setActiveSection({...activeStep, data});
        setSectionDetailsLoading(false);
      }
      if (selected_institution) {
        setSelectedInstitution(selected_institution);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    if (open) {
      setupActiveSection();
    }
  }, [open]);

  const fetchInstListForAdmin = async () => {
    const fetchInstitutionData: any = await API.graphql(
      graphqlOperation(customQueries.getInstListForAdmin)
    );
    setInstitutionList(
      fetchInstitutionData.data?.listInstitutions?.items?.map((item: any) => ({
        ...item,
        institution: {
          id: item.id,
          name: item.name,
        },
      })) || []
    );
    setInstListLoading(false);
  };

  const onItemClick = async (section: {
    id: string;
    redirectionUrl: string;
    title: string;
  }) => {
    setSectionDetailsLoading(true);
    setLocalStorageData('active_step_section', section);
    // setActiveSection((prevSection: any) => ({
    //   ...prevSection,
    //   ...section,
    // }));

    if (selectedInstitution?.institution?.id) {
      // if (section.redirectionUrl) {
      //   history.push(
      //     `${section.redirectionUrl?.replace(
      //       '{institutionId}',
      //       selectedInstitution?.institution?.id
      //     )}`
      //   );
      // }
    } else {
      setShowAlert(true);
    }
    const data = await fetchDataOfActiveSection(
      section.id,
      selectedInstitution?.institution?.id,
      section.redirectionUrl
    );
    setSectionDetailsLoading(false);
    setActiveSection((prevSection: any) => ({
      ...section,
      data: {...prevSection.data, ...data},
    }));
  };

  const redirectToSelectedSection = (redirectionUrl: string, replaceObject?: any) => {
    let url = redirectionUrl;
    for (const key in replaceObject) {
      if (replaceObject.hasOwnProperty(key)) {
        const val = replaceObject[key];
        url = url.replace(new RegExp(`{${key}}`, 'g'), val);
      }
    }
    history.push(url);
  };

  const fetchDataOfActiveSection = async (
    id: string,
    instId: string,
    redirectionUrl?: string
  ) => {
    let replaceObject: any = {
      institutionId: selectedInstitution?.institution?.id,
    };
    switch (id) {
      case 'inst_general_info': {
        try {
          if (instId) {
            const result: any = await API.graphql(
              graphqlOperation(customQueries.getBasicDetailsOfInstitution, {
                id: instId,
              })
            );
            if (redirectionUrl) {
              redirectToSelectedSection(redirectionUrl, replaceObject);
            }
            return result?.data.getInstitution;
          }
          return null;
        } catch (error) {
          console.log(error, 'error');
        }
      }
      case 'inst_staff': {
        try {
          if (instId) {
            const result: any = await API.graphql(
              graphqlOperation(queries.listStaffs, {
                filter: {
                  or: [
                    {
                      institutionID: {eq: instId},
                    },
                  ],
                },
              })
            );
            if (redirectionUrl) {
              redirectToSelectedSection(redirectionUrl, replaceObject);
            }
            return {
              staff: result.data.listStaffs.items.filter(
                (member: any) => member.staffMember.role === 'TR'
              ),
            };
          }
          return null;
        } catch (error) {
          console.log(error, 'error');
        }
      }
      case 'inst_classes_create': {
        try {
          if (instId) {
            const result: any = await API.graphql(
              graphqlOperation(customQueries.GetInstitutionClasses, {id: instId})
            );
            return {classes: result.data?.getInstitution?.classes.items};
          }
          return null;
        } catch (error) {
          console.log(error, 'error');
        }
      }
      case 'inst_curriculum_general_info': {
        try {
          if (instId) {
            const result: any = await API.graphql(
              graphqlOperation(customQueries.getInstitutionCurriculums, {id: instId})
            );
            return {curriculum: result.data?.getInstitution?.curricula.items};
          }
          return null;
        } catch (error) {
          console.log(error, 'error');
        }
      }
      case 'inst_curriculum_learning_objectives': {
        try {
          if (instId) {
            let curriculums: any = activeSection?.data?.curriculum;
            if (!curriculums) {
              const result: any = await API.graphql(
                graphqlOperation(customQueries.getInstitutionCurriculums, {id: instId})
              );
              curriculums = result.data?.getInstitution?.curricula.items;
            }

            if (curriculums?.length) {
              const filter = {
                or: curriculums.map((curriculum: any) => ({
                  curriculumID: {eq: curriculum.id},
                })),
              };
              let learningObjectives: any = await API.graphql(
                graphqlOperation(queries.listLearningObjectives, {
                  filter,
                })
              );
              learningObjectives =
                learningObjectives?.data?.listLearningObjectives?.items || [];
              console.log(learningObjectives, 'learningObjectives');
              let topics: any = await API.graphql(
                graphqlOperation(queries.listTopics, {
                  filter,
                })
              );
              topics = topics?.data?.listTopics?.items || [];
              console.log(topics, 'topics');
              let rubrics: any = await API.graphql(
                graphqlOperation(queries.listRubrics, {
                  filter,
                })
              );
              rubrics = rubrics?.data?.listRubrics?.items || [];
              if (redirectionUrl) {
                redirectToSelectedSection(redirectionUrl, {
                  ...replaceObject,
                  curriculumId: curriculums[0].id,
                });
              }
              return {
                curriculum: curriculums,
                learningObjectives,
                topics,
                rubrics,
              };
            }
            redirectToSelectedSection(
              '/dashboard/manage-institutions/institution/curricular-creation?id={institutionId}'
            );
          }
          return null;
        } catch (error) {
          console.log(error, 'error');
        }
      }
      case 'inst_curriculum_units_general_info': {
        try {
          if (instId) {
            let curriculums: any = activeSection?.data?.curriculum;
            if (!curriculums) {
              const result: any = await API.graphql(
                graphqlOperation(customQueries.getInstitutionCurriculums, {id: instId})
              );
              curriculums = result.data?.getInstitution?.curricula.items;
            }
            if (curriculums?.length) {
              const filter = {
                or: curriculums.map((curriculum: any) => ({
                  curriculumID: {eq: curriculum.id},
                })),
              };
              let universalSyllabus: any = await API.graphql(
                graphqlOperation(queries.listUniversalSyllabuss, {
                  filter,
                  // limit: 1,
                })
              );
              universalSyllabus = universalSyllabus?.data?.listUniversalSyllabuss?.items;
              if (redirectionUrl) {
                if (universalSyllabus?.length) {
                  redirectToSelectedSection(redirectionUrl, {
                    ...replaceObject,
                    curriculumId: universalSyllabus[0].curriculumID,
                    syllabusId: universalSyllabus[0].id,
                  });
                } else {
                  redirectToSelectedSection(
                    '/dashboard/manage-institutions/institution/curricular-creation?id={institutionId}'
                  );
                }
              }
              return {universalSyllabus};
            }
            redirectToSelectedSection(
              '/dashboard/manage-institutions/institution/curricular-creation?id={institutionId}'
            );
          }
        } catch (error) {
          console.log(error, 'error');
        }
      }
      case 'inst_classroom_unit_planner':
      case 'inst_classroom_class_detail': {
        try {
          if (instId) {
            const result: any = await API.graphql(
              graphqlOperation(customQueries.listRoomsBasicDetails, {
                filter: {institutionID: {eq: instId}},
              })
            );
            const rooms = result.data?.listRooms?.items;
            if (redirectionUrl) {
              if (rooms.length) {
                redirectToSelectedSection(redirectionUrl, {
                  ...replaceObject,
                  roomId: rooms[0].id,
                });
              } else {
                redirectToSelectedSection(
                  '/dashboard/manage-institutions/institution/room-creation?id=${institutionId}',
                  replaceObject
                );
              }
            }
            return {classRooms: result.data?.listRooms?.items};
          }
        } catch (error) {
          console.log(error, 'error');
        }
      }
      case 'inst_curriculum_units_lesson_plan_manager':
      case 'lesson_builder_list_create_new_lesson':
      case 'lesson_builder_activities_lesson_planner':
      case 'lesson_builder_activities_overlay':
      case 'lesson_builder_plan_block_and_component':
      case 'lesson_builder_overview': {
        try {
          let universalLessons = activeSection?.data?.universalLessons?.length;
          if (instId && !universalLessons?.length) {
            const result: any = await API.graphql(
              graphqlOperation(customQueries.listUniversalLessonsForInstitution, {
                filter: {institutionID: {eq: instId}},
              })
            );
            universalLessons = result.data?.listUniversalLessons?.items;
            if (redirectionUrl) {
              if (universalLessons.length) {
                const lessonPlanWithBlock = universalLessons?.find((lesson: any) =>
                  lesson.lessonPlan?.find((plan: any) =>
                    plan.pageContent?.find((page: any) => page?.partContent?.length)
                  )
                );
                if (lessonPlanWithBlock) {
                  replaceObject = {
                    ...replaceObject,
                    pageId: lessonPlanWithBlock.lessonPlan[0].id,
                  };
                }
                redirectToSelectedSection(redirectionUrl, {
                  ...replaceObject,
                  lessonId: universalLessons[0].id,
                });
              } else {
                redirectToSelectedSection('/dashboard/lesson-builder/lesson/add');
              }
            }
            return {universalLessons};
          }
          if (redirectionUrl) {
            if (universalLessons.length) {
              const lessonPlanWithBlock = universalLessons?.find((lesson: any) =>
                lesson.lessonPlan?.find((plan: any) =>
                  plan.pageContent?.find((page: any) => page?.partContent?.length)
                )
              );
              if (lessonPlanWithBlock) {
                replaceObject = {
                  ...replaceObject,
                  pageId: lessonPlanWithBlock.lessonPlan[0].id,
                };
              }
              redirectToSelectedSection(redirectionUrl, {
                ...replaceObject,
                lessonId: universalLessons[0].id,
              });
            } else {
              redirectToSelectedSection('/dashboard/lesson-builder/lesson/add');
            }
          }
        } catch (error) {
          console.log(error, 'error');
        }
      }
      case 'lesson_builder_courses': {
        try {
          if (instId) {
            let universalLessonsList = activeSection?.data?.universalLessons;
            if (!universalLessonsList) {
              const result: any = await API.graphql(
                graphqlOperation(customQueries.listUniversalLessonsForInstitution, {
                  filter: {institutionID: {eq: instId}},
                })
              );
              universalLessonsList = result.data?.listUniversalLessons?.items;
            }
            const list: any = await API.graphql(
              graphqlOperation(customQueries.listCurriculumsForLessons, {
                filter: {
                  institutionID: {eq: instId},
                },
              })
            );
            const curriculums = list.data?.listCurriculums?.items;
            const lessonIds = universalLessonsList?.map((lesson: any) => lesson.id);
            let isCourseAdded = false;
            curriculums.map((curriculum: any) => {
              if (!isCourseAdded) {
                const assignedSyllabi = curriculum.universalSyllabus?.items.filter(
                  (syllabus: any) =>
                    syllabus.lessons?.items.filter((lesson: any) =>
                      lessonIds.includes(lesson.lessonID)
                    ).length
                );
                isCourseAdded = Boolean(assignedSyllabi.length);
              }
            });
            if (universalLessonsList.length) {
              redirectToSelectedSection(redirectionUrl, {
                ...replaceObject,
                lessonId: universalLessonsList[0].id,
              });
            } else {
              redirectToSelectedSection('/dashboard/lesson-builder/lesson/add');
            }
            return {isCourseAdded, universalLessons: universalLessonsList};
          }
        } catch (error) {
          console.log(error, 'error');
        }
      }
      case 'lesson_builder_learning_evidence': {
        try {
          if (instId) {
            let universalLessonsList = activeSection?.data?.universalLessons;
            if (!universalLessonsList) {
              const result: any = await API.graphql(
                graphqlOperation(customQueries.listUniversalLessonsForInstitution, {
                  filter: {institutionID: {eq: instId}},
                })
              );
              universalLessonsList = result.data?.listUniversalLessons?.items;
            }
            const filter = {
              or: universalLessonsList.map((lesson: any) => ({
                lessonID: {eq: lesson.id},
              })),
            };
            const result: any = await API.graphql(
              graphqlOperation(customQueries.listLessonRubricss, {
                filter,
                limit: 1,
              })
            );
            if (universalLessonsList.length) {
              redirectToSelectedSection(redirectionUrl, {
                ...replaceObject,
                lessonId: universalLessonsList[0].id,
              });
            } else {
              redirectToSelectedSection('/dashboard/lesson-builder/lesson/add');
            }
            return {
              lessonRubrics: result?.data?.listLessonRubricss?.items,
              universalLessons: universalLessonsList,
            };
          }
        } catch (error) {
          console.log(error, 'error');
        }
      }
      case 'service_provider_provide_service':
      case 'service_provider_request_service': {
        if (redirectionUrl) {
          redirectToSelectedSection(redirectionUrl, replaceObject);
        }
      }
    }
  };

  const onInstituteChange = async (_: string, name: string, id: string) => {
    const selectedData = institutionList.find((item: any) => item.institution?.id === id);
    setSelectedInstitution(selectedData);
    setLocalStorageData('selected_institution', selectedData);
    if (activeSection) {
      const data = await fetchDataOfActiveSection(
        activeSection.id,
        selectedData?.institution?.id
      );
      setActiveSection((prevData: any) => ({...prevData, data}));
    }
  };

  const progressIndicator = (isCompleted: boolean) => {
    return (
      <span className="w-6 h-6 inline-flex justify-start items-center">
        {isCompleted ? (
          <IoIosCheckmarkCircle className="text-green-400" />
        ) : (
          <BsCircleFill className="w-2 h-2 ml-2 text-red-500" />
        )}
      </span>
    );
  };

  console.log(activeSection, 'activeSection+++++++++');

  const stepsOfActiveSection = () => {
    switch (activeSection?.id) {
      case 'inst':
        return (
          <div className="mt-6">
            <div className="mb-4">
              Welcome to the institution setup section. There are 5 areas we will cover
              which are the following:
            </div>

            <ul className="mb-4">
              <li>1. General Information</li>
              <li>2. Staff</li>
              <li>3. Classes</li>
              <li>4. Curricular</li>
              <li>5. Classrooms</li>
            </ul>

            <div className="mb-4">
              All sections need to be completed for the app to work properly.{' '}
            </div>

            <div className="mb-4">
              Note: We will cover Service Providers in another section for those who are
              lending or using their curriculum or teachers to another institution.
            </div>
          </div>
        );
      case 'inst_general_info':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      `/dashboard/manage-institutions/institution/edit?id=${selectedInstitution?.institution?.id}`
                    )
                  }>
                  1. Add Your Institution's Avatar
                </span>
                {progressIndicator(activeSection?.data?.image)}
              </div>
              <div className="my-1 ml-3 italic">
                Click the avatar circle to upload your organization's logo. SVG or PNG
                file extensions are recommended but jpg will work as well.
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="w-auto text-base font-bold cursor-pointer"
                  onClick={() =>
                    history.push(
                      `/dashboard/manage-institutions/institution/edit?id=${selectedInstitution?.institution?.id}`
                    )
                  }>
                  2. Enter your Institution's contact information
                </span>
                {progressIndicator(activeSection?.data?.address)}
              </div>
              <div className="my-1 ml-3 italic">
                Update the address, contact number and website of your organization. The
                service provider checkbox will be covered later.
              </div>
            </div>
          </div>
        );

      case 'inst_staff':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  1. Add at least one teacher or fellow to your institution (required)
                </span>
                {progressIndicator(activeSection?.data?.staff?.length)}
              </div>
              <div className="my-1 ml-3 italic">
                <div>- A teacher is someone who works at one organization.</div>
                <div>- A fellow is someone who works at several organizations</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="w-auto text-base font-bold cursor-pointer"
                  onClick={() =>
                    history.push(
                      `/dashboard/manage-institutions/institution/edit?id=${selectedInstitution?.institution?.id}`
                    )
                  }>
                  2. Add a builder (optional)
                </span>
              </div>
              <div className="my-1 ml-3 italic">
                A builder is someone who works creates curriculum and does analysis on
                lesson results but is not assigned classrooms or interacts with students.
              </div>
            </div>
          </div>
        );
      case 'inst_classes_create':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      `/dashboard/manage-institutions/institution/class-creation?id=${selectedInstitution?.institution?.id}`
                    )
                  }>
                  Create a class for your institution
                </span>
                {progressIndicator(activeSection?.data?.classes?.length)}
              </div>
              <div className="my-1 ml-3 italic">
                Add a class name and click save. We will add students to the class in the
                next step.
              </div>
            </div>
          </div>
        );
      case 'inst_classes_add_student':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  Add students to your class
                </span>
                {progressIndicator(false)}
              </div>
              <div className="my-1 ml-3 italic">
                Click the button to add a new person Add their name, email and select the
                student role.
              </div>
              <div className="my-1 ml-3 italic">
                Select the institute and the class you just created.
              </div>
              <div className="my-1 ml-3 italic">
                The group field is optional. This is if you want to add a level of
                classification for the group.
              </div>
            </div>
          </div>
        );
      case 'inst_curriculum_general_info':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      `/dashboard/manage-institutions/institution/curricular-creation?id={institutionId}`
                    )
                  }>
                  1. Add curriculum image
                </span>
                {progressIndicator(
                  Boolean(
                    activeSection?.data?.curriculum?.some(
                      (curriculum: any) => curriculum.image
                    )
                  )
                )}
              </div>
              <div className="my-1 ml-3 italic">
                Click the avatar square. SVG or PNG files are recommended but jpg files
                will work as well.
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      `/dashboard/manage-institutions/institution/curricular-creation?id={institutionId}`
                    )
                  }>
                  2. Name your curriculum
                </span>
                {progressIndicator(
                  Boolean(
                    activeSection?.data?.curriculum?.some(
                      (curriculum: any) => curriculum.name
                    )
                  )
                )}
              </div>
              <div className="my-1 ml-3 italic">
                For multi-lingual classrooms, you can have more than one lesson languages.
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      `/dashboard/manage-institutions/institution/curricular-creation?id={institutionId}`
                    )
                  }>
                  3. Select the language(s) of your lessons
                </span>
                {progressIndicator(
                  Boolean(
                    activeSection?.data?.curriculum?.some(
                      (curriculum: any) => curriculum.languages?.length
                    )
                  )
                )}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      `/dashboard/manage-institutions/institution/curricular-creation?id={institutionId}`
                    )
                  }>
                  4. Add the people who contributed to the design of the curriculum
                </span>
                {progressIndicator(
                  Boolean(
                    activeSection?.data?.curriculum?.some(
                      (curriculum: any) => curriculum.designers?.length
                    )
                  )
                )}
              </div>
              <div className="my-1 ml-3 italic">
                Can be a mix of teachers and builders
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      `/dashboard/manage-institutions/institution/curricular-creation?id={institutionId}`
                    )
                  }>
                  5. Select the audience of your curriculum
                </span>
                {progressIndicator(Boolean(activeSection?.data?.curriculum?.length))}
              </div>
              {/* <div className="my-1 ml-3 italic">
                Add a class name and click save. We will add students to the class in the
                next step.
              </div> */}
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      `/dashboard/manage-institutions/institution/curricular-creation?id={institutionId}`
                    )
                  }>
                  6. Add the purpose, description and objective of the course
                </span>
                {progressIndicator(
                  Boolean(
                    activeSection?.data?.curriculum?.some(
                      (curriculum: any) =>
                        curriculum.summary &&
                        curriculum.description &&
                        curriculum.objectives?.filter(Boolean)?.length
                    )
                  )
                )}
              </div>
              {/* <div className="my-1 ml-3 italic">
                Add a class name and click save. We will add students to the class in the
                next step.
              </div> */}
            </div>
          </div>
        );
      case 'inst_curriculum_learning_objectives': {
        const redirectionPath = activeSection?.data?.curriculum?.length
          ? `/dashboard/manage-institutions/${selectedInstitution?.institution?.id}/curricular?id=${activeSection?.data?.curriculum[0].id}`
          : `/dashboard/manage-institutions/institution/curricular-creation?id=${selectedInstitution?.institution?.id}`;
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(redirectionPath)}>
                  1. Click on Add Learning Objective button
                </span>
                {progressIndicator(activeSection?.data?.learningObjectives?.length)}
              </div>
              {/* <div className="my-1 ml-3 italic">
                Click the avatar square. SVG or PNG files are recommended but jpg files
                will work as well.
              </div> */}
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(redirectionPath)}>
                  2. Create Learning Objective and add a description
                </span>
                {progressIndicator(false)}
              </div>
              {/* <div className="my-1 ml-3 italic">
                For multi-lingual classrooms, you can have more than one lesson languages.
              </div> */}
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(redirectionPath)}>
                  3. Add a topic to the Learning Objective
                </span>
                {progressIndicator(activeSection?.data?.topics?.length)}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(redirectionPath)}>
                  4. Add description and rubric to your topic
                </span>
                {progressIndicator(false)}
              </div>
              {/* <div className="my-1 ml-3 italic">
                Can be a mix of teachers and builders
              </div> */}
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(redirectionPath)}>
                  5. Add at least one measurements to your topic
                </span>
                {progressIndicator(activeSection?.data?.rubrics?.length)}
              </div>
              {/* <div className="my-1 ml-3 italic">
                Add a class name and click save. We will add students to the class in the
                next step.
              </div> */}
            </div>
          </div>
        );
      }
      case 'inst_curriculum_units_general_info': {
        const redirectionPath = activeSection?.data?.curriculum?.length
          ? `/dashboard/manage-institutions/${selectedInstitution?.institution?.id}/curricular?id=${activeSection?.data?.curriculum[0].id}&tab=1`
          : `/dashboard/manage-institutions/institution/curricular-creation?id=${selectedInstitution?.institution?.id}`;
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(redirectionPath)}>
                  1. Enter name of unit
                </span>
                {progressIndicator(activeSection?.data?.universalSyllabus?.length)}
              </div>
              {/* <div className="my-1 ml-3 italic">
                Click the avatar square. SVG or PNG files are recommended but jpg files
                will work as well.
              </div> */}
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(redirectionPath)}>
                  2. Select the languages of the lessons
                </span>
                {progressIndicator(false)}
              </div>
              {/* <div className="my-1 ml-3 italic">
                For multi-lingual classrooms, you can have more than one lesson languages.
              </div> */}
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(redirectionPath)}>
                  3. Add the description of the description, objectives, policies, purpose
                  and methodologies of the unit
                </span>
                {progressIndicator(false)}
              </div>
            </div>
          </div>
        );
      }
      case 'inst_curriculum_units_lesson_plan_manager':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/lesson-builder`)}>
                  1. Click on the New Lesson button
                </span>
                {progressIndicator(activeSection?.data?.universalLessons)}
              </div>
              <div className="my-1 ml-3 italic">
                One lesson for the institution is in the lesson table
              </div>
            </div>
          </div>
        );
      case 'inst_classroom_class_detail':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      activeSection?.data?.classRooms?.length
                        ? `/dashboard/manage-institutions/room-edit?id=${activeSection?.data?.classRooms[0].id}&step=overview`
                        : `/dashboard/manage-institutions/institution/room-creation?id=${selectedInstitution?.institution?.id}`
                    )
                  }>
                  1. Enter classroom name, select curriculum, select teachers &
                  co-teachers, add class, conference call link and location objectives,
                  policies, purpose and methodologies of the unit
                </span>
                {progressIndicator(
                  activeSection?.data?.classRooms?.filter((item: any) => item.startDate)
                    .length
                )}
              </div>
              {/* <div className="my-1 ml-3 italic">
                One lesson for the institution is in the lesson table
              </div> */}
            </div>
          </div>
        );
      case 'inst_classroom_unit_planner':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      activeSection?.data?.classRooms?.length
                        ? `/dashboard/manage-institutions/room-edit?id=${activeSection?.data?.classRooms[0].id}&step=unit-planner`
                        : `/dashboard/manage-institutions/institution/room-creation?id=${selectedInstitution?.institution?.id}`
                    )
                  }>
                  1. Set up schedule details
                </span>
                {progressIndicator(
                  activeSection?.data?.classRooms?.filter((item: any) => item.startDate)
                    .length
                )}
              </div>
              <div className="my-1 ml-3 italic">
                This section will be used to project the dates for your lessons
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      activeSection?.data?.classRooms?.length
                        ? `/dashboard/manage-institutions/room-edit?id=${activeSection?.data?.classRooms[0].id}&step=class-dynamics`
                        : `/dashboard/manage-institutions/institution/room-creation?id=${selectedInstitution?.institution?.id}`
                    )
                  }>
                  2. Add any details which impact the schedule
                </span>
                {progressIndicator(false)}
              </div>
              <div className="my-1 ml-3 italic">
                This area is to record events which will impact your lessons or lesson
                dates. Push means you will push the next lesson to the following project
                date. Compact means that you will continue with the lesson but will need
                to abbreviate the lesson coursework to meet schedule
              </div>
            </div>
          </div>
        );
      case 'inst_curriculum_class_dynamics': {
        const redirectionPath = activeSection?.data?.classRooms?.length
          ? `/dashboard/manage-institutions/room-edit?id=${activeSection?.data?.classRooms[0].id}&step=class-dynamics`
          : `/dashboard/manage-institutions/institution/room-creation?id=${selectedInstitution?.institution?.id}`;
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(redirectionPath)}>
                  1. Create subject proficiency groups
                </span>
              </div>
              <div className="my-1 ml-3 italic">
                Group students by their knowledge proficiency
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(redirectionPath)}>
                  2. Create course partner groups
                </span>
              </div>
              <div className="my-1 ml-3 italic">
                Put students into course study groups if applicable for your material
              </div>
            </div>
          </div>
        );
      }
      case 'lesson_builder_list_create_new_lesson':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/lesson-builder`)}>
                  1. Click Create New Lesson button
                </span>
                {progressIndicator(activeSection?.data?.universalLessons?.length)}
              </div>
              {/* <div className="my-1 ml-3 italic">Click Create New Lesson from scratch</div> */}
            </div>
            {/* <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  2. Edit or delete a lesson
                </span>
              </div>
              <div className="my-1 ml-3 italic">
                Click on the three dots under the Actions header to edit or clone a lesson
              </div>
            </div> */}
          </div>
        );
      case 'lesson_builder_overview':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/lesson-builder/lesson/add`)}>
                  1. Enter the core details of your lesson
                </span>
                {progressIndicator(activeSection?.data?.universalLessons?.length)}
              </div>
              <div className="my-1 ml-3 italic">
                a. a <b>lesson</b> is a list of activities for learning, a <b>survey</b>{' '}
                are questions with no answer key and an <b> assessment </b> is a set of
                questions that have an answer key.
              </div>
              <div className="my-1 ml-3 italic">
                b. Duration is the number of time periods the lesson will be taught over.
                Fractional times mean you will use two or more lesson blocks in one time
                period.
              </div>
              <div className="my-1 ml-3 italic">
                c. Institution is the organization who is the intellectual owner of the
                material
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/lesson-builder/lesson/add`)}>
                  2. Create a lesson card for your classroom page
                </span>
              </div>
              <div className="my-1 ml-3 italic">
                Materials has two tabs. One is a reminder for the educator, the second tab
                is to notify participants if they need to bring materials to class.
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/lesson-builder/lesson/add`)}>
                  3. List any materials for instructor and/or participant to bring for the
                  lesson
                </span>
              </div>
              <div className="my-1 ml-3 italic">
                Add an image, put some text over the image and provide a quick overview to
                the lessons for the participants
              </div>
            </div>
          </div>
        );
      case 'lesson_builder_activities_lesson_planner':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      activeSection?.data?.universalLessons?.length
                        ? `/dashboard/lesson-builder/lesson/edit?lessonId=${activeSection?.data?.universalLessons[0].id}&step=activities`
                        : `/dashboard/lesson-builder/lesson/add`
                    )
                  }>
                  1. Click on Add New Class Activity button
                </span>
                {progressIndicator(
                  activeSection?.data?.universalLessons?.filter(
                    (lesson: any) => lesson.lessonPlan?.length
                  )
                )}
              </div>
            </div>
          </div>
        );
      case 'lesson_builder_activities_overlay':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      activeSection?.data?.universalLessons?.length
                        ? `/dashboard/lesson-builder/lesson/edit?lessonId=${activeSection?.data?.universalLessons[0].id}&step=activities`
                        : `/dashboard/lesson-builder/lesson/add`
                    )
                  }>
                  1. Click on View icon on top right-hand corner of editor
                </span>
                {progressIndicator(
                  activeSection?.data?.universalLessons?.filter(
                    (lesson: any) => lesson.lessonPlan?.length
                  )
                )}
              </div>
              <div className="my-1 ml-3 italic">
                a. First icon is to look at page in preview mode.
              </div>
              <div className="my-1 ml-3 italic">
                b. Next icon is to copy or clone a page from another lesson.
              </div>
              <div className="my-1 ml-3 italic">
                c. The next icon is to create a new page from scratch
              </div>
              <div className="my-1 ml-3 italic">
                d. The last icon is to delete the page (can not be recovered)
              </div>
            </div>
          </div>
        );
      case 'lesson_builder_plan_block_and_component': {
        const lessonPlanWithBlock = activeSection?.data?.universalLessons?.find(
          (lesson: any) =>
            lesson.lessonPlan?.find((plan: any) =>
              plan.pageContent?.find((page: any) => page?.partContent?.length)
            )
        );
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      lessonPlanWithBlock
                        ? `/dashboard/lesson-builder/lesson/page-builder?lessonId=${lessonPlanWithBlock.id}&pageId=${lessonPlanWithBlock.lessonPlan[0].id}`
                        : `/dashboard/lesson-builder/lesson/add`
                    )
                  }>
                  1. Click on Add New Block section
                </span>
                {progressIndicator(Boolean(lessonPlanWithBlock))}
              </div>
              <div className="my-1 ml-3 italic">
                a. Text Content is information you are pushing to participants but do not
                want a response from this content.
              </div>
              <div className="my-1 ml-3 italic">
                b. Media are the various ways to interact with participants outside
                written content
              </div>
              <div className="my-1 ml-3 italic">
                c. User Interaction is content where you want a response or a participant
                to create something in the activity
              </div>
              <div className="mt-3 italic">
                A block is one or more components that create a single idea
              </div>
              <div className="italic">A component is a single unit of content</div>
            </div>
          </div>
        );
      }
      case 'lesson_builder_plan_manager': {
        const lessonPlanWithBlock = activeSection?.data?.universalLessons?.find(
          (lesson: any) =>
            lesson.lessonPlan?.find((plan: any) =>
              plan.pageContent?.find((page: any) => page?.partContent?.length)
            )
        );
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      lessonPlanWithBlock
                        ? `/dashboard/lesson-builder/lesson/page-builder?lessonId=${lessonPlanWithBlock.id}&pageId=${lessonPlanWithBlock.lessonPlan[0].id}`
                        : `/dashboard/lesson-builder/lesson/add`
                    )
                  }>
                  1. Move your activities around so they are in the order you want to
                  teach them and set the initial dark/light mode of your lessons
                </span>
              </div>
              <div className="mt-1 ml-3 italic">
                <b>Try this out: </b>
              </div>
              <div className="ml-3 italic">
                1. Move an activity to a different order (you can always move it back)
              </div>
              <div className="my-1 ml-3 italic">
                2. Click on the dark/light mode to see the different views of your lesson
                plan (be sure to check this. Participants can change their views in the
                classroom so make sure both views work for your class!)
              </div>
              <div className="my-3 ml-3 italic">
                3. Create homework and challenges for lesson (coming soon)
              </div>
            </div>
          </div>
        );
      }
      case 'lesson_builder_plan_homework_and_challenges': {
        const lessonPlanWithBlock = activeSection?.data?.universalLessons?.find(
          (lesson: any) =>
            lesson.lessonPlan?.find((plan: any) =>
              plan.pageContent?.find((page: any) => page?.partContent?.length)
            )
        );
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      lessonPlanWithBlock
                        ? `/dashboard/lesson-builder/lesson/page-builder?lessonId=${lessonPlanWithBlock.id}&pageId=${lessonPlanWithBlock.lessonPlan[0].id}`
                        : `/dashboard/lesson-builder/lesson/add`
                    )
                  }>
                  <b> Coming Soon </b> You will be able to add homework and challenges to
                  lesson plans soon
                </span>
              </div>
              <div className="my-1 ml-3 italic">
                a. Text Content is information you are pushing to participants but do not
                want a response from this content.
              </div>
              <div className="my-1 ml-3 italic">
                b. Media are the various ways to interact with participants outside
                written content
              </div>
              <div className="my-1 ml-3 italic">
                c. User Interaction is content where you want a response or a participant
                to create something in the activity
              </div>
              <div className="my-3 ml-3 italic">
                A block is one or more components that create a single idea
              </div>
              <div className="my-1 ml-3 italic">
                A component is a single unit of content
              </div>
            </div>
          </div>
        );
      }
      case 'lesson_builder_courses':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      activeSection?.data?.universalLessons?.length
                        ? `/dashboard/lesson-builder/lesson/edit?lessonId=${activeSection?.data?.universalLessons[0].id}&step=courses`
                        : `/dashboard/lesson-builder/lesson/add`
                    )
                  }>
                  Click Add Lesson to Syllabus button
                </span>
                {progressIndicator(activeSection?.data?.isCourseAdded)}
              </div>
              <div className="my-1 ml-3 italic">
                Add lesson to one or more curriculum and units
              </div>
            </div>
          </div>
        );
      case 'lesson_builder_learning_evidence':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      activeSection?.data?.universalLessons?.length
                        ? `/dashboard/lesson-builder/lesson/edit?lessonId=${activeSection?.data?.universalLessons[0].id}&step=learning-evidence`
                        : `/dashboard/lesson-builder/lesson/add`
                    )
                  }>
                  Check all learning evidences which are applicable for each selected
                  curriculum
                </span>
                {progressIndicator(activeSection?.data?.lessonRubrics?.length)}
              </div>
            </div>
          </div>
        );
      case 'service_provider_provide_service':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      `/dashboard/manage-institutions/institution/edit?id=${selectedInstitution?.institution?.id}&tab=3`
                    )
                  }>
                  Toggle service provider to be true
                </span>
              </div>
              <div className="my-1 ml-3 italic">
                As a service provider you can make your curriculum, teachers and fellows
                available to other organizations
              </div>
            </div>
          </div>
        );
      case 'service_provider_request_service':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=3`
                    )
                  }>
                  Select service provider from list
                </span>
              </div>
              <div className="my-1 ml-3 italic">
                Service providers make their curriculum, teachers and fellows available
                for you to add to your own classrooms
              </div>
            </div>
          </div>
        );
      case 'research_and_analytics_survey_download':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/csv`)}>
                  Select classroom, unit and survey to download
                </span>
              </div>
            </div>
          </div>
        );
      default:
        break;
    }
  };

  const resetData = () => {
    setActiveSection({id: 'inst', title: 'Institution Setup'});
    setSelectedInstitution({});
    removeLocalStorageData('active_step_section');
    removeLocalStorageData('selected_institution');
  };

  return (
    <Dialog
      as="div"
      static
      className={`
            fixed inset-0 transition-all ease-in-out duration-300 
            z-100
            ${open ? 'w-auto' : 'w-0 opacity-0 overflow-hidden bg-black bg-opacity-50'}
`}
      initialFocus={cancelButtonRef}
      open={open}
      onClose={onCancel}>
      <div className="absolute inset-0 overflow-hidden">
        <Dialog.Overlay className="absolute inset-0 w-auto" />

        <div
          className={` 
              fixed w-auto inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16
              transform transition ease-in-out duration-500 sm:duration-700
              ${open ? 'translate-x-0' : 'translate-x-full'}
              `}>
          <div className="w-auto max-w-2xl">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="flex-1">
                {/* Header */}
                <div className="px-4 py-6 bg-gray-50 sm:px-6">
                  <div className="flex items-start justify-between space-x-3">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          {`${
                            selectedInstitution?.institution?.name || ''
                          } Set-Up Navigator`}
                        </Dialog.Title>
                        {selectedInstitution?.institution?.id ? (
                          <span className="w-auto cursor-pointer" onClick={resetData}>
                            <HiOutlineRefresh className="w-6 h-6" />
                          </span>
                        ) : (
                          role === 'ADM' &&
                          (!associateInstitute?.length ||
                            associateInstitute?.length > 1) && (
                            <Selector
                              selectedItem={selectedInstitution?.institution?.name}
                              label={''}
                              placeholder={'Select institution'}
                              list={institutionList}
                              onChange={onInstituteChange}
                            />
                          )
                        )}
                      </div>
                      {showAlert && (
                        <div
                          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                          role="alert">
                          <span className="block sm:inline">
                            Please select institution before continuing
                          </span>
                          <span
                            className="absolute top-0 bottom-0 right-0 px-4 py-3 w-auto"
                            onClick={() => setShowAlert(false)}>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="h-7 w-auto flex items-center">
                      <button
                        ref={cancelButtonRef}
                        type="button"
                        className="w-auto bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onClick={onCancel}>
                        <span className="sr-only">Close panel</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
                {loading || instListLoading ? (
                  <div className="w-196 2xl:w-256 h-100 flex justify-center items-center">
                    <div className="w-5/10">
                      <Loader />
                    </div>
                  </div>
                ) : (
                  <div
                    style={{minHeight: 'calc(100vh - 76px)'}}
                    className={'w-196 2xl:w-256 flex'}>
                    {/* <div
                    className="grid grid-cols-2"
                    style={{height: 'calc(100vh - 76px)'}}> */}
                    <div
                      className="bg-indigo-100 p-4 w-2/5 text-sm 2xl:text-base overflow-y-scroll"
                      style={{height: 'calc(100vh - 76px)'}}>
                      <div className="text-base 2xl:text-xl font-bold mb-4">Sections</div>
                      <ContextMenuProvider>
                        <Tree
                          root={data}
                          hoverClassName={'bg-indigo-200'}
                          textClassName={'text-gray-900 font-medium'}
                          onItemClick={onItemClick}
                          activeSectionId={activeSection?.id}
                        />
                      </ContextMenuProvider>
                    </div>
                    <div className="p-4 w-3/5">
                      <div className="text-lg font-bold">
                        Steps for Setting up {activeSection?.title}
                      </div>
                      <hr className="my-2 text-gray-500" />
                      {sectionDetailsLoading ? (
                        <div className="h-100 flex justify-center items-center">
                          <div className="w-5/10">
                            <Loader />
                          </div>
                        </div>
                      ) : (
                        stepsOfActiveSection()
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {showAlert && (
        <Modal
          showHeader={false}
          showFooter={false}
          closeAction={() => setShowAlert(false)}>
          <div className="py-8 px-16">
            <div className="mx-auto flex items-center justify-center rounded-full">
              <FiAlertCircle className="w-8 h-8" />
            </div>
            <div className="mt-4">Enter classroom details</div>
            <div className="flex justify-center mt-4">
              <Buttons
                btnClass={'abc'}
                label={'Ok'}
                labelClass={'leading-6'}
                onClick={() => setShowAlert(false)}
              />
            </div>
          </div>
        </Modal>
      )} */}
    </Dialog>
  );
};

export default InformationalWalkThrough;
