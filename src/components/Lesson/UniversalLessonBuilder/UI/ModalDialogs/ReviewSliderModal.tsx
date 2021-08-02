import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import {FORM_TYPES} from '../common/constants';
import {v4 as uuidv4} from 'uuid';

interface ReviewProps extends IContentTypeComponentProps {
  inputObj?: any;
}

const ReviewSliderModal = ({
  closeAction,
  inputObj,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
  askBeforeClose,
  setUnsavedChanges,
}: ReviewProps) => {
  const {userLanguage, clientKey} = useContext(GlobalContext);
  const {EditQuestionModalDict} = useDictionary(clientKey);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  useEffect(() => {
    if (inputObj && inputObj.length) {
      setIsEditingMode(true);
      setReviewFields({
        ...reviewFields,
        label: inputObj[0].label,
        value: inputObj[0].value,
      });
    }
  }, [inputObj]);

  const [reviewFields, setReviewFields] = useState({label: '', value: ''});

  const onChange = (e: React.FormEvent) => {
    setUnsavedChanges(true);
    const {value, name} = e.target as HTMLFormElement;
    setReviewFields({...reviewFields, [name]: value});
  };

  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };
    await updateLessonPageToDB(input);
  };

  const onReviewSliderCreate = async () => {
    const reviewSliderArray = [
      {
        id: uuidv4().toString(),
        type: FORM_TYPES.REVIEW_SLIDER,
        label: reviewFields.label,
        value: isEditingMode ? reviewFields.value : 0,
      },
    ];
    if (isEditingMode) {
      const updatedList = updateBlockContentULBHandler(
        '',
        '',
        'form',
        reviewSliderArray,
        0
      );
      await addToDB(updatedList);
    } else {
      const updatedList = createNewBlockULBHandler('', '', 'form', reviewSliderArray, 0);
      await addToDB(updatedList);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 my-2 gap-4">
        <div className="col-span-2">
          <div className={'my-2'}>
            <label
              htmlFor={'Link'}
              className="mb-2 block text-xs font-semibold leading-5 text-gray-700">
              Enter review title
            </label>
            <div className="mb-2">
              <FormInput
                onChange={onChange}
                name={'label'}
                value={reviewFields?.label}
                placeHolder={'Rate you experience'}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex mt-4 justify-end px-6 pb-4">
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
            onClick={onReviewSliderCreate}
          />
        </div>
      </div>
    </>
  );
};

export default ReviewSliderModal;
