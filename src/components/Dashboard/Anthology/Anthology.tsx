import React, {useContext, useEffect, useState} from 'react';
import SectionTitle from '../../Atoms/SectionTitleV2';
import SubSectionTabs from './SubSectionTabs';
import AnthologyContent from './AnthologyContent';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {API, graphqlOperation} from '@aws-amplify/api';
import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import * as customMutations from '../../../customGraphql/customMutations';
import useDictionary from '../../../customHooks/dictionary';
import HeroBanner from '../../Header/HeroBanner';
import {getAsset} from '../../../assets';
import SectionTitleV3 from '../../Atoms/SectionTitleV3';
import UnderlinedTabs from '../../Atoms/UnderlinedTabs';
import Buttons from '../../Atoms/Buttons';

import {FaEdit} from 'react-icons/fa';
import {initials, stringToHslColor} from '../../../utilities/strings';
import {getImageFromS3} from '../../../utilities/services';
import {BiCloudDownload} from 'react-icons/bi';
import Modal from '../../Atoms/Modal';
import Loader from '../../Atoms/Loader';

export interface AnthologyContentInterface {
  type: string;
  subType: string;
  title: string;
  subTitle: string;
  description: string;
  content: string;
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

export type ViewEditMode = {
  mode: 'view' | 'edit' | 'save' | 'create' | 'savenew' | '';
  studentDataID: string;
  idx: number;
};

const Anthology = () => {
  const {state, dispatch, userLanguage, theme, clientKey} = useContext(GlobalContext);
  const {anthologyDict} = useDictionary(clientKey);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const [tab, setTab] = useState(0);

  const [studentData, setStudentData] = useState<AnthologyMapItem[]>([]);
  const [newStudentData, setNewStudentData] = useState<AnthologyMapItem>({
    type: 'journal',
    subType: '',
    title: '',
    subTitle: '',
    description: '',
    content: '',
    lessonProgress: '0',
    currentLocation: '0',
    status: 'ACTIVE',
    syllabusLessonID: '',
    studentID: state.user.email,
    studentAuthID: state.user.authId,
  });
  // For switching sections & knowing which field to edit
  const [subSection, setSubSection] = useState<string>('Journal');
  // For editing specific poems/stories
  const [viewEditMode, setViewEditMode] = useState<ViewEditMode>({
    mode: '',
    studentDataID: '',
    idx: 0,
  });

  useEffect(() => {
    dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'anthology'}});
  }, []);

  // TOP Function to load student data
  const listStudentData = async () => {
    try {
      const studentDataFetch: any = await API.graphql(
        graphqlOperation(queries.listStudentDatas, {
          filter: {studentAuthID: {eq: state.user.authId}},
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
      setStudentData(reducedAnthologyContent);
    } catch (e) {
      console.error('Anthology student data fetch error: ', e);
    }
  };

  // Useeffect to load student data and process it
  useEffect(() => {
    const initializeStudentData = async () => {
      if (state.user.authId) {
        await listStudentData();
      }
    };
    initializeStudentData();
  }, [state.user.authId]);

  // Useeffect to initialize newStudentData
  useEffect(() => {
    setNewStudentData({...newStudentData, syllabusLessonID: customSyllabusLessonID()});
  }, [studentData]);

  // Function group to handle updating student data
  const handleEditUpdate = (e: React.ChangeEvent) => {
    const {id, value} = e.target as HTMLInputElement;
    const [key, type, studentDataID] = id.split('_');
    switch (viewEditMode.mode) {
      case 'edit':
        const updatedStudentData = studentData.reduce(
          (acc: AnthologyMapItem[], contentObj: any, idx: number) => {
            if (
              contentObj.type === type &&
              contentObj.studentDataID === studentDataID &&
              idx === viewEditMode.idx
            ) {
              return [...acc, {...contentObj, [key]: value}];
            } else {
              return [...acc, contentObj];
            }
          },
          []
        );
        setStudentData(updatedStudentData);
        break;
      case 'create':
        if (viewEditMode.mode === 'create') {
          const updatedNewStudentData = {...newStudentData, [key]: value};
          setNewStudentData(updatedNewStudentData);
        }
        break;
    }
  };

  const handleWYSIWYGupdate = (id: string, value: string) => {
    const [key, type, studentDataID] = id.split('_');
    switch (viewEditMode.mode) {
      case 'edit':
        const updatedStudentData = studentData.reduce(
          (acc: AnthologyMapItem[], contentObj: any, idx: number) => {
            if (
              contentObj.type === type &&
              contentObj.studentDataID === studentDataID &&
              idx === viewEditMode.idx
            ) {
              return [...acc, {...contentObj, [key]: value}];
            } else {
              return [...acc, contentObj];
            }
          },
          []
        );
        setStudentData(updatedStudentData);
        break;
      case 'create':
        if (viewEditMode.mode === 'create') {
          const updatedNewStudentData = {...newStudentData, [key]: value};
          setNewStudentData(updatedNewStudentData);
        }
        break;
    }
  };

  const handleEditToggle = (
    editMode: 'view' | 'edit' | 'create' | 'save' | 'savenew' | '',
    studentDataID: string,
    idx: number
  ) => {
    setViewEditMode({mode: editMode, studentDataID: studentDataID, idx: idx});
  };

  const onCancel = (type: string) => {
    setNewStudentData({...newStudentData, content: '', title: ''});
  };

  // Function group to handle section-switching
  const handleTabClick = (tab: number, e: React.MouseEvent) => {
    const {id} = e.target as HTMLElement;
    setViewEditMode({...viewEditMode, mode: ''});
    setTab(tab);

    if (id !== subSection) {
      if (id !== 'subSectionTabs') {
        setSubSection(id);
        setNewStudentData({...newStudentData, type: subSectionKey[id][0]});
      }
    }
  };

  const subSectionKey: any = {
    Journal: ['journal'],
    Work: ['poem', 'story'],
    Notes: ['notes'],
  };

  // Function group for filtering the studentData/anthology content
  const customSyllabusLessonID = () => {
    return `custom_${state.user.authId}_${
      filterAnthologyContentWithSimilarSyllabusLessonID('custom').length
    }`;
  };

  const filterAnthologyContentBySubsection = studentData.filter(
    (contentObj: AnthologyMapItem) => {
      if (subSectionKey[subSection].includes(contentObj.type)) return contentObj;
    }
  );

  const filterAnthologyContentWithSimilarSyllabusLessonID = (
    inputSyllabusLessonID: string
  ) =>
    studentData.filter((contentObj: AnthologyMapItem) => {
      if (contentObj.syllabusLessonID.includes(inputSyllabusLessonID)) return contentObj;
    });

  const getAnthologyContentByStudentDataID = studentData.find(
    (contentObj: AnthologyMapItem) => {
      return contentObj.studentDataID === viewEditMode.studentDataID;
    }
  );

  const getContentObjIndex = (contentObj: AnthologyMapItem) =>
    studentData.indexOf(contentObj);

  // Function group for mutating database
  const anthologySave = async () => {
    const removeHelperProperties = {
      type: getAnthologyContentByStudentDataID.type,
      subType: getAnthologyContentByStudentDataID.subType,
      title: getAnthologyContentByStudentDataID.title,
      subTitle: getAnthologyContentByStudentDataID.subTitle,
      description: getAnthologyContentByStudentDataID.description,
      content: getAnthologyContentByStudentDataID.content,
    };

    try {
      const studentDataUpdate: any = await API.graphql(
        graphqlOperation(mutations.updateStudentData, {
          input: {
            id: getAnthologyContentByStudentDataID.studentDataID,
            status: getAnthologyContentByStudentDataID.status,
            syllabusLessonID: getAnthologyContentByStudentDataID.syllabusLessonID,
            studentID: state.user.email,
            studentAuthID: state.user.authId,
            anthologyContent: removeHelperProperties,
          },
        })
      );
    } catch (e) {
      console.error('studentDataUpdate: ', e);
    } finally {
      setViewEditMode({mode: '', studentDataID: '', idx: 0});
    }
  };

  const anthologyCreate = async () => {
    const removeHelperProperties = {
      type: newStudentData.type,
      subType: newStudentData.subType,
      title: newStudentData.title,
      subTitle: newStudentData.subTitle,
      description: newStudentData.description,
      content: newStudentData.content,
    };

    try {
      const studentDataCreate: any = await API.graphql(
        graphqlOperation(mutations.createStudentData, {
          input: {
            lessonProgress: newStudentData.lessonProgress,
            currentLocation: newStudentData.currentLocation,
            status: newStudentData.status,
            syllabusLessonID: newStudentData.syllabusLessonID,
            studentID: state.user.email,
            studentAuthID: state.user.authId,
            anthologyContent: removeHelperProperties,
          },
        })
      );
    } catch (e) {
      console.error('studentDataCreate: Anthology: ', e);
    } finally {
      setViewEditMode({mode: '', studentDataID: '', idx: 0});
    }
  };

  // UseEffect for monitoring save/create new changes and calling functions
  useEffect(() => {
    const manageSaveAndCreate = async () => {
      if (viewEditMode.mode === 'save') {
        await anthologySave();
      } else if (viewEditMode.mode === 'savenew') {
        await anthologyCreate();
        await listStudentData();
      }
    };
    manageSaveAndCreate();
  }, [viewEditMode]);

  const getTranslation = Object.keys(anthologyDict[userLanguage].TABS).map((key: any) => {
    return anthologyDict[userLanguage].TABS[key];
  });
  const notebookBanner = getAsset(clientKey, 'dashboardBanner1');

  const Feedbacks = () => {
    const [showComments, setShowComments] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [attModal, setAttModal] = useState({show: false, type: '', url: ''});

    // arrays
    const [feedbackData, setFeedbackData] = useState([]);

    const [profileUrl, setProfileUrl] = useState('');
    useEffect(() => {
      async function getUrl() {
        const profileUrl: any = getImageFromS3(state.user.image);
        setProfileUrl(profileUrl);
      }
      if (!profileUrl) {
        getUrl();
      }
    }, [state.user, profileUrl]);

    function GetFormattedDate(todayTime: any) {
      const date = new Date(todayTime);
      var hours = date.getHours();
      var min = date.getMinutes();
      return `${hours > 9 ? hours : `0${hours}`}:${min > 9 ? min : `0${min}`}`;
    }

    const getSizeInBytes = (size: number) => {
      const inKB = size / 1024;
      const inMB = inKB / 1024;
      if (inMB < 1) {
        return `${inKB.toFixed(2)} KB`;
      } else {
        return `${inMB.toFixed(2)} MB`;
      }
    };

    const ImageMedia = ({attachment}: any) => {
      return (
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
    const Size = ({size}: {size: number}) => {
      return (
        <span
          style={{
            bottom: '0rem',
            fontSize: '0.65rem',
            right: '-3rem',
          }}
          className="absolute size-stamp w-auto text-gray-500">
          {getSizeInBytes(size)}
        </span>
      );
    };
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

    const OtherMedia = ({attachment}: any) => {
      return (
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
      return (
        <div className="h-auto w-72 border-0 p-4 border-gray-300">
          <p className="truncate text-center min-w-auto p-2 pt-0 text-gray-500">
            {attachment.filename}
          </p>
          <video controls className="rounded-lg" src={attachment.url}>
            <source type={attachment.type} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    };

    const Feedback = ({feedback}: any) => {
      return (
        <div
          key={feedback.id}
          className="relative comment-main flex items-center justify-between px-6 w-auto py-3 my-2">
          <div className="text-sm text-gray-900 flex items-start">
            {feedback.person.image ? (
              <img
                className="h-10 w-10 rounded-md bg-gray-400 flex items-center justify-center"
                src={profileUrl}
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
                      feedback.person.firstName + ' ' + feedback.person.lastName
                    )}`,
                    textShadow: '0.2rem 0.2rem 3px #423939b3',
                  }}>
                  {initials(
                    feedback.person.preferredName
                      ? feedback.person.preferredName
                      : feedback.person.firstName,
                    feedback.person.lastName
                  )}
                </div>
              </div>
            )}
            <div className="ml-2 w-auto">
              <h5 className="font-semibold hover:text-underline">
                {(feedback.person.preferredName
                  ? feedback.person.preferredName
                  : feedback.person.firstName) +
                  ' ' +
                  feedback.person.lastName}
                <span className="text-xs text-gray-600 font-normal ml-3">
                  {GetFormattedDate(feedback.createdAt)}
                </span>
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
        </div>
      );
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

    const actionStyles =
      'flex items-center justify-center ml-2 h-7 w-7 rounded cursor-pointer transition-all duration-150 hover:text-white hover:bg-indigo-400 text-gray-500 ';
    return (
      <div className={`w-full pb-2 py-8 ${theme.elem.bg} ${theme.elem.shadow} mb-8`}>
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
            {loadingComments ? (
              <div className="py-2 text-center mx-auto flex justify-center items-center w-full">
                <div className="">
                  <Loader color="rgba(107, 114, 128, 1)" />
                  <p className="mt-2 text-center text-lg text-gray-500">
                    Loading Comments...
                    {/* @Mohammad: Add this to dict */}
                  </p>
                </div>
              </div>
            ) : (
              feedbackData &&
              feedbackData.map((feedback, eventIdx: number) => (
                <Feedback feedback={feedback} />
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  const Content = (
    <AnthologyContent
      viewEditMode={viewEditMode}
      handleEditToggle={handleEditToggle}
      handleEditUpdate={handleEditUpdate}
      handleWYSIWYGupdate={handleWYSIWYGupdate}
      subSection={subSection}
      createTemplate={newStudentData}
      content={studentData.length > 0 && filterAnthologyContentBySubsection}
      getContentObjIndex={getContentObjIndex}
    />
  );

  const tabs = [
    {
      index: 0,
      title: anthologyDict[userLanguage].TABS.A,
      id: 'Journal',
      content: Content,
    },
    {
      index: 1,
      title: anthologyDict[userLanguage].TABS.B,
      id: 'Work',
      content: Content,
    },
    {
      index: 2,
      title: anthologyDict[userLanguage].TABS.C,
      id: 'Notes',
      content: Content,
    },
  ];

  return (
    <React.Fragment>
      <div>
        <HeroBanner imgUrl={notebookBanner} title={'Notebook'} />
      </div>

      <div
        className={`${theme.section} -mt-6 mb-4 px-6 py-4 m-auto relative ${theme.backGround[themeColor]} text-white rounded`}>
        <h2 className={`text-base text-center font-semibold`}>All your work in place</h2>
      </div>

      <SectionTitleV3
        fontSize="2xl"
        fontStyle="bold"
        extraContainerClass="max-w-256"
        extraClass="leading-6 text-gray-900"
        withButton={
          tab === 0 && (
            <Buttons
              Icon={FaEdit}
              customStyles={{width: '14rem'}}
              label={anthologyDict[userLanguage].ACTIONS.CREATE}
              onClick={() =>
                handleEditToggle('create', newStudentData.syllabusLessonID, 0)
              }
              type="button"
            />
          )
        }
        title={anthologyDict[userLanguage].TITLE}
      />

      <div
        className={`mx-auto max-w-256 min-h-48 pb-4 overflow-hidden bg-white rounded-lg shadow mb-4`}>
        <UnderlinedTabs tabs={tabs} updateTab={handleTabClick} />
      </div>

      {/*
        Tabs to select between:
          - Lesson Data
          - Journal
          - Your Stories & Poems
    */}
      {/* <SubSectionTabs
        subSection={subSection}
        handleTabClick={handleTabClick}
        subSectionList={Object.keys(subSectionKey)}
        translations={getTranslation}
      /> */}
      {/*
        This section shows rows of:
          - ADD NEW ENTRY
          - Journal entries
          - Stories
          - Poems
    */}
      {/* <AnthologyContent
        viewEditMode={viewEditMode}
        handleEditToggle={handleEditToggle}
        handleEditUpdate={handleEditUpdate}
        handleWYSIWYGupdate={handleWYSIWYGupdate}
        subSection={subSection}
        createTemplate={newStudentData}
        content={studentData.length > 0 && filterAnthologyContentBySubsection}
        getContentObjIndex={getContentObjIndex}
      /> */}
    </React.Fragment>
  );
};

export default Anthology;
