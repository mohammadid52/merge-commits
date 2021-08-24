import {find, findIndex} from 'lodash';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {BiLinkAlt} from 'react-icons/bi';
import {BsCameraVideoFill} from 'react-icons/bs';
import {IoSendSharp} from 'react-icons/io5';
import {MdCancel, MdImage} from 'react-icons/md';
import Storage from '@aws-amplify/storage';
import * as mutations from '../../../graphql/mutations';
import API, {graphqlOperation} from '@aws-amplify/api';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {AddQuestionModalDict} from '../../../dictionary/dictionary.iconoclast';
import {getImageFromS3} from '../../../utilities/services';
import Buttons from '../../Atoms/Buttons';
import Loader from '../../Atoms/Loader';
import ModalPopUp from '../../Molecules/ModalPopUp';
import Feedback from '../Admin/UserManagement/Feedback';
import Modal from '../../Atoms/Modal';
import {getAsset} from '../../../assets';
import {HiEmojiHappy} from 'react-icons/hi';
import EmojiPicker from 'emoji-picker-react';

const Feedbacks = ({
  showComments,
  item,
  feedbackData,
  setFeedbackData,
  loadingComments,
  idx,
  fileObject,
  setFileObject,
  allStudentData,
  setAllStudentData,
}: any) => {
  const {state, clientKey, userLanguage} = useContext(GlobalContext);

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
  const [editModal, setEditModal] = useState({show: false, id: '', content: ''});
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
      updateCommentLocalState({comment: editCommentInput, id: commentObject.id});
      closeEditModal();
      await updateCommentFromDB({comment: editCommentInput, id: commentObject.id});
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

    let newExerciseFeedback = {
      exerciseData: selectStudentDataRecord.exerciseData.map((exercise: any) => {
        if (exercise.id === item.id) {
          return {...exercise, feedbacks: newFeedBackIds};
        } else {
          return exercise;
        }
      }),
    };

    let mergedStudentData = allStudentData.map((dataRecord: any) => {
      if (dataRecord.id === selectStudentDataRecord.id) {
        return {...dataRecord, exerciseData: newExerciseFeedback.exerciseData};
      } else {
        return dataRecord;
      }
    });

    try {
      let updatedStudentData: any = await API.graphql(
        graphqlOperation(mutations.updateUniversalLessonStudentData, {
          input: {
            id: selectStudentDataRecord.id,
            exerciseData: newExerciseFeedback.exerciseData,
          },
        })
      );
      setAllStudentData(mergedStudentData);
    } catch (e) {
      console.error('error updating exercise feedbacks- ', e);
    } finally {
      //
    }
  };

  // ~~~~~~~~~ DB-UPDATE FEEDBACKS ~~~~~~~~~ //

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

      await updateExerciseFeedback(newFeedbacks);

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

      let newFeedbacks =
        item.feedbacks.length > 0
          ? item.feedbacks.filter((feedbackId: string) => feedbackId !== id)
          : [];

      await updateExerciseFeedback(newFeedbacks);
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
    setFileObject({});
    setComment('');
  };

  const deleteComment = (id: string) => {
    const commentObject: any = getCurrentComment(id);

    if (commentObject) {
      if (commentObject.attachments && commentObject.attachments.length > 0) {
        const key: string = getKeyForAttachments(commentObject.attachments[0].url);
        deletImageFromS3(key);
      }

      const filteredData: any = feedbackData.filter((data: any) => data.id !== id);
      setFeedbackData(filteredData); // this is to update local state
      deleteCommentFromDatabase(id, item);
    }
  };

  // ##################################################################### //
  // ########################### FILE UPLOADING ########################## //
  // ##################################################################### //

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

  // ##################################################################### //
  // ######################### IMAGE MANIPULATION ######################## //
  // ##################################################################### //

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

  const getKeyForAttachments = (url: string) => {
    let splitUrl = url.split('/');
    return splitUrl[splitUrl.length - 1].split('?')[0];
  };
  const getFullNameString = (obj: any) =>
    obj.preferredName ? obj.preferredName : obj.firstName + ' ' + obj.lastName;

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

  // ~~~~~~~ SPECIFIC CLICK HANDLING ~~~~~~~ //

  const inputVideo = useRef(null);
  const inputImage = useRef(null);
  const inputOther = useRef(null);

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
  const actionStyles = `flex items-center justify-center ml-2 h-7 w-7 rounded cursor-pointer transition-all duration-150 hover:text-white text-gray-500 ${
    themeColor === 'iconoclastIndigo' ? getColor('indigo') : getColor('blue')
  }`;

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <div key={idx} className={`w-full pb-2 mb-2`}>
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
            feedbackData.map((feedback: any) => (
              <Feedback
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
                      onClick={() => setFileObject({})}
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
                      onClick={() => setFileObject({})}
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
                      onClick={() => setFileObject({})}
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
                        groupVisibility={{
                          recently_used: false,
                        }}
                        onEmojiClick={(e: any, emoji: any) => onEmojiSelect(emoji, false)}
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

export default Feedbacks;
