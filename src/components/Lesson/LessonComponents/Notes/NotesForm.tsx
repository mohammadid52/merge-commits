import React, {useContext, useState} from 'react';
import RichTextEditor from '../../../Atoms/RichTextEditor';
import {FloatingSideMenuProps} from '../../../Dashboard/FloatingSideMenu/FloatingSideMenu';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {getAsset} from '../../../../assets';
import {nanoid} from 'nanoid';
import {Auth} from '@aws-amplify/auth';
import {useParams} from 'react-router-dom';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as queries from '../../../../graphql/queries';
import * as mutations from '../../../../graphql/mutations';
import {useEffect} from 'react';

const NotesForm = (props: FloatingSideMenuProps) => {
  const {focusSection, saveInProgress, setSaveInProgress} = props;
  const {lessonState, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const urlParams: any = useParams();

  // ##################################################################### //
  // ############################## STORAGE ############################## //
  // ##################################################################### //
  const [notesData, setNotesData] = useState<{
    id: string;
    studentID: string;
    studentAuthID: string;
    studentEmail: string;
    type: 'class-note';
    feedbacks: string[];
    entryData: {domID: string; type: string; input: string}[];
  }>({
    id: '',
    studentID: '',
    studentAuthID: '',
    studentEmail: '',
    type: 'class-note',
    feedbacks: [''],
    entryData: [
      {
        domID: `title_${nanoid(4)}`,
        type: 'header',
        input: 'Default Title',
      },
      {
        domID: `note_${nanoid(4)}`,
        type: 'content',
        input: '<p>Enter notes here...</p>',
      },
    ],
  });

  // ##################################################################### //
  // ########################### GET OR CREATE ########################### //
  // ##################################################################### //
  const [initialized, setInitialized] = useState<boolean>(false);

  const getOrCreateJournalData = async () => {
    const {lessonID} = urlParams;
    const user = await Auth.currentAuthenticatedUser();
    const studentAuthId = user.username;

    try {
      const listFilter = {
        filter: {
          studentAuthID: {eq: studentAuthId},
          lessonID: {eq: lessonID},
          type: {eq: 'class-note'},
        },
      };

      const notesData: any = await API.graphql(
        graphqlOperation(queries.listUniversalJournalDatas, listFilter)
      );
      const notesDataRows = notesData.data.listUniversalJournalDatas.items;

      if (notesDataRows?.length === 0) {
        const newJournalEntry = await createJournalData();
      } else {
        const existJournalEntry = notesDataRows[0];
        // setNotesData()
      }
      console.log('notes data - ', notesData);
    } catch (e) {
      console.error('error getting or creating journal data - ', e);
    } finally {
      console.log('getOrCreateJournalData init');
      setInitialized(true);
    }
  };

  const createJournalData = async () => {
    const {lessonID} = urlParams;
    const user = await Auth.currentAuthenticatedUser();
    const studentAuthId = user.username;
    const email = user.attributes.email;

    try {
      const input = {
        studentID: studentAuthId,
        studentAuthID: studentAuthId,
        studentEmail: email,
        type: 'class-note',
        entryData: notesData.entryData,
      };

      const returnedData = '';
      return returnedData;
    } catch (e) {
      console.error('error creating journal data - ', e);
    }
  };

  useEffect(() => {
    // getOrCreateJournalData();
    setSaveInProgress(true);
    setTimeout(() => {
      setSaveInProgress(false);
    }, 2000);
  }, []);

  // ##################################################################### //
  // ###################### UPDATE NOTES AND EDITOR ###################### //
  // ##################################################################### //

  const updateNotesContent = (html: string) => {
    const updatedNotesData = {
      ...notesData,
      entryData: notesData.entryData.map((entryObj: any) => {
        if (entryObj.type === 'content') {
          return {...entryObj, input: html};
        } else {
          return entryObj;
        }
      }),
    };
    setNotesData(updatedNotesData);
  };

  const noteContent = notesData?.entryData.find(
    (noteEntryData: any) => noteEntryData.type === 'content'
  ).input;

  return (
    <div
      className={`
        transform transition duration-400 ease-in-out
        ${
          focusSection === 'Notes'
            ? 'w-full h-full mb-12 opacity-100'
            : 'w-0 overflow-hidden opacity-0'
        }
      `}>
      <RichTextEditor
        theme={themeColor}
        rounded
        customStyle
        mediumDark={true}
        initialValue={noteContent}
        onChange={
          initialized ? (htmlContent) => updateNotesContent(htmlContent) : () => {}
        }
        fullWHOverride={true}
      />
    </div>
  );
};

export default NotesForm;
