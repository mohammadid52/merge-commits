import Storage from '@aws-amplify/storage';
import API, {graphqlOperation} from '@aws-amplify/api';
import FileListItem from '@components/Dashboard/Anthology/UploadsTab/FileListItem';
import UploadAttachment from '@components/Dashboard/Anthology/UploadsTab/UploadAttachment';
import {sortBy} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {BiImageAdd} from 'react-icons/bi';
import {getAsset} from '../../../../assets';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {anthologyDict} from '../../../../dictionary/dictionary.iconoclast';
import * as queries from '../../../../graphql/queries';
import {dateFromServer} from '../../../../utilities/time';
import Buttons from '../../../Atoms/Buttons';
import ContentCard from '../../../Atoms/ContentCard';
import FeedbacksUploads from '@components/Dashboard/Anthology/UploadsTab/FeedbacksUploads';
import {IUploadCardProps} from '../UploadsTab';
import {UPLOAD_KEYS} from '@components/Lesson/constants';
import * as mutations from '@graphql/mutations';

const UploadCard = ({
  idx,
  subSection,
  contentLen,
  contentObj,
  updateLoadedFilesList,
  handleEdit,
  handleSave,
  handleCancel,
  editID,
  personAuthID,
  personEmail,
}: IUploadCardProps) => {
  const gContext = useContext(GlobalContext);
  const state = gContext.state;
  const user = state.user;
  const theme = gContext.theme;
  const clientKey = gContext.clientKey;
  const userLanguage = gContext.userLanguage;
  const themeColor = getAsset(clientKey, 'themeClassName');

  // ##################################################################### //
  // ############################# VISIBILITY ############################ //
  // ##################################################################### //

  const [showComments, setShowComments] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState<boolean>(false);

  const toggleDialog = (option: string) => {
    switch (option) {
      case 'comments':
        if (showUploadDialog) {
          setShowUploadDialog(false);
        }
        setShowComments(!showComments);
        break;
      case 'uploads':
        if (showComments) {
          setShowComments(false);
        }
        setShowUploadDialog(!showUploadDialog);
        break;
    }
  };

  // ##################################################################### //
  // ###################### INDIVIDUAL FILE DELETION ##################### //
  // ##################################################################### //

  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteFileKey, setdeleteFileKey] = useState<string>('');

  // ~~~~~~~~~~ TOGGLE & FUNCTIONS ~~~~~~~~~ //

  const handleToggleDelete = (fileKeyToToggle: string) => {
    if (fileKeyToToggle === deleteFileKey) {
      setdeleteFileKey('');
    } else if (fileKeyToToggle !== deleteFileKey || deleteFileKey !== '') {
      setdeleteFileKey(fileKeyToToggle);
    }
  };

  const handleConfirmDelete = async () => {
    const newFiles = contentObj.files.reduce((acc: any[], fileObj: any) => {
      if (fileObj.fileKey !== deleteFileKey) {
        return [...acc, fileObj];
      } else {
        return acc;
      }
    }, []);
    setDeleting(true);
    try {
      await deleteImage(deleteFileKey);
      await updatePersonFiles(newFiles);
      await updateLoadedFilesList(contentObj.id, newFiles);
    } catch (e) {
      console.error('@handleConfirmDelete - ', e);
    } finally {
      setDeleting(false);
    }
  };

  // ~~~~~~ UPDATE PERSON FILES TABLE ~~~~~~ //

  const updatePersonFiles = async (newFilesArray: any[]) => {
    try {
      const payload = {
        id: contentObj.id,
        personAuthID: state.user.authId,
        personEmail: state.user.email,
        files: newFilesArray,
        lessonPageID: contentObj.lessonPageID,
        lessonID: contentObj.lessonID,
        syllabusLessonID: contentObj.syllabusLessonID,
      };

      console.log('payu;lpoad - ', payload);

      const result: any = await API.graphql(
        graphqlOperation(mutations.updatePersonFiles, {input: payload})
      );
    } catch (error) {
      console.error('@uploadFileDataToTable: ', error.message);
    } finally {
      setdeleteFileKey('');
    }
  };

  // ~~~~~~~~~ S3 STORAGE DELETION ~~~~~~~~~ //

  const UPLOAD_KEY = UPLOAD_KEYS.getStudentDataUploadKey(user?.id, contentObj.lessonID);

  const deleteImageFromS3 = (key: string) => {
    // Remove image from bucket
    return new Promise((resolve, reject) => {
      Storage.remove(key)
        .then((result) => {
          console.log('deleted: ', key);
          resolve(result);
        })
        .catch((err) => {
          console.error(err.message);

          reject(err);
        });
    });
  };

  const deleteImage = async (fileKey: string) => {
    deleteImageFromS3(`${UPLOAD_KEY}${fileKey}`);
  };

  // ##################################################################### //
  // ########################### FEEDBACK LOGIC ########################## //
  // ##################################################################### //

  const [feedbackData, setFeedbackData] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const [fileObject, setFileObject] = useState({});

  // ~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~ //

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

  const getFeedBackData = async () => {
    if (contentObj.feedbacks && contentObj.feedbacks.length > 0) {
      setLoadingComments(true);
      try {
        const feedbacksData: any = await listComments(contentObj.feedbacks);
        setFeedbackData(sortBy(feedbacksData, ['createdAt']));
      } catch (error) {
        console.error('error @getFeedBackData: ', error.message);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  useEffect(() => {
    getFeedBackData();
  }, []);

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <>
      {/* <ContentCard hasBackground={false} key={`anthology_${subSection}${idx}`}> */}
      <div
        id={`anthology_${subSection}${idx}`}
        className={`flex flex-col ${
          idx !== contentLen - 1 && 'border-b-2'
        } border-gray-300 px-6 py-6 p-2`}>
        {/**
         *  section:  FILES LIST
         */}
        <div className={`flex justify-end px-4`}>
          <p className={`w-auto text-right italic text-sm text-gray-400`}>
            Updated: {dateFromServer(contentObj?.updatedAt)}
          </p>
        </div>
        <div className="flow-root mt-6">
          <ul role="list" className="divide-y divide-gray-200">
            {contentObj && contentObj?.files.length > 0
              ? contentObj.files.map((file: any, fileIdx: number) => (
                  <FileListItem
                    fileIdx={fileIdx}
                    fileName={file.fileName}
                    fileKey={file.fileKey}
                    fileSize={file.fileSize}
                    deleteFileKey={deleteFileKey}
                    handleToggleDelete={handleToggleDelete}
                    handleConfirmDelete={handleConfirmDelete}
                    deleting={deleting}
                  />
                ))
              : null}
          </ul>
        </div>

        {/**
         *  section:  VIEW/EDIT BUTTON
         */}
        <div className={`flex pt-2 flex-col  mt-2`}>
          <div className="flex items-center justify-between">
            <div className="w-auto flex items-center justify-start">
              <div
                className={`${theme.btn[themeColor]} w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2 flex flex-row`}
                onClick={() => toggleDialog('uploads')}>
                <BiImageAdd className={`w-auto mr-2`} />
                {anthologyDict[userLanguage].ACTIONS.UPLOAD}
              </div>
            </div>

            {/**
             *  section:  FEEDBACK
             */}
            {subSection === 'Uploads' ? (
              <div
                onClick={() => toggleDialog('comments')}
                className={`${
                  feedbackData.length > 0 ? theme.btn[themeColor] : 'bg-gray-500'
                } ${
                  loadingComments ? 'flex items-center justify-between' : ''
                }  text-white  w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2`}>
                <p>
                  {loadingComments
                    ? 'Loading Comments . . .'
                    : feedbackData.length > 0
                    ? `${showComments ? 'Hide' : 'Show'} Feedback`
                    : 'Leave Feedback'}
                </p>
              </div>
            ) : null}
          </div>

          {showUploadDialog && !showComments && (
            <UploadAttachment
              personFilesID={contentObj.id}
              updateLoadedFilesList={updateLoadedFilesList}
              filesArray={contentObj.files}
              lessonPageID={contentObj.lessonPageID}
              lessonID={contentObj.lessonID}
              syllabusLessonID={contentObj.syllabusLessonID}
              roomID={contentObj.roomID}
              toggleDialog={() => toggleDialog('uploads')}
            />
          )}

          {showComments && !showUploadDialog && (
            <div className="border-t-0 border-gray-200 mt-4">
              <FeedbacksUploads
                key={contentObj.id}
                contentObj={contentObj}
                subSection={subSection}
                feedbackData={feedbackData}
                setFeedbackData={setFeedbackData}
                loadingComments={loadingComments}
                showComments={showComments}
                setShowComments={setShowComments}
                fileObject={fileObject}
                setFileObject={setFileObject}
                personEmail={personEmail}
                personAuthID={personAuthID}
                toggleDialog={() => toggleDialog('comments')}
              />
            </div>
          )}
        </div>
      </div>
      {/* </ContentCard> */}
    </>
  );
};

export default React.memo(UploadCard);
