import React, { useContext } from 'react';
import { nanoid } from 'nanoid';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlinePlus } from 'react-icons/ai';
import { PagePartInput, PartContentSub } from '../../../../../interfaces/UniversalLessonInterfaces';
import { GlobalContext } from '../../../../../contexts/GlobalContext';

interface WritingBlockProps {
  id?: string;
  linestarters?: PartContentSub[];
  poemInput?: PagePartInput[];
  setPoemInput?: React.Dispatch<React.SetStateAction<PagePartInput[]>>;
  saveAndEdit?: boolean;
  setSaveAndEdit?: React.Dispatch<React.SetStateAction<boolean>>;
}

const WritingBlock = (props: WritingBlockProps) => {
  const {id, linestarters, poemInput, setPoemInput, saveAndEdit, setSaveAndEdit} = props;
  const {
    state: {lessonPage: {theme: lessonPageTheme = '', themeTextColor = ''} = {}},
  } = useContext(GlobalContext);
  

  const handleAddInput = () => {
    setPoemInput([
      ...poemInput,
      {
        domID: `line_${nanoid(4)}`,
        input: [''],
      },
    ]);
  };

  const handleDeleteInput = (e: React.MouseEvent) => {
    const {id} = e.target as HTMLElement;
    const filtered = poemInput.filter((input: PagePartInput) => input.domID !== id);
    setPoemInput(filtered);
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {id, value} = e.target as HTMLSelectElement;
    const mapped = poemInput.map((input: PagePartInput) => {
      if (input.domID === id) {
        return {
          domID: input.domID,
          input: [value],
        };
      } else {
        return input;
      }
    });
    setPoemInput(mapped)
  };

  return (
    <div className="w-full flex flex-col">
      <div className={`w-full h-full rounded-xl z-10 p-4`}>
        <h3
          className={`relative w-auto pb-2 mb-2  mt-4 flex flex-row items-center border-b-4 border-sea-green font-medium text-left text-gray-100 text-xl`}>
          Line Prompts
        </h3>

        {/* ADD LINE PROMPS BUTTON */}
        <button
          className={`mx-auto w-auto px-3 h-8 bg-sea-green flex justify-center items-center rounded-xl mt-2 text-sm text-gray-200`}
          onClick={handleAddInput}>
          Add Line
          <IconContext.Provider
            value={{
              size: '1.5rem',
              style: {width: '32px'},
              className: `text-white`,
            }}>
            <div className="w-8 cursor-pointer">
              <AiOutlinePlus />
            </div>
          </IconContext.Provider>
        </button>
      </div>

      <div
        className={`w-full flex flex-col border-2 border-white border-opacity-20 rounded-lg p-4`}>
        {/* MAP THE LINE PROMPTS */}
        {poemInput.map((inputObj: PagePartInput, idx: number) => (
          <div key={`${inputObj.domID}`} className={`mb-4`}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
              Input {idx}:{' '}
              <span
                id={`${inputObj.domID}`}
                onClick={(e) => handleDeleteInput(e)}
                className={`font-semibold text-xs text-red-400 cursor-pointer`}>
                Delete?
              </span>
            </label>
            <select
              id={`${inputObj.domID}`}
              onChange={(e) => handleInputChange(e)}
              name={`${inputObj.domID}`}
              className={`${
                lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-charcoal'
              } mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}>
              {linestarters.map((line: PartContentSub, idx2: number) => (
                <option key={`line_${idx}_${idx2}`}>{line.value}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WritingBlock;
