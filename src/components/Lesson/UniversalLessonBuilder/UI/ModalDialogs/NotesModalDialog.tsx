import Buttons from '@atoms/Buttons';
import FormInput from '@atoms/Form/FormInput';
import Selector from '@components/Atoms/Form/Selector';
import NotesBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/Notes/NotesBlock';
import {FORM_TYPES} from '@components/Lesson/UniversalLessonBuilder/UI/common/constants';
import {IOnChange} from '@interfaces/index';
import {IContentTypeComponentProps} from '@interfaces/UniversalLessonBuilderInterfaces';
import AnimatedContainer from '@uiComponents/Tabs/AnimatedContainer';
import Tabs, {useTabs} from '@uiComponents/Tabs/Tabs';
import PreviewLayout from '@UlbUI/Preview/Layout/PreviewLayout';
import {map, remove, update} from 'lodash';
import {nanoid} from 'nanoid';
import React, {useContext, useEffect, useState} from 'react';
import {updateLessonPageToDB} from '@utilities/updateLessonPageToDB';
import useDictionary from '@customHooks/dictionary';
import {GlobalContext} from '@contexts/GlobalContext';
import ColorPicker from '@components/Lesson/UniversalLessonBuilder/UI/ColorPicker/ColorPicker';

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

  const initialValues = {id: nanoid(6), noteText: '', bgColor: 'yellow', error: ''};
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
    const newNoteField = {...initialValues, bgColor: randomColor, id: nanoid(6)};
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
    if (isEditingMode) {
      const updatedList = updateBlockContentULBHandler('', '', `notes-form`, notesList);
      await addToDB(updatedList);
    } else {
      const updatedList = createNewBlockULBHandler('', '', `notes-form`, notesList);
      await addToDB(updatedList);
    }
  };

  const [colorPicker, setColorPicker] = useState<boolean>(false);

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
                <div
                  key={singleNoteData.id}
                  className="flex flex-col items-center justify-start mb-4 gap-x-4">
                  <div className="mb-2">
                    <FormInput
                      label={'Add note text'}
                      onChange={(e) => onChange(e, idx)}
                      error={singleNoteData.error}
                      name={'noteText'}
                      value={singleNoteData.noteText}
                      placeHolder={'Note text'}
                    />
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="relative w-1/4 h-full">
                      <label
                        htmlFor={'bgColor'}
                        className="mb-2 block text-xs font-semibold leading-5 text-gray-700">
                        Select background color
                      </label>
                      <button
                        onClick={() => setColorPicker(!colorPicker)}
                        className={`border-0 border-gray-300 rounded shadow-xs flex items-center justify-start  h-10 px-3`}>
                        <span className={'text-gray-700 w-auto text-sm mr-2 capitalize'}>
                          {singleNoteData.bgColor?.split('-')[0]}{' '}
                        </span>

                        <span
                          className={`h-4 block w-4 bg-gradient-to-t from-${singleNoteData.bgColor}-500 to-${singleNoteData.bgColor}-300 rounded-full `}></span>
                      </button>
                      {colorPicker && (
                        <ColorPicker
                          isMainPage
                          customColors={{
                            colors: [
                              {label: 'Red', value: 'red'},
                              {label: 'Red', value: 'green'},
                              {label: 'Red', value: 'blue'},
                              {label: 'Red', value: 'yellow'},
                              {label: 'Red', value: 'indigo'},
                              {label: 'Red', value: 'purple'},
                            ],
                            values: [{label: 500, value: 500}],
                          }}
                          callbackColor={(pickedColor) => {
                            setColorPicker(false);
                            onFieldUpdate('bgColor', pickedColor.split('-')[0], idx);
                          }}
                          styleString={{top: '100%'}}
                        />
                      )}
                    </div>
                    {idx !== 0 && (
                      <div className="w-auto">
                        <button
                          onClick={() => removeItemFromList(singleNoteData.id)}
                          className={`text-center transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded mt-2 border-2 hover:text-red-600 w-auto`}>
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
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
          <div>
            <PreviewLayout
              notAvailable={
                notesList.length === 0 ? 'Please add notes to see preview' : false
              }>
              {/* @ts-ignore */}
              <NotesBlock value={notesList} />
            </PreviewLayout>
          </div>
        )}
      </AnimatedContainer>
    </div>
  );
};

export default NotesModalDialog;
