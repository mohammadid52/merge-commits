import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {IconContext} from 'react-icons';
import {FaSpinner} from 'react-icons/fa';
import * as queries from '../../../graphql/queries';
import EmptyViewWrapper from './EmptyViewWrapper';
import {ITabParentProps} from './TabView';
import SingleUpload from './UploadsTab/UploadCard';
import ContentLessonWrapper from './Wrapper/ContentLessonWrapper';

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
  updateLoadedFilesList?: (personFilesID: string, filesArray: any[]) => void;
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

  const [loaded, setLoaded] = useState<boolean>(false);
  const [allPersonLessonFiles, setAllPersonLessonFiles] = useState<any[]>([]);
  const [filteredLessonIds, setFilteredLessonIds] = useState<string[]>([]);

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
        setAllPersonLessonFiles(personLessonFilesRows);
        const filterUniqueLessonIds = personLessonFilesRows.reduce(
          (acc: string[], fileRow: any) => {
            if (acc.includes(fileRow.lessonID)) {
              return acc;
            } else {
              return [...acc, fileRow.lessonID];
            }
          },
          []
        );
        setFilteredLessonIds(filterUniqueLessonIds);
        setLoaded(true);
      } else {
        console.log('anthology - NO personLessonFiles');
        setLoaded(true);
      }
    } catch (e) {
      console.error('error listing personLessonFilesa - ', e);
      setLoaded(true);
    } finally {
    }
  }, [personAuthID, sectionRoomID]);

  // ~~~~~~~~~~~~~~~ ON MOUNT ~~~~~~~~~~~~~~ //

  useEffect(() => {
    // do this on mount
    if (personAuthID && sectionRoomID) {
      listPersonLessonFiles();
    }
  }, [personAuthID, sectionRoomID]);

  // ~~~~~~~ UPDATE LOADED FILES LIST ~~~~~~ //
  /****************************************************
   *  THIS FUNCTION JUST UPDATES LOCAL STATE SO YOU   *
   * DON'T HAVE TO DO A RE-FETCH OF THE NEWLY MUTATED *
   *                      FILES                       *
   ****************************************************/

  const updateLoadedFilesList = async (personFilesID: string, filesArray: any[]) => {
    const updated = allPersonLessonFiles.map((contentObj: any) => {
      if (contentObj.id === personFilesID) {
        return {...contentObj, files: filesArray};
      } else {
        return contentObj;
      }
    });
    setAllPersonLessonFiles(updated);
  };

  // ~~~ FILTER LOADED FILES BY LESSON ID ~~ //

  const filterFilesListByLessonID = (lessonID: string, allFiles: any[]) => {
    const output = allFiles.reduce((acc: any[], file: any) => {
      // console.log('lessonID - ', lessonID);
      // console.log('file.lessonID - ', file.lessonID);
      // console.log('ile.lessonID === lessonID - ', file.lessonID === lessonID);

      if (file.lessonID === lessonID) {
        return [...acc, file];
      } else {
        return acc;
      }
    }, []);
    console.log('output - ', output);
    return output;
  };

  // ##################################################################### //
  // ######################## TOGGLE EDITING CARDS ####################### //
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

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <>
      <EmptyViewWrapper
        wrapperClass={`h-auto pb-4 overflow-hidden bg-white rounded-b-lg shadow mb-4`}
        revealContents={loaded}
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
        {filteredLessonIds && filteredLessonIds.length > 0 ? (
          filteredLessonIds.map((idString: string) => (
            <ContentLessonWrapper lessonID={idString}>
              {filterFilesListByLessonID(idString, allPersonLessonFiles).length > 0 &&
                filterFilesListByLessonID(idString, allPersonLessonFiles).map(
                  (lessonFileObj: any, idx: number) => {
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
                          updateLoadedFilesList={updateLoadedFilesList}
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
                  }
                )}
            </ContentLessonWrapper>
          ))
        ) : (
          <div className="p-12 flex flex-center items-center">
            <p className="text-center text-lg text-gray-500">
              No content for {subSection} section
            </p>
          </div>
        )}
      </EmptyViewWrapper>
    </>
  );
};

export default UploadsTab;
