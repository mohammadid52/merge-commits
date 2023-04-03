import {useGlobalContext} from '@contexts/GlobalContext';
import {doResize} from '@utilities/functions';
import {getAsset} from 'assets';
import Buttons from 'atoms/Buttons';
import Loader from 'atoms/Loader';
import Modal from 'atoms/Modal';
import {API, graphqlOperation} from 'aws-amplify';
import {AddQuestionModalDict} from 'dictionary/dictionary.iconoclast';
import EmojiPicker from 'emoji-picker-react';
import {deleteImageFromS3, uploadImageToS3} from 'graphql/functions';
import * as mutations from 'graphql/mutations';
import {find, findIndex} from 'lodash';
import ModalPopUp from 'molecules/ModalPopUp';
import {useEffect, useRef, useState} from 'react';
import {BiLinkAlt} from 'react-icons/bi';
import {BsCameraVideoFill} from 'react-icons/bs';
import {HiEmojiHappy} from 'react-icons/hi';
import {IoSendSharp} from 'react-icons/io5';
import {MdCancel, MdImage} from 'react-icons/md';
import {getImageFromS3} from 'utilities/services';
import Feedback from '../../Admin/UserManagement/Feedback';

const Feedbacks = ({
  showComments,
  item,
  allStudentData,
  setAllStudentData,
  allUniversalJournalData,
  setAllUniversalJournalData,
  subSection,
  feedbackData,
  setFeedbackData,
  loadingComments,
  idx,
  fileObject,
  setFileObject
}: any) => {
  const entryID = item.id;
  const {state, clientKey, userLanguage} = useGlobalContext();

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

  // ##################################################################### //
  // ############################ LOCAL STATE ############################ //
  // ##################################################################### //

  // ~~~~~~~~~~~~~~~~ MODALS ~~~~~~~~~~~~~~~ //
  const [attModal, setAttModal] = useState({show: false, type: '', url: ''});
  const [editModal, setEditModal] = useState({
    show: false,
    id: '',
    content: ''
  });
  const [deleteModal, setDeleteModal] = useState({show: false, id: ''});

  const closeEditModal = () => {
    setEditModal({show: false, id: '', content: ''});
  };

  // ~~~~~~~~~ LOCAL COMMENT STATE ~~~~~~~~~ //
  const [comment, setComment] = useState('');
  const [editCommentInput, setEditCommentInput] = useState('');

  // ~~~~~~~~~~~ UPLOADING STATUS ~~~~~~~~~~ //
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  // ~~~~~~~~ LOCAL STATE FUNCTIONS ~~~~~~~~ //
  const pushCommentToLocalState = (comment: string, attachments?: any) => {
    let localObj = {
      text: comment,
      person: {
        authId: state.user.authId,
        image: state.user.image,
        firstName: state?.user?.preferredName,
        preferredName: state?.user?.firstName,
        lastName: state.user.lastName,
        role: state.user.role
      },
      createdAt: new Date(),
      id: Date.now().toString() // this is just for local state, After refreshing it will be replaced with real ID
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
                type: attachments.type
              }
            ]
          }
        : localObj;

    setFeedbackData([...feedbackData, finalInput]);
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

  const updateCommentLocalState = (commentObject: any) => {
    const {comment, id} = commentObject;

    const idx = findIndex(feedbackData, (fdbck: any) => fdbck.id === id);

    if (idx >= 0) {
      feedbackData[idx].text = comment;
      feedbackData[idx].edited = true;

      setFeedbackData([...feedbackData]);
    }
  };

  const editComment = async (id: string) => {
    const commentObject: any = getCurrentComment(id);

    if (commentObject) {
      updateCommentLocalState({
        comment: editCommentInput,
        id: commentObject.id
      });
      closeEditModal();
      await updateCommentFromDB({
        comment: editCommentInput,
        id: commentObject.id
      });
    }
  };

  // ##################################################################### //
  // ################################ CRUD ############################### //
  // ##################################################################### //

  // ~~~~~~~~ DB-UPDATE STUDENT DATA ~~~~~~~ //

  const updateExerciseFeedback = async (newFeedBackIds: string[]) => {
    const selectStudentDataRecord = allStudentData.find(
      (record: any) => record.id === item.recordID
    );

    const newExerciseFeedback = {
      exerciseData: selectStudentDataRecord.exerciseData.map((exercise: any) => {
        if (exercise.id === item.id) {
          return {...exercise, feedbacks: newFeedBackIds};
        } else {
          return exercise;
        }
      })
    };

    const mergedStudentData = allStudentData.map((dataRecord: any) => {
      if (dataRecord.id === selectStudentDataRecord.id) {
        return {
          ...dataRecord,
          exerciseData: newExerciseFeedback.exerciseData
        };
      } else {
        return dataRecord;
      }
    });

    try {
      await API.graphql(
        graphqlOperation(mutations.updateUniversalLessonStudentData, {
          input: {
            id: selectStudentDataRecord.id,
            exerciseData: newExerciseFeedback.exerciseData
          }
        })
      );
      setAllStudentData(mergedStudentData);
    } catch (e) {
      console.error('error updating exercise feedbacks- ', e);
    } finally {
      //
    }
  };

  // ~~~~~~~ DB-UPDATE JOURNAL ENTRY ~~~~~~~ //

  const updateJournalFeedback = async (newFeedBackIds: string[]) => {
    const mergedJournalData = allUniversalJournalData.map((dataRecord: any) => {
      if (dataRecord.id === item.id) {
        return {...dataRecord, feedbacks: newFeedBackIds};
      } else {
        return dataRecord;
      }
    });

    try {
      await API.graphql(
        graphqlOperation(mutations.updateUniversalJournalData, {
          input: {
            id: item.id,
            feedbacks: newFeedBackIds
          }
        })
      );
      setAllUniversalJournalData(mergedJournalData);
    } catch (e) {
      console.error('error updating journal feedbacks - ', e);
    } finally {
      //
    }
  };

  // ~~~~~~~~~ DB-UPDATE FEEDBACKS ~~~~~~~~~ //

  const updateCommentFromDB = async (commentObj: any) => {
    try {
      await API.graphql(
        graphqlOperation(mutations.updateAnthologyComment, {
          input: {
            id: commentObj.id,
            text: commentObj.comment,
            edited: true
          }
        })
      );
    } catch (error) {
      console.error('error @commentUpdate: ', error);
    }
  };

  const pushCommentToDatabase = async (text: string, item: any, attachments?: any) => {
    try {
      let input = {
        email: state.user.email,
        authID: state.user.authId,
        text,
        entryID: entryID
      };

      const finalInput =
        attachments && attachments.url
          ? {
              ...input,
              attachments: {
                type: attachments.type,
                url: attachments.url,
                filename: attachments.filename,
                size: attachments.size
              }
            }
          : input;
      const results: any = await API.graphql(
        graphqlOperation(mutations.createAnthologyComment, {
          input: finalInput
        })
      );

      const commentData: any = results.data.createAnthologyComment;
      let newFeedbacks = item.feedbacks || [];

      if (!newFeedbacks.includes(commentData.id)) {
        newFeedbacks.push(commentData.id);
      }

      if (subSection === 'Work') {
        await updateExerciseFeedback(newFeedbacks);
      } else {
        await updateJournalFeedback(newFeedbacks);
      }
    } catch (error) {
      console.error('error @createAnthologyComment: ', error);
    }
  };

  const deleteCommentFromDatabase = async (id: string, item: any) => {
    try {
      await API.graphql(
        graphqlOperation(mutations.deleteAnthologyComment, {input: {id}})
      );

      let newFeedbacks =
        item.feedbacks.length > 0
          ? item.feedbacks.filter((feedbackId: string) => feedbackId !== id)
          : [];

      if (subSection === 'Work') {
        await updateExerciseFeedback(newFeedbacks);
      } else {
        await updateJournalFeedback(newFeedbacks);
      }
    } catch (e) {
      console.error('error deleting comment - ', e);
    }
  };

  // ~~~~~~~~~ CRUD TOGGLE HANDLERS ~~~~~~~~ //

  const onCommentSubmit = async () => {
    if (fileObject.name) {
      let _comment: any = comment;
      setUploadingAttachment(true);
      let _fileObject: any = fileObject;
      const id: string = `feedbacks/${Date.now().toString()}_${fileObject.name}`;

      const type = _fileObject.type;
      setFileObject({});
      setComment('');
      pushCommentToLocalState(_comment, {
        url: 'loading',
        type,
        filename: _fileObject.name,
        size: _fileObject.size
      });

      await uploadImageToS3(_fileObject, id, type);

      const imageUrl: any = await getImageFromS3(id);

      pushCommentToDatabase(_comment, item, {
        url: imageUrl,
        type,
        filename: _fileObject.name,
        size: _fileObject.size
      });
      pushCommentToLocalState(_comment, {
        url: imageUrl,
        type,
        filename: _fileObject.name,
        size: _fileObject.size
      });
      setUploadingAttachment(false);
    } else {
      pushCommentToLocalState(comment);
      pushCommentToDatabase(comment, item);
    }
    setFileObject({});
    setComment('');
  };

  const deleteComment = (id: string) => {
    const commentObject: any = getCurrentComment(id);

    if (commentObject) {
      if (commentObject.attachments && commentObject.attachments.length > 0) {
        const key: string = getKeyForAttachments(commentObject.attachments[0].url);
        deleteImageFromS3(key);
      }

      const filteredData: any = feedbackData.filter((data: any) => data.id !== id);
      setFeedbackData(filteredData); // this is to update local state
      deleteCommentFromDatabase(id, item);
    }
  };

  // ##################################################################### //
  // ########################### FILE UPLOADING ########################## //
  // ##################################################################### //

  // ##################################################################### //
  // ######################### IMAGE MANIPULATION ######################## //
  // ##################################################################### //

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

  const getKeyForAttachments = (url: string) => {
    let splitUrl = url.split('/');
    return splitUrl[splitUrl.length - 1].split('?')[0];
  };
  const getFullNameString = (obj: any) =>
    obj.preferredName ? obj.preferredName : obj.firstName + ' ' + obj.lastName;

  const AttachmentsModalPopUp = (props: any) => {
    const {children, closeAction, open} = props;
    return (
      <Modal
        open={open}
        closeOnBackdrop
        closeAction={closeAction}
        showHeader={false}
        showHeaderBorder={false}
        showFooter={false}>
        {children}
      </Modal>
    );
  };

  // ~~~~~~~ SPECIFIC CLICK HANDLING ~~~~~~~ //

  const inputVideo = useRef<any>(null);
  const inputImage = useRef<any>(null);
  const inputOther = useRef<any>(null);

  const handleVideo = () => inputVideo.current.click();
  const handleImage = () => inputImage.current.click();
  const handleOther = () => inputOther.current.click();

  // ##################################################################### //
  // ############################### EMOJIS ############################## //
  // ##################################################################### //
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

  const handleSelection = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const isImage = file.type.includes('image');
      const isVideo = file.type.includes('video');
      setFileObject(file);
      if (isImage) {
        preview_image(file);
      }
      if (isVideo) {
        preview_thumnbnail(file);
      }
    }
  };

  // ##################################################################### //
  // ############################## STYLING ############################## //
  // ##################################################################### //
  const themeColor = getAsset(clientKey, 'themeClassName');

  const getColor = (theme = 'indigo') => {
    return `hover:bg-${theme}-500 active:bg-${theme}-500 focus:bg-${theme}-500`;
  };

  const isImage = fileObject && fileObject.type && fileObject.type.includes('image');
  const isVideo = fileObject && fileObject.type && fileObject.type.includes('video');
  const actionStyles = `flex items-center justify-center ml-2 h-7 w-7 rounded-full cursor-pointer transition-all duration-150 hover:text-white text-medium   ${
    themeColor === 'iconoclastIndigo' ? getColor('indigo') : getColor('blue')
  }`;

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <div key={idx} className={`w-full pb-2 mb-2`}>
      {showComments && (
        <div className="comment-container">
          <AttachmentsModalPopUp
            open={attModal.show}
            closeAction={() => setAttModal({show: false, url: '', type: ''})}>
            {attModal.type.includes('image') && (
              <img
                style={{
                  objectFit: 'cover',
                  maxHeight: '90vh',
                  maxWidth: '90vw'
                }}
                className="h-auto w-auto rounded"
                src={attModal.url}
              />
            )}
          </AttachmentsModalPopUp>

          <Modal
            open={editModal.show}
            showHeader={true}
            title={`Edit`}
            showHeaderBorder={true}
            showFooter={false}
            closeAction={closeEditModal}>
            <div>
              <textarea
                onKeyUp={(e) => doResize(e.target)}
                style={{resize: 'none'}}
                cols={125}
                rows={1}
                placeholder="Edit Feedback"
                className="text-sm w-96 p-2 px-4 pt-3 text-dark   border-0 border-lightest rounded-xl"
                value={editCommentInput}
                onChange={(e) => setEditCommentInput(e.target.value)}
              />
              <div className="mt-8 px-6 pb-4">
                <div className="flex justify-center items-center">
                  <Buttons
                    label={AddQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
                    onClick={closeEditModal}
                    transparent
                  />
                  <Buttons
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
                        onEmojiClick={(emoji: any) => onEmojiSelect(emoji, true)}
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

          <ModalPopUp
            open={deleteModal.show}
            message="Are you sure you want to delete it?"
            deleteLabel="delete"
            deleteModal
            saveAction={() => {
              deleteComment(deleteModal.id);
              setDeleteModal({show: false, id: ''});
            }}
            closeAction={() => setDeleteModal({show: false, id: ''})}
          />

          {loadingComments ? (
            <div className="py-2 my-4 text-center mx-auto flex justify-center items-center w-full">
              <div className="">
                <Loader />
                <p className="my-2 text-center text-lg text-medium ">
                  Loading Comments...
                  {/* @Mohammad: Add this to dict */}
                </p>
              </div>
            </div>
          ) : feedbackData && feedbackData.length > 0 ? (
            feedbackData.map((feedback: any, key: number) => {
              if (feedback) {
                return (
                  <Feedback
                    key={`feedback_${key}`}
                    setAttModal={setAttModal}
                    deleteModal={deleteModal}
                    uploadingAttachment={uploadingAttachment}
                    role={state.user.role}
                    fileObject={fileObject}
                    authId={state.user.authId}
                    setDeleteModal={setDeleteModal}
                    feedback={feedback}
                    setEditModal={setEditModal}
                    setEditCommentInput={setEditCommentInput}
                  />
                );
              }
              return <div className="hidden w-auto" />;
            })
          ) : (
            <div className="py-2 my-4 text-center mx-auto flex justify-center items-center w-full">
              <div className="">
                <p className="mt-2 text-center text-lg text-medium ">
                  Be the first to give feedback
                  {/* @Mohammad: Add this to dict */}
                </p>
              </div>
            </div>
          )}
          <div className="comment-box w-auto flex flex-col border-0 border-lightest h-auto rounded-xl mt-4">
            <div
              style={{minHeight: '2.5rem'}}
              className="flex comment-box__inner flex-col border-b-0 border-light">
              <textarea
                onKeyUp={(e) => doResize(e.target)}
                style={{resize: 'none'}}
                placeholder="Add Feedback"
                className="comment-input text-sm w-9/10 m-2 mx-4 mt-3 rounded-full text-dark  "
                rows={1}
                cols={125}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              {/* ------------------------- Preview Section Start -------------------------------- */}
              <div className={`${fileObject.name ? 'block px-4 py-2' : 'hidden'}`}>
                {isImage && (
                  <div className="h-auto w-80 p-2 text-medium  border-0 border-lightest  hover:border-light  max-w-7xl min-w-56 rounded-md transition-all cursor-pointer flex justify-between items-center px-4">
                    <img
                      style={{objectFit: 'cover'}}
                      id="output_image"
                      className="h-16 w-16 mr-2 rounded-lg"
                    />
                    <p className="truncate w-auto font-light text-medium ">
                      {fileObject?.name}
                    </p>
                    <span
                      onClick={() => setFileObject({})}
                      className={
                        'flex items-center justify-center h-8 w-8 rounded cursor-pointer transition-all duration-150 hover:text-indigo-400 text-medium  '
                      }>
                      <MdCancel />
                    </span>
                  </div>
                )}
                {isVideo && (
                  <div className="h-auto w-80 p-2 text-medium  border-0 border-lightest  hover:border-light  max-w-7xl min-w-56 rounded-md transition-all cursor-pointer flex justify-between items-center px-4">
                    <video id="output_video" className="h-20 mr-2 w-20 rounded-lg">
                      <source type={fileObject.type} />
                      Your browser does not support the video tag.
                    </video>
                    <p className="truncate w-auto font-light text-medium ">
                      {fileObject?.name}
                    </p>
                    <span
                      onClick={() => setFileObject({})}
                      className={
                        'flex items-center justify-center h-8 w-8 rounded cursor-pointer transition-all duration-150 hover:text-indigo-400 text-medium  '
                      }>
                      <MdCancel />
                    </span>
                  </div>
                )}
                {!isVideo && !isImage && (
                  <div className="h-12 w-80 p-2 text-medium  border-0 border-lightest  hover:border-light  max-w-7xl min-w-56 rounded-md transition-all cursor-pointer flex justify-between items-center px-4">
                    <p className="truncate w-auto font-light text-medium ">
                      {fileObject?.name}
                    </p>

                    <span
                      onClick={() => setFileObject({})}
                      className={
                        'flex items-center justify-center h-8 w-8 rounded cursor-pointer transition-all duration-150 hover:text-indigo-400 text-medium  '
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
                  <button onClick={handleVideo} className={`${actionStyles}`}>
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
                  <button onClick={handleImage} className={`${actionStyles} `}>
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
                  <button onClick={handleOther} className={`${actionStyles}`}>
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
                        onEmojiClick={(emoji: any) => onEmojiSelect(emoji, false)}
                      />
                    </div>
                  )}
                  <button
                    onClick={() => setShowEmoji(!showEmoji)}
                    className={`${actionStyles}`}>
                    <HiEmojiHappy className="" />
                  </button>
                </div>
              </div>
              <div className="right-action w-auto p-2">
                <button
                  disabled={comment.length === 0 && !fileObject.name}
                  onClick={onCommentSubmit}
                  className={`flex items-center justify-center ml-2 h-7 w-7 rounded transition-all duration-300 ${
                    comment.length || fileObject.name
                      ? 'bg-indigo-500 text-white cursor-pointer hover:bg-indigo-600'
                      : 'cursor-default text-indigo-300'
                  }`}>
                  <IoSendSharp className="" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedbacks;
