import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Auth} from '@aws-amplify/auth';
import Loader from '@components/Atoms/Loader';
import NotesBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/Notes/NotesBlock';
import {GlobalContext} from '@contexts/GlobalContext';
import * as mutations from '@graphql/mutations';
import * as queries from '@graphql/queries';
import {UniversalJournalData} from '@interfaces/UniversalLessonInterfaces';
import {getLocalStorageData} from '@utilities/localStorage';
import filter from 'lodash/filter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import {nanoid} from 'nanoid';
import React, {useContext, useEffect, useState} from 'react';
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

const NotesContainer = ({notes}: {notes: any[]}) => {
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

  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;

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
    // const id = '6641f563-3940-4bd3-a9a4-7838355dc320';
    // deleteUJD(id);
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
        input: `Sticky notes - ${lessonState?.lessonData?.title}`,
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

  // ~~~~~~~~~~ UPDATE DB RECORDS ~~~~~~~~~~ //
  const updateStudentData = async (newNote: any) => {
    return lessonState.universalStudentDataID.reduce(
      async (p: any, currentIdObj: any, idx: number) => {
        if (currentIdObj.update) {
          let list = lessonState.studentData[currentIdObj.pageIdx];
          list.push(newNote);
          let data = {
            id: currentIdObj.id,
            pageData: [...list],
            hasExerciseData: lessonState?.exerciseData[currentIdObj.pageIdx]?.length > 0,
            exerciseData: lessonState?.exerciseData[currentIdObj.pageIdx],
            roomID: getRoomData.id,
          };

          try {
            let updatedStudentData: any = await API.graphql(
              graphqlOperation(mutations.updateUniversalLessonStudentData, {input: data})
            );
          } catch (e) {
            console.error('update universal student data - ', encodeURI);
          } finally {
            if (idx === lessonState.universalStudentDataID.length - 1) {
              return Promise.resolve();
            }
          }
        }
      },
      Promise.resolve()
    );
  };

  const addNewNote = async (newNote: any, notesData: any) => {
    let oldEntryData = [...notesData.entryData];

    oldEntryData.push(newNote);
    setNotesData((prev) => ({...prev, entryData: [...oldEntryData]}));

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

      updateStudentData({domID: newNote.domID, input: ['']});
      const updateJournalData: any = await API.graphql(
        graphqlOperation(mutations.updateUniversalJournalData, {input})
      );

      const updatedData = updateJournalData.data.updateUniversalJournalData;

      setNotesData({
        id: updatedData.id,
        studentID: updatedData.studentID,
        studentAuthID: updatedData.studentAuthID,
        studentEmail: updatedData.studentEmail,
        feedbacks: updatedData.feedbacks,
        entryData: input.entryData,
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

  const saveData = async (_notesData?: any, cb?: any, cb2?: any) => {
    if (cb) {
      cb();
    }
    try {
      const input = {
        id: _notesData.id,
        studentID: _notesData.studentID,
        studentAuthID: _notesData.studentAuthID,
        studentEmail: _notesData.studentEmail,
        entryData: _notesData.entryData,
        roomID: getRoomData.id,
        syllabusLessonID: getRoomData.activeSyllabus,
      };

      const updatedJournalData: any = await API.graphql(
        graphqlOperation(mutations.updateUniversalJournalData, {input})
      );
      const updatedData = updatedJournalData.data.updateUniversalJournalData;

      if (updatedData && updatedData.entryData) {
        setNotesData((prev) => ({
          ...prev,
          entryData: input.entryData,
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (cb2) {
        cb2();
      }
    }
  };

  const updateNotesJournalChange = async (newNotesArr: any[], notesData?: any) => {
    const mapCustomData = newNotesArr.map((m) => ({
      domID: m.id,
      type: 'content',
      input: m.value,
    }));

    try {
      const input = {
        id: notesData.id,
        studentID: notesData.studentID,
        studentAuthID: notesData.studentAuthID,
        studentEmail: notesData.studentEmail,
        entryData: [...notesData.entryData, ...mapCustomData],
        roomID: getRoomData.id,
        syllabusLessonID: getRoomData.activeSyllabus,
      };

      const _updateJournalData: any = await API.graphql(
        graphqlOperation(mutations.updateUniversalJournalData, {input})
      );
      const updatedData = _updateJournalData.data.updateUniversalJournalData;

      setNotesData({
        id: updatedData.id,
        studentID: updatedData.studentID,
        studentAuthID: updatedData.studentAuthID,
        studentEmail: updatedData.studentEmail,
        feedbacks: updatedData.feedbacks,
        entryData: input.entryData,
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

  const noteDelete = async (notesData: {
    id: any;
    studentID: any;
    studentAuthID: any;
    studentEmail: any;
    entryData: any;
  }) => {
    try {
      const input = {
        id: notesData.id,
        studentID: notesData.studentID,
        studentAuthID: notesData.studentAuthID,
        studentEmail: notesData.studentEmail,
        entryData: [...notesData.entryData],
        roomID: getRoomData.id,
        syllabusLessonID: getRoomData.activeSyllabus,
      };

      const _updateJournalData: any = await API.graphql(
        graphqlOperation(mutations.updateUniversalJournalData, {input})
      );
      const updatedData = _updateJournalData.data.updateUniversalJournalData;

      setNotesData({
        id: updatedData.id,
        studentID: updatedData.studentID,
        studentAuthID: updatedData.studentAuthID,
        studentEmail: updatedData.studentEmail,
        feedbacks: updatedData.feedbacks,
        entryData: input.entryData,
        roomID: getRoomData.id,
        syllabusLessonID: getRoomData.activeSyllabus,
      });
    } catch (e) {
      console.error('error updating journal data - ', e);
    } finally {
      console.log('updated journal data...');
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
      const newList: any[] = filter(
        other.allNotes,
        (d) => !find(other.filteredNotes, ['domID', d.id])
      );

      if (newList && newList.length > 0) {
        const newModifiedList = map(newList, (note) => ({
          domID: note.id,
          type: 'content',
          input: null,
        }));

        oldEntryData = [...other?.existingList, ...newModifiedList];
      }
    }

    try {
      const input = {
        id: _notesData.id,
        studentID: _notesData.studentID,
        studentAuthID: _notesData.studentAuthID,
        studentEmail: _notesData.studentEmail,
        entryData: [..._notesData.entryData],
        roomID: getRoomData.id,
        syllabusLessonID: getRoomData.activeSyllabus,
      };

      const _updateJournalData: any = await API.graphql(
        graphqlOperation(mutations.updateUniversalJournalData, {input})
      );
      const updatedData = _updateJournalData.data.updateUniversalJournalData;

      setNotesData({
        id: updatedData.id,
        studentID: updatedData.studentID,
        studentAuthID: updatedData.studentAuthID,
        studentEmail: updatedData.studentEmail,
        feedbacks: updatedData.feedbacks,
        entryData: input.entryData,
        roomID: getRoomData.id,
        syllabusLessonID: getRoomData.activeSyllabus,
      });
    } catch (e) {
      console.error('error updating journal data - ', e);
    } finally {
      console.log('updated journal data...');
    }
  };

  const getUniq = (_obj: {type: string; domID: any | string}) =>
    _obj && _obj.type === 'content' && find(allNotes, ['id', _obj.domID]);

  const getOrCreateJournalData = async () => {
    const {lessonID} = urlParams;
    const user = await Auth.currentAuthenticatedUser();
    const studentAuthId = user.username;

    try {
      const listFilter = {
        filter: {
          studentAuthID: {eq: studentAuthId},
          lessonID: {eq: lessonID},
          syllabusLessonID: {eq: getRoomData.activeSyllabus},
          roomID: {eq: getRoomData.id},
        },
      };

      const notesData: any = await API.graphql(
        graphqlOperation(queries.listUniversalJournalDatas, {
          filter: {...listFilter.filter, type: {eq: 'class-note'}},
        })
      );

      const notesDataRows = notesData.data.listUniversalJournalDatas.items;

      const notesFormIndex = findIndex(notesDataRows, (d: any) =>
        d.entryData[0].domID.includes('notes_form')
      );

      const isNotesFormCreated = notesFormIndex > -1;
      const existJournalEntry = isNotesFormCreated ? notesDataRows[notesFormIndex] : [];

      const filterOldNotes = filter(existJournalEntry.entryData, (d) => getUniq(d));
      const filterNewNotes = filter(
        allNotes,
        (_obj) => _obj && !find(existJournalEntry.entryData, ['domID', _obj.id])
      );

      const changesInNotesLen = filterOldNotes.length < allNotes.length;

      if (!isNotesFormCreated) {
        // this section condition works perfectly fine
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
        // ----- Skip this part for while -----
        if (changesInNotesLen && filterNewNotes.length > 0) {
          updateNotesJournalChange(filterNewNotes, existJournalEntry);
        }
      }
    } catch (e) {
      console.error('error getting or creating journal data - ', e);
    } finally {
      setNotesInitialized(true);
    }
  };

  if (notesInitialized) {
    const fixedFilteredData = filter(notesData?.entryData, (ed) => getUniq(ed));

    /**
     * Working case
     * const entryData = [{domID:1},{domID:2}]
     * const allNotes = [{id:1}, {id:2}]
     *  -- Everything works with this
     *
     * Failing case
     * const entryData = [{domID:1}, {domID:2}]
     * const allNotes = [{id:1}]
     *  -- Teacher removed one note from lesson
     *  -- but it is still present in entryData
     *
     */

    const fixedCustomData = filter(notesData?.entryData, (ed) =>
      ed?.type?.includes('content-custom')
    );

    let strippedString = (str: string) =>
      str.replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, '');
    const mapFixedData = fixedFilteredData.map((m) => {
      // @ts-ignore
      const note = find(allNotes, ['id', m.domID]);
      if (note && m) {
        return {
          // @ts-ignore
          id: m.domID,
          class: note?.class,
          // @ts-ignore
          value: strippedString(m.input.toString()),
          pagePartId: note?.pagePartId,
          partContentId: note?.partContentId,
          custom: false,
        };
      }
    });

    const mapCustomData = fixedCustomData.map((m) => {
      let className = m.type.split(' || ')[1];
      const note = find(allNotes, ['id', m.domID]);

      return {
        id: m.domID,
        class: className,
        value: strippedString(m.input.toString()),
        custom: true,
        pagePartId: note?.pagePartId,
        partContentId: note?.partContentId,
      };
    });

    const collectedNotes = [...mapFixedData, ...mapCustomData];

    return (
      <>
        <div className="text-lg mb-2 text-gray-600">
          {15 - collectedNotes.length} {collectedNotes.length > 1 ? 'notes' : 'note'}{' '}
          available
        </div>
        <div className="flex relative items-center justify-center">
          {collectedNotes.length > 0 && (
            <NotesBlock
              addNew={addNewNote}
              grid={{cols: 3, rows: 3}}
              value={collectedNotes}
              notesData={notesData}
              setNotesData={setNotesData}
              noteDelete={noteDelete}
              saveData={saveData}
              updateJournalData={updateJournalData}
              notesInitialized={notesInitialized}
            />
          )}
        </div>
      </>
    );
  } else return <Loader withText="Loading notes" />;
};

export default NotesContainer;
