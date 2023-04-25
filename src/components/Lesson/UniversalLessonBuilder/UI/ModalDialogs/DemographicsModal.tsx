import Buttons from '@components/Atoms/Buttons';
import useDictionary from '@customHooks/dictionary';
import {IContentTypeComponentProps} from '@interfaces/UniversalLessonBuilderInterfaces';
import React, {useState} from 'react';
import {FORM_TYPES} from '../common/constants';
import {PartContentSub} from '@interfaces/UniversalLessonInterfaces';
import {updateLessonPageToDB} from '@utilities/updateLessonPageToDB';
import {v4 as uuidV4} from 'uuid';
import useAuth from '@customHooks/useAuth';
import {logError} from 'graphql-functions/functions';
import {Checkbox} from 'antd';

const DemographicsModal = (props: IContentTypeComponentProps) => {
  const {EditQuestionModalDict, userLanguage} = useDictionary();

  const [loading, setLoading] = useState(false);

  const addToDB = async (list: any) => {
    props.closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan]
    };

    await updateLessonPageToDB(input);
  };

  const {email, authId} = useAuth();

  console.log(props);

  const [isRequired, setIsRequired] = useState(false);

  const onCreate = async () => {
    setLoading(true);
    try {
      const inputFieldsArray: PartContentSub[] = [
        {
          label: 'Demographics',
          value: 'Demographics',
          id: uuidV4(),
          type: FORM_TYPES.DEMOGRAPHICS,
          isRequired
        }
      ];
      let updatedList = [];
      if (props.inputObj[0]) {
        updatedList = props.updateBlockContentULBHandler(
          '',
          '',
          FORM_TYPES.DEMOGRAPHICS,
          [{...props.inputObj[0], isRequired}],
          undefined,
          undefined
        );
      } else {
        updatedList = props.createNewBlockULBHandler(
          '',
          '',
          FORM_TYPES.DEMOGRAPHICS,
          inputFieldsArray,
          undefined,
          undefined
        );
      }

      await addToDB(updatedList);
    } catch (error) {
      console.error(error);
      logError(error, {authId, email}, 'DemographicsModal @onCreate ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>This will add demographics to your survey</div>

      <Checkbox
        checked={isRequired}
        onClick={() => {
          setIsRequired(!isRequired);
        }}>
        Make this required
      </Checkbox>
      <div className="flex mt-8 justify-end gap-4 items-center px-6 pb-4">
        <Buttons
          label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
          onClick={props.askBeforeClose}
          transparent
          size="middle"
        />

        <Buttons
          label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
          loading={loading}
          size="middle"
          onClick={onCreate}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default DemographicsModal;
