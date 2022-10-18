import Buttons from 'components/Atoms/Buttons';
import RichTextEditor from 'components/Atoms/RichTextEditor';
import {GRATITUDE} from 'components/Lesson/UniversalLessonBuilder/UI/common/constants';
import AnimatedContainer from 'components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import useAuth from 'customHooks/useAuth';
import useGraphqlMutation from 'customHooks/useGraphqlMutation';
import {awsFormatDate, dateString} from 'utilities/time';
import {CreateGameChangerInput, CreateGameChangerLogInput} from 'API';
import gsap from 'gsap';
import {nanoid} from 'nanoid';
import React, {useEffect, useState} from 'react';
import {useGameChangers} from '../context/GameChangersContext';

const Gratitude = () => {
  const {email, authId} = useAuth();

  const [error, setError] = useState('');

  const {setIsCompleted, isCompleted} = useGameChangers();
  const [fields, setFields] = useState({summary: '1. \n\n2. \n\n3. \n', summaryHtml: ''});

  const mutationLog = useGraphqlMutation<{input: CreateGameChangerLogInput}>(
    'createGameChangerLog',
    {
      onSuccess: () => {
        setIsCompleted(true);
      }
    }
  );

  const mutation = useGraphqlMutation<{input: CreateGameChangerInput}>(
    'createGameChanger'
  );

  const onEditorStateChange = (
    html: string,
    text: string,
    fieldHtml: string,
    field: string
  ) => {
    setError('');
    setFields({...fields, [field]: text, [fieldHtml]: html});
  };

  const onSave = () => {
    const gameChangerID = nanoid(24);

    mutation.mutate({
      input: {
        id: gameChangerID,
        gameChangerName: GRATITUDE,
        objective: fields.summaryHtml
      }
    });

    mutationLog.mutate({
      input: {
        id: nanoid(24),
        gameChangerID,
        personAuthID: authId,
        personEmail: email,
        startTime: awsFormatDate(dateString('-', 'WORLD'))
      }
    });
  };

  useEffect(() => {
    gsap.fromTo(
      '#journal-editor',
      {
        delay: 1,
        height: 0,
        duration: 2,
        opacity: 0
      },
      {height: 'auto', opacity: 1, delay: 1}
    );
  }, []);

  return (
    <>
      <AnimatedContainer show={!isCompleted}>
        {!isCompleted && (
          <div>
            <h1 className="text-2xl text-white mb-4">
              Write down 3 things that you feel grateful for right now.
            </h1>
            <div id="journal-editor">
              <RichTextEditor
                wrapperClass="bg-component-dark border-none"
                rounded
                customStyle
                dark
                initialValue={fields.summary}
                onChange={(htmlContent, plainText) =>
                  onEditorStateChange(htmlContent, plainText, 'summaryHtml', 'summary')
                }
              />

              <div className="w-auto flex items-center justify-end mt-4">
                <Buttons
                  onClick={onSave}
                  label={mutationLog.isLoading || mutation.isLoading ? 'saving' : 'save'}
                />
              </div>
            </div>
          </div>
        )}
      </AnimatedContainer>
    </>
  );
};

export default Gratitude;
