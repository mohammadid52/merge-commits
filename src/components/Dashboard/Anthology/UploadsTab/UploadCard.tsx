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
import FeedbacksUploads from '../FeedbacksUploads';
import {IUploadCardProps} from '../UploadsTab';

const UploadCard = ({
  idx,
  mainSection,
  subSection,
  contentLen,
  contentObj,
  handleEdit,
  handleSave,
  handleDelete,
  handleConfirm,
  handleCancel,
  editID,
  editMode,
  personAuthID,
  personEmail,
}: IUploadCardProps) => {
  const gContext = useContext(GlobalContext);
  const theme = gContext.theme;
  const clientKey = gContext.clientKey;
  const userLanguage = gContext.userLanguage;
  const themeColor = getAsset(clientKey, 'themeClassName');

  // ##################################################################### //
  // ############################# VISIBILITY ############################ //
  // ##################################################################### //

  const [showComments, setShowComments] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState<boolean>(false);

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
    <ContentCard hasBackground={false} key={`anthology_${subSection}${idx}`}>
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
          <ul role="list" className="-my-5 divide-y divide-gray-200">
            {contentObj && contentObj?.files.length > 0
              ? contentObj.files.map((file: any) => (
                  <FileListItem fileName={file.fileName} fileKey={file.fileKey} />
                ))
              : null}
          </ul>
        </div>

        {/**
         *  section:  VIEW/EDIT BUTTON
         */}
        <div className={`flex pt-2 flex-col  mt-2`}>
          {editID === contentObj.id ? (
            <div className="flex items-center">
              <Buttons
                onClick={() => {
                  handleCancel();
                }}
                label={anthologyDict[userLanguage].ACTIONS.CANCEL}
                transparent
                btnClass="mr-2"
              />

              <Buttons
                onClick={() => handleSave()}
                label={anthologyDict[userLanguage].ACTIONS.SAVE}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="w-auto flex items-center justify-start">
                <div
                  className={`${theme.btn[themeColor]}  w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2`}
                  onClick={() => handleEdit()}>
                  {anthologyDict[userLanguage].ACTIONS.EDIT}
                </div>

                <div
                  className={`${theme.btn[themeColor]} w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2 ml-2 flex flex-row`}
                  onClick={() => setShowUploadDialog(!showUploadDialog)}>
                  <BiImageAdd className={`w-auto mr-2`} />
                  {anthologyDict[userLanguage].ACTIONS.UPLOAD}
                </div>
              </div>

              {/**
               *  section:  FEEDBACK
               */}
              {subSection === 'Uploads' ? (
                <div
                  onClick={() => setShowComments(!showComments)}
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
                  {/* {!loadingComments && (
                    <span className="w-auto ml-4 w-auto">
                      <Loader color="#fff" />
                    </span>
                  )} */}
                </div>
              ) : null}
            </div>
          )}

          {showUploadDialog && (
            <UploadAttachment
              personFilesID={contentObj.id}
              filesArray={contentObj.files}
              lessonPageID={contentObj.lessonPageID}
              lessonID={contentObj.lessonID}
              syllabusLessonID={contentObj.syllabusLessonID}
              roomID={contentObj.roomID}
            />
          )}

          {showComments && (
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
              />
            </div>
          )}
        </div>
      </div>
    </ContentCard>
  );
};

export default UploadCard;
