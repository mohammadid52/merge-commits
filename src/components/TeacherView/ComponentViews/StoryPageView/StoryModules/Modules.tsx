import React, { useState, useEffect, useContext } from 'react';
// import { useCookies } from 'react-cookie';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineInfoCircle } from 'react-icons/ai';

type InputProp = [{ name: string; example: string; prompt: string }];

interface ModulesProps {
  inputs: InputProp;
  fullscreen: boolean;
  dataProps?: {
    title?: string;
    story?: string[];
    additional?: [
      {
        name: string;
        input: string;
      }
    ];
  };
}

interface FormInputsState {
  [key: string]: string;
}

const Modules = (props: ModulesProps) => {
  const { inputs, fullscreen, dataProps } = props;
  const { state, dispatch, theme } = useContext(LessonControlContext);
  // const [ cookies, setCookie ] = useCookies(['story'])
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
  }, []);

  useEffect(() => {
    if (dataProps && dataProps.additional) {
      dataProps.additional.forEach((item: { name: string; input: string }) => {
        setFormInputs((prev) => {
          return {
            ...prev,
            [item.name]: item.input,
          };
        });
      });
    }
  }, [dataProps]);

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
        <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
          <div className="absolute w-auto h-auto mr-2 right-0">
            <AiOutlineInfoCircle
              style={{
                MozUserSelect: 'none',
                WebkitUserSelect: 'none',
                msUserSelect: 'none',
              }}
            />
          </div>
        </IconContext.Provider>
      </div>

      <div className="w-full h-full ">
        {formInputs
          ? inputs.map((input, key) => (
              <div key={key} className={`flex flex-col mb-4 ${key !== inputs.length - 1}`}>
                <label className={`${theme.elem.text} mt-2 mb-2 w-full`} htmlFor={input.name}>
                  <p>
                    <span className="font-bold">{key + 1}.</span>&nbsp;{input.prompt}
                  </p>
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
