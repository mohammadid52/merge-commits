import NotesBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/Notes/NotesBlock';
import ThemeModal from '@components/Molecules/ThemeModal';
import {GlobalContext} from '@contexts/GlobalContext';
import {setState} from '@interfaces/index';
import {UniversalLesson} from '@interfaces/UniversalLessonInterfaces';
import forEach from 'lodash/forEach';
import React, {useContext} from 'react';
import {CgNotes} from 'react-icons/cg';

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

  const {lessonState, state} = useContext(GlobalContext);

  // const getStudentDataValue = (domID: string) => {
  //   const pageData = lessonState.studentData[lessonState.currentPage];
  //   const getInput = pageData
  //     ? pageData.find((inputObj: any) => inputObj.domID === domID)
  //     : undefined;
  //   if (getInput !== undefined) {
  //     return getInput.input;
  //   } else {
  //     return [''];
  //   }
  // };

  // // ~~~~~~~~~~~~ GET OR CREATE ~~~~~~~~~~~~ //
  // const [universalJournalDataLoaded, setUniversalJournalDataLoaded] = useState<boolean>(
  //   false
  // );

  // const [allUniversalJournalData, setAllUniversalJournalData] = useState<
  //   UniversalJournalData[]
  // >([]);

  // const listUniversalJournalData = async () => {
  //   const user = state.user;
  //   const studentAuthId = user.username;

  //   try {
  //     const listFilter = {
  //       filter: {
  //         studentAuthID: {eq: studentAuthId},
  //       },
  //     };

  //     const journalEntryData: any = await API.graphql(
  //       graphqlOperation(queries.listUniversalJournalDatas, listFilter)
  //     );
  //     const journalEntryDataRows = journalEntryData.data.listUniversalJournalDatas.items;

  //     if (journalEntryDataRows?.length > 0) {
  //       console.log('anthology - universalJournalDatas exist ', journalEntryDataRows);

  //       setAllUniversalJournalData(journalEntryDataRows);
  //     } else {
  //       console.log('anthology - NO universalJournalDatas');
  //     }
  //     setUniversalJournalDataLoaded(true);
  //   } catch (e) {
  //     console.error('error listing journal data - ', e);
  //     setUniversalJournalDataLoaded(true);
  //   } finally {
  //   }
  // };

  // useEffect(() => {
  //   const initialDataFetch = async () => {
  //     await listUniversalJournalData();
  //     await createJournalData();
  //   };
  //   initialDataFetch();
  // }, []);

  // const studentAuthID = state.user.authId;
  // const studentEmail = state.user.email;

  // const createJournalData = async () => {
  //   const testNote = allNotes[0];
  //   const splited = testNote.split('\n');
  //   const entryData = [
  //     {type: 'header', domID: testNote.id, input: splited[0]},
  //     {type: 'content', domID: testNote.id, input: splited[0]},
  //   ];
  //   const input = {
  //     studentID: studentAuthID,
  //     studentAuthID: studentAuthID,
  //     studentEmail: studentEmail,
  //     type: 'class-note',
  //     entryData: entryData,
  //   };
  //   // console.log('create input - ', input);
  //   try {
  //     const newJournalData: any = await API.graphql(
  //       graphqlOperation(mutations.createUniversalJournalData, {input})
  //     );

  //     const returnedData = newJournalData.data.createUniversalJournalData;
  //     return returnedData;
  //   } catch (e) {
  //     console.error('error creating journal data - ', e);
  //   }
  // };
  return (
    <div className="flex items-center justify-center overflow-hidden">
      {allNotes.length > 0 && (
        <ThemeModal
          dark={darkMode}
          overflowClass={'overflow-hidden'}
          header={`${pageTitle} - Notes`}
          open={showNotesModal}
          setOpen={setShowNotesModal}>
          <div className="p-4">
            <NotesBlock
              currentLesson={currentLesson}
              grid={{cols: 3, rows: 3}}
              value={allNotes}
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
