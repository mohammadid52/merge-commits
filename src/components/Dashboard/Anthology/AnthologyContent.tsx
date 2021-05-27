import React, {useState, useContext, useEffect, useRef} from 'react';
import Storage from '@aws-amplify/storage';
import API, {graphqlOperation} from '@aws-amplify/api';

import {GlobalContext} from '../../../contexts/GlobalContext';
import ContentCard from '../../Atoms/ContentCard';
import {AnthologyMapItem, ViewEditMode} from './Anthology';
import FormInput from '../../Atoms/Form/FormInput';
import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import TextArea from '../../Atoms/Form/TextArea';
import {dateFromServer} from '../../../utilities/time';
import useDictionary from '../../../customHooks/dictionary';
import RichTextEditor from '../../Atoms/RichTextEditor';
import Buttons from '../../Atoms/Buttons';
import {getImageFromS3, getImageFromS3Static} from '../../../utilities/services';
import {BiCloudDownload, BiLinkAlt} from 'react-icons/bi';
import {initials, stringToHslColor} from '../../../utilities/strings';
import Modal from '../../Atoms/Modal';

import Loader from '../../Atoms/Loader';
import {find, sortBy} from 'lodash';
import {BsCameraVideoFill, BsFillTrashFill} from 'react-icons/bs';
import {MdCancel, MdImage} from 'react-icons/md';
import {IoSendSharp} from 'react-icons/io5';
import ModalPopUp from '../../Molecules/ModalPopUp';

interface ContentCardProps {
  viewEditMode: ViewEditMode;
  handleEditToggle: (editMode: string, studentDataID: string, idx: number) => void;
  handleEditUpdate: (e: React.ChangeEvent) => void;
  handleWYSIWYGupdate: (id: any, value: any) => void;
  subSection: string;
  createTemplate: any;
  content?: any;
  getContentObjIndex?: (contentObj: AnthologyMapItem) => number;
}

const AnthologyContent = (props: ContentCardProps) => {
  const {
    viewEditMode,
    handleEditToggle,
    handleEditUpdate,
    handleWYSIWYGupdate,
    subSection,
    createTemplate,
    content,
    getContentObjIndex,
  } = props;
  const {state, theme, userLanguage, clientKey} = useContext(GlobalContext);
  const {anthologyDict} = useDictionary(clientKey);
  const [notesData, setNotesData] = useState<{key: string; value: string}>({
    key: '',
    value: '',
  });

  const setEditorContent = (html: string, text: string, idKey: string) => {
    setNotesData({
      key: idKey,
      value: html,
    });
    handleWYSIWYGupdate(idKey, html);
  };

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
        .then((result: any) => {
          resolve(result);
        })
        .catch((err) => {
          console.log('Error in deleting file from s3', err);
          reject(err);
        });
    });
  };

  const Feedbacks = ({
    showComments,
    item,
    loadingComments,
    feedbackData,
    setFeedbackData,
  }: any) => {
    const [attModal, setAttModal] = useState({show: false, type: '', url: ''});

    // strings
    const [comment, setComment] = useState('');

    // objects
    const [fileObject, setfileObject] = useState<any>({});

    const [uploadingAttachment, setUploadingAttachment] = useState(false);
    const [deleteModal, setDeleteModal] = useState({show: false, id: ''});

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

    const pushCommentToLocalState = (comment: string, attachments?: any) => {
      let localObj = {
        text: comment,
        person: {
          authId: state.user.authId,
          image: state.user.image,
          firstName: state?.user?.preferredName,
          preferredName: state?.user?.firstName,
          lastName: state.user.lastName,
          size: attachments.size,
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

    const ImageMedia = ({attachment}: any) => {
      return attachment.url === 'loading' ? (
        <LoadingMedia size={attachment.size} filename={attachment.filename} />
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

    const AudioMedia = ({attachment}: any) => {
      return attachment.url === 'loading' ? (
        <div
          style={{width: '30rem'}}
          className="h-12 relative p-2 text-gray-500 border-0 border-gray-300 hover:border-gray-400 max-w-7xl min-w-56 rounded-md transition-all cursor-pointer flex justify-between items-center px-4">
          <p className="truncate w-auto">{attachment.filename}</p>
          <Size size={attachment.size} />

          <span className={'flex items-center justify-center h-8 w-8'}>
            <Loader color="#6366F1" />
          </span>
        </div>
      ) : (
        <div style={{width: '30rem'}} className="h-auto border-0 p-4 border-gray-300">
          <p className="truncate text-left min-w-auto p-2 pt-0 text-gray-500">
            {attachment.filename}
          </p>
          <Size size={attachment.size} />
          <div className="flex items-center justify-center">
            <audio controls className="mr-2 rounded-lg">
              <source type={fileObject.type} src={attachment.url} />
              Your browser does not support the video tag.
            </audio>
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
    const LoadingMedia = ({filename, size}: any) => {
      return (
        <div className="relative h-40 w-auto max-w-56 flex-col border-0 border-gray-300 hover:border-gray-400 rounded-lg p-2 min-h-48 min-w-48 flex items-center justify-center">
          <div className="h-2/10 min-w-auto p-2 pt-0 text-gray-500 truncate">
            {filename}
          </div>
          <div className="h-8/10 flex items-center min-w-48 bg-gray-100 rounded-lg">
            <Loader color="#6366F1" />
          </div>
          <Size size={size} />
        </div>
      );
    };

    const VideoMedia = ({attachment}: any) => {
      return attachment.url === 'loading' ? (
        <LoadingMedia size={attachment.size} filename={attachment.filename} />
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

    const Feedback = ({feedback}: any) => {
      const {person} = feedback;
      const {firstName, lastName, preferredName} = person;

      return (
        <div
          key={feedback.id}
          className="relative comment-main flex items-center justify-between w-auto py-3 my-2">
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
                    person.role === state.user.role
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  } ml-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium w-auto`}>
                  {getRole(person.role || 'FLW')}
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
                    const isAudio = type.includes('audio');
                    const isOther = !isImage && !isVideo && !isAudio;
                    return (
                      <div
                        className="mt-2"
                        onClick={() => {
                          isImage && setAttModal({show: true, url, type});
                        }}>
                        {isImage && <ImageMedia attachment={attachment} />}
                        {isVideo && <VideoMedia attachment={attachment} />}
                        {isOther && <OtherMedia attachment={attachment} />}
                        {isAudio && <AudioMedia attachment={attachment} />}
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
    const getKeyForAttachments = (url: string) => {
      let splitUrl = url.split('/');
      return splitUrl[splitUrl.length - 1].split('?')[0];
    };
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

        const filteredData: any = feedbackData.filter((data: any) => data.id !== id);
        setFeedbackData(filteredData); // this is to update local state
        deleteCommentFromDatabase(id, item);
      }
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
    const actionStyles =
      'flex items-center justify-center ml-2 h-7 w-7 rounded cursor-pointer transition-all duration-150 hover:text-white hover:bg-indigo-400 text-gray-500 ';
    return (
      <div className={`w-full pb-2 pb-4 mb-2`}>
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
            {loadingComments ? (
              <div className="py-2 my-4 text-center mx-auto flex justify-center items-center w-full">
                <div className="">
                  <Loader color="rgba(107, 114, 128, 1)" />
                  <p className="mt-2 text-center text-lg text-gray-500">
                    Loading Comments...
                    {/* @Mohammad: Add this to dict */}
                  </p>
                </div>
              </div>
            ) : feedbackData && feedbackData.length > 0 ? (
              feedbackData.map((feedback: any, eventIdx: number) => (
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
            <div className="comment-box w-auto flex flex-col border-0 border-gray-200 h-auto rounded mt-4">
              <div
                style={{minHeight: '2.5rem'}}
                className="flex comment-box__inner flex-col border-b-0 border-gray-200">
                <textarea
                  onKeyUp={(e) => do_resize(e.target)}
                  style={{resize: 'none'}}
                  placeholder="Add Feedback"
                  className="comment-input text-sm w-9/10 m-2 mx-4 mt-3 text-gray-700"
                  rows={1}
                  cols={125}
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
                    <div className="h-12 w-80 p-2 text-gray-500 border-0 border-gray-300 hover:border-gray-400 max-w-7xl min-w-56 rounded-md transition-all cursor-pointer flex justify-between items-center px-4">
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
      </div>
    );
  };

  const viewModeView = (contentObj: AnthologyMapItem) => (
    <>
      {/* <div className={`flex px-4`}>
        <p className={`text-right italic ${theme.lessonCard.subtitle}`}>
          Updated: {dateFromServer(contentObj.updatedAt)}
        </p>
      </div> */}
      <>
        {viewEditMode.mode === 'create' &&
          viewEditMode.studentDataID === createTemplate.syllabusLessonID && (
            <div
              style={{height: '0.05rem'}}
              className={'mx-auto px-8 border-t-0 my-2 border-gray-200'}
            />
          )}
        <div className="border-gray-200">
          <h4 className={`mb-2 w-auto font-medium ${theme.lessonCard.title}`}>
            {contentObj.title ? contentObj.title : `No title`}
          </h4>
          <div className={`overflow-ellipsis overflow-hidden ellipsis`}>
            {contentObj.content.length > 0 ? (
              <p
                className="font-normal"
                dangerouslySetInnerHTML={{__html: contentObj.content}}
              />
            ) : (
              `No content`
            )}
          </div>
        </div>
      </>
    </>
  );

  const editModeView = (contentObj: AnthologyMapItem) => (
    <>
      {/**
       *  section: TOP INFO
       */}
      {/* <div className={`flex px-4`}>
        <p className={`text-right italic ${theme.lessonCard.subtitle}`}>
          Updated: {dateFromServer(contentObj.updatedAt)}
        </p>
      </div> */}
      {/**
       *  section: TITLE
       */}
      <div className={`mb-2`}>
        <FormInput
          id={`title_${contentObj.type}_${contentObj.studentDataID}`}
          label={`Title`}
          onChange={handleEditUpdate}
          value={contentObj.title}
          placeHolder={contentObj.title ? contentObj.title : `Please add title...`}
        />
      </div>
      {/**
       *  section:  CONTENT
       */}
      <div className={`mt-2 mb-2`}>
        <RichTextEditor
          initialValue={contentObj.content}
          onChange={(htmlContent, plainText) =>
            setEditorContent(
              htmlContent,
              plainText,
              `content_${contentObj.type}_${contentObj.studentDataID}`
            )
          }
        />
      </div>
    </>
  );

  const createModeView = (contentObj: AnthologyMapItem) => (
    <>
      {/**
       *  section: TOP INFO
       */}
      <div className={`flex pb-2 mb-2`}>
        <p
          style={{letterSpacing: '0.015em'}}
          className={`text-left font-semibold text-lg text-dark`}>
          Create new
        </p>
      </div>
      {/**
       *  section: TITLE
       */}
      <div className={`pb-2 mb-2`}>
        <FormInput
          id={`title_${contentObj.type}_${contentObj.studentDataID}`}
          label={`Title`}
          onChange={handleEditUpdate}
          value={contentObj.title}
          placeHolder={contentObj.title ? contentObj.title : `Please add title...`}
        />
      </div>
      {/**
       *  section:  CONTENT
       */}
      <div className={`mt-2 mb-2`}>
        <RichTextEditor
          initialValue={contentObj.content}
          onChange={(htmlContent, plainText) =>
            setEditorContent(
              htmlContent,
              plainText,
              `content_${contentObj.type}_${contentObj.studentDataID}`
            )
          }
        />
      </div>
    </>
  );

  const Content = ({idx, contentObj}: any) => {
    const [showComments, setShowComments] = useState(false);
    const [feedbackData, setFeedbackData] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);

    const getFeedBackData = async () => {
      setLoadingComments(true);
      try {
        const feedbacksData: any = await listComments(contentObj.feedbacks);
        setFeedbackData(sortBy(feedbacksData, ['createdAt']));
      } catch (error) {
        console.error('error @getFeedBackData: ', error.message);
      } finally {
        setLoadingComments(false);
      }
    };
    const onCommentShowHide = () => {
      if (!showComments && feedbackData.length === 0) {
        getFeedBackData();
      }
      if (showComments) {
        // setfileObject({});
      }
      setShowComments(!showComments);
    };

    const isEditMode =
      viewEditMode &&
      viewEditMode.mode === 'edit' &&
      viewEditMode.studentDataID === contentObj.studentDataID &&
      viewEditMode.idx === getContentObjIndex(contentObj);

    return (
      <ContentCard hasBackground={false} key={`anthology_${subSection}${idx}`}>
        <div
          id={`anthology_${subSection}${idx}`}
          className={`flex flex-col ${
            idx !== content.length - 1 && 'border-b-0'
          } border-gray-200 px-6 py-6 p-2`}>
          {isEditMode ? editModeView(contentObj) : viewModeView(contentObj)}
          {/**
           *  section:  VIEW/EDIT BUTTON
           */}
          <div className={`flex pt-2 flex-col mt-2`}>
            {isEditMode ? (
              <div className="flex ">
                <Buttons
                  onClick={() => {
                    handleEditToggle('', '', 0);
                    // onCancel(contentObj.type);
                  }}
                  label={anthologyDict[userLanguage].ACTIONS.CANCEL}
                  transparent
                  btnClass="mr-2"
                />
                <Buttons
                  onClick={() =>
                    handleEditToggle(
                      'save',
                      contentObj.studentDataID,
                      getContentObjIndex(contentObj)
                    )
                  }
                  label={anthologyDict[userLanguage].ACTIONS.SAVE}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <Buttons
                  onClick={() =>
                    handleEditToggle(
                      'edit',
                      contentObj.studentDataID,
                      getContentObjIndex(contentObj)
                    )
                  }
                  label={anthologyDict[userLanguage].ACTIONS.EDIT}
                />
                <Buttons
                  onClick={onCommentShowHide}
                  label={`${showComments ? 'Hide' : 'Show'} Feedbacks`}
                />
              </div>
            )}

            {showComments && (
              <div className="border-t-0 border-gray-200 mt-4">
                <Feedbacks
                  feedbackData={feedbackData}
                  loadingComments={loadingComments}
                  item={contentObj}
                  showComments={showComments}
                  setShowComments={setShowComments}
                  setFeedbackData={setFeedbackData}
                />
              </div>
            )}
          </div>
        </div>
      </ContentCard>
    );
  };

  return (
    <>
      {viewEditMode.mode === 'create' &&
        viewEditMode.studentDataID === createTemplate.syllabusLessonID && (
          <ContentCard hasBackground={false}>
            <div
              id={`anthology_${subSection}_create`}
              className={`flex flex-col px-6 p-2`}>
              {viewEditMode && viewEditMode.mode === 'create'
                ? createModeView(createTemplate)
                : null}
              <div
                className={`flex ${viewEditMode.mode === 'create' ? 'pt-2 mt-2' : ''}`}>
                {viewEditMode.mode === 'create' &&
                viewEditMode.studentDataID === createTemplate.syllabusLessonID ? (
                  <Buttons
                    onClick={() => handleEditToggle('', '', 0)}
                    label={anthologyDict[userLanguage].ACTIONS.CANCEL}
                    transparent
                    btnClass="mr-2"
                  />
                ) : null}
                {viewEditMode.mode === 'create' &&
                viewEditMode.studentDataID === createTemplate.syllabusLessonID ? (
                  <Buttons
                    onClick={() => handleEditToggle('savenew', `custom_${subSection}`, 0)}
                    label={anthologyDict[userLanguage].ACTIONS.SAVE}
                  />
                ) : null}
              </div>
            </div>
          </ContentCard>
        )}
      {content.length > 0 ? (
        content.map((contentObj: AnthologyMapItem, idx: number) => (
          <Content idx={idx} contentObj={contentObj} />
        ))
      ) : (
        <div className="p-12 flex flex-center items-center">
          <p className="text-center text-lg text-gray-500">
            No content for {subSection} section
          </p>
        </div>
      )}
    </>
  );
};

export default AnthologyContent;
