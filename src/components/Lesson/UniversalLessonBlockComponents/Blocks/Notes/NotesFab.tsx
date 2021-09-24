import API, {graphqlOperation} from '@aws-amplify/api';
import {Auth} from '@aws-amplify/auth';
import NotesBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/Notes/NotesBlock';
import ThemeModal from '@components/Molecules/ThemeModal';
import * as mutations from '@graphql/mutations';
import * as queries from '@graphql/queries';
import {setState} from '@interfaces/index';
import {
  UniversalJournalData,
  UniversalLesson,
} from '@interfaces/UniversalLessonInterfaces';
import {wait} from '@utilities/functions';
import {getLocalStorageData} from '@utilities/localStorage';
import {find, findIndex, map} from 'lodash';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import {nanoid} from 'nanoid';
import React, {useEffect, useState} from 'react';
import ReactHtmlParser from 'react-html-parser';
import {CgNotes} from 'react-icons/cg';
import {useParams} from 'react-router';

const INITIAL_NOTESDATA: UniversalJournalData = {
  id: '',
  studentID: '',
  studentAuthID: '',
  studentEmail: '',
  type: 'class-note',
  feedbacks: [''],
  entryData: [
    {
      domID: `1title_${nanoid(4)}`,
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

const NotesFab = ({
  showNotesModal,
  setShowNotesModal,
  notes,
  darkMode,
  currentLesson,
  pageTitle,
}: {
  showNotesModal: boolean;
  setShowNotesModal: setState['boolean'];
  notes: any[];
  darkMode?: boolean;
  pageTitle?: string;
  currentLesson?: UniversalLesson;
}) => {
  const mapNotesTogether = () => {
    let res: any[] = [];
    forEach(notes, (d) => {
      if (d.partContent && d.partContent.length > 0) {
        forEach(d.partContent, (_d) => {
          if (_d.value && _d.value.length > 0) {
            forEach(_d.value, (f) => {
              res.push({...f, pagePartId: d.id, partContentId: _d.id});
            });
          }
        });
      }
    });
    return res;
  };

  const allNotes = mapNotesTogether();

  const urlParams: any = useParams();
  const getRoomData = getLocalStorageData('room_info');

  const [notesInitialized, setNotesInitialized] = useState<boolean>(false);

  const deleteUJD = async (id: string) => {
    await API.graphql(
      graphqlOperation(mutations.deleteUniversalJournalData, {input: {id}})
    );
  };

  useEffect(() => {
    if (!notesInitialized && allNotes && allNotes.length > 0) {
      getOrCreateJournalData();
    }
    // const ids = ['19c031f1-6c5c-429f-b3e1-c3af563b1696'];
    // forEach(ids, (id) => {
    //   wait(1000).then(() => {
    //     deleteUJD(id);
    //   });
    // });
  }, [notesInitialized]);

  const [notesData, setNotesData] = useState<UniversalJournalData>(INITIAL_NOTESDATA);

  const createJournalData = async () => {
    const {lessonID} = urlParams;
    const user = await Auth.currentAuthenticatedUser();
    const studentAuthId = user.username;
    const email = user.attributes.email;

    let _notesdata: any[] = [];
    _notesdata = map(allNotes, (note) => ({
      domID: note.id,
      type: 'content',
      input: note.value || '',
    }));

    const entryData = [
      {
        domID: `title_notes_form_${nanoid(4)}`,
        type: 'header',
        input: '',
      },
      ..._notesdata,
    ];

    try {
      const input = {
        lessonID: lessonID,
        studentID: studentAuthId,
        studentAuthID: studentAuthId,
        studentEmail: email,
        type: 'class-note',
        entryData: entryData,
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

  const addNewNote = async (newNote: any, notesData: any) => {
    let oldEntryData = [...notesData.entryData];

    oldEntryData.push(newNote);
    setNotesData({...notesData, entryData: [...oldEntryData]});

    try {
      const input = {
        id: notesData.id,
        studentID: notesData.studentID,
        studentAuthID: notesData.studentAuthID,
        studentEmail: notesData.studentEmail,
        entryData: [...oldEntryData],
        roomID: getRoomData.id,
        syllabusLessonID: getRoomData.activeSyllabus,
      };

      const updateJournalData: any = await API.graphql(
        graphqlOperation(mutations.updateUniversalJournalData, {input})
      );

      setNotesData({
        id: updateJournalData.id,
        studentID: updateJournalData.studentID,
        studentAuthID: updateJournalData.studentAuthID,
        studentEmail: updateJournalData.studentEmail,
        feedbacks: updateJournalData.feedbacks,
        entryData: [...updateJournalData.entryData],
        roomID: getRoomData.id,
        syllabusLessonID: getRoomData.activeSyllabus,
      });
    } catch (e) {
      console.error('error updating journal data - ', e);
    } finally {
      console.log('updated journal data...');
      // if (notesChanged) setNotesChanged(false);
      // if (saveInProgress) setSaveInProgress(false);
    }
  };

  const saveData = async (notesData?: any) => {
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

      setNotesData({
        id: updateJournalData.id,
        studentID: updateJournalData.studentID,
        studentAuthID: updateJournalData.studentAuthID,
        studentEmail: updateJournalData.studentEmail,
        feedbacks: updateJournalData.feedbacks,
        entryData: [...updateJournalData.entryData],
        roomID: getRoomData.id,
        syllabusLessonID: getRoomData.activeSyllabus,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updateJournalData = async (newNoteObj?: any, other?: any) => {
    const _notesData = other?.notesData || notesData;

    let oldEntryData = [..._notesData.entryData];
    if (other === undefined) {
      if (newNoteObj) {
        if (typeof newNoteObj === 'object') {
          _notesData.entryData.push(newNoteObj);
          oldEntryData.push(newNoteObj);
        }
        if (Array.isArray(newNoteObj)) {
          oldEntryData = [...newNoteObj];
        }
      }
    } else {
      const newList: any[] = [];
      forEach(other.allNotes, (d) => {
        if (!find(other.filteredNotes, ['domID', d.id])) {
          newList.push(d);
        }
      });

      const newModifiedList = map(newList, (note) => ({
        domID: note.id,
        type: 'content',
        input: null,
      }));

      oldEntryData = [...other?.existingList, ...newModifiedList];
    }

    try {
      const input = {
        id: _notesData.id,
        studentID: _notesData.studentID,
        studentAuthID: _notesData.studentAuthID,
        studentEmail: _notesData.studentEmail,
        entryData: [..._notesData],
        roomID: getRoomData.id,
        syllabusLessonID: getRoomData.activeSyllabus,
      };

      const updateJournalData: any = await API.graphql(
        graphqlOperation(mutations.updateUniversalJournalData, {input})
      );

      setNotesData({
        id: updateJournalData.id,
        studentID: updateJournalData.studentID,
        studentAuthID: updateJournalData.studentAuthID,
        studentEmail: updateJournalData.studentEmail,
        feedbacks: updateJournalData.feedbacks,
        entryData: [...updateJournalData.entryData],
        roomID: getRoomData.id,
        syllabusLessonID: getRoomData.activeSyllabus,
      });
    } catch (e) {
      console.error('error updating journal data - ', e);
    } finally {
      console.log('updated journal data...');
      // if (notesChanged) setNotesChanged(false);
      // if (saveInProgress) setSaveInProgress(false);
    }
  };

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

      const notesFormIndex = findIndex(notesDataRows, (d: any) =>
        d.entryData[0].domID.includes('notes_form')
      );

      const isNotesFormCreated = notesFormIndex > -1;
      const existJournalEntry = isNotesFormCreated ? notesDataRows[notesFormIndex] : [];

      const filterOldNotes = filter(
        existJournalEntry.entryData,
        (d) => d.type === 'content'
      );

      if (!isNotesFormCreated) {
        const newJournalEntry = await createJournalData();

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
        const existJournalEntry = notesDataRows[notesFormIndex];

        setNotesData({
          id: existJournalEntry.id,
          studentID: existJournalEntry.studentID,
          studentAuthID: existJournalEntry.studentAuthID,
          studentEmail: existJournalEntry.studentEmail,
          feedbacks: existJournalEntry.feedbacks,
          entryData: [...existJournalEntry.entryData],
          roomID: getRoomData.id,
          syllabusLessonID: getRoomData.activeSyllabus,
        });
        if (filterOldNotes.length !== allNotes.length) {
          updateJournalData(undefined, {
            allNotes,
            filteredNotes: filterOldNotes,
            existingList: existJournalEntry.entryData,
            notesData: existJournalEntry,
          });
        }
      }
    } catch (e) {
      console.error('error getting or creating journal data - ', e);
    } finally {
      setNotesInitialized(true);
    }
  };

  const fixedFilteredData = filter(
    notesData?.entryData,
    (ed) => ed && ed.type === 'content'
  );
  const fixedCustomData = filter(notesData?.entryData, (ed) =>
    ed?.type?.includes('content-custom')
  );

  const mapFixedData = fixedFilteredData.map((m) => {
    const note = find(allNotes, ['id', m.domID]);
    if (note && m) {
      return {
        id: m.domID,
        class: note?.class,
        value: ReactHtmlParser(m.input),
        pagePartId: note?.pagePartId,
        partContentId: note?.partContentId,
        custom: false,
      };
    }
  });

  const mapCustomData = fixedCustomData.map((m) => {
    const className = m.type.split(' || ')[1];
    return {
      id: m.domID,
      class: className,
      value: ReactHtmlParser(m.input),
      custom: true,
    };
  });

  const collectedNotes = [...mapFixedData, ...mapCustomData];

  return (
    <div className="flex relative items-center justify-center overflow-hidden">
      {collectedNotes.length > 0 && (
        <ThemeModal
          dark={darkMode}
          overflowClass={'overflow-hidden'}
          header={`${pageTitle} - Notes`}
          open={showNotesModal}
          setOpen={setShowNotesModal}>
          <div className="p-4 relative 4">
            <NotesBlock
              addNew={addNewNote}
              showNotesModal={showNotesModal}
              grid={{cols: 3, rows: 3}}
              value={collectedNotes}
              notesData={notesData}
              setNotesData={setNotesData}
              saveData={saveData}
              updateJournalData={updateJournalData}
              notesInitialized={notesInitialized}
            />
          </div>
        </ThemeModal>
      )}

      <div
        title={`All notes ${allNotes.length > 0 ? `(${allNotes.length})` : ''}`}
        onClick={() => setShowNotesModal(!showNotesModal)}
        className="flex items-center relative justify-center h-12 w-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full cursor-pointer iconoclast:bg-500 curate:bg-500">
        <CgNotes className="text-lg lg:text-xl text-white" />
      </div>
    </div>
  );
};

export default NotesFab;
