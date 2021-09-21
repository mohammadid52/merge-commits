import Buttons from '@atoms/Buttons';
import NotesBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/Notes/NotesBlock';
import {FORM_TYPES} from '@components/Lesson/UniversalLessonBuilder/UI/common/constants';
import {GlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import {IOnChange} from '@interfaces/index';
import {IContentTypeComponentProps} from '@interfaces/UniversalLessonBuilderInterfaces';
import AnimatedContainer from '@uiComponents/Tabs/AnimatedContainer';
import Tabs, {useTabs} from '@uiComponents/Tabs/Tabs';
import SingleNote from '@UlbBlocks/Notes/SingleNoteForm';
import PreviewLayout from '@UlbUI/Preview/Layout/PreviewLayout';
import {updateLessonPageToDB} from '@utilities/updateLessonPageToDB';
import {map, remove, update} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

interface NoteModalProps extends IContentTypeComponentProps {
  inputObj?: any;
  classString?: string;
}

const NotesModalDialog = (props: NoteModalProps) => {
  const {
    closeAction,
    inputObj,
    createNewBlockULBHandler,
    updateBlockContentULBHandler,
    askBeforeClose,
    setUnsavedChanges,
  } = props;

  const {userLanguage, clientKey} = useContext(GlobalContext);
  const {EditQuestionModalDict} = useDictionary(clientKey);

  // set all values to local state
  useEffect(() => {
    if (inputObj && inputObj.length) {
      setIsEditingMode(true);
      const modifiedFields = map(inputObj, (d) => ({
        ...d,
        noteText: d.value,
        bgColor: d.class,
        error: '',
      }));
      setFields([...modifiedFields]);
    }
  }, [inputObj]);

  const initialValues = {id: uuidv4(), noteText: '', bgColor: 'yellow', error: ''};
  const [fields, setFields] = useState([{...initialValues}]);

  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  const onChange = (e: IOnChange, idx: number) => {
    setUnsavedChanges(true);
    update(fields[idx], 'noteText', () => e.target.value);
    setFields([...fields]);
  };

  const onFieldUpdate = (fieldName: string, value: string, idx: number) => {
    setUnsavedChanges(true);
    update(fields[idx], fieldName, () => value);
    setFields([...fields]);
  };

  const colorList = [
    {id: 0, name: 'red'},
    {id: 1, name: 'green'},
    {id: 2, name: 'blue'},
    {id: 3, name: 'yellow'},
    {id: 4, name: 'indigo'},
    {id: 5, name: 'purple'},
  ];

  const addNewNoteField = () => {
    const randomIdx = Math.floor(Math.random() * 5) + 0;
    setUnsavedChanges(true);

    const randomColor = colorList[randomIdx].name;
    const newNoteField = {...initialValues, bgColor: randomColor, id: uuidv4()};
    setFields([...fields, newNoteField]);
  };

  const removeItemFromList = (id: string) => {
    setUnsavedChanges(true);
    remove(fields, (f) => f.id === id);
    setFields([...fields]);
  };
  const notesList = map(fields, (f) => ({
    type: FORM_TYPES.NOTES,
    value: f.noteText,
    class: f.bgColor,
    id: f.id,
  }));

  // common stuff for adding data to db
  const addToDB = async (list: any) => {
    closeAction();
    setUnsavedChanges(false);
    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };
    await updateLessonPageToDB(input);
  };

  const onSubmit = async () => {
    const parentKey = 'notes-container';
    if (isEditingMode) {
      const updatedList = updateBlockContentULBHandler(
        '',
        '',
        `notes-form`,
        notesList,
        0,
        '',
        parentKey
      );

      await addToDB(updatedList);
    } else {
      const updatedList = createNewBlockULBHandler(
        '',
        '',
        `notes-form`,
        notesList,
        0,
        '',

        parentKey
      );

      await addToDB(updatedList);
    }
  };

  const {curTab, setCurTab, helpers} = useTabs();
  const [onSetupTab, onPreviewTab] = helpers;

  return (
    <div>
      <Tabs curTab={curTab} setCurTab={setCurTab} />
      <AnimatedContainer show={onSetupTab}>
        {onSetupTab && (
          <div>
            <div className="flex flex-col">
              {map(fields, (singleNoteData, idx) => (
                <SingleNote
                  onFieldUpdate={onFieldUpdate}
                  onChange={onChange}
                  key={singleNoteData.id}
                  removeItemFromList={removeItemFromList}
                  singleNoteData={singleNoteData}
                  idx={idx}
                />
              ))}
            </div>
            <Buttons
              btnClass="py-1 px-4 text-xs mr-2"
              label={'Add another note'}
              onClick={addNewNoteField}
              transparent
            />
            <div className="flex mt-8 justify-end px-6 pl-0 pb-4">
              <div className="flex items-center w-auto">
                <Buttons
                  btnClass="py-1 px-4 text-xs mr-2"
                  label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
                  onClick={askBeforeClose}
                  transparent
                />
                <Buttons
                  btnClass="py-1 px-8 text-xs ml-2"
                  label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
                  onClick={() => onSubmit()}
                />
              </div>
            </div>
          </div>
        )}
      </AnimatedContainer>
      <AnimatedContainer show={onPreviewTab}>
        {onPreviewTab && (
          <div className="">
            <PreviewLayout
              notAvailable={
                notesList.length === 0 ? 'Please add notes to see preview' : false
              }>
              {/* @ts-ignore */}
              <NotesBlock grid={{cols: 2, rows: 2}} value={notesList} />
            </PreviewLayout>
          </div>
        )}
      </AnimatedContainer>
    </div>
  );
};

export default NotesModalDialog;
