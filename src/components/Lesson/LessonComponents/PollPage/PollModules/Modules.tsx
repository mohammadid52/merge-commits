import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

import { useCookies } from 'react-cookie';
import { PollInput } from './PollActivity';

type InputProp = [{ name: string; example: string; prompt: string }];

interface ModulesProps {
  isTeacher?: boolean;
  inputs: InputProp;
  dataProps?: {
    pollInputs?: PollInput[];
    poll?: PollInput[];
    additional: any;
  };
}

interface FormInputsState {
  [key: string]: string;
}

const Modules = (props: ModulesProps) => {
  /**
   * Teacher switch
   */
  const { isTeacher, inputs, dataProps } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

  /**
   * Component state and cookies
   */
  const [cookies, setCookie] = useCookies([`lesson-${state.syllabusLessonID}`]);
  const [formInputs, setFormInputs] = useState<FormInputsState>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    inputs.forEach((item: { name: string; example: string; prompt: string }) => {
      setFormInputs((prev) => {
        return {
          ...prev,
          [item.name]: '',
        };
      });
    });

    if (!isTeacher) {
      /**
       *
       * CHECK IF NOT TEACHER and
       * ONLY DO THIS FOR STUDENT
       *
       */
      if (
        cookies[`lesson-${state.syllabusLessonID}`]?.poll?.additional &&
        cookies[`lesson-${state.syllabusLessonID}`].poll.additional.length > 0
      ) {
        cookies[`lesson-${state.syllabusLessonID}`].poll.additional.forEach((item: { name: string; input: string }) => {
          setFormInputs((prev) => {
            return {
              ...prev,
              [item.name]: item.input,
            };
          });
        });
      }

      if (
        state.componentState?.poll &&
        state.componentState?.poll.additional &&
        state.componentState?.poll.additional.length > 0
      ) {
        state.componentState?.poll.additional.map((item: { name: string; input: string }) => {
          setFormInputs((prev) => {
            return {
              ...prev,
              [item.name]: item.input,
            };
          });
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!isTeacher) {
      /**
       *
       * CHECK IF NOT TEACHER and
       * ONLY DO THIS FOR STUDENT
       *
       */
      if (formInputs) {
        let tempArray: Array<{ name: string; input: string }> = [];
        inputs.forEach((input) => {
          let tempObj = {
            name: input.name,
            input: formInputs[input.name],
          };

          tempArray.push(tempObj);
        });

        dispatch({
          type: 'UPDATE_COMPONENT_STATE',
          payload: {
            componentName: 'poll',
            inputName: 'additional',
            content: tempArray,
          },
        });

        setCookie(`lesson-${state.syllabusLessonID}`, {
          ...cookies[`lesson-${state.syllabusLessonID}`],
          poll: { ...cookies[`lesson-${state.syllabusLessonID}`].poll, additional: tempArray },
        });
      }
    }
  }, [formInputs]);


  useEffect(() => {
    if (isTeacher && dataProps) {
      if (dataProps.additional) {
        const mappedValues = dataProps.additional.map((item: { name: string; input: string }) => {
          return { [item.name]: item.input };
        });

        setFormInputs(mappedValues[0]); // TODO: same as PollForm.tsx, in student this data structure is an object, but in teacher it becomes array
        // TODO: fix this so data structure doesnt change
      }
    }
  }, [dataProps]);

  const handleFormInputChange = (e: { target: { id: string; value: string } }) => {
    setFormInputs({
      ...formInputs,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className='relative w-full h-full rounded-xl'>
      <div className={`w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>
        <h3>Focus Questions</h3>
      </div>
      <div className='w-full h-full '>
        {formInputs
          ? inputs.map((input, key) => (
            <div
              key={key}
              className={`flex flex-col animate-fadeIn ${
                key !== inputs.length - 1 && 'border-b border-white border-opacity-10 '
              }`}>
              <label className={`${theme.elem.text} mt-2 mb-2 w-full`} htmlFor={input.name}>
                {input.prompt}
              </label>
              <input
                id={input.name}
                className={`h-auto ${theme.elem.textInput} w-full rounded-xl`}
                name={input.name}
                type='text'
                placeholder={`${input.example}, etc.`}
                value={formInputs[input.name]}
                onChange={handleFormInputChange}
              />
            </div>
          ))
          : null}
      </div>
    </div>
  );
};

export default Modules;
