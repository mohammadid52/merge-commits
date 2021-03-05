import React, { useState, useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import ContentCard from '../../Atoms/ContentCard';
import { AnthologyMapItem, ViewEditMode } from './Anthology';
import FormInput from '../../Atoms/Form/FormInput';
import TextArea from '../../Atoms/Form/TextArea';
import { dateFromServer } from '../../../utilities/time';
import useDictionary from '../../../customHooks/dictionary';
import RichTextEditor from '../../Atoms/RichTextEditor';

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
  const { state, theme, userLanguage, clientKey } = useContext(GlobalContext);
  const { anthologyDict } = useDictionary(clientKey);
  const [notesData, setNotesData] = useState<{ key: string, value: string }>({ key: '', value: '' });

  const setEditorContent = (html: string, text: string, idKey: string) => {
    setNotesData({
      key: idKey,
      value: html,
    });
    handleWYSIWYGupdate(idKey, html);
  };

  const viewModeView = (contentObj: AnthologyMapItem) => (
    <>
      {/**
       *  section: TOP INFO
       */}
      <div className={`flex pb-2 mb-2 border-b ${theme.lessonCard.border}`}>
        {/*<p className={`text-left ${theme.lessonCard.subtitle}`}>Lesson: -</p>*/}
        <p className={`text-right ${theme.lessonCard.subtitle}`}>Updated: {dateFromServer(contentObj.updatedAt)}</p>
      </div>
      {/**
       *  section: TITLE
       */}
      <div className={``}>
        <h4
          className={`mb-2 w-auto ${theme.lessonCard.title}`}>{contentObj.title ? contentObj.title : `No title`}</h4>
        {/*<p className={`text-left ${theme.lessonCard.subtitle}`}>{contentObj.subTitle ? contentObj.subTitle : `No subtitle`}</p>*/}
      </div>
      {/**
       *  section: DESCRIPTION
       */}
      {/*<div className={`overflow-ellipsis overflow-hidden ellipsis`}>
        {contentObj.description ?
          contentObj.description :
          `No description`}
      </div>*/}
      {/**
       *  section:  CONTENT
       */}
      <div className={`p-3 border-l overflow-ellipsis overflow-hidden ellipsis`}>
        {contentObj.content ?
          <p dangerouslySetInnerHTML={{ __html: contentObj.content }} /> :
          `No content`}
      </div>
    </>);

  const editModeView = (contentObj: AnthologyMapItem) => (
    <>
      {/**
       *  section: TOP INFO
       */}
      <div className={`flex pb-2 mb-2 border-b ${theme.lessonCard.border}`}>
        {/*<p className={`text-left ${theme.lessonCard.subtitle}`}>Lesson: -</p>*/}
        <p className={`text-right ${theme.lessonCard.subtitle}`}>Updated: {dateFromServer(contentObj.updatedAt)}</p>
      </div>
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
      <div className={`mt-2 `}>
        {/*  <FormInput
          id={`subTitle_${contentObj.type}_${contentObj.studentDataID}`}
          label={`Subtitle`}
          onChange={handleEditUpdate}
          value={contentObj.subTitle}
          placeHolder={contentObj.subTitle ? contentObj.subTitle : `Please add subtitle...`}
        />*/}
      </div>
      {/**
       *  section: DESCRIPTION
       */}
      <div className={`mt-2 overflow-ellipsis overflow-hidden ellipsis`}>
       {/* <FormInput
          id={`description_${contentObj.type}_${contentObj.studentDataID}`}
          label={`Description`}
          onChange={handleEditUpdate}
          value={contentObj.description}
          placeHolder={contentObj.description ? contentObj.description : `Please add description...`}
        />*/}
      </div>
      {/**
       *  section:  CONTENT
       */}
      <div className={`mt-2 mb-2`}>
        {/*<TextArea
          id={`content_${contentObj.type}_${contentObj.studentDataID}`}
          label={`Content`}
          onChange={handleEditUpdate}
          value={contentObj.content}
          placeHolder={contentObj.content ? contentObj.content : `Please add content...`}
        />*/}
        <RichTextEditor initialValue={contentObj.content}
                        onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, `content_${contentObj.type}_${contentObj.studentDataID}`)} />
      </div>
    </>
  );

  const createModeView = (contentObj: AnthologyMapItem) => (
    <>
      {/**
       *  section: TOP INFO
       */}
      <div className={`flex pb-2 mb-2 border-b ${theme.lessonCard.border}`}>
        <p className={`text-left ${theme.lessonCard.subtitle}`}>This is a new entry</p>
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
      <div className={`mt-2 `}>
        {/*   <FormInput
          id={`subTitle_${contentObj.type}_${contentObj.studentDataID}`}
          label={`Subtitle`}
          onChange={handleEditUpdate}
          value={contentObj.subTitle}
          placeHolder={contentObj.subTitle ? contentObj.subTitle : `Please add subtitle...`}
        />*/}
      </div>
      {/**
       *  section: DESCRIPTION
       */}
      <div className={`mt-2 overflow-ellipsis overflow-hidden ellipsis`}>
      {/*  <FormInput
          id={`description_${contentObj.type}_${contentObj.studentDataID}`}
          label={`Description`}
          onChange={handleEditUpdate}
          value={contentObj.description}
          placeHolder={contentObj.description ? contentObj.description : `Please add description...`}
        />*/}
      </div>
      {/**
       *  section:  CONTENT
       */}
      <div className={`mt-2 mb-2`}>
        <RichTextEditor initialValue={contentObj.content}
                        onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, `content_${contentObj.type}_${contentObj.studentDataID}`)} />
      </div>
    </>)
  ;

  return (
    <>
      {
        <ContentCard>
          <div id={`anthology_${subSection}_create`} className={`flex flex-col p-2`}>
            {
              viewEditMode && viewEditMode.mode === 'create' ?
                createModeView(createTemplate) :
                null
            }
            <div className={`flex ${(viewEditMode.mode === 'create') ? 'pt-2 mt-2' : ''}`}>
              {
                viewEditMode.mode === 'create' && viewEditMode.studentDataID === createTemplate.syllabusLessonID ?
                  (
                    <p onClick={() => handleEditToggle('', '', 0)}
                       className={`w-auto mr-2 cursor-pointer font-semibold text-blueberry`}>{anthologyDict[userLanguage].ACTIONS.CANCEL}</p>
                  ) :
                  (
                    <p onClick={() => handleEditToggle('create', createTemplate.syllabusLessonID, 0)}
                       className={`w-auto mr-2 cursor-pointer font-semibold text-blueberry`}>{anthologyDict[userLanguage].ACTIONS.CREATE}</p>
                  )
              }
              {
                viewEditMode.mode === 'create' && viewEditMode.studentDataID === createTemplate.syllabusLessonID ?
                  (
                    <>
                      <span className={`w-auto mr-2`}>/</span>
                      <p onClick={() => handleEditToggle('savenew', `custom_${subSection}`, 0)}
                         className={`w-auto cursor-pointer font-semibold text-blueberry`}>{anthologyDict[userLanguage].ACTIONS.SAVE}</p>
                    </>
                  ) :
                  null
              }
            </div>
          </div>
        </ContentCard>
      }
      {
        content.length > 0 ?
          (content.map((contentObj: AnthologyMapItem, idx: number) => {
              return (
                <ContentCard key={`anthology_${subSection}${idx}`}>
                  <div id={`anthology_${subSection}${idx}`} className={`flex flex-col p-2`}>
                    {
                      viewEditMode && viewEditMode.mode === 'edit' && viewEditMode.studentDataID === contentObj.studentDataID && viewEditMode.idx === getContentObjIndex(contentObj) ? editModeView(contentObj) :
                        viewModeView(contentObj)

                    }
                    {/**
                     *  section:  VIEW/EDIT BUTTON
                     */}
                    <div className={`flex pt-2 mt-2`}>
                      {
                        viewEditMode.mode === 'edit' && viewEditMode.studentDataID === contentObj.studentDataID && viewEditMode.idx === getContentObjIndex(contentObj) ?
                          (
                            <p onClick={() => handleEditToggle('', '', 0)}
                               className={`w-auto mr-2 cursor-pointer font-semibold text-blueberry`}>{anthologyDict[userLanguage].ACTIONS.CANCEL}</p>
                          ) :
                          (
                            <p
                              onClick={() => handleEditToggle('edit', contentObj.studentDataID, getContentObjIndex(contentObj))}
                              className={`w-auto cursor-pointer font-semibold text-blueberry`}>{anthologyDict[userLanguage].ACTIONS.EDIT}</p>
                          )
                      }
                      {
                        viewEditMode.mode === 'edit' && viewEditMode.studentDataID === contentObj.studentDataID && viewEditMode.idx === getContentObjIndex(contentObj) ?
                          (
                            <>
                              <span className={`w-auto mr-2`}>/</span>
                              <p
                                onClick={() => handleEditToggle('save', contentObj.studentDataID, getContentObjIndex(contentObj))}
                                className={`w-auto cursor-pointer font-semibold text-blueberry`}>{anthologyDict[userLanguage].ACTIONS.SAVE}</p>
                            </>
                          ) :
                          null
                      }
                    </div>
                  </div>
                </ContentCard>
              );
            })
          ) : (
            <ContentCard>
              No content for this section :(
            </ContentCard>
          )
      }
    </>);
};


export default AnthologyContent;
