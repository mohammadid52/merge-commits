import {sortBy} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import * as queries from '../../../graphql/queries';
import API, {graphqlOperation} from '@aws-amplify/api';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {anthologyDict} from '../../../dictionary/dictionary.iconoclast';
import Buttons from '../../Atoms/Buttons';
import ContentCard from '../../Atoms/ContentCard';
import Loader from '../../Atoms/Loader';
import {getAsset} from '../../../assets';
import Feedbacks from './Feedbacks';

const SingleNote = ({
  subSection,
  idx,
  contentLen,
  handleEditToggle,
  onCancel,
  viewEditMode,
  editModeView,
  viewModeView,
  contentObj,
  allStudentData,
  setAllStudentData,
  allUniversalJournalData,
  setAllUniversalJournalData,
}: any) => {
  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const [showComments, setShowComments] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [fileObject, setFileObject] = useState({});

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

  return (
    <ContentCard hasBackground={false} key={`anthology_${subSection}${idx}`}>
      <div
        id={`anthology_${subSection}${idx}`}
        className={`flex flex-col ${
          idx !== contentLen - 1 && 'border-b-2'
        } border-gray-300 px-6 py-6 p-2`}>
        {viewEditMode &&
        viewEditMode.mode === 'edit' &&
        viewEditMode.dataID === contentObj.id
          ? editModeView(contentObj)
          : viewModeView(contentObj)}
        {/**
         *  section:  VIEW/EDIT BUTTON
         */}
        <div className={`flex pt-2 flex-col  mt-2`}>
          {viewEditMode.mode === 'edit' && viewEditMode.dataID === contentObj.id ? (
            <div className="flex items-center">
              <Buttons
                onClick={() => {
                  handleEditToggle('', '', 0, '');
                  onCancel(contentObj.type);
                }}
                label={anthologyDict[userLanguage].ACTIONS.CANCEL}
                transparent
                btnClass="mr-2"
              />

              <Buttons
                onClick={() =>
                  handleEditToggle('save', contentObj.id, 0, contentObj?.recordID)
                }
                label={anthologyDict[userLanguage].ACTIONS.SAVE}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div
                className={`${theme.btn[themeColor]}  w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2`}
                onClick={() =>
                  handleEditToggle('edit', contentObj.id, 0, contentObj?.recordID)
                }>
                {anthologyDict[userLanguage].ACTIONS.EDIT}
              </div>

              {viewEditMode.mode === 'delete' &&
              viewEditMode.option === 0 &&
              viewEditMode.dataID === contentObj.id ? (
                <div className="w-auto flex items-center justify-between">
                  <div
                    className={`${theme.btn.confirm}  w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2`}
                    onClick={() => handleEditToggle('delete', contentObj.id, 1)}>
                    {anthologyDict[userLanguage].ACTIONS.CONFIRM}
                  </div>
                  <div
                    className={`${theme.btn.cancel}  w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2 ml-2`}
                    onClick={() => handleEditToggle('', '', 0, '')}>
                    {anthologyDict[userLanguage].ACTIONS.CANCEL}
                  </div>
                </div>
              ) : (
                subSection !== 'Work' && (
                  <div
                    className={`${theme.btn.delete}  w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2`}
                    onClick={() => handleEditToggle('delete', contentObj.id, 0)}>
                    {anthologyDict[userLanguage].ACTIONS.DELETE}
                  </div>
                )
              )}

              {/**
               *  section:  FEEDBACK
               */}
              {subSection !== 'Journal' && (
                <div
                  onClick={() => setShowComments(!showComments)}
                  className={`${
                    feedbackData.length > 0 ? theme.btn[themeColor] : 'bg-gray-500'
                  } ${
                    loadingComments ? 'flex items-center justify-between' : ''
                  }  text-white  w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2`}>
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
              )}
            </div>
          )}

          {showComments && (
            <div className="border-t-0 border-gray-200 mt-4">
              <Feedbacks
                key={contentObj.id}
                item={contentObj}
                allUniversalJournalData={allUniversalJournalData}
                setAllUniversalJournalData={setAllUniversalJournalData}
                allStudentData={allStudentData}
                setAllStudentData={setAllStudentData}
                subSection={subSection}
                feedbackData={feedbackData}
                loadingComments={loadingComments}
                showComments={showComments}
                setShowComments={setShowComments}
                fileObject={fileObject}
                setFileObject={setFileObject}
                setFeedbackData={setFeedbackData}
              />
            </div>
          )}
        </div>
      </div>
    </ContentCard>
  );
};

export default SingleNote;
