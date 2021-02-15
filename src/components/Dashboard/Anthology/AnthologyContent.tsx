import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import ContentCard from '../../Atoms/ContentCard';
import { AnthologyMapItem, ViewEditMode } from './Anthology';
import FormInput from '../../Atoms/Form/FormInput';
import TextArea from '../../Atoms/Form/TextArea';

interface ContentCardProps {
  viewEditMode: ViewEditMode;
  handleEditToggle: (editMode: string, studentDataID: string) => void;
  handleEditUpdate: (e: React.ChangeEvent) => void;
  subSection: string;
  createTemplate: any;
  content?: any
}

const AnthologyContent = (props: ContentCardProps) => {
  const { viewEditMode, handleEditToggle, handleEditUpdate, subSection, createTemplate, content } = props;
  const { theme } = useContext(GlobalContext);

  const viewModeView = (contentObj: AnthologyMapItem) => (
    <>
      {/**
       *  section: TOP INFO
       */}
      <div className={`flex`}>
        <p className={`text-left ${theme.lessonCard.subtitle}`}>Lesson: Lesson Title</p>
        <p className={`text-right ${theme.lessonCard.subtitle}`}>{contentObj.updatedAt}</p>
      </div>
      {/**
       *  section: TITLE
       */}
      <div className={``}>
        <h4
          className={`w-auto ${theme.lessonCard.title}`}>{contentObj.title ? contentObj.title : `No title`}</h4>
        <p
          className={`text-left ${theme.lessonCard.subtitle}`}>{contentObj.subTitle ? contentObj.subTitle : `No subtitle`}</p>
      </div>
      {/**
       *  section: DESCRIPTION
       */}
      <div className={`h-12 overflow-ellipsis overflow-hidden ellipsis`}>
        {contentObj.description ?
          contentObj.description :
          `No description`}
      </div>
      {/**
       *  section:  CONTENT
       */}
    </>);

  const editModeView = (contentObj: AnthologyMapItem) => (
    <>
      {/**
       *  section: TOP INFO
       */}
      <div className={`flex`}>
        <p className={`text-left ${theme.lessonCard.subtitle}`}>Lesson: Lesson Title</p>
        <p className={`text-right ${theme.lessonCard.subtitle}`}>{contentObj.updatedAt}</p>
      </div>
      {/**
       *  section: TITLE
       */}
      <div className={``}>
        <FormInput
          id={`title_${contentObj.type}_${contentObj.studentDataID}`}
          onChange={handleEditUpdate}
          value={contentObj.title}
          placeHolder={contentObj.title ? contentObj.title : `Please add title...`}
        />
        <FormInput
          id={`subTitle_${contentObj.type}_${contentObj.studentDataID}`}
          onChange={handleEditUpdate}
          value={contentObj.subTitle}
          placeHolder={contentObj.subTitle ? contentObj.subTitle : `Please add subtitle...`}
        />
      </div>
      {/**
       *  section: DESCRIPTION
       */}
      <div className={`h-12 overflow-ellipsis overflow-hidden ellipsis`}>
        <FormInput
          id={`description_${contentObj.type}_${contentObj.studentDataID}`}
          onChange={handleEditUpdate}
          value={contentObj.description}
          placeHolder={contentObj.description ? contentObj.description : `Please add description...`}
        />
      </div>
      {/**
       *  section:  CONTENT
       */}
      <div>
        <TextArea
          id={`content_${contentObj.type}_${contentObj.studentDataID}`}
          onChange={handleEditUpdate}
          value={contentObj.content}
          placeHolder={contentObj.content ? contentObj.content : `Please add content...`}
        />
      </div>
    </>
  );

  const createModeView = (contentObj: AnthologyMapItem) => (
    <>
      {/**
       *  section: TOP INFO
       */}
      <div className={`flex`}>
        <p className={`text-left ${theme.lessonCard.subtitle}`}>This is a new Anthology entry</p>
      </div>
      {/**
       *  section: TITLE
       */}
      <div className={``}>
        <FormInput
          id={`title_${contentObj.type}_${contentObj.studentDataID}`}
          onChange={handleEditUpdate}
          value={contentObj.title}
          placeHolder={contentObj.title ? contentObj.title : `Please add title...`}
        />
        <FormInput
          id={`subTitle_${contentObj.type}_${contentObj.studentDataID}`}
          onChange={handleEditUpdate}
          value={contentObj.subTitle}
          placeHolder={contentObj.subTitle ? contentObj.subTitle : `Please add subtitle...`}
        />
      </div>
      {/**
       *  section: DESCRIPTION
       */}
      <div className={`h-12 overflow-ellipsis overflow-hidden ellipsis`}>
        <FormInput
          id={`description_${contentObj.type}_${contentObj.studentDataID}`}
          onChange={handleEditUpdate}
          value={contentObj.description}
          placeHolder={contentObj.description ? contentObj.description : `Please add description...`}
        />
      </div>
      {/**
       *  section:  CONTENT
       */}
      <div>
        <TextArea
          id={`content_${contentObj.type}_${contentObj.studentDataID}`}
          onChange={handleEditUpdate}
          value={contentObj.content}
          placeHolder={contentObj.content ? contentObj.content : `Please add content...`}
        />
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
            <div className={`flex`}>
              <p onClick={() => handleEditToggle('create', createTemplate.syllabusLessonID)}
                 className={`w-auto mr-2 cursor-pointer font-semibold text-blueberry`}>Create New Entry</p>
              <span className={`w-auto`}>/</span>
              <p onClick={() => handleEditToggle('savenew', createTemplate.syllabusLessonID)}
                 className={`w-auto mx-2 cursor-pointer font-semibold text-blueberry`}>Save New</p>
            </div>
          </div>
        </ContentCard>
      }
      {
        content.length > 0 ?
          (content.map((contentObj: AnthologyMapItem, idx: number) => {
              return (
                <ContentCard key={`anthology_${subSection}${idx}`}>
                  <div id={contentObj.studentDataID} className={`flex flex-col p-2`}>
                    {
                      viewEditMode && viewEditMode.mode === 'edit' && viewEditMode.studentDataID === contentObj.studentDataID ?
                        editModeView(contentObj) :
                        viewModeView(contentObj)

                    }
                    {/**
                     *  section:  VIEW/EDIT BUTTON
                     */}
                    <div className={`flex`}>
                      <p onClick={() => handleEditToggle('view', contentObj.studentDataID)}
                         className={`w-auto mr-2 cursor-pointer font-semibold text-blueberry`}>View</p>
                      <p onClick={() => handleEditToggle('edit', contentObj.studentDataID)}
                         className={`w-auto mx-2 cursor-pointer font-semibold text-blueberry`}>Edit</p>
                      <span className={`w-auto`}>/</span>
                      <p onClick={() => handleEditToggle('save', contentObj.studentDataID)}
                         className={`w-auto mx-2 cursor-pointer font-semibold text-blueberry`}>Save</p>
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
