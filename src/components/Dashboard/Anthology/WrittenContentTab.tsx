import filter from 'lodash/filter';
import map from 'lodash/map';
import React from 'react';
import {IconContext} from 'react-icons';
import {FaSpinner} from 'react-icons/fa';
import {getAsset} from '../../../assets';
import {useGlobalContext} from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';
import {UniversalJournalData} from '../../../interfaces/UniversalLessonInterfaces';
import {dateFromServer} from '../../../utilities/time';
import Buttons from '../../Atoms/Buttons';
import ContentCard from '../../Atoms/ContentCard';
import FormInput from '../../Atoms/Form/FormInput';
import RichTextEditor from '../../Atoms/RichTextEditor';
import EmptyViewWrapper from './EmptyViewWrapper';
import {ITabViewProps} from './TabView';
import SingleNote from './WrittenContentTab/SingleNote';

const WrittenContentTab = (props: ITabViewProps) => {
  const {
    viewEditMode,
    handleEditToggle,
    handleEditUpdate,
    updateJournalContent,
    onCancel,
    mainSection,
    subSection,
    createTemplate,
    currentContentObj,
    content,
    allStudentData,
    setAllStudentData,
    classNotebook,
    allUniversalJournalData,
    setAllUniversalJournalData,
    allUniversalClassData,
    setAllUniversalClassData
  } = props;

  const {theme, userLanguage, clientKey} = useGlobalContext();
  const {anthologyDict} = useDictionary(clientKey);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const handleInputFieldUpdate = (e: any) => {
    const {value} = e.target;
    updateJournalContent(value, 'header');
  };

  // ##################################################################### //
  // ############################### VIEWS ############################### //
  // ##################################################################### //
  const viewModeView = (contentObj: UniversalJournalData) => {
    const notesExist = contentObj.entryData[0].domID.includes('notes_form');
    const filtered = filter(
      contentObj?.entryData,
      (ed) => ed && ed.type.includes('content')
    );

    const organized = contentObj.entryData.reduce(
      (acc: {header: any; content: any}, entry: any) => {
        if (entry.type === 'header') {
          return {...acc, header: entry};
        } else if (entry.type === 'content') {
          return {...acc, content: entry};
        } else {
          return acc;
        }
      },
      {
        header: {type: '', domID: '', input: ''},
        content: {type: '', domID: '', input: ''}
      }
    );

    return (
      <>
        <div className={`flex justify-end px-4`}>
          <p className={`w-auto text-right italic ${theme.lessonCard.subtitle}`}>
            Updated: {dateFromServer(contentObj?.updatedAt)}
          </p>
        </div>
        <>
          {viewEditMode.mode === 'create' &&
            viewEditMode.dataID === createTemplate.syllabusLessonID && (
              <div
                style={{height: '0.05rem'}}
                className={'mx-auto px-8 border-t-0 my-2 border-gray-200'}
              />
            )}
          <div className="border-gray-200">
            <h4 className={`mb-2 w-auto font-medium ${theme.lessonCard.title}`}>
              {organized.header?.input ? organized.header.input : `No title`}
            </h4>
            <div className={`overflow-ellipsis overflow-hidden ellipsis`}>
              {notesExist ? (
                <div className="space-y-4">
                  {map(filtered, (note) => (
                    <div
                      key={note.domID}
                      className="font-normal "
                      dangerouslySetInnerHTML={{
                        __html: note?.input ? note.input : 'No content...'
                      }}
                    />
                  ))}
                </div>
              ) : contentObj ? (
                <div
                  className="font-normal"
                  dangerouslySetInnerHTML={{
                    __html: organized.content?.input
                      ? organized.content.input
                      : 'No content...'
                  }}
                />
              ) : (
                `No content`
              )}
            </div>
          </div>
        </>
      </>
    );
  };

  const createModeView = (contentObj: UniversalJournalData) => {
    const organized = contentObj.entryData.reduce(
      (acc: {header: any; content: any}, entry: any) => {
        if (entry.type === 'header') {
          return {...acc, header: entry};
        } else if (entry.type === 'content') {
          return {...acc, content: entry};
        } else {
          return acc;
        }
      },
      {
        header: {type: '', domID: '', input: ''},
        content: {type: '', domID: '', input: ''}
      }
    );

    return (
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
            id={organized.header.domID}
            label={`Title`}
            onChange={handleInputFieldUpdate}
            value={organized.header.input}
            placeHolder={
              organized.header?.input ? organized.header.input : `Please add title...`
            }
          />
        </div>
        {/**
         *  section:  CONTENT
         */}
        <div className={`mt-2 mb-2`}>
          <RichTextEditor
            initialValue={organized.content.input}
            onChange={(htmlContent) => updateJournalContent(htmlContent, 'content')}
          />
        </div>
      </>
    );
  };

  const editModeView = (contentObj: UniversalJournalData) => {
    const notesExist = contentObj.entryData[0].domID.includes('notes_form');
    const filtered = filter(
      contentObj?.entryData,
      (ed) => ed && ed.type.includes('content')
    );

    const organized = contentObj.entryData.reduce(
      (acc: {header: any; content: any}, entry: any) => {
        if (entry.type === 'header') {
          return {...acc, header: entry};
        } else if (entry.type === 'content') {
          return {...acc, content: entry};
        } else {
          return acc;
        }
      },
      {
        header: {type: '', domID: '', input: ''},
        content: {type: '', domID: '', input: ''}
      }
    );

    return (
      <>
        <div className={`flex px-4`}>
          <p className={`text-right italic ${theme.lessonCard.subtitle}`}>
            Updated: {dateFromServer(contentObj?.updatedAt)}
          </p>
        </div>
        <div className={`mb-2`}>
          {notesExist ? (
            <FormInput
              id={contentObj.entryData[0].domID}
              label={`Title`}
              onChange={handleInputFieldUpdate}
              value={contentObj.entryData[0].input}
              placeHolder={
                contentObj.entryData[0].input
                  ? contentObj.entryData[0].input
                  : `Please add title...`
              }
            />
          ) : (
            <FormInput
              id={organized.header.domID}
              label={`Title`}
              onChange={handleInputFieldUpdate}
              value={organized.header.input}
              placeHolder={
                organized.header.input ? organized.header.input : `Please add title...`
              }
            />
          )}
        </div>

        <div className={`mt-2 mb-2`}>
          {notesExist ? (
            <div>
              {map(filtered, (note, idx) => (
                <RichTextEditor
                  key={idx}
                  initialValue={note.input}
                  onChange={(htmlContent) =>
                    updateJournalContent(htmlContent, 'content', idx + 1)
                  }
                />
              ))}
            </div>
          ) : (
            <RichTextEditor
              initialValue={organized.content.input}
              onChange={(htmlContent) => updateJournalContent(htmlContent, 'content')}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      {viewEditMode.mode === 'create' && viewEditMode.dataID === createTemplate.id && (
        <ContentCard hasBackground={false}>
          <div id={`anthology_${subSection}_create`} className={`flex flex-col px-6 p-2`}>
            {viewEditMode && viewEditMode.mode === 'create'
              ? createModeView(createTemplate)
              : null}
            <div className={`flex ${viewEditMode.mode === 'create' ? 'pt-2 mt-2' : ''}`}>
              {viewEditMode.mode === 'create' &&
              viewEditMode.dataID === createTemplate.id ? (
                <Buttons
                  onClick={() => handleEditToggle('', '', 0, '')}
                  label={anthologyDict[userLanguage].ACTIONS.CANCEL}
                  transparent
                  btnClass="mr-2"
                />
              ) : null}
              {viewEditMode.mode === 'create' &&
              viewEditMode.dataID === createTemplate.id ? (
                <Buttons
                  onClick={() => handleEditToggle('savenew', '')}
                  label={anthologyDict[userLanguage].ACTIONS.SAVE}
                />
              ) : null}
            </div>
          </div>
        </ContentCard>
      )}
      {content.length > 0 ? (
        content.map((contentObj: UniversalJournalData, idx: number) => {
          console.log(
            '🚀 ~ file: WrittenContentTab.tsx ~ line 294 ~ content.map ~ contentObj',
            contentObj
          );
          return (
            <EmptyViewWrapper
              key={`emptyview_${idx}`}
              wrapperClass={`h-auto pb-4 overflow-hidden bg-white rounded-b-lg shadow mb-4`}
              timedRevealInt={idx + 1}
              fallbackContents={
                <IconContext.Provider
                  value={{
                    size: '1.2rem',
                    style: {},
                    className: `relative mr-4 animate-spin ${theme.textColor[themeColor]}`
                  }}>
                  <FaSpinner />
                </IconContext.Provider>
              }>
              <SingleNote
                idx={idx}
                mainSection={mainSection}
                subSection={subSection}
                onCancel={onCancel}
                viewModeView={viewModeView}
                editModeView={editModeView}
                viewEditMode={viewEditMode}
                handleEditToggle={handleEditToggle}
                contentLen={content.length}
                contentObj={
                  currentContentObj.id === contentObj.id ? currentContentObj : contentObj
                }
                allUniversalJournalData={allUniversalJournalData}
                setAllUniversalJournalData={setAllUniversalJournalData}
                allUniversalClassData={allUniversalClassData}
                setAllUniversalClassData={setAllUniversalClassData}
                allStudentData={allStudentData}
                setAllStudentData={setAllStudentData}
              />
            </EmptyViewWrapper>
          );
        })
      ) : (
        <>
          {subSection === 'Work' && allUniversalClassData.length > 0 ? (
            <div className="work">
              {allUniversalClassData.map((first: any) =>
                first.pageData.map((three: any) => {
                  return (
                    <div
                      dangerouslySetInnerHTML={{__html: three.input || '<p></p>'}}></div>
                  );
                })
              )}
            </div>
          ) : (
            subSection === 'Notes' &&
            classNotebook.length > 0 && (
              <div className="note">
                {classNotebook.map((element: any) =>
                  element.pageData.map((second: any) => {
                    return (
                      <div dangerouslySetInnerHTML={{__html: second.input || '<p></p>'}}>
                        {/* {second.input ? ReactHtmlParser(second.input) : '<p></p>'} */}
                      </div>
                    );
                  })
                )}
              </div>
            )
          )}

          {allUniversalClassData.length === 0 && classNotebook.length === 0 && (
            <div className="p-12 flex flex-center items-center">
              <p className="text-center text-lg text-gray-500">
                No content for {subSection} section
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default React.memo(WrittenContentTab);
