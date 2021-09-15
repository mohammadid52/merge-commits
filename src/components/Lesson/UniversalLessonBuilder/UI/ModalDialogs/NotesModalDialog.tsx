import Buttons from '@atoms/Buttons';
import FormInput from '@atoms/Form/FormInput';
import Selector from '@components/Atoms/Form/Selector';
import {IOnChange} from '@interfaces/index';
import {IContentTypeComponentProps} from '@interfaces/UniversalLessonBuilderInterfaces';
import AnimatedContainer from '@uiComponents/Tabs/AnimatedContainer';
import Tabs, {useTabs} from '@uiComponents/Tabs/Tabs';
import PreviewLayout from '@UlbUI/Preview/Layout/PreviewLayout';
import NotesBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/Notes/NotesBlock';
import {map, remove, update} from 'lodash';
import {nanoid} from 'nanoid';
import React, {useState} from 'react';

interface NoteModalProps extends IContentTypeComponentProps {
  inputObj?: any;
  classString?: string;
}

const NotesModalDialog = (props: NoteModalProps) => {
  const initialValues = {id: nanoid(6), noteText: '', bgColor: 'yellow', error: ''};
  const [fields, setFields] = useState([{...initialValues}]);

  const onChange = (e: IOnChange, idx: number) => {
    update(fields[idx], 'noteText', () => e.target.value);
    setFields([...fields]);
  };

  const onFieldUpdate = (fieldName: string, value: string, idx: number) => {
    update(fields[idx], fieldName, () => value);
    setFields([...fields]);
  };

  const addNewNoteField = () => {
    const newNoteField = {...initialValues, id: nanoid(6)};
    setFields([...fields, newNoteField]);
  };

  const removeItemFromList = (id: string) => {
    remove(fields, (f) => f.id === id);
  };

  const {curTab, setCurTab, helpers} = useTabs();
  const [onSetupTab, onPreviewTab] = helpers;

  const notesList = map(fields, (f) => ({value: f.noteText, class: f.bgColor, id: f.id}));

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
                    <div className="">
                      <label
                        htmlFor={'notes bg color'}
                        className="mb-2 block text-xs font-semibold leading-5 text-gray-700">
                        Select background color
                      </label>
                      <div className="w-1/4">
                        <Selector
                          placeholder="Select color"
                          selectedItem={singleNoteData.bgColor}
                          onChange={(_, name) => onFieldUpdate('bgColor', name, idx)}
                          list={[
                            {id: 0, name: 'red'},
                            {id: 1, name: 'green'},
                            {id: 2, name: 'blue'},
                            {id: 3, name: 'yellow'},
                            {id: 4, name: 'indigo'},
                            {id: 5, name: 'purple'},
                          ]}
                        />
                      </div>
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
              <NotesBlock value={notesList} />
            </PreviewLayout>
          </div>
        )}
      </AnimatedContainer>
    </div>
  );
};

export default NotesModalDialog;
