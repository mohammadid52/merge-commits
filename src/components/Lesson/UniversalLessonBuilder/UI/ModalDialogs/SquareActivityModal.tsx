import React from 'react';
import {IContentTypeComponentProps} from '@interfaces/UniversalLessonBuilderInterfaces';
import {SQUARE} from '../common/constants';
import {updateLessonPageToDB} from '@utilities/updateLessonPageToDB';
import {nanoid} from 'nanoid';
import Buttons from '@components/Atoms/Buttons';
import {useGlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';

const SquareActivityModal = ({
  createNewBlockULBHandler,
  askBeforeClose,
  closeAction,
}: IContentTypeComponentProps) => {
  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };

    await updateLessonPageToDB(input);
  };

  const {clientKey, userLanguage} = useGlobalContext();
  const {EditQuestionModalDict} = useDictionary(clientKey);

  const onActivityCreate = async () => {
    const value = [
      {
        id: nanoid(20),
        label: 'Square Breathing',
        value: 'sqaure-breathing',
      },
    ];

    const parentKey = 'activities';
    const updatedList: any = createNewBlockULBHandler(
      '',
      '',
      SQUARE,

      value,
      0,
      '',
      parentKey
    );
    await addToDB(updatedList);
  };
  return (
    <div>
      <h1>Did you want to add Square breathing to this lesson?</h1>

      <div className="flex mt-8 justify-center px-6 pb-4">
        <div className="flex justify-end">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={askBeforeClose}
            transparent
          />
          <Buttons
            btnClass="py-1 px-8 text-xs ml-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            onClick={onActivityCreate}
          />
        </div>
      </div>
    </div>
  );
};

export default SquareActivityModal;
