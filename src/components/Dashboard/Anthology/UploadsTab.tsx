import {API, graphqlOperation} from '@aws-amplify/api';
import React, {useCallback, useEffect, useState} from 'react';
import {IconContext} from 'react-icons';
import {FaSpinner} from 'react-icons/fa';
import * as queries from '../../../graphql/queries';
import EmptyViewWrapper from './EmptyViewWrapper';
import {ITabParentProps} from './TabView';
import SingleUpload from './UploadsTab/UploadCard';

const LIMIT = 100;

export interface IUploadCardProps extends ITabParentProps {
  personAuthID?: string;
  personEmail?: string;
  sectionRoomID?: string;
  themeColor?: string;
  idx?: number;
  contentLen?: number;
  contentObj?: any;
  editID?: string;
  editMode?: string;
  handleEdit?: any;
  handleSave?: any;
  handleDelete?: any;
  handleConfirm?: any;
  handleCancel?: any;
}

const UploadsTab = ({
  personAuthID,
  personEmail,
  sectionRoomID,
  themeColor,
  mainSection,
  subSection,
  onCancel,
}: IUploadCardProps) => {
  // ##################################################################### //
  // ############################ CRUD UPLOADS ########################### //
  // ##################################################################### //

  // ~~~~~~~~~~~~ GET OR CREATE ~~~~~~~~~~~~ //
  const [personLessonFilesLoaded, setPersonLessonFilesLoaded] = useState<boolean>(false);
  const [allPersonLessonFiles, setAllPersonLessonFiles] = useState<any[]>([]);

  const listPersonLessonFiles = useCallback(async () => {
    try {
      const listFilter = {
        filter: {
          personEmail: {eq: personEmail},
          personAuthID: {eq: personAuthID},
          roomID: {eq: sectionRoomID},
        },
      };

      const personLessonFiles: any = await API.graphql(
        graphqlOperation(queries.listPersonFiless, listFilter)
      );
      const personLessonFilesRows = personLessonFiles.data.listPersonFiless.items;

      if (personLessonFilesRows?.length > 0) {
        // console.log('anthology - personLessonFiles exist ', personLessonFilesRows);

        setAllPersonLessonFiles(personLessonFilesRows);
      } else {
        console.log('anthology - NO personLessonFiles');
      }
      setPersonLessonFilesLoaded(true);
    } catch (e) {
      console.error('error listing personLessonFilesa - ', e);
      setPersonLessonFilesLoaded(true);
    } finally {
    }
  }, [personAuthID, sectionRoomID]);

  useEffect(() => {
    // do this on mount
    if (personAuthID && sectionRoomID) {
      listPersonLessonFiles();
    }
  }, [personAuthID, sectionRoomID]);

  // ##################################################################### //
  // ######################## TOGGLE EDITING FILES ####################### //
  // ##################################################################### //

  const [editID, setEditID] = useState<string>('');
  const [editMode, setEditMode] = useState<string>('');
  const handleEdit = (editedID: string) => {
    if (editMode !== 'edit') {
      setEditMode('edit');
    }
    if (editID !== editedID) {
      setEditID(editedID);
    }
  };
  const handleSave = () => {
    setEditMode('');
    setEditID('');
  };
  const handleDelete = (deletableID: string) => {
    if (editMode !== 'delete') {
      setEditMode('delete');
    }
    if (editID !== deletableID) {
      setEditID(deletableID);
    }
  };
  const handleConfirm = () => {
    setEditMode('');
    setEditID('');
  };
  const handleCancel = () => {
    setEditMode('');
    setEditID('');
  };

  return (
    <>
      {allPersonLessonFiles && allPersonLessonFiles.length > 0
        ? allPersonLessonFiles.map((lessonFileObj: any, idx: number) => {
            return (
              <EmptyViewWrapper
                key={`lessonfilecard_${idx}`}
                wrapperClass={`h-auto pb-4 overflow-hidden bg-white rounded-b-lg shadow mb-4`}
                timedRevealInt={idx + 1}
                fallbackContents={
                  <IconContext.Provider
                    value={{
                      size: '1.2rem',
                      style: {},
                      className: `relative mr-4 animate-spin ${themeColor}`,
                    }}>
                    <FaSpinner />
                  </IconContext.Provider>
                }>
                <SingleUpload
                  idx={idx}
                  mainSection={mainSection}
                  subSection={subSection}
                  onCancel={onCancel}
                  handleEdit={() => handleEdit(lessonFileObj.id)}
                  handleSave={handleSave}
                  handleDelete={() => handleDelete(lessonFileObj.id)}
                  handleConfirm={handleConfirm}
                  handleCancel={handleCancel}
                  editID={editID}
                  editMode={editMode}
                  contentLen={allPersonLessonFiles?.length}
                  contentObj={lessonFileObj}
                  personEmail={personEmail}
                  personAuthID={personAuthID}
                />
              </EmptyViewWrapper>
            );
          })
        : null}
    </>
  );
};

export default UploadsTab;
