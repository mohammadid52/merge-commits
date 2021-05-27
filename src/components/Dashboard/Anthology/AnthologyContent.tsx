import React, {useState, useContext, useEffect} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import ContentCard from '../../Atoms/ContentCard';
import {AnthologyMapItem, ViewEditMode} from './Anthology';
import FormInput from '../../Atoms/Form/FormInput';
import TextArea from '../../Atoms/Form/TextArea';
import {dateFromServer} from '../../../utilities/time';
import useDictionary from '../../../customHooks/dictionary';
import RichTextEditor from '../../Atoms/RichTextEditor';
import Buttons from '../../Atoms/Buttons';
import {getImageFromS3} from '../../../utilities/services';
import {BiCloudDownload} from 'react-icons/bi';
import {initials, stringToHslColor} from '../../../utilities/strings';
import Modal from '../../Atoms/Modal';
import Loader from '../../Atoms/Loader';

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
        content.map((contentObj: AnthologyMapItem, idx: number) => {
          return (
            <ContentCard hasBackground={false} key={`anthology_${subSection}${idx}`}>
              <div
                id={`anthology_${subSection}${idx}`}
                className={`flex flex-col ${
                  idx !== content.length - 1 && 'border-b-0'
                } border-gray-200 px-6 py-6 p-2`}>
                {viewEditMode &&
                viewEditMode.mode === 'edit' &&
                viewEditMode.studentDataID === contentObj.studentDataID &&
                viewEditMode.idx === getContentObjIndex(contentObj)
                  ? editModeView(contentObj)
                  : viewModeView(contentObj)}
                {/**
                 *  section:  VIEW/EDIT BUTTON
                 */}
                <div className={`flex pt-2 pb-6  mt-2`}>
                  {viewEditMode.mode === 'edit' &&
                  viewEditMode.studentDataID === contentObj.studentDataID &&
                  viewEditMode.idx === getContentObjIndex(contentObj) ? (
                    <Buttons
                      onClick={() => {
                        handleEditToggle('', '', 0);
                        // onCancel(contentObj.type);
                      }}
                      label={anthologyDict[userLanguage].ACTIONS.CANCEL}
                      transparent
                      btnClass="mr-2"
                    />
                  ) : (
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
                  )}
                  {viewEditMode.mode === 'edit' &&
                  viewEditMode.studentDataID === contentObj.studentDataID &&
                  viewEditMode.idx === getContentObjIndex(contentObj) ? (
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
                  ) : null}
                </div>
              </div>
            </ContentCard>
          );
        })
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
