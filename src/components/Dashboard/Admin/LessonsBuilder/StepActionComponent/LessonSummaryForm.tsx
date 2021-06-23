import React, {useContext} from 'react';
import useDictionary from '../../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import TextArea from '../../../../Atoms/Form/TextArea';
import RichTextEditor from '../../../../Atoms/RichTextEditor';
import FormInput from '../../../../Atoms/Form/FormInput';
import Selector from '../../../../Atoms/Form/Selector';
import Buttons from '../../../../Atoms/Buttons';

const periodOptions = [
  {id: 1, name: 1},
  {id: 2, name: 2},
  {id: 3, name: 3},
  {id: 4, name: 4},
  {id: 5, name: 5},
];

const LessonSummaryForm = () => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {AddNewLessonFormDict, LessonBuilderDict} = useDictionary(clientKey);
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
              // value={name}
              id="name"
              onChange={() => console.log('on change')}
              name="name"
            />
          </div>
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              {LessonBuilderDict[userLanguage]['DURATION']}{' '}
              <span className="text-red-500"> * </span>
            </label>
            <Selector
              // selectedItem={type.name}
              placeholder={LessonBuilderDict[userLanguage]['DURATION']}
              list={periodOptions}
              onChange={(val, name, id) => console.log('on change')}
            />
          </div>
        </div>

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
              {LessonBuilderDict[userLanguage]['SUMMARY']}
            </label>
            <TextArea
              rows={3}
              id="resources"
              // value={criteria}
              onChange={() => console.log('on change')}
              name="resources"
            />
          </div>
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
              {LessonBuilderDict[userLanguage]['NOTES']}
            </label>
            <RichTextEditor
              initialValue={''}
              onChange={
                (htmlContent, plainText) => console.log('inside editor change')
                // setEditorContent(htmlContent, plainText, 'purposeHtml', 'purpose')
              }
            />
          </div>
        </div>
        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
              {LessonBuilderDict[userLanguage]['RESOURCES']}
            </label>
            <RichTextEditor
              initialValue={''}
              onChange={
                (htmlContent, plainText) => console.log('inside editor change')
                // setEditorContent(htmlContent, plainText, 'purposeHtml', 'purpose')
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
            // onClick={saveFormData}
            // disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonSummaryForm;
