import FormInput from '@components/Atoms/Form/FormInput';
import MultipleSelector from '@components/Atoms/Form/MultipleSelector';
import Selector from '@components/Atoms/Form/Selector';
import {useGlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import {useQuery} from '@customHooks/urlParam';
import React, {useEffect} from 'react';
import {
  languageList,
  lessonTypeList,
  periodOptions,
  targetAudienceForIconoclast,
} from '@utilities/staticData';
import {UploadIcon} from 'media/icons';
import Buttons from '@components/Atoms/Buttons';

const LessonDetails = ({
  name,
  onInputChange,
  validation,
  lessonId,
  targetAudience,
  type,
  duration,
  selectedDesigners,
  languages,
  designerListLoading,
  onDurationSelect,
  onSelectOption,
  onSelectTargetAudience,
  selectLanguage,
  designersList,
  selectDesigner,
}: any) => {
  const params = useQuery(location.search);
  const refName = params.get('refName');

  const inputRef = React.useRef();

  useEffect(() => {
    if (refName && refName === 'name') {
      if (inputRef && inputRef?.current) {
        // @ts-ignore
        inputRef?.current?.focus();
      }
    }
  }, [refName, inputRef]);

  const {clientKey, userLanguage} = useGlobalContext();

  const {AddNewLessonFormDict} = useDictionary(clientKey);
  return (
    <div className="px-3">
      <div className="px-0 py-4">
        <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
          {AddNewLessonFormDict[userLanguage]['NAME']}{' '}
          <span className="text-red-500"> * </span>
        </label>
        <FormInput
          value={name}
          inputRef={inputRef}
          id="name"
          onChange={onInputChange}
          name="name"
        />
        {validation.name && <p className="text-red-600 text-sm">{validation.name}</p>}
      </div>
      <div className="grid lg:grid-cols-2 gap-x-4">
        <div className="px-0 py-4">
          <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
            {AddNewLessonFormDict[userLanguage]['SELECTTYPE']}{' '}
            <span className="text-red-500"> * </span>
          </label>
          <Selector
            disabled={lessonId !== ''}
            selectedItem={type.name}
            placeholder={AddNewLessonFormDict[userLanguage]['TYPE']}
            list={lessonTypeList}
            onChange={(val, name, id) => onSelectOption(val, name, id, 'type')}
          />
          {validation.type && <p className="text-red-600 text-sm">{validation.type}</p>}
        </div>
        <div className="px-0 py-4">
          <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
            {AddNewLessonFormDict[userLanguage]['DURATION']}{' '}
          </label>
          <Selector
            selectedItem={duration.toString() || ''}
            placeholder={AddNewLessonFormDict[userLanguage]['DURATION']}
            list={periodOptions}
            onChange={onDurationSelect}
          />
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-x-4">
        <div className="px-0 py-4">
          <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
            {AddNewLessonFormDict[userLanguage]['TARGET_AUDIENCE']}{' '}
          </label>
          <Selector
            selectedItem={targetAudience}
            placeholder={AddNewLessonFormDict[userLanguage]['SELECT_TARGET_AUDIENCE']}
            list={targetAudienceForIconoclast}
            onChange={onSelectTargetAudience}
          />
        </div>
        <div className="px-0 py-4">
          <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
            {AddNewLessonFormDict[userLanguage]['SELECTLANG']}
            <span className="text-red-500"> * </span>
          </label>
          <MultipleSelector
            // disabled={lessonId !== ''}
            selectedItems={languages}
            placeholder={AddNewLessonFormDict[userLanguage]['LANGUAGE']}
            list={languageList}
            onChange={selectLanguage}
          />
        </div>
      </div>
      <div className="py-4 col-span-2">
        <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
          {AddNewLessonFormDict[userLanguage]['SELECTDESIGNER']}
        </label>
        <MultipleSelector
          selectedItems={selectedDesigners}
          placeholder={AddNewLessonFormDict[userLanguage]['DESIGNER']}
          list={designersList}
          onChange={selectDesigner}
          noOptionMessage={
            designerListLoading
              ? AddNewLessonFormDict[userLanguage]['MESSAGES']['LOADING']
              : AddNewLessonFormDict[userLanguage]['MESSAGES']['NODESIGNEROPTION']
          }
        />
      </div>
    </div>
  );
};

export default LessonDetails;
