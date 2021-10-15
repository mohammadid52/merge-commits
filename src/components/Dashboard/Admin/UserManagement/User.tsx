import useUrlState from '@ahooksjs/use-url-state';
import API, {graphqlOperation} from '@aws-amplify/api';
import Storage from '@aws-amplify/storage';
import Anthology from '@components/Dashboard/Anthology/Anthology';
import EmojiPicker from 'emoji-picker-react';
import {find, findIndex} from 'lodash';
import slice from 'lodash/slice';
import sortBy from 'lodash/sortBy';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import {BiLinkAlt} from 'react-icons/bi';
import {BsArrowLeft, BsCameraVideoFill} from 'react-icons/bs';
import {FaEdit} from 'react-icons/fa';
import {HiEmojiHappy} from 'react-icons/hi';
import {IoIosTime} from 'react-icons/io';
import {IoSendSharp} from 'react-icons/io5';
import {MdCancel, MdImage} from 'react-icons/md';
import {getAsset} from '../../../../assets';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import * as customMutations from '../../../../customGraphql/customMutations';
import * as customQueries from '../../../../customGraphql/customQueries';
import useDictionary from '../../../../customHooks/dictionary';
import {useQuery} from '../../../../customHooks/urlParam';
import {AddQuestionModalDict} from '../../../../dictionary/dictionary.iconoclast';
import * as mutations from '../../../../graphql/mutations';
import * as queries from '../../../../graphql/queries';
import {getImageFromS3} from '../../../../utilities/services';
import {
  createFilterToFetchSpecificItemsOnly,
  getUniqItems,
  initials,
  stringToHslColor,
} from '../../../../utilities/strings';
import BreadCrums from '../../../Atoms/BreadCrums';
import Buttons from '../../../Atoms/Buttons';
import Loader from '../../../Atoms/Loader';
import Modal from '../../../Atoms/Modal';
import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import AnimatedContainer from '../../../Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {useTabs} from '../../../Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/Tabs';
import DroppableMedia from '../../../Molecules/DroppableMedia';
import ModalPopUp from '../../../Molecules/ModalPopUp';
import ProfileCropModal from '../../Profile/ProfileCropModal';
import Attendance from './Attendance';
import Feedback from './Feedback';
import UserEdit from './UserEdit';
import UserInformation from './UserInformation';
import UserTabs from './User/UserTabs';

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
  onDemand?: boolean;
  rooms: any[];
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

interface IUserProps {
  instituteId?: string;
}

const User = ({instituteId}: IUserProps) => {
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const params = useQuery(location.search);

  const {theme, state, userLanguage, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const [status, setStatus] = useState('');
  const [upImage, setUpImage] = useState(null);
  const [fileObj, setFileObj] = useState({});
  const [showCropper, setShowCropper] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');

  const tabs = [
    {name: 'User Information', current: true},
    {name: 'Coursework & Attendance', current: false},
    {name: 'Notebook', current: false},
  ];

  const {curTab, setCurTab, helpers} = useTabs(tabs);

  const [onUserInformationTab, onCATab, onNotebookTab] = helpers;
  const [questionData, setQuestionData] = useState([]);

  const [urlState, setUrlState] = useUrlState(
    {id: '', t: 'p'},
    {navigateMode: 'replace'}
  );

  const {userId}: any = useParams();

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
    onDemand: false,
    rooms: [],
  });

  const [imageUrl, setImageUrl] = useState('');
  const pathName = location.pathname.replace(/\/$/, '');
  const currentPath = pathName.substring(pathName.lastIndexOf('/') + 1);

  const {id, t: tab} = urlState;

  const {CommonlyUsedDict} = useDictionary(clientKey);

  const mediaRef = React.useRef(null);
  const handleImage = () => mediaRef?.current?.click();

  // const breadCrumsList = [
  //   {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
  //   {
  //     title: BreadcrumsTitles[userLanguage]['PEOPLE'],
  //     url: '/dashboard/manage-users',
  //     last: false,
  //   },
  //   {
  //     title: [
  //       user.preferredName ? user.preferredName : user.firstName,
  //       user.lastName,
  //     ].join(' '),
  //     url: `${location.pathname}${location.search}`,
  //     last: true,
  //   },
  // ];

  // ##################################################################### //
  // ######################### PROFILE QUESTIONS ######################### //
  // ##################################################################### //

  // ~~~~~~~~~~~~ GET RESPONSES ~~~~~~~~~~~~ //

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
  };

  // ##################################################################### //
  // ########################## GET CHECKPOINTS ########################## //
  // ##################################################################### //

  // ~~~~~~~~~~~~~~~ STORAGE ~~~~~~~~~~~~~~~ //

  const [allCheckpointIds, setAllCheckpointIds] = useState([]);
  const [allCheckpointQuesSeq, setAllCheckpointQuesSeq] = useState();

  const [demographicCheckpoints, setDemographicCheckpoints] = useState([]);
  const [privateCheckpoints, setPrivateCheckpoints] = useState([]);

  async function getUserProfile(id: string) {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.getUserProfile, {id: id})
      );
      const userData = result.data.userById.items.pop();

      let studentClasses: any = userData.classes?.items.map((item: any) => item?.class);
      studentClasses = studentClasses.filter((d: any) => d !== null);
      console.log('studentClasses - ', studentClasses);

      const studentRooms: any = studentClasses?.reduce((roomAcc: any[], item: any) => {
        if (item?.room) {
          return [...roomAcc, item.room];
        } else {
          return roomAcc;
        }
      }, []);

      userData.rooms = studentRooms;

      const studentCurriculars: any =
        studentRooms.length > 0
          ? studentRooms.map((item: any) => item?.curricula?.items).flat(1)
          : [];

      // console.log('studentCurriculars', studentCurriculars);

      const uniqCurriculars: any =
        studentCurriculars.length > 0
          ? getUniqItems(
              studentCurriculars.filter((d: any) => d !== null),
              'curriculumID'
            )
          : [];
      // console.log('uniqCurriculars', uniqCurriculars);

      const studCurriCheckp: any =
        uniqCurriculars.length > 0
          ? uniqCurriculars
              .map((item: any) => item?.curriculum?.checkpoints?.items)
              .flat(1)
          : [];

      // console.log('studCurriCheckp', studCurriCheckp);

      const studentCheckpoints: any =
        studCurriCheckp.length > 0
          ? studCurriCheckp.map((item: any) => item?.checkpoint)
          : [];

      // console.log('studentCheckpoints', studentCheckpoints);

      let sCheckpoints: any[] = [];

      studentCheckpoints.forEach((item: any) => {
        if (item) sCheckpoints.push(item);
      });

      sCheckpoints = sortBy(sCheckpoints, (item: any) => item.scope === 'private');

      /***********************
       *   DEMOGRAPHIC AND   *
       * PRIVATE CHECKPOINTS *
       ***********************/

      // ~~~~~~~~~~~~~~~~ UNIQUE ~~~~~~~~~~~~~~~ //
      const uniqCheckpoints: any = sCheckpoints ? getUniqItems(sCheckpoints, 'id') : [];
      const uniqCheckpointIDs: any = uniqCheckpoints.map((item: any) => item?.id);

      // ~~~~~~~~~~~~~~ SPLIT OUT ~~~~~~~~~~~~~~ //
      const demographicCheckpoints = uniqCheckpoints.filter(
        (checkpoint: any) => checkpoint.scope !== 'private'
      );
      // .reverse();
      const privateCheckpoints = uniqCheckpoints.filter(
        (checkpoint: any) => checkpoint.scope === 'private'
      );
      // .reverse();

      const personalInfo: any = {...userData};

      delete personalInfo.classes;

      setDemographicCheckpoints(demographicCheckpoints);
      setPrivateCheckpoints(privateCheckpoints);

      setStatus('done');
      setUser(() => {
        if (typeof userData === 'object') {
          return userData;
        }
        return user;
      });

      if (uniqCheckpointIDs?.length > 0) {
        setAllCheckpointIds(uniqCheckpointIDs);
        getQuestionData(uniqCheckpointIDs, userData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // ##################################################################### //
  // ########################### PROFILE IMAGE ########################### //
  // ##################################################################### //

  const isAdmin = state.user.role === 'ADM' || state.user.role === 'SUP';

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
    await uploadImageToS3(image ? image : fileObj, user.id, 'image/jpeg');
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
    if (userId) {
      getUserProfile(userId);
    }
  }, [userId]);

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
        reducedAnthologyContent.filter(
          (item: any) => item.content !== '' && item.title !== ''
        )
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
      await listStudentData();
    };
    if (!isTeacher && !isAdmin && user.authId) {
      initializeStudentData();
    }
  }, [user.authId]);

  if (status !== 'done') {
    return <LessonLoading />;
  }

  const disableProfileChange = user.role !== 'ST';

  const setTab = (value: string) => {
    setUrlState({t: value});
  };

  const switchMainTab = (tab: string) => {
    setCurTab(tab);
    history.push(`/dashboard/manage-users/user?id=${userId}&tab=${tab}`);
  };

  const handleClassRoomClick = (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsTimelineOpen(true);
  };

  const goToClassroom = () => {
    setSelectedRoomId('');
    setIsTimelineOpen(false);
  };

  const AssociatedClasses = ({list}: any) => {
    return (
      <div className="flex flex-col">
        <div className="flex justify-end mb-4">
          <Buttons
            label={'Timeline'}
            onClick={() => setIsTimelineOpen(true)}
            btnClass="mr-4"
            Icon={IoIosTime}
          />
        </div>
        <div className="overflow-x-auto">
          <div className="align-middle inline-block min-w-full">
            <div className=" overflow-hidden border-b-0 border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Institution
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Classroom
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
                  {list.map((room: any, idx: number) => {
                    const curriculum = room.curricula;
                    const teacher = room.teacher;
                    return (
                      <tr
                        key={`${room.id}`}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                        <td className="px-6 py-4 w-auto whitespace-nowrap text-sm text-gray-500">
                          {room?.class?.institution?.name}
                        </td>
                        <td
                          className="px-6 py-4 w-auto whitespace-nowrap text-sm text-gray-500 font-bold cursor-pointer"
                          onClick={() => handleClassRoomClick(room.id)}>
                          {room.name}
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

  function capitalizeFirstLetter(str: string = '') {
    if (str.length > 0) {
      const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
      return capitalized;
    }
  }

  const do_resize = (textbox: any) => {
    var maxrows = 50;
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

  const formatLastEdit = (editDate: string) => {
    const date = new Date(editDate);
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    return `${d}/${m + 1}/${y}`;
  };

  const listComments = async (feedbacks: string[] = []) => {
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

  const getFullNameString = (obj: any) =>
    obj.preferredName ? obj.preferredName : obj.firstName + ' ' + obj.lastName;

  const subSectionKey: any = {
    Journal: ['journal'],
    Work: ['poem', 'story'],
    Notes: ['notes'],
  };
  const getSection = (key: string) => {
    let journal = subSectionKey.Journal.includes(key);
    let work = subSectionKey.Work.includes(key);
    let notes = subSectionKey.Notes.includes(key);
    if (journal) return 'Journal';
    if (work) return 'Work';
    if (notes) return 'Notes';
  };

  const getColorForTag = (tagName: string) => {
    switch (tagName) {
      case 'Journal':
        return 'bg-green-100 text-green-600';
      case 'Notes':
        return 'bg-yellow-100 text-yellow-600';
      case 'Work':
        return 'bg-blue-100 text-blue-600';
      default:
        break;
    }
  };

  const updateCommentFromDB = async (commentObj: any) => {
    try {
      const commentUpdate: any = await API.graphql(
        graphqlOperation(mutations.updateAnthologyComment, {
          input: {
            id: commentObj.id,
            text: commentObj.comment,
            edited: true,
          },
        })
      );
    } catch (error) {
      console.error('error @commentUpdate: ', error);
    }
  };

  const StudentData = ({item}: any) => {
    // booleans
    const [showComments, setShowComments] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [attModal, setAttModal] = useState({show: false, type: '', url: ''});
    const [uploadingAttachment, setUploadingAttachment] = useState(false);
    const [deleteModal, setDeleteModal] = useState({show: false, id: ''});
    const [editModal, setEditModal] = useState({show: false, id: '', content: ''});
    // arrays
    const [feedbackData, setFeedbackData] = useState<any>([]);

    // strings
    const [comment, setComment] = useState('');
    const [editCommentInput, setEditCommentInput] = useState('');

    // objects
    const [fileObject, setfileObject] = useState<any>({});

    const [showEmoji, setShowEmoji] = useState(false);
    const [showEmojiForEdit, setShowEmojiForEdit] = useState(false);

    const onEmojiSelect = (e: any, forEdit: boolean = false) => {
      if (forEdit) {
        let commentWithEmoji = editCommentInput.concat(e.emoji);
        setEditCommentInput(commentWithEmoji);
        setShowEmojiForEdit(false);
      } else {
        let commentWithEmoji = comment.concat(e.emoji);
        setComment(commentWithEmoji);
        setShowEmoji(false);
      }
    };

    const getCurrentComment = (id: string) => {
      const currentComment: any = find(feedbackData, (comment: any) => comment.id === id);

      const currentCommentWithoutId: any = find(
        feedbackData,
        (comment: any) =>
          getFullNameString(comment.person) === getFullNameString(state.user)
      );

      const comment: any = currentComment.id ? currentComment : currentCommentWithoutId;
      return comment;
    };

    const deleteComment = (id: string) => {
      const comment: any = getCurrentComment(id);
      if (comment) {
        if (comment.attachments && comment.attachments.length > 0) {
          const key: string = getKeyForAttachments(comment.attachments[0].url);
          deletImageFromS3(key);
        }

        const filteredData: any = feedbackData.filter((data: any) => data.id !== id);
        setFeedbackData(filteredData); // this is to update local state
        deleteCommentFromDatabase(id, item);
      }
    };

    const closeEditModal = () => {
      setEditModal({show: false, id: '', content: ''});
    };

    const editComment = async (id: string) => {
      const commentObject: any = getCurrentComment(id);

      if (commentObject) {
        updateCommentLocalState({comment: editCommentInput, id: commentObject.id});
        closeEditModal();
        await updateCommentFromDB({comment: editCommentInput, id: commentObject.id});
      }
    };

    const onCommentShowHide = () => {
      if (showComments) {
        setfileObject({});
      }
      setShowComments(!showComments);
    };

    useEffect(() => {
      getFeedBackData();
    }, []);

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

    const updateCommentLocalState = (commentObject: any) => {
      const {comment, id} = commentObject;

      const idx = findIndex(feedbackData, (fdbck: any) => fdbck.id === id);

      if (idx >= 0) {
        feedbackData[idx].text = comment;
        feedbackData[idx].edited = true;

        setFeedbackData([...feedbackData]);
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
          role: state.user.role,
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

    const onCommentSubmit = async () => {
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
    const getColor = (theme = 'indigo') => {
      return `hover:bg-${theme}-500 active:bg-${theme}-500 focus:bg-${theme}-500`;
    };
    const actionStyles = `flex ${
      themeColor === 'iconoclastIndigo' ? getColor('indigo') : getColor('blue')
    } items-center justify-center ml-2 h-7 w-7 rounded cursor-pointer transition-all duration-150 hover:text-white text-gray-500`;

    return (
      <div
        className={`w-full note-container relative overflow-x-hidden white_back pb-2 py-8 ${theme.elem.bg} ${theme.elem.shadow} mb-8`}>
        <div className="px-6">
          <span className="notebook-lastedit absolute left-1 w-auto px-2.5 py-0.5 bottom-0 mb-2 text-xs text-gray-500">
            Last Edited: {formatLastEdit(item.updatedAt)}
          </span>

          <span
            className={`notebook-lastedit absolute right-0 w-auto px-2.5 py-0.5 top-0 text-xs font-medium ${getColorForTag(
              getSection(item.type)
            )}`}>
            {getSection(item.type) !== 'Journal' && `${getSection(item.type)} - `}
            {capitalizeFirstLetter(item.type)}
          </span>

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
                    style={{objectFit: 'cover', maxHeight: '90vh', maxWidth: '90vw'}}
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
            {editModal.show && (
              <Modal
                showHeader={true}
                title={`Edit`}
                showHeaderBorder={true}
                showFooter={false}
                closeAction={closeEditModal}>
                <div>
                  <textarea
                    onKeyUp={(e) => do_resize(e.target)}
                    style={{resize: 'none'}}
                    cols={125}
                    rows={1}
                    placeholder="Edit Feedback"
                    className="text-sm w-96 p-2 px-4 pt-3 text-gray-700 border-0 border-gray-200 rounded"
                    value={editCommentInput}
                    onChange={(e) => setEditCommentInput(e.target.value)}
                  />
                  <div className="mt-8 px-6 pb-4">
                    <div className="flex justify-center items-center">
                      <Buttons
                        btnClass="py-1 px-4 text-xs mr-2"
                        label={AddQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
                        onClick={closeEditModal}
                        transparent
                      />
                      <Buttons
                        btnClass="py-1 px-8 text-xs ml-2"
                        label={AddQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
                        onClick={() => editComment(editModal.id)}
                      />
                      {showEmojiForEdit && (
                        <div
                          onClick={(e: any) => {
                            const {id} = e.target;
                            if (id === 'picker-wrapper') {
                              setShowEmojiForEdit(false);
                            }
                          }}
                          id="picker-wrapper"
                          className="picker-wrapper absolute bottom-1 left-5">
                          <EmojiPicker
                            groupVisibility={{
                              recently_used: false,
                            }}
                            onEmojiClick={(e: any, emoji: any) =>
                              onEmojiSelect(emoji, true)
                            }
                          />
                        </div>
                      )}
                      <button
                        onClick={() => setShowEmojiForEdit(!showEmojiForEdit)}
                        className={`${actionStyles}`}>
                        <HiEmojiHappy className="" />
                      </button>
                    </div>
                  </div>
                </div>
              </Modal>
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
              feedbackData.map((feedback: any) => (
                <Feedback
                  setEditModal={setEditModal}
                  setEditCommentInput={setEditCommentInput}
                  setAttModal={setAttModal}
                  deleteModal={deleteModal}
                  uploadingAttachment={uploadingAttachment}
                  role={user.role}
                  fileObject={fileObject}
                  authId={state.user.authId}
                  setDeleteModal={setDeleteModal}
                  feedback={feedback}
                />
              ))
            ) : (
              <div className="py-2 my-4 text-center mx-auto flex justify-center items-center w-full">
                <div className="">
                  <p className="mt-2 text-center text-lg text-gray-500">
                    Be the first to give feedback
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
                className="flex comment-box__inner flex-col">
                <textarea
                  onKeyUp={(e) => do_resize(e.target)}
                  style={{resize: 'none'}}
                  cols={125}
                  rows={1}
                  placeholder="Add Feedback"
                  className="comment-input text-sm w-9/10 m-2 mx-4 mt-3 text-gray-700"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                {/* ------------------------- @key:B2 Preview Section Start -------------------------------- */}
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
                <div className="left-action w-auto relative">
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
                    {showEmoji && (
                      <div
                        onClick={(e: any) => {
                          const {id} = e.target;
                          if (id === 'picker-wrapper') {
                            setShowEmoji(false);
                          }
                        }}
                        id="picker-wrapper"
                        className="picker-wrapper absolute bottom-5 left-5">
                        <EmojiPicker
                          groupVisibility={{
                            recently_used: false,
                          }}
                          onEmojiClick={(e: any, emoji: any) =>
                            onEmojiSelect(emoji, false)
                          }
                        />
                      </div>
                    )}
                    <button
                      onClick={() => setShowEmoji(true)}
                      className={`${actionStyles}`}>
                      <HiEmojiHappy className="" />
                    </button>
                  </div>
                </div>
                <div className="right-action w-auto p-2">
                  <div
                    onClick={onCommentSubmit}
                    className={`flex items-center justify-center ml-2 h-7 w-7 rounded transition-all duration-300 ${
                      comment.length || fileObject.name
                        ? `text-white cursor-pointer ${getColorForSendBtn(
                            themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
                          )}`
                        : `cursor-default text-${
                            themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
                          }-300`
                    }`}>
                    <IoSendSharp className="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center px-6 justify-end">
          <div
            onClick={onCommentShowHide}
            className={`${
              feedbackData.length > 0 ? theme.btn[themeColor] : 'bg-gray-500'
            } ${
              loadingComments ? 'flex items-center justify-between' : ''
            } text-white  w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2`}>
            <p>
              {loadingComments
                ? 'Loading Comments'
                : feedbackData.length > 0
                ? `${showComments ? 'Hide' : 'Show'} Feedback`
                : 'Leave Feedback'}
            </p>
            {loadingComments && (
              <span className="ml-4 w-auto">
                <Loader color="#fff" />
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getColorForSendBtn = (theme = 'indigo') => {
    return `hover:bg-${theme}-600 bg-${theme}-500`;
  };

  const isTeacher =
    state.user.role === 'TR' ||
    state.user.role === 'FLW' ||
    state.user.role === 'ADM' ||
    state.user.role === 'SUP';
  {
    return (
      <>
        <div className={`pl-12 max-w-256`}>
          {/* <BreadCrums items={breadCrumsList} /> */}
          {params.get('from') && (
            <div
              className="flex items-center mt-1 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={history.goBack}>
              <span className="w-auto mr-2">
                <BsArrowLeft />
              </span>
              <div className="text-sm">
                {CommonlyUsedDict[userLanguage]['BACK']}
              </div>
            </div>
            // <div className="flex justify-end mb-4">
            //   <Buttons
            //     label="Go Back"
            //     btnClass="mr-4"
            //     onClick={history.goBack}
            //     Icon={IoArrowUndoCircleOutline}
            //   />
            // </div>
          )}
          <div className="flex justify-between items-center mb-4 py-4 w-auto">
            {/* <SectionTitle title={UserDict[userLanguage]['title']} /> */}

            <UserTabs
              tabs={tabs}
              currentTab={curTab}
              viewedUser={user}
              setCurrentTab={setCurTab}
              isTeacher={isTeacher}
              isAdmin={isAdmin}
              theme={theme}
            />

            <div className="flex justify-end w-auto">
              {currentPath !== 'edit' && onUserInformationTab && (
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
          <AnimatedContainer className="h-full" show={onUserInformationTab}>
            {onUserInformationTab && (
              <div
                className={`w-full overflow-hidden white_back p-8 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} mb-8`}>
                <div className="h-1/2 flex flex-col md:flex-row">
                  <div className="w-1/4 p-4 flex flex-col text-center items-center">
                    <div className="cursor-pointer">
                      {user.image ? (
                        <button className="group hover:opacity-80 focus:outline-none focus:opacity-95">
                          {!imageLoading ? (
                            <>
                              <label className="cursor-pointer">
                                <DroppableMedia
                                  mediaRef={mediaRef}
                                  setImage={(img: any, file: any) => {
                                    setUpImage(img);
                                    setFileObj(file);
                                  }}
                                  toggleCropper={toggleCropper}>
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
                                </DroppableMedia>
                              </label>
                            </>
                          ) : (
                            <div className="w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-light">
                              <Loader />
                            </div>
                          )}
                        </button>
                      ) : (
                        <label className={`flex justify-center items-center mx-auto`}>
                          {!imageLoading ? (
                            <DroppableMedia
                              mediaRef={mediaRef}
                              setImage={(img: any, file: any) => {
                                setUpImage(img);
                                setFileObj(file);
                              }}
                              toggleCropper={toggleCropper}>
                              <div
                                onClick={handleImage}
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
                                    user.preferredName
                                      ? user.preferredName
                                      : user.firstName,
                                    user.lastName
                                  )}
                                </div>
                              </div>
                            </DroppableMedia>
                          ) : (
                            <Loader />
                          )}
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
                          // tab={stdCheckpoints.length > 0 ? tab : 'p'}
                          instituteId={instituteId}
                          tab={tab}
                          setTab={setTab}
                          user={user}
                          status={status}
                          setStatus={setStatus}
                          getUserById={getUserProfile}
                          questionData={questionData}
                          checkpoints={
                            tab === 'demographics'
                              ? demographicCheckpoints
                              : tab === 'private'
                              ? privateCheckpoints
                              : []
                          }
                        />
                      )}
                    />
                    <Route
                      path={`${match.url}/`}
                      render={() => (
                        <UserInformation
                          // tab={stdCheckpoints.length > 0 ? tab : 'p'}
                          tab={tab}
                          setTab={setTab}
                          questionData={questionData}
                          checkpoints={
                            tab === 'demographics'
                              ? demographicCheckpoints
                              : tab === 'private'
                              ? privateCheckpoints
                              : []
                          }
                          user={user}
                          status={status}
                        />
                      )}
                    />
                  </Switch>
                </div>
              </div>
            )}
          </AnimatedContainer>
          <AnimatedContainer show={onCATab}>
            {onCATab && user?.classes?.items.length > 0 && user.role === 'ST' && (
              <div
                className={`w-full white_back py-8 px-4 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} mb-8`}>
                {isTimelineOpen ? (
                  <Attendance
                    id={id}
                    goToClassroom={goToClassroom}
                    selectedRoomId={selectedRoomId}
                  />
                ) : (
                  <AssociatedClasses list={user?.rooms} />
                )}
              </div>
            )}
          </AnimatedContainer>
          <AnimatedContainer show={onNotebookTab}>
            {onNotebookTab && (
              <Anthology
                isTeacher={isTeacher}
                studentID={user.id}
                studentAuthID={user.authId}
                studentName={user.firstName}
                studentEmail={user.email}
              />
            )}
          </AnimatedContainer>

          {curTab === 'Timeline' && (
            <div
              className={`w-full white_back py-8 px-4 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} mb-8`}>
              <Attendance id={id} goToClassroom={() => switchMainTab(tabs[1].name)} />
            </div>
          )}
        </div>
        {showCropper && (
          <ProfileCropModal
            upImg={upImage}
            saveCroppedImage={(img: string) => {
              saveCroppedImage(img);
            }}
            closeAction={toggleCropper}
          />
        )}
      </>
    );
  }
};

export default User;
