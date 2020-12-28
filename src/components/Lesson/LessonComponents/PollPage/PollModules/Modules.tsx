import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';

type InputProp = [{ name: string; example: string; prompt: string }];

interface ModulesProps {
  inputs: InputProp;
}

interface FormInputsState {
  [key: string]: string;
}

const Modules = (props: ModulesProps) => {
  const { inputs } = props;
  const { state, theme, dispatch } = useContext(LessonContext);
  const [cookies, setCookie] = useCookies([`lesson-${state.classroomID}`]);
  const [formInputs, setFormInputs] = useState<FormInputsState>();

  useEffect(() => {
    inputs.forEach((item: { name: string; example: string; prompt: string }) => {
      setFormInputs((prev) => {
        return {
          ...prev,
          [item.name]: '',
        };
      });
    });

    if (
      cookies[`lesson-${state.classroomID}`]?.poll?.additional &&
      cookies[`lesson-${state.classroomID}`].poll.additional.length > 0
    ) {
      cookies[`lesson-${state.classroomID}`].poll.additional.forEach((item: { name: string; input: string }) => {
        setFormInputs((prev) => {
          return {
            ...prev,
            [item.name]: item.input,
          };
        });
      });
    }

    if (
      state.componentState.poll &&
      state.componentState.poll.additional &&
      state.componentState.poll.additional.length > 0
    ) {
      state.componentState.poll.additional.map((item: { name: string; input: string }) => {
        setFormInputs((prev) => {
          return {
            ...prev,
            [item.name]: item.input,
          };
        });
      });
    }
  }, []);

  useEffect(() => {
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

      setCookie(`lesson-${state.classroomID}`, {
        ...cookies[`lesson-${state.classroomID}`],
        poll: { ...cookies[`lesson-${state.classroomID}`].poll, additional: tempArray },
      });
    }
  }, [formInputs]);

  const handleFormInputChange = (e: { target: { id: string; value: string } }) => {
    setFormInputs({
      ...formInputs,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="relative w-full h-full rounded-xl">
      <div className={`w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>
      <h3>Focus Questions</h3>
      </div>
      <div className="w-full h-full ">
        {formInputs
          ? inputs.map((input, key) => (
              <div
                key={key}
                className={`flex flex-col animate-fadeIn ${
                  key !== inputs.length - 1 && 'border-b border-white border-opacity-10 '
                }`}>
                <label
                  className={`${theme.elem.text} mt-2 mb-2 w-full`}
                  htmlFor={input.name}>
                  {input.prompt}
                </label>
                <input
                  id={input.name}
                  className={`h-auto ${theme.elem.textInput} w-full rounded-xl`}
                  name={input.name}
                  type="text"
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
