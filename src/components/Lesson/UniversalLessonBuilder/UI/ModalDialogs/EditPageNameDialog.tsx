import {findIndex, update} from 'lodash';
import React, {useContext, useState} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import {useQuery} from '../../../../../customHooks/urlParam';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';
import Selector from '../../../../Atoms/Form/Selector';
import useDictionary from '../../../../../customHooks/dictionary';
import {estimatedTimeList} from '../../../../../utilities/staticData';

const EditPageNameDialog = ({content, closeAction, backToDetails}: any) => {
  const [updatedValues, setUpdatedValues] = useState({
    id: content.id,
    title: content.title,
    description: content.description,
    label: content.label,
    estTime: `${content.estTime} min`,
  });

  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {LessonBuilderDict} = useDictionary(clientKey);

  const {universalLessonDetails, setUniversalLessonDetails} = useULBContext();

  const params = useQuery(location.search);

  const lessonId = params.get('lessonId');

  const updateData = async () => {
    closeAction();

    const PAGECONTENT_ID = content.id;

    const pageIdx = findIndex(
      universalLessonDetails.lessonPlan,
      (item: any) => item.id === PAGECONTENT_ID
    );

    const PATH_TO_PAGECONTENT = `lessonPlan[${pageIdx}]`;
    const updatedObject = {
      ...universalLessonDetails.lessonPlan[pageIdx],
      id: content.id,
      title: updatedValues.title,
      description: updatedValues.description,
      label: updatedValues.label,
      estTime: Number(updatedValues.estTime?.split(' ')[0]),
    };

    update(universalLessonDetails, PATH_TO_PAGECONTENT, () => {
      return updatedObject;
    });

    setUniversalLessonDetails({...universalLessonDetails});

    const input = {
      id: lessonId,
      lessonPlan: [...universalLessonDetails.lessonPlan],
    };

    backToDetails();
    await updateLessonPageToDB(input);
  };

  const onChange = (e: any) => {
    const {id, value} = e.target;
    setUpdatedValues({...updatedValues, [id]: value});
  };

  const onSelectOption = (_: any, name: string) => {
    setUpdatedValues((prevInputs: any) => ({
      ...prevInputs,
      estTime: name,
    }));
  };

  return (
    <div>
      <div>
        <div className="mb-4">
          <FormInput
            label={'Edit Label'}
            value={updatedValues.label}
            onChange={onChange}
            id={'label'}
          />
        </div>
        <div className="mb-4">
          <FormInput
            label={'Edit Title'}
            value={updatedValues.title}
            onChange={onChange}
            id={'title'}
          />
        </div>
        <div className="mb-4">
          <FormInput
            label={'Edit Description'}
            value={updatedValues.description}
            onChange={onChange}
            id={'description'}
          />
          <div className="mb-4">
            <Selector
              label={LessonBuilderDict[userLanguage]['LESSON_PLAN_FORM'].ESTIMATED_TIME}
              placeholder={'Select estimate time'}
              list={estimatedTimeList}
              selectedItem={updatedValues.estTime}
              onChange={onSelectOption}
            />
          </div>
        </div>
      </div>

      <div className="flex mt-8 justify-center px-6 pb-4">
        <div className="flex justify-end">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={closeAction}
            transparent
          />
          <Buttons
            btnClass="py-1 px-8 text-xs ml-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            onClick={updateData}
          />
        </div>
      </div>
    </div>
  );
};

export default EditPageNameDialog;
