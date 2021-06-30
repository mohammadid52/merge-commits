import React, {useContext, useEffect, useState} from 'react';

import useDictionary from '../../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../../contexts/GlobalContext';

import RichTextEditor from '../../../../Atoms/RichTextEditor';
import FormInput from '../../../../Atoms/Form/FormInput';
import Selector from '../../../../Atoms/Form/Selector';
import Buttons from '../../../../Atoms/Buttons';
import {graphqlOperation, API} from 'aws-amplify';
import * as mutations from '../../../../../graphql/mutations';

const periodOptions = [
  {id: 1, name: '1'},
  {id: 2, name: '2'},
  {id: 3, name: '3'},
  {id: 4, name: '4'},
  {id: 5, name: '5'},
];

interface FormDataInterface {
  label: string;
  duration: string;
  resources: string;
  notes: string;
}

interface LessonSummaryFormInterface {
  formData: FormDataInterface;
  setFormData: React.Dispatch<React.SetStateAction<FormDataInterface>>;
  lessonId: string;
}

const LessonSummaryForm = (props: LessonSummaryFormInterface) => {
  const {formData, setFormData, lessonId} = props;

  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {AddNewLessonFormDict, LessonBuilderDict} = useDictionary(clientKey);

  const [loading, setLoading] = useState(false);

  const saveFormData = async () => {
    setLoading(true);
    try {
      const input = {
        id: lessonId,
        label: formData.label,
        resources: formData.resources,
        notes: formData.notes,
        duration: Number(formData.duration),
      };
      const res: any = await API.graphql(
        graphqlOperation(mutations.updateUniversalLesson, {input})
      );
    } catch (error) {
      console.error(error.message);
      console.log('error saving data');
    } finally {
      setLoading(false);
    }
  };

  const onInputChange = (e: any) => {
    const {
      target: {name, value},
    } = e;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    // setValidation((prevValidation) => ({
    //   ...prevValidation,
    //   [name]: '',
    // }));
  };

  const onSelectOption = (_: any, name: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      duration: name,
    }));
  };

  const onEditorStateChange = (
    html: string,
    text: string,
    fieldHtml: string,
    field: string
  ) => {
    setFormData({
      ...formData,
      // [fieldHtml]: html,
      [field]: text,
    });
  };
  const {label = '', duration = '1', resources = '', notes = ''} = formData || {};
  return (
    <div>
      <div className="p-4">
        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              {LessonBuilderDict[userLanguage]['LESSON_PLAN_LABEL']}{' '}
              <span className="text-red-500"> * </span>
            </label>
            <FormInput
              value={label}
              id="label"
              onChange={onInputChange}
              name="label"
              maxLength={12}
              showCharacterUsage={true}
            />
          </div>
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              {LessonBuilderDict[userLanguage]['DURATION']}{' '}
              <span className="text-red-500"> * </span>
            </label>
            <Selector
              selectedItem={duration.toString() || ''}
              placeholder={LessonBuilderDict[userLanguage]['DURATION']}
              list={periodOptions}
              onChange={onSelectOption}
            />
          </div>
        </div>

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
              {LessonBuilderDict[userLanguage]['RESOURCES']}
            </label>
            <RichTextEditor
              initialValue={resources}
              onChange={(htmlContent, plainText) =>
                onEditorStateChange(htmlContent, plainText, 'resourceHtml', 'resources')
              }
            />
          </div>
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
              {LessonBuilderDict[userLanguage]['NOTES']}
            </label>
            <RichTextEditor
              initialValue={notes}
              onChange={(htmlContent, plainText) =>
                onEditorStateChange(htmlContent, plainText, 'noteHtml', 'notes')
              }
            />
          </div>
        </div>
        <div className="flex mb-8 mt-4 justify-center">
          <Buttons
            btnClass="py-3 px-10"
            label={
              false
                ? AddNewLessonFormDict[userLanguage]['SAVING']
                : AddNewLessonFormDict[userLanguage]['SAVE']
            }
            onClick={saveFormData}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonSummaryForm;
