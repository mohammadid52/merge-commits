import React, {useState, useContext} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import ContentCard from '../../Atoms/ContentCard';
import {AnthologyMapItem, ViewEditMode} from './Anthology';
import FormInput from '../../Atoms/Form/FormInput';
import TextArea from '../../Atoms/Form/TextArea';
import {dateFromServer} from '../../../utilities/time';
import useDictionary from '../../../customHooks/dictionary';
import RichTextEditor from '../../Atoms/RichTextEditor';
import Buttons from '../../Atoms/Buttons';

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
                className={`flex flex-col px-6 py-6 p-2`}>
                {viewEditMode &&
                viewEditMode.mode === 'edit' &&
                viewEditMode.studentDataID === contentObj.studentDataID &&
                viewEditMode.idx === getContentObjIndex(contentObj)
                  ? editModeView(contentObj)
                  : viewModeView(contentObj)}
                {/**
                 *  section:  VIEW/EDIT BUTTON
                 */}
                <div className={`flex pt-2 pb-6 border-b-0 border-gray-200 mt-2`}>
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
