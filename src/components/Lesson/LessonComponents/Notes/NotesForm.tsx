import React, {useContext} from 'react';
import RichTextEditor from '../../../Atoms/RichTextEditor';
import {FloatingSideMenuProps} from '../../../Dashboard/FloatingSideMenu/FloatingSideMenu';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {getAsset} from '../../../../assets';
import {useEffect} from 'react';

const NotesForm = ({
  focusSection,
  notesData,
  notesInitialized,
  getOrCreateJournalData,
  updateNotesContent,
}: FloatingSideMenuProps) => {
  const {clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  useEffect(() => {
    if (!notesInitialized && focusSection === 'Notes') {
      getOrCreateJournalData();
    }
  }, [notesInitialized]);

  const noteContent = notesData?.entryData
    ? notesData?.entryData.find((noteEntryData: any) => noteEntryData.type === 'content')
        .input
    : undefined;

  return (
    <div
      className={`
      relative
        transform transition duration-400 ease-in-out
        ${
          focusSection === 'Notes'
            ? 'w-full h-full mb-12 opacity-100'
            : 'w-0 overflow-hidden opacity-0'
        }
      `}>
      {notesInitialized ? (
        <RichTextEditor
          theme={themeColor}
          rounded
          customStyle
          mediumDark={true}
          initialValue={noteContent}
          onChange={
            notesInitialized ? (htmlContent) => updateNotesContent(htmlContent) : () => {}
          }
          fullWHOverride={true}
        />
      ) : (
        <div className="bg-white bg-opacity-20 h-full w-full flex justify-center items-center align-center content-center">
          <div className="w-auto h-auto text-lg text-white">Loading notes...</div>
        </div>
      )}
    </div>
  );
};

export default React.memo(NotesForm);
