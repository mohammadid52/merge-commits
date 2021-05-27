import React, {useEffect, useState, useContext, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import queryString from 'query-string';
import API, {graphqlOperation} from '@aws-amplify/api';
import {FaEdit} from 'react-icons/fa';
import {IoArrowUndoCircleOutline, IoSendSharp} from 'react-icons/io5';
import {Switch, Route, useRouteMatch, useHistory} from 'react-router-dom';
import Storage from '@aws-amplify/storage';
import useUrlState from '@ahooksjs/use-url-state';
import ReactHtmlParser from 'react-html-parser';

import * as customMutations from '../../../../customGraphql/customMutations';
import * as queries from '../../../../graphql/queries';
import * as mutations from '../../../../graphql/mutations';
import * as customQueries from '../../../../customGraphql/customQueries';

import {GlobalContext} from '../../../../contexts/GlobalContext';
import UserInformation from './UserInformation';
import UserEdit from './UserEdit';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import Buttons from '../../../Atoms/Buttons';
import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import {getImageFromS3, getImageFromS3Static} from '../../../../utilities/services';
import useDictionary from '../../../../customHooks/dictionary';
import ProfileCropModal from '../../Profile/ProfileCropModal';
import Loader from '../../../Atoms/Loader';
import {getUniqItems, initials, stringToHslColor} from '../../../../utilities/strings';
import slice from 'lodash/slice';
import sortBy from 'lodash/sortBy';
import {
  BiCloudDownload,
  BiLinkAlt,
  BiMessageRoundedDots,
  BiMessageRoundedX,
} from 'react-icons/bi';
import {find, findIndex, isEmpty} from 'lodash';
import {GrSend} from 'react-icons/gr';
import {MdAudiotrack, MdCancel, MdImage} from 'react-icons/md';
import {
  BsCameraVideo,
  BsCameraVideoFill,
  BsFillTrashFill,
  BsLink45Deg,
} from 'react-icons/bs';
import {getAsset} from '../../../../assets';
import Modal from '../../../Atoms/Modal';
import ModalPopUp from '../../../Molecules/ModalPopUp';

export interface UserInfo {
  authId: string;
  courses?: string;
  createdAt: string;
  email: string;
  externalId?: string;
  classes: any;
  firstName: string;
  grade?: string;
  id: string;
  image?: string;
  institution?: string;
  language: string;
  lastName: string;
  preferredName?: string;
  role: string;
  status: string;
  phone: string;
  updatedAt: string;
  birthdate?: string;
}

export interface AnthologyContentInterface {
  type: string;
  subType: string;
  title: string;
  subTitle: string;
  description: string;
  content: string;
  feedbacks?: string[];
}

export interface AnthologyMapItem extends AnthologyContentInterface {
  studentDataID?: string;
  lessonProgress?: string;
  currentLocation?: string;
  status: string;
  syllabusLessonID: string;
  studentID: string;
  studentAuthID: string;
  updatedAt?: string;
}

const User = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const {theme, state, userLanguage, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const [status, setStatus] = useState('');
  const [upImage, setUpImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const tabs = [
    {name: 'User Information', current: true},
    {name: 'Associated Classrooms', current: false},
    {name: 'Notebook', current: false},
  ];

  const [curTab, setCurTab] = useState<string>(tabs[0].name);
  const [questionData, setQuestionData] = useState([]);
  const [stdCheckpoints, setStdCheckpoints] = useState([]);
  const [urlState, setUrlState] = useUrlState(
    {id: '', t: 'p'},
    {navigateMode: 'replace'}
  );

  const [user, setUser] = useState<UserInfo>({
    id: '',
    authId: '',
    courses: null,
    createdAt: '',
    email: '',
    externalId: null,
    firstName: '',
    grade: null,
    image: null,
    institution: null,
    language: '',
    lastName: '',
    preferredName: null,
    classes: null,
    role: '',
    status: '',
    phone: '',
    updatedAt: '',
    birthdate: null,
  });

  const [imageUrl, setImageUrl] = useState('');
  const location = useLocation();
  const pathName = location.pathname.replace(/\/$/, '');
  const currentPath = pathName.substring(pathName.lastIndexOf('/') + 1);

  const {id, t: tab} = urlState;

  const {UserDict, BreadcrumsTitles} = useDictionary(clientKey);
  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['PEOPLE'],
      url: '/dashboard/manage-users',
      last: false,
    },
    {
      title: curTab,
      url: `${location.pathname}${location.search}`,
      last: true,
    },
  ];

  const getQuestionData = async (checkpointIDs: any[], user: any) => {
    const checkpointIDFilter: any = checkpointIDs.map((item: any) => {
      return {
        checkpointID: {
          eq: item,
        },
      };
    });
    const filter = {
      and: [
        {email: {eq: user.email}},
        {authID: {eq: user.authId}},
        {syllabusLessonID: {eq: '999999'}},
        {
          or: [...checkpointIDFilter],
        },
      ],
    };
    const results: any = await API.graphql(
      graphqlOperation(customQueries.listQuestionDatas, {filter: filter})
    );
    const questionData: any = results.data.listQuestionDatas?.items;
    setQuestionData(questionData);

    // questionData.forEach(async (item: any) => {
    // await API.graphql(
    //   graphqlOperation(mutations.deleteQuestionData, {input: {id: item.id}})
    // );
    // });
  };

  async function getUserById(id: string) {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.userById, {id: id})
      );
      const userData = result.data.userById.items.pop();

      let studentClasses: any = userData.classes?.items.map((item: any) => item?.class);
      studentClasses = studentClasses.filter((d: any) => d !== null);

      const studentInstitutions: any = studentClasses?.map(
        (item: any) => item?.institution
      );
      const studentRooms: any = studentClasses
        ?.map((item: any) => item?.rooms?.items)
        ?.flat(1);
      const studentCurriculars: any = studentRooms
        .map((item: any) => item?.curricula?.items)
        .flat(1);
      const uniqCurriculars: any = getUniqItems(
        studentCurriculars.filter((d: any) => d !== null),
        'curriculumID'
      );
      const studCurriCheckp: any = uniqCurriculars
        .map((item: any) => item?.curriculum?.checkpoints?.items)
        .flat(1);
      const studentCheckpoints: any = studCurriCheckp.map(
        (item: any) => item?.checkpoint
      );

      let sCheckpoints: any[] = [];

      studentCheckpoints.forEach((item: any) => {
        if (item) sCheckpoints.push(item);
      });

      sCheckpoints = sortBy(sCheckpoints, (item: any) => item.scope === 'private');

      const uniqCheckpoints: any = getUniqItems(sCheckpoints, 'id');
      const uniqCheckpointIDs: any = uniqCheckpoints.map((item: any) => item?.id);
      const personalInfo: any = {...userData};

      delete personalInfo.classes;

      setStdCheckpoints([...uniqCheckpoints]);

      setStatus('done');
      setUser(() => {
        if (typeof userData === 'object') {
          return userData;
        }
        return user;
      });

      if (uniqCheckpointIDs?.length > 0) {
        getQuestionData(uniqCheckpointIDs, userData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const isAdmin = state.user.role === 'ADM';

  useEffect(() => {
    async function getUrl() {
      const imageUrl: any = await getImageFromS3(user.image);
      setImageUrl(imageUrl);
    }
    getUrl();
  }, [user.image]);

  const toggleCropper = () => {
    setShowCropper(!showCropper);
  };

  const cropSelecetedImage = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = function () {
        setUpImage(fileReader.result);
      };
      fileReader.readAsDataURL(file);
      toggleCropper();
    }
  };

  const uploadImageToS3 = async (file: any, id: string, type: string) => {
    // Upload file to s3 bucket

    return new Promise((resolve, reject) => {
      Storage.put(`user_profile_image_${id}`, file, {
        contentType: type,
        ContentEncoding: 'base64',
      })
        .then((result) => {
          resolve(true);
        })
        .catch((err) => {
          console.log('Error in uploading file to s3', err);
          reject(err);
        });
    });
  };

  const saveCroppedImage = async (image: string) => {
    setImageLoading(true);
    toggleCropper();
    await uploadImageToS3(image, user.id, 'image/jpeg');
    const imageUrl: any = await getImageFromS3(`user_profile_image_${user.id}`);
    setImageUrl(imageUrl);
    setUser({...user, image: `user_profile_image_${user.id}`});
    updateImageParam(`user_profile_image_${user.id}`);
    toggleCropper();
    setImageLoading(false);
  };

  async function updateImageParam(imageKey: string) {
    // TODO:
    // Need to check for update only required input values.

    const input = {
      id: user.id,
      authId: user.authId,
      image: imageKey,
      status: user.status,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      language: user.language,
    };

    try {
      const update: any = await API.graphql(
        graphqlOperation(customMutations.updatePerson, {input: input})
      );
      setUser({
        ...user,
      });
    } catch (error) {
      console.error('Error updating image on graphql', error);
    }
  }

  useEffect(() => {
    if (typeof id === 'string') {
      getUserById(id);
    }
  }, []);

  const [studentData, setStudentData] = useState<AnthologyMapItem[]>([]);
  const [loading, setLoading] = useState(false);

  // TOP Function to load student data
  const listStudentData = async () => {
    setLoading(true);
    try {
      const studentDataFetch: any = await API.graphql(
        graphqlOperation(queries.listStudentDatas, {
          filter: {studentAuthID: {eq: user.authId}},
        })
      );
      const response = await studentDataFetch;
      const arrayOfResponseObjects = response?.data?.listStudentDatas?.items;

      const reducedAnthologyContent = arrayOfResponseObjects.reduce(
        (acc: AnthologyMapItem[], contentObj: any) => {
          if (contentObj.anthologyContent) {
            const mapIdToItem = contentObj.anthologyContent.map(
              (contentMapItem: AnthologyContentInterface) => {
                return {
                  ...contentMapItem,
                  status: contentObj.status,
                  syllabusLessonID: contentObj.syllabusLessonID,
                  studentID: contentObj.studentID,
                  studentAuthID: contentObj.studentAuthID,
                  studentDataID: contentObj.id,
                  updatedAt: contentObj.updatedAt,
                };
              }
            );
            return [...acc, ...mapIdToItem];
          } else {
            return acc;
          }
        },
        []
      );
      setStudentData(
        reducedAnthologyContent.filter((item: any) => item.type === 'journal')
      );
    } catch (e) {
      console.error('Anthology student data fetch error: ', e);
    } finally {
      setLoading(false);
    }
  };

  // Useeffect to load student data and process it
  useEffect(() => {
    const initializeStudentData = async () => {
      if (user.authId) {
        await listStudentData();
      }
    };
    initializeStudentData();
  }, [user.authId]);

  if (status !== 'done') {
    return <LessonLoading />;
  }

  const disableProfileChange = user.role !== 'ST';

  const setTab = (value: string) => {
    setUrlState({t: value});
  };

  const AssociatedClasses = ({list}: any) => {
    return (
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="align-middle inline-block min-w-full">
            <div className=" overflow-hidden border-b-0 border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Classname
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Institution
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Curriculum
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item: any, idx: number) => {
                    const rooms = item?.class?.rooms.items;
                    const curriculum = rooms.length > 0 ? rooms[0].curricula : null;
                    const teacher = rooms.length > 0 ? rooms[0].teacher : null;
                    return (
                      <tr
                        key={`${item.class?.name}_${idx}`}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                        <td className="px-6 py-4 w-auto whitespace-nowrap text-sm font-medium text-gray-900">
                          {item?.class?.name}
                        </td>
                        <td className="px-6 py-4 w-auto whitespace-nowrap text-sm text-gray-500">
                          {item?.class?.institution?.name}
                        </td>
                        <td className="px-6 py-4 w-auto whitespace-nowrap text-sm text-gray-500">
                          {teacher
                            ? `${teacher?.firstName || ''} ${teacher?.lastName || ''}`
                            : 'Not Available'}
                        </td>
                        <td className="px-6 py-4 w-auto whitespace-nowrap text-sm text-gray-500">
                          {curriculum
                            ? `${curriculum?.items[0]?.curriculum?.name}${
                                curriculum?.items[0]?.length > 1 ? '...' : ''
                              }`
                            : 'Not Available'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Tabs = () => {
    const tabsData = !isTeacher ? slice(tabs, 0, 2) : tabs;

    return (
      <div className="w-8/10 bg-white rounded-lg p-2">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
            defaultValue={curTab}>
            {tabsData.map((tab) => (
              <option className="transition-all" key={tab.name}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex user__profile-tabs space-x-4" aria-label="Tabs">
            {tabsData.map((tab) => (
              <div
                key={tab.name}
                onClick={() => {
                  setCurTab(tab.name);
                }}
                className={`px-3 hover:bg-indigo-400 py-2 cursor-pointer font-medium tab text-sm rounded-md ${
                  tab.name === curTab ? 'active' : ''
                }`}>
                {tab.name}
              </div>
            ))}
          </nav>
        </div>
      </div>
    );
  };

  const do_resize = (textbox: any) => {
    var maxrows = 10;
    var txt = textbox.value;
    var cols = textbox.cols;

    var arraytxt: any = txt.split('\n');
    var rows = arraytxt.length;

    for (let i = 0; i < arraytxt.length; i++)
      // @ts-ignore
      rows += parseInt(arraytxt[i].length / cols);

    if (rows > maxrows) textbox.rows = maxrows;
    else textbox.rows = rows;
  };

  const getRole = (role: string) => {
    switch (role) {
      case 'CRD':
        return 'Coordinator';
      case 'TR':
        return 'Teacher';
      case 'FLW':
        return 'Fellow';
      case 'BLD':
        return 'Builder';
      case 'ADM':
        return 'Admin';
      case 'ST':
        return 'Student';
    }
  };

  const preview_image = (file: any) => {
    var reader = new FileReader();
    reader.onload = function () {
      var output: any = document.getElementById('output_image');
      output.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const preview_thumnbnail = (file: any) => {
    var reader = new FileReader();
    reader.onload = function () {
      var output: any = document.getElementById('output_video');
      output.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const pushCommentToDatabase = async (text: string, item: any, attachments?: any) => {
    try {
      let input = {
        email: state.user.email,
        authID: state.user.authId,
        text,
      };

      const finalInput =
        attachments && attachments.url
          ? {
              ...input,
              attachments: {
                type: attachments.type,
                url: attachments.url,
                filename: attachments.filename,
                size: attachments.size,
              },
            }
          : input;
      const results: any = await API.graphql(
        graphqlOperation(mutations.createAnthologyComment, {input: finalInput})
      );

      const commentData: any = results.data.createAnthologyComment;
      let newFeedbacks = item.feedbacks || [];

      if (!newFeedbacks.includes(commentData.id)) {
        newFeedbacks.push(commentData.id);
      }

      const removeHelperProperties = {
        type: item.type,
        subType: item.subType,
        title: item.title,
        subTitle: item.subTitle,
        description: item.description,
        content: item.content,
        feedbacks: newFeedbacks,
      };

      const studentDataUpdate: any = await API.graphql(
        graphqlOperation(mutations.updateStudentData, {
          input: {
            id: item.studentDataID,
            status: item.status,
            syllabusLessonID: item.syllabusLessonID,
            studentID: item.studentID,
            studentAuthID: item.studentAuthID,
            anthologyContent: removeHelperProperties,
          },
        })
      );
      const feedbackData: any = results.data.updateStudentData;
      // onSuccessCB(feedbackData?.anthologyContent?.feedbacks);
    } catch (error) {
      console.error('error @createAnthologyComment: ', error);
    }
  };

  const deleteCommentFromDatabase = async (id: string, item: any) => {
    try {
      const results: any = await API.graphql(
        graphqlOperation(mutations.deleteAnthologyComment, {input: {id}})
      );

      let newFeedbacks = item.feedbacks || [];

      const removeHelperProperties = {
        type: item.type,
        subType: item.subType,
        title: item.title,
        subTitle: item.subTitle,
        description: item.description,
        content: item.content,
        feedbacks: newFeedbacks.filter((feedbackId: string) => feedbackId !== id),
      };

      const studentDataUpdate: any = await API.graphql(
        graphqlOperation(mutations.updateStudentData, {
          input: {
            id: item.studentDataID,
            status: item.status,
            syllabusLessonID: item.syllabusLessonID,
            studentID: item.studentID,
            studentAuthID: item.studentAuthID,
            anthologyContent: removeHelperProperties,
          },
        })
      );
    } catch (error) {}
  };

  const listComments = async (feedbacks: string[]) => {
    const filter: any = feedbacks.map((id: string) => {
      return {
        id: {
          eq: id,
        },
      };
    });
    try {
      const listCommentData: any = await API.graphql(
        graphqlOperation(queries.listAnthologyComments, {
          filter: {
            or: [...filter],
          },
        })
      );
      return listCommentData?.data?.listAnthologyComments?.items;
    } catch (error) {
      console.error('error @listComments: ', error);
    }
  };
  function GetFormattedDate(todayTime: any) {
    const date = new Date(todayTime);
    var hours = date.getHours();
    var min = date.getMinutes();
    return `${hours > 9 ? hours : `0${hours}`}:${min > 9 ? min : `0${min}`}`;
  }

  const AttachmentsModalPopUp = (props: any) => {
    const {children, closeAction} = props;
    return (
      <Modal
        closeOnBackdrop
        closeAction={closeAction}
        showHeader={false}
        showHeaderBorder={false}
        showFooter={false}>
        {children}
      </Modal>
    );
  };

  const uploadAttachment = async (file: any, id: string, type: string) => {
    // Upload Attachments
    return new Promise((resolve, reject) => {
      Storage.put(id, file, {
        contentType: type,
        progressCallback: ({loaded, total}: any) => {
          console.log((loaded * 100) / total);
        },
      })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log('Error in uploading file to s3', err);
          reject(err);
        });
    });
  };

  const deletImageFromS3 = (key: string) => {
    // Remove image from bucket

    return new Promise((resolve, reject) => {
      Storage.remove(key)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log('Error in deleting file from s3', err);
          reject(err);
        });
    });
  };

  const getKeyForAttachments = (url: string) => {
    let splitUrl = url.split('/');
    return splitUrl[splitUrl.length - 1].split('?')[0];
  };

  const getSizeInBytes = (size: number) => {
    const inKB = size / 1024;
    const inMB = inKB / 1024;
    if (inMB < 1) {
      return `${inKB.toFixed(2)} KB`;
    } else {
      return `${inMB.toFixed(2)} MB`;
    }
  };

  const StudentData = ({item}: any) => {
    // booleans
    const [showComments, setShowComments] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [attModal, setAttModal] = useState({show: false, type: '', url: ''});
    const [uploadingAttachment, setUploadingAttachment] = useState(false);
    const [deleteModal, setDeleteModal] = useState({show: false, id: ''});
    // arrays
    const [feedbackData, setFeedbackData] = useState([]);

    // strings
    const [comment, setComment] = useState('');

    // objects
    const [fileObject, setfileObject] = useState<any>({});

    const getFullNameString = (obj: any) =>
      obj.preferredName ? obj.preferredName : obj.firstName + ' ' + obj.lastName;

    const deleteComment = (id: string) => {
      const currentComment: any = find(feedbackData, (comment: any) => comment.id === id);

      const currentCommentWithoutId: any = find(
        feedbackData,
        (comment: any) =>
          getFullNameString(comment.person) === getFullNameString(state.user)
      );

      const comment: any = currentComment.id ? currentComment : currentCommentWithoutId;

      if (comment) {
        if (comment.attachments && comment.attachments.length > 0) {
          const key: string = getKeyForAttachments(comment.attachments[0].url);
          deletImageFromS3(key);
        }

        const filteredData: any = feedbackData.filter((data) => data.id !== id);
        setFeedbackData(filteredData); // this is to update local state
        deleteCommentFromDatabase(id, item);
      }
    };

    const onCommentShowHide = () => {
      if (!showComments && feedbackData.length === 0) {
        getFeedBackData();
      }
      if (showComments) {
        setfileObject({});
      }
      setShowComments(!showComments);
    };

    const getFeedBackData = async () => {
      setLoadingComments(true);

      try {
        const feedbacksData: any = await listComments(item.feedbacks);
        setFeedbackData(sortBy(feedbacksData, ['createdAt']));
      } catch (error) {
        console.error('error @getFeedBackData: ', error.message);
      } finally {
        setLoadingComments(false);
      }
    };

    const pushCommentToLocalState = (comment: string, attachments?: any) => {
      let localObj = {
        text: comment,
        person: {
          authId: state.user.authId,
          image: state.user.image,
          firstName: state?.user?.preferredName,
          preferredName: state?.user?.firstName,
          lastName: state.user.lastName,
        },
        createdAt: new Date(),
        id: Date.now().toString(), // this is just for local state, After refreshing it will be replaced with real ID
      };
      const finalInput =
        attachments && attachments.type
          ? {
              ...localObj,
              attachments: [
                {
                  url: attachments.url,
                  filename: attachments.filename,
                  size: attachments.size,
                  type: attachments.type,
                },
              ],
            }
          : localObj;

      setFeedbackData([...feedbackData, finalInput]);
    };

    const onCommentSubmit = async (e: any) => {
      if (fileObject.name) {
        setUploadingAttachment(true);
        let _fileObject: any = fileObject;
        let _comment: any = comment;
        const id: string = `feedbacks/${Date.now().toString()}_${fileObject.name}`;

        const type = _fileObject.type;
        setfileObject({});
        setComment('');
        pushCommentToLocalState(_comment, {
          url: 'loading',
          type,
          filename: _fileObject.name,
          size: _fileObject.size,
        });

        await uploadAttachment(_fileObject, id, type);

        const imageUrl: any = await getImageFromS3(id);

        pushCommentToDatabase(_comment, item, {
          url: imageUrl,
          type,
          filename: _fileObject.name,
          size: _fileObject.size,
        });
        pushCommentToLocalState(_comment, {
          url: imageUrl,
          type,
          filename: _fileObject.name,
          size: _fileObject.size,
        });
        setUploadingAttachment(false);
      } else {
        pushCommentToLocalState(comment);
        pushCommentToDatabase(comment, item);
      }
      setfileObject({});
      setComment('');
    };

    const inputVideo = useRef(null);
    const inputImage = useRef(null);
    const inputOther = useRef(null);

    const handleVideo = () => inputVideo.current.click();
    const handleImage = () => inputImage.current.click();
    const handleOther = () => inputOther.current.click();

    const downloadFile = (uri: string, name: string, isAudio: boolean) => {
      const a = document.createElement('a');
      a.style.display = 'none';
      document.body.appendChild(a);

      // Set the HREF to a Blob representation of the data to be downloaded
      a.href = uri;
      if (isAudio) {
        a.setAttribute('target', '_blank');
      }
      // Use download attribute to set set desired file name
      a.setAttribute('download', name);

      // Trigger the download by simulating click
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    };

    const LoadingMedia = ({filename}: any) => {
      return (
        <div className="relative h-40 w-auto max-w-56 flex-col border-0 border-gray-300 hover:border-gray-400 rounded-lg p-2 min-h-48 min-w-48 flex items-center justify-center">
          <div className="h-2/10 min-w-auto p-2 pt-0 text-gray-500 truncate">
            {filename}
          </div>
          <div className="h-8/10 flex items-center min-w-48 bg-gray-100 rounded-lg">
            <Loader color="#6366F1" />
          </div>
        </div>
      );
    };

    const ImageMedia = ({attachment}: any) => {
      return attachment.url === 'loading' ? (
        <LoadingMedia filename={attachment.filename} />
      ) : (
        <div className="relative h-40 w-auto max-w-56 flex-col border-0 border-gray-300 hover:border-gray-400 rounded-lg p-2 min-h-48 min-w-32 flex items-center justify-center">
          <p className="truncate min-w-auto text-center p-2 pt-0 text-gray-500">
            {attachment.filename}
          </p>

          <Size size={attachment.size} />
          <img
            style={{objectFit: 'cover'}}
            className="h-32 w-auto rounded-lg"
            src={attachment.url}
            id="output_image2"
          />
        </div>
      );
    };

    const OtherMedia = ({attachment}: any) => {
      return attachment.url === 'loading' ? (
        <div className="h-12 w-80 p-2 text-gray-500 border-0 border-gray-300 hover:border-gray-400 max-w-7xl min-w-56 rounded-md transition-all cursor-pointer flex justify-between items-center px-4">
          <p className="truncate w-auto">{attachment.filename}</p>
          <span className={'flex items-center justify-center h-8 w-8'}>
            <Loader color="#6366F1" />
          </span>
        </div>
      ) : (
        <div className="relative h-12 w-80 p-2 text-gray-500 border-0 border-gray-300 hover:border-gray-400 max-w-7xl min-w-56 rounded-md transition-all cursor-pointer flex justify-between items-center px-4">
          <Size size={attachment.size} />
          <p className="truncate w-auto">{attachment.filename}</p>
          <span
            onClick={() => {
              downloadFile(
                attachment.url,
                attachment.filename.replace(/\.[^/.]+$/, ''),
                attachment.type.includes('audio')
              );
            }}
            className={
              'flex items-center justify-center h-7 w-7 rounded cursor-pointer transition-all duration-150 hover:text-white hover:bg-indigo-400 text-gray-500 text-lg'
            }>
            <BiCloudDownload />
          </span>
        </div>
      );
    };

    const VideoMedia = ({attachment}: any) => {
      return attachment.url === 'loading' ? (
        <LoadingMedia filename={attachment.filename} />
      ) : (
        <div className="h-auto w-72 border-0 p-4 border-gray-300">
          <p className="truncate text-center min-w-auto p-2 pt-0 text-gray-500">
            {attachment.filename}
          </p>
          <video controls className="rounded-lg" src={attachment.url}>
            <source type={fileObject.type} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    };

    const handleSelection = (e: any) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const isImage = file.type.includes('image');
        const isVideo = file.type.includes('video');
        setfileObject(file);
        if (isImage) {
          preview_image(file);
        }
        if (isVideo) {
          preview_thumnbnail(file);
        }
      }
    };

    const isImage = fileObject && fileObject.type && fileObject.type.includes('image');
    const isVideo = fileObject && fileObject.type && fileObject.type.includes('video');

    const Size = ({size}: {size: number}) => {
      return (
        <span
          style={{
            bottom: '0rem',
            fontSize: '0.65rem',
            right: '-3.5rem',
          }}
          className="absolute size-stamp w-auto text-gray-500">
          {getSizeInBytes(size)}
        </span>
      );
    };

    const Feedback = ({feedback}: any) => {
      const {person} = feedback;
      const {firstName, lastName, preferredName} = person;

      return (
        <div
          key={feedback.id}
          className="relative comment-main flex items-center justify-between px-6 w-auto py-3 my-2">
          <div className="text-sm text-gray-900 flex items-start">
            {person.image ? (
              <img
                className="h-10 w-10 rounded-md bg-gray-400 flex items-center justify-center"
                src={getImageFromS3Static(person.image)}
                alt=""
              />
            ) : (
              <div
                className={`h-10 w-10 flex justify-center items-center rounded-md  bg-gray-400`}>
                <div
                  className="h-full w-full flex justify-center items-center text-sm text-semibold text-white rounded-md"
                  style={{
                    /* stylelint-disable */
                    background: `${stringToHslColor(
                      preferredName ? preferredName : firstName + ' ' + lastName
                    )}`,
                    textShadow: '0.2rem 0.2rem 3px #423939b3',
                  }}>
                  {initials(preferredName ? preferredName : firstName, lastName)}
                </div>
              </div>
            )}
            <div className="ml-2 w-auto">
              <h5 className="font-semibold hover:text-underline">
                {(preferredName ? preferredName : firstName) + ' ' + lastName}

                <span className="text-xs text-gray-600 font-normal ml-2">
                  {GetFormattedDate(feedback.createdAt)}
                </span>
                <p
                  className={`${
                    person.role === user.role
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  } ml-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium w-auto`}>
                  {getRole(person.role)}
                </p>
              </h5>
              <p style={{whiteSpace: 'break-spaces'}}>{feedback.text}</p>
              {/* ------------------------- Attachments Section Start -------------------------------- */}

              {feedback.attachments &&
                feedback.attachments.length > 0 &&
                feedback.attachments.map(
                  (attachment: {
                    type: string;
                    url: string;
                    filename: string;
                    size: number;
                  }) => {
                    const {type, url} = attachment;
                    const isImage = type.includes('image');
                    const isVideo = type.includes('video');
                    const isOther = !isImage && !isVideo;
                    return (
                      <div
                        className="mt-2"
                        onClick={() => {
                          isImage && setAttModal({show: true, url, type});
                        }}>
                        {isImage && <ImageMedia attachment={attachment} />}
                        {isVideo && <VideoMedia attachment={attachment} />}
                        {isOther && <OtherMedia attachment={attachment} />}
                      </div>
                    );
                  }
                )}
              {/* ------------------------- Attachments Section End -------------------------------- */}
            </div>
          </div>
          {feedback.person.authId === state.user.authId && !uploadingAttachment && (
            <div
              onClick={() => {
                setDeleteModal({show: !deleteModal.show, id: feedback.id});
              }}
              className="delete-comment hover:bg-red-400 hover:text-white transition-all duration-150 rounded text-red-400 w-auto self-start p-1 cursor-pointer">
              <BsFillTrashFill />
            </div>
          )}
        </div>
      );
    };
    const actionStyles =
      'flex items-center justify-center ml-2 h-7 w-7 rounded cursor-pointer transition-all duration-150 hover:text-white hover:bg-indigo-400 text-gray-500 ';
    return (
      <div
        className={`w-full white_back pb-2 py-8 ${theme.elem.bg} ${theme.elem.shadow} mb-8`}>
        <div className="px-6">
          <h3 className="text-dark text-2xl font-medium mb-3">{item.title}</h3>
          {item.content && ReactHtmlParser(item.content)}
        </div>

        {showComments && (
          <div className="comment-container">
            {attModal.show && (
              <AttachmentsModalPopUp
                closeAction={() => setAttModal({show: false, url: '', type: ''})}>
                {attModal.type.includes('image') && (
                  <img
                    style={{objectFit: 'cover'}}
                    className="h-auto w-auto rounded"
                    src={attModal.url}
                  />
                )}
              </AttachmentsModalPopUp>
            )}
            {deleteModal.show && (
              <ModalPopUp
                message="Are you sure you want to delete it?"
                deleteLabel="delete"
                deleteModal
                saveAction={() => {
                  deleteComment(deleteModal.id);
                  setDeleteModal({show: false, id: ''});
                }}
                closeAction={() => setDeleteModal({show: false, id: ''})}
              />
            )}
            {loadingComments ? (
              <div className="py-2 text-center my-4 mx-auto flex justify-center items-center w-full">
                <div className="">
                  <Loader color="rgba(107, 114, 128, 1)" />
                  <p className="mt-2 text-center text-lg text-gray-500">
                    Loading Comments...
                    {/* @Mohammad: Add this to dict */}
                  </p>
                </div>
              </div>
            ) : feedbackData && feedbackData.length > 0 ? (
              feedbackData.map((feedback, eventIdx: number) => (
                <Feedback feedback={feedback} />
              ))
            ) : (
              <div className="py-2 my-4 text-center mx-auto flex justify-center items-center w-full">
                <div className="">
                  <p className="mt-2 text-center text-lg text-gray-500">
                    No Feedbacks
                    {/* @Mohammad: Add this to dict */}
                  </p>
                </div>
              </div>
            )}
            <div
              className={`${
                isAdmin ? 'hidden' : ''
              } comment-box w-auto mx-6 flex flex-col border-0 border-gray-200 h-auto rounded mt-4`}>
              <div
                style={{minHeight: '2.5rem'}}
                className="flex flex-col border-b-0 border-gray-200">
                <textarea
                  onKeyUp={(e) => do_resize(e.target)}
                  autoFocus={true}
                  style={{resize: 'none'}}
                  cols={125}
                  rows={1}
                  placeholder="Add Feedback"
                  className="comment-input text-sm w-9/10 m-2 mx-4 mt-3 text-gray-700"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                {/* ------------------------- Preview Section Start -------------------------------- */}
                <div className={`${fileObject.name ? 'block px-4 py-2' : 'hidden'}`}>
                  {isImage && (
                    <div className="h-auto w-80 p-2 text-gray-500 border-0 border-gray-300 hover:border-gray-400 max-w-7xl min-w-56 rounded-md transition-all cursor-pointer flex justify-between items-center px-4">
                      <img
                        style={{objectFit: 'cover'}}
                        id="output_image"
                        className="h-16 w-16 mr-2 rounded-lg"
                      />
                      <p className="truncate w-auto font-light text-gray-600">
                        {fileObject?.name}
                      </p>
                      <span
                        onClick={() => setfileObject({})}
                        className={
                          'flex items-center justify-center h-8 w-8 rounded cursor-pointer transition-all duration-150 hover:text-indigo-400 text-gray-500 '
                        }>
                        <MdCancel />
                      </span>
                    </div>
                  )}
                  {isVideo && (
                    <div className="h-auto w-80 p-2 text-gray-500 border-0 border-gray-300 hover:border-gray-400 max-w-7xl min-w-56 rounded-md transition-all cursor-pointer flex justify-between items-center px-4">
                      <video id="output_video" className="h-20 mr-2 w-20 rounded-lg">
                        <source type={fileObject.type} />
                        Your browser does not support the video tag.
                      </video>
                      <p className="truncate w-auto font-light text-gray-600">
                        {fileObject?.name}
                      </p>
                      <span
                        onClick={() => setfileObject({})}
                        className={
                          'flex items-center justify-center h-8 w-8 rounded cursor-pointer transition-all duration-150 hover:text-indigo-400 text-gray-500 '
                        }>
                        <MdCancel />
                      </span>
                    </div>
                  )}
                  {!isVideo && !isImage && (
                    <div
                      onClick={() => setfileObject({})}
                      className="h-12 w-80 p-2 text-gray-500 border-0 border-gray-300 hover:border-gray-400 max-w-7xl min-w-56 rounded-md transition-all cursor-pointer flex justify-between items-center px-4">
                      <p className="truncate w-auto font-light text-gray-600">
                        {fileObject?.name}
                      </p>
                      <span
                        className={
                          'flex items-center justify-center h-8 w-8 rounded cursor-pointer transition-all duration-150 hover:text-indigo-400 text-gray-500 '
                        }>
                        <MdCancel />
                      </span>
                    </div>
                  )}
                </div>
                {/* ------------------------- Preview Section End -------------------------------- */}
              </div>
              <div className="comment-actions h-10 flex items-center justify-between">
                <div className="left-action w-auto">
                  <div className="flex items-center justify-center">
                    <button onClick={(e) => handleVideo()} className={`${actionStyles}`}>
                      <input
                        accept="video/*"
                        ref={inputVideo}
                        onChange={handleSelection}
                        type="file"
                        className="hidden"
                        multiple={false}
                      />
                      <BsCameraVideoFill className="" />
                    </button>
                    <button onClick={(e) => handleImage()} className={`${actionStyles} `}>
                      <input
                        accept="image/*"
                        ref={inputImage}
                        onChange={handleSelection}
                        type="file"
                        className="hidden"
                        multiple={false}
                      />
                      <MdImage className="" />
                    </button>
                    <button onClick={(e) => handleOther()} className={`${actionStyles}`}>
                      <BiLinkAlt className="" />
                      <input
                        ref={inputOther}
                        onChange={handleSelection}
                        type="file"
                        className="hidden"
                        multiple={false}
                      />
                    </button>
                  </div>
                </div>
                <div className="right-action w-auto p-2">
                  <div
                    onClick={onCommentSubmit}
                    className={`flex items-center justify-center ml-2 h-7 w-7 rounded transition-all duration-300 ${
                      comment.length || fileObject.name
                        ? 'bg-indigo-500 text-white cursor-pointer hover:bg-indigo-600'
                        : 'cursor-default text-indigo-300'
                    }`}>
                    <IoSendSharp className="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center mx-6 justify-start">
          <div
            onClick={onCommentShowHide}
            className="bg-indigo-500 text-white hover:bg-indigo-600 w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2">
            {showComments ? 'Hide' : 'Show'} Feedbacks
          </div>
        </div>
      </div>
    );
  };

  const isTeacher = state.user.role === 'TR' || state.user.role === 'FLW';
  {
    return (
      <>
        <div className={`mx-auto max-w-256`}>
          <BreadCrums items={breadCrumsList} />
          <div className="flex justify-between items-center mb-4 py-4 w-auto">
            {/* <SectionTitle title={UserDict[userLanguage]['title']} /> */}

            <Tabs />

            <div className="flex justify-end w-auto">
              {/* @Mohammad TODO: Move this goback button upwards */}
              {/* <Buttons
                label="Go Back"
                btnClass="mr-4"
                onClick={history.goBack}
                Icon={IoArrowUndoCircleOutline}
              /> */}
              {currentPath !== 'edit' && curTab === 'User Information' && (
                <Buttons
                  btnClass="mr-4 px-6"
                  label="Edit"
                  onClick={() => {
                    setCurTab(tabs[0].name);
                    history.push(`${match.url}/edit${location.search}`);
                  }}
                  Icon={FaEdit}
                />
              )}
            </div>
          </div>
          {curTab === 'User Information' && (
            <div
              className={`w-full white_back p-8 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} mb-8`}>
              <div className="h-1/2 flex flex-col md:flex-row">
                <div className="w-1/3 p-4 flex flex-col text-center items-center">
                  <div className="cursor-pointer">
                    {user.image ? (
                      <button className="group hover:opacity-80 focus:outline-none focus:opacity-95">
                        {!imageLoading ? (
                          <>
                            <label className="cursor-pointer">
                              {imageUrl ? (
                                <img
                                  className={`profile w-20 h-20 md:w-40 md:h-40 rounded-full  border-0 flex flex-shrink-0 border-gray-400 shadow-elem-light mx-auto`}
                                  src={imageUrl}
                                />
                              ) : (
                                <div
                                  className={`profile w-20 h-20 md:w-40 md:h-40 rounded-full  border-0 flex flex-shrink-0 border-gray-400 shadow-elem-light mx-auto`}
                                />
                              )}

                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => cropSelecetedImage(e)}
                                onClick={(e: any) => (e.target.value = '')}
                                accept="image/*"
                                multiple={false}
                                disabled={disableProfileChange}
                              />
                            </label>
                          </>
                        ) : (
                          <div className="w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-lightI">
                            <Loader />
                          </div>
                        )}
                      </button>
                    ) : (
                      <label className={`flex justify-center items-center mx-auto`}>
                        {!imageLoading ? (
                          <div
                            className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-light`}>
                            <div
                              className="h-full w-full flex justify-center items-center text-5xl text-extrabold text-white rounded-full"
                              style={{
                                /* stylelint-disable */
                                background: `${stringToHslColor(
                                  user.preferredName
                                    ? user.preferredName
                                    : user.firstName + ' ' + user.lastName
                                )}`,
                                textShadow: '0.2rem 0.2rem 3px #423939b3',
                              }}>
                              {initials(
                                user.preferredName ? user.preferredName : user.firstName,
                                user.lastName
                              )}
                            </div>
                          </div>
                        ) : (
                          <Loader />
                        )}
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => cropSelecetedImage(e)}
                          onClick={(e: any) => (e.target.value = '')}
                          accept="image/*"
                          disabled={disableProfileChange}
                          multiple={false}
                        />
                      </label>
                    )}
                  </div>
                  <div className={`text-lg md:text-3xl font-bold  text-gray-900 mt-4`}>
                    {`${user.preferredName ? user.preferredName : user.firstName} ${
                      user.lastName
                    }`}
                    <p className="text-md md:text-lg">{`${
                      user.institution ? user.institution : ''
                    }`}</p>
                  </div>
                </div>
                <Switch>
                  <Route
                    path={`${match.url}/edit`}
                    render={() => (
                      <UserEdit
                        tab={stdCheckpoints.length > 0 ? tab : 'p'}
                        setTab={setTab}
                        user={user}
                        status={status}
                        setStatus={setStatus}
                        getUserById={getUserById}
                        questionData={questionData}
                        stdCheckpoints={stdCheckpoints}
                      />
                    )}
                  />
                  <Route
                    path={`${match.url}/`}
                    render={() => (
                      <UserInformation
                        tab={stdCheckpoints.length > 0 ? tab : 'p'}
                        setTab={setTab}
                        questionData={questionData}
                        stdCheckpoints={stdCheckpoints}
                        user={user}
                        status={status}
                      />
                    )}
                  />
                </Switch>
              </div>
            </div>
          )}
          {curTab === 'Associated Classrooms' &&
            user?.classes?.items.length > 0 &&
            user.role === 'ST' && (
              <div
                className={`w-full white_back py-8 px-4 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} mb-8`}>
                <AssociatedClasses list={user?.classes?.items} />
              </div>
            )}

          {curTab === 'Notebook' &&
            (loading ? (
              <div className="py-20 white_back text-center mx-auto flex justify-center items-center w-full h-48">
                <div className="">
                  <Loader color="rgba(107, 114, 128, 1)" />
                  <p className="mt-2 text-center text-lg text-gray-500">
                    {'Loading Notebook Data'}
                  </p>
                </div>
              </div>
            ) : studentData && studentData.length > 0 ? (
              studentData.map((item: any) => <StudentData item={item} />)
            ) : (
              <div className="py-20 white_back text-center mx-auto flex justify-center items-center w-full h-48">
                <div className="">
                  <p className="mt-2 text-center text-lg text-gray-500">
                    {'No Notebook Data Found'}
                  </p>
                </div>
              </div>
            ))}
        </div>
        {showCropper && (
          <ProfileCropModal
            upImg={upImage}
            saveCroppedImage={(img: string) => saveCroppedImage(img)}
            closeAction={toggleCropper}
          />
        )}
      </>
    );
  }
};

export default User;
