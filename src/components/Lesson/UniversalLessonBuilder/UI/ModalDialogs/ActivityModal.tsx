import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {IContentTypeComponentProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {snakeCase} from 'lodash';
import {nanoid} from 'nanoid';
import {useState} from 'react';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';
import {
  EMOTIONS,
  GAME_CHANGERS,
  GRATITUDE,
  SINGING_BOWL,
  SQUARE,
  THINK_ABOUT_IT
} from '../common/constants';

interface ActivityModalProps extends IContentTypeComponentProps {
  type: string;
}

const ActivityModal = ({
  createNewBlockULBHandler,
  askBeforeClose,
  closeAction,
  type = SQUARE
}: ActivityModalProps) => {
  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan]
    };

    await updateLessonPageToDB(input);
  };

  const {userLanguage} = useGlobalContext();
  const {EditQuestionModalDict} = useDictionary();

  const getLabel = () => {
    switch (type) {
      case SQUARE:
        return 'Square';

      case EMOTIONS:
        return 'Emotion';

      case THINK_ABOUT_IT:
        return 'Think About It';
      case GRATITUDE:
        return 'Gratitude Component';
      case SINGING_BOWL:
        return 'Singing Bowl Component';

      default:
        return '478 Breathing';
    }
  };
  const onActivityCreate = async () => {
    const value = [
      {
        id: nanoid(20),
        label: type === EMOTIONS ? emotionLabel : getLabel(),
        value: snakeCase(getLabel())
      }
    ];

    const parentKey = 'activities';
    const updatedList: any = createNewBlockULBHandler(
      '',
      '',
      GAME_CHANGERS,

      value,
      0,
      '',
      parentKey
    );
    await addToDB(updatedList);
  };

  const [emotionLabel, setEmotionLabel] = useState('');

  return (
    <div>
      {type !== EMOTIONS && <h1>Did you want to add {getLabel()} to this lesson?</h1>}

      {type === EMOTIONS && (
        <div>
          <FormInput
            onChange={(e) => setEmotionLabel(e.target.value)}
            label={'Emotion Feedback Label'}
            value={emotionLabel}
            id={'emotion_feedback_label'}
            placeHolder={`Enter label for emotion feedback`}
            type="text"
          />
        </div>
      )}

      <div className="flex mt-8 justify-end px-6 pb-4">
        <div className="flex justify-end gap-4">
          <Buttons
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={askBeforeClose}
            size="middle"
            transparent
          />
          <Buttons
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            onClick={onActivityCreate}
            size="middle"
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
