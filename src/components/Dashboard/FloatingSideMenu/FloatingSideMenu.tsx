import API, {graphqlOperation} from '@aws-amplify/api';
import {Auth} from '@aws-amplify/auth';
import {findIndex} from 'lodash';
import {nanoid} from 'nanoid';
import React, {SetStateAction, useContext, useState} from 'react';
import {useParams} from 'react-router-dom';
import {GlobalContext} from '../../../contexts/GlobalContext';
import useDeviceDetect from '../../../customHooks/deviceDetect';
import * as mutations from '../../../graphql/mutations';
import * as queries from '../../../graphql/queries';
import {UniversalJournalData} from '../../../interfaces/UniversalLessonInterfaces';
import {getLocalStorageData} from '../../../utilities/localStorage';
import ExpandedMenu from './ExpandedMenu';
import {FloatingBar} from './FloatingBar';

export interface FloatingSideMenuProps {
  menuState?: number;
  setMenuState?: (level: number, section: string) => void;
  focusSection?: string;
  setFocusSection?: any;
  chatroom?: any;
  setChatroom?: React.Dispatch<React.SetStateAction<any>>;
  setOverlay?: React.Dispatch<SetStateAction<string>>;
  overlay?: string;
  callback?: any;
  callbackArg?: any;
  saveInProgress?: boolean;
  setSaveInProgress?: any;
  notesData?: UniversalJournalData;
  notesInitialized?: boolean;
  setNotesInitialized?: React.Dispatch<SetStateAction<boolean>>;
  getOrCreateJournalData?: () => void;
  updateNotesContent?: (html: string) => void;
}

const INITIAL_NOTESDATA: UniversalJournalData = {
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
};

const FloatingSideMenu = () => {
  const {lessonState} = useContext(GlobalContext);
  const getRoomData = getLocalStorageData('room_info');
  const {browser} = useDeviceDetect();
  const urlParams: any = useParams();
  const scrollbarMarginRight = browser.includes('Firefox') ? 'mr-4' : 'mr-3';

  // ##################################################################### //
  // ########################## MENU OPEN LEVEL ########################## //
  // ##################################################################### //
  const [menuOpenLevel, setMenuOpenLevel] = useState<number>(0);
  const setMenuState = (level: number, section: string) => {
    if (level === -1 && section === 'reset') {
      if (menuOpenLevel > 0) {
        if (focusSection === 'Chatroom') {
          setMenuOpenLevel(menuOpenLevel - 1);
          setFocusSection('Chat');
          setChatroom({});
        } else {
          setMenuOpenLevel(0);
          setFocusSection('');
        }
      }
    } else {
      if (section === focusSection) {
        if (level !== menuOpenLevel) {
          setMenuOpenLevel(level);
        } else {
          setMenuOpenLevel(0);
        }
      } else {
        setFocusSection(section);
        if (level !== menuOpenLevel) {
          setMenuOpenLevel(level);
        }
      }
    }
  };

  const handleSetMenuState = async (level: number, section: string) => {
    if (notesChanged) {
      if (!saveInProgress) setSaveInProgress(true);
      await updateJournalData();
      setMenuState(level, section);
    } else {
      if (saveInProgress) setSaveInProgress(false);
      setMenuState(level, section);
    }
  };

  // ##################################################################### //
  // ########################### FOCUS SECTION ########################### //
  // ##################################################################### //
  // Remember last opened section e.g. chat
  const [focusSection, setFocusSection] = useState<string>('');
  const handleSetFocusSection = (section: string) => {
    setFocusSection(section);
  };

  // ##################################################################### //
  // ########################## CURRENT CHATROOM ######################### //
  // ##################################################################### //
  const [chatroom, setChatroom] = useState<any>({});
  const handleSetChatroom = (chatRoomObj: any) => {
    if (!chatroom || (chatroom && chatroom.name !== chatRoomObj.name)) {
      setChatroom(chatRoomObj);
    }

    handleSetMenuState(2, 'Chatroom');
  };

  // ##################################################################### //
  // ######################### CLASS NOTES LOGIC ######################### //
  // ##################################################################### //

  // ~~~~~~~~~~~~~~~ STORAGE ~~~~~~~~~~~~~~~ //
  const [notesData, setNotesData] = useState<UniversalJournalData>(INITIAL_NOTESDATA);

  // ~~~~~~~~~~~~ GET OR CREATE ~~~~~~~~~~~~ //
  const [notesInitialized, setNotesInitialized] = useState<boolean>(false);
  const [notesChanged, setNotesChanged] = useState<boolean>(false);
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false);

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

      const notesFormIndex = findIndex(
        notesDataRows,
        (d: any) => !d.entryData[0].domID.includes('notes_form')
      );

      const isNotesCreated = notesFormIndex > -1;

      if (!isNotesCreated) {
        const newJournalEntry = await createJournalData();
        console.log('newJournalEntry - ', newJournalEntry);
        setNotesData({
          id: newJournalEntry.id,
          studentID: newJournalEntry.studentID,
          studentAuthID: newJournalEntry.studentAuthID,
          studentEmail: newJournalEntry.studentEmail,
          feedbacks: newJournalEntry.feedbacks,
          entryData: newJournalEntry.entryData,
          roomID: getRoomData.id,
          syllabusLessonID: getRoomData.activeSyllabus,
        });
      } else {
        const existJournalEntry = notesDataRows[0];
        console.log('existJournalEntry - ', existJournalEntry);
        setNotesData({
          id: existJournalEntry.id,
          studentID: existJournalEntry.studentID,
          studentAuthID: existJournalEntry.studentAuthID,
          studentEmail: existJournalEntry.studentEmail,
          feedbacks: existJournalEntry.feedbacks,
          entryData: existJournalEntry.entryData,
          roomID: getRoomData.id,
          syllabusLessonID: getRoomData.activeSyllabus,
        });
      }
    } catch (e) {
      console.error('error getting or creating journal data - ', e);
    } finally {
      setNotesInitialized(true);
    }
  };

  const createJournalData = async () => {
    const {lessonID} = urlParams;
    const user = await Auth.currentAuthenticatedUser();
    const studentAuthId = user.username;
    const email = user.attributes.email;

    try {
      const input = {
        lessonID: lessonID,
        studentID: studentAuthId,
        studentAuthID: studentAuthId,
        studentEmail: email,
        type: 'class-note',
        entryData: notesData.entryData.map((entryObj: any) => {
          if (entryObj.type === 'header') {
            return {...entryObj, input: `Class Note: ${lessonState?.lessonData?.title}`};
          } else {
            return entryObj;
          }
        }),
        roomID: getRoomData.id,
        syllabusLessonID: getRoomData.activeSyllabus,
      };

      const newJournalData: any = await API.graphql(
        graphqlOperation(mutations.createUniversalJournalData, {input})
      );

      const returnedData = newJournalData.data.createUniversalJournalData;
      return returnedData;
    } catch (e) {
      console.error('error creating journal data - ', e);
    }
  };

  const updateJournalData = async () => {
    const user = await Auth.currentAuthenticatedUser();

    try {
      const input = {
        id: notesData.id,
        studentID: notesData.studentID,
        studentAuthID: notesData.studentAuthID,
        studentEmail: notesData.studentEmail,
        entryData: notesData.entryData,
        roomID: getRoomData.id,
        syllabusLessonID: getRoomData.activeSyllabus,
      };
      const updateJournalData: any = await API.graphql(
        graphqlOperation(mutations.updateUniversalJournalData, {input})
      );
    } catch (e) {
      console.error('error updating journal data - ', e);
    } finally {
      console.log('updated journal data...');
      if (notesChanged) setNotesChanged(false);
      if (saveInProgress) setSaveInProgress(false);
    }
  };

  // ~~~~~~~~~~~~~ UPDATE NOTES ~~~~~~~~~~~~ //
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
    // console.log('updatedContent - ', updatedNotesData);
    setNotesData(updatedNotesData);
    if (!notesChanged) setNotesChanged(true);
  };

  return (
    <div>
      <div className={`relative`}>
        <div
          className={`
               relative
               w-0
               h-full
              ${menuOpenLevel === 3 ? 'mx-auto' : `ml-auto ${scrollbarMarginRight}`}
              flex flex-row flex-1 z-100`}>
          <div
            className={`
              fixed
              transform transition-all ease-in-out duration-400 
             ${menuOpenLevel === 0 ? 'w-0 -translate-x-0 h-100' : ''}
             ${menuOpenLevel === 1 ? 'w-56 -translate-x-56 h-128' : ''}
             ${menuOpenLevel === 2 ? 'w-84 -translate-x-84 h-136' : ''}
             ${menuOpenLevel === 3 ? 'w-full max-w-256 -translate-x-1/2 h-136' : ''}
              top-1/2 -translate-y-1/2
              bg-gray-800 
              shadow`}>
            <div
              className={`relative  transition-all ease-in-out duration-400 w-full h-full`}>
              <FloatingBar
                menuState={menuOpenLevel}
                setMenuState={handleSetMenuState}
                focusSection={focusSection}
                setFocusSection={handleSetFocusSection}
                chatroom={chatroom}
              />
              <ExpandedMenu
                menuState={menuOpenLevel}
                setMenuState={handleSetMenuState}
                focusSection={focusSection}
                setFocusSection={handleSetFocusSection}
                chatroom={chatroom}
                setChatroom={handleSetChatroom}
                saveInProgress={saveInProgress}
                notesData={notesData}
                notesInitialized={notesInitialized}
                setNotesInitialized={setNotesInitialized}
                getOrCreateJournalData={getOrCreateJournalData}
                updateNotesContent={updateNotesContent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingSideMenu;
