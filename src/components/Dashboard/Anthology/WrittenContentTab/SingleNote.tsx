import ComponentLoading from 'components/Lesson/Loading/ComponentLoading';
import useGraphqlQuery from 'customHooks/useGraphqlQuery';
import {ListAnthologyCommentsQuery, ListAnthologyCommentsQueryVariables} from 'API';
import {sortBy} from 'lodash';
import React, {Suspense, useEffect, useState} from 'react';
import {getAsset} from 'assets';
import {useGlobalContext} from 'contexts/GlobalContext';
import {anthologyDict} from 'dictionary/dictionary.iconoclast';
import Buttons from 'atoms/Buttons';
import ContentCard from 'atoms/ContentCard';
import Toggle from './../AnthologyContentNote/Toggle';
import Feedbacks from './Feedbacks';

const SingleNote = (props: any) => {
  const {
    idx,
    mainSection,
    subSection,
    contentLen,
    handleEditToggle,
    onCancel,
    viewEditMode,
    editModeView,
    viewModeView,
    contentObj,
    allStudentData,
    setAllStudentData,
    allUniversalJournalData = [],
    setAllUniversalJournalData
  } = props;

  const {theme, clientKey, userLanguage} = useGlobalContext();
  const themeColor = getAsset(clientKey, 'themeClassName');

  const isPrivate = mainSection.toLowerCase() === 'private';

  // ##################################################################### //
  // ########################### FEEDBACK-LOGIC ########################## //
  // ##################################################################### //
  const [showComments, setShowComments] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);

  const [fileObject, setFileObject] = useState({});

  const filter: any = (contentObj?.feedbacks || [])?.map((id: string) => {
    return {
      id: {
        eq: id
      }
    };
  });

  const {data: listCommentData, refetch, isLoading, isFetched} = useGraphqlQuery<
    ListAnthologyCommentsQueryVariables,
    ListAnthologyCommentsQuery['listAnthologyComments']['items']
  >(
    'listAnthologyComments',
    {
      filter: {
        or: [...filter]
      }
    },
    {enabled: showComments}
  ); // why enabled:false? because we don't want to run this query on page load, we want to run it when the user clicks on the feedback button. So we'll run it with filter on click

  const sortComments = () => {
    try {
      if (isFetched && !isLoading && listCommentData) {
        setFeedbackData(sortBy(listCommentData, ['createdAt']));
      }
    } catch (error) {
      console.error('error @listComments: ', error);
    }
  };

  useEffect(() => {
    if (showComments && listCommentData && listCommentData?.length > 0) {
      sortComments();
    }
  }, [showComments, isLoading, isFetched, contentObj.feedbacks, listCommentData]);

  // ##################################################################### //
  // ########################### TOGGLE SHARING ########################## //
  // ##################################################################### //
  const [shareToggleQueue, setShareToggleQueue] = useState<any[]>([]);

  const addToJournalUpdateQueue = (journalObj: any) => {
    setShareToggleQueue([...shareToggleQueue, journalObj]);
  };

  const updateJournalShare = (updatedEntries: any[]) => {
    setShareToggleQueue([]);
    const mergedJournalData = updatedEntries?.reduce(
      (allJournalDataAcc: any[], updatedEntry: any) => {
        return allJournalDataAcc?.map((dataRecord: any) => {
          if (dataRecord) {
            if (dataRecord.id === updatedEntry.id) {
              return {...dataRecord, shared: !dataRecord.shared};
            } else {
              return dataRecord;
            }
          }
        });
      },
      allUniversalJournalData
    );

    setAllUniversalJournalData(mergedJournalData);
  };

  useEffect(() => {
    if (shareToggleQueue?.length > 0) {
      updateJournalShare(shareToggleQueue);
    }
  }, [shareToggleQueue]);

  return (
    <Suspense
      fallback={
        <div className="min-h-56 w-full flex flex-col justify-center items-center">
          <ComponentLoading />
        </div>
      }>
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
                <div className="w-auto flex items-center justify-start">
                  <div
                    className={`${theme.btn[themeColor]}  w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2`}
                    onClick={() =>
                      handleEditToggle('edit', contentObj.id, 0, contentObj?.recordID)
                    }>
                    {anthologyDict[userLanguage].ACTIONS.EDIT}
                  </div>

                  {/* CONDITIONAL SHOW OF DELETE AND DELETE CONFIRM BTNS */}
                  {subSection !== 'Work' && subSection !== 'Notes' ? (
                    viewEditMode.mode === 'delete' &&
                    viewEditMode.option === 0 &&
                    viewEditMode.dataID === contentObj.id ? (
                      <>
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
                      </>
                    ) : (
                      <div
                        className={`${theme.btn.delete}  w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2 ml-2`}
                        onClick={() => handleEditToggle('delete', contentObj.id, 0)}>
                        {anthologyDict[userLanguage].ACTIONS.DELETE}
                      </div>
                    )
                  ) : null}
                  {/* SHOW SHARE TOGGLE ONLY IN JOURNAL */}
                  {mainSection === 'Private' && (
                    <Toggle
                      toggled={contentObj?.shared}
                      label={`Share With Teacher`}
                      allUniversalJournalData={allUniversalJournalData}
                      currentContentObj={contentObj}
                      addToJournalUpdateQueue={addToJournalUpdateQueue}
                    />
                  )}
                </div>

                {/**
                 *  section:  FEEDBACK
                 */}
                {subSection === 'Work' || contentObj?.shared ? (
                  <div
                    onClick={() => {
                      !showComments && refetch();
                      setShowComments(!showComments);
                    }}
                    className={`iconoclast:bg-main curate:bg-main ${
                      isLoading ? 'flex items-center justify-between' : ''
                    }  text-white  w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2`}>
                    <p>
                      {isLoading
                        ? 'Loading Comments . . .'
                        : `${showComments ? 'Hide' : 'Show'} Feedback`}
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

            {!isLoading && isFetched && showComments && (
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
                  loadingComments={isLoading}
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
    </Suspense>
  );
};

export default SingleNote;
