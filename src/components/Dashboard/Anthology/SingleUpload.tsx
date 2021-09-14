import {sortBy} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import * as queries from '../../../graphql/queries';
import API, {graphqlOperation} from '@aws-amplify/api';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {anthologyDict} from '../../../dictionary/dictionary.iconoclast';
import Buttons from '../../Atoms/Buttons';
import ContentCard from '../../Atoms/ContentCard';
import {getAsset} from '../../../assets';
import {IUploadCardProps} from './UploadsTab';
import {IconContext} from 'react-icons';
import {AiOutlineFile} from 'react-icons/ai';
import {dateFromServer} from '../../../utilities/time';
import {getImageFromS3Static} from '../../../utilities/services';
import FeedbacksUploads from './FeedbacksUploads';

const SingleUpload = ({
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
  personEmail
}: IUploadCardProps) => {
  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  // ##################################################################### //
  // ########################### FEEDBACK LOGIC ########################## //
  // ##################################################################### //
  const [showComments, setShowComments] = useState(false);
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
  // ######################## HANDLE IMAGE LOADING ####################### //
  // ##################################################################### //

  const [imageUrl, setImageUrl] = useState<string>('');

  const isImage = (filenameStr: string) => {
    return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(filenameStr);
  };

  const getImageURL = async (uniqKey: string) => {
    const imageUrl: any = await getImageFromS3Static(uniqKey);
    if (imageUrl) {
      console.log('imageUrl', imageUrl);
      return imageUrl;
    } else {
      return '';
    }
  };

  useEffect(() => {
    const imageURL = getImageURL(contentObj.fileKey);
    Promise.resolve(imageURL).then((urlStr: string) => setImageUrl(urlStr));
  }, [contentObj]);

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
            <li className="py-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 overflow-hidden">
                  {isImage(contentObj?.fileName) ? (
                    <img src={imageUrl} id={contentObj.id} alt={contentObj.fileName} />
                  ) : (
                    <IconContext.Provider value={{size: '48px', color: 'darkgrey'}}>
                      <AiOutlineFile />
                    </IconContext.Provider>
                  )}
                </div>
                <div className="w-full">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {contentObj?.fileName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{contentObj?.fileName}</p>
                </div>
                <div className="w-auto">
                  <a
                    href="#"
                    className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50">
                    View
                  </a>
                </div>
              </div>
            </li>
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

                {/* CONDITIONAL SHOW OF DELETE AND DELETE CONFIRM BTNS */}
                {subSection !== 'Work' && subSection !== 'Notes' ? (
                  editMode === 'delete' && editID === contentObj.id ? (
                    <>
                      <div
                        className={`${theme.btn.confirm}  w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2`}
                        onClick={() => handleConfirm()}>
                        {anthologyDict[userLanguage].ACTIONS.CONFIRM}
                      </div>
                      <div
                        className={`${theme.btn.cancel}  w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2 ml-2`}
                        onClick={() => handleCancel()}>
                        {anthologyDict[userLanguage].ACTIONS.CANCEL}
                      </div>
                    </>
                  ) : (
                    <div
                      className={`${theme.btn.delete}  w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2 ml-2`}
                      onClick={() => handleDelete()}>
                      {anthologyDict[userLanguage].ACTIONS.DELETE}
                    </div>
                  )
                ) : null}

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

export default SingleUpload;
