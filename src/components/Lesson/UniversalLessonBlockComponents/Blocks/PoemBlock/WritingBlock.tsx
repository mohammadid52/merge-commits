import React, {useEffect, useState} from 'react';
import {useOutsideAlerter} from '../../../../General/hooks/outsideAlerter';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {AiOutlinePlus} from 'react-icons/ai';
import {
  PagePartInput,
  PartContentSub,
} from '../../../../../interfaces/UniversalLessonInterfaces';

interface WritingBlockProps {
  id?: string;
  linestarters?: PartContentSub[];
  poemInput?: PagePartInput[];
  setPoemInput?: React.Dispatch<React.SetStateAction<PagePartInput[]>>;
}

const WritingBlock = (props: WritingBlockProps) => {
  const {id, linestarters, poemInput, setPoemInput} = props;
  const [nrLines, setNrLines] = useState<number>(1);

  const handleAddInput = () => {
    setNrLines(nrLines + 1);
  };

  useEffect(() => {
    const initialPoemInput = Array.from(Array(nrLines).keys()).map(
      (_: any, idx: number) => {
        return {
          domID: `${id}_${idx}`,
          input: [''],
        };
      }
    );
    setPoemInput(initialPoemInput);
  }, [nrLines]);

  const handleDeleteInput = (e: any) => {};

  const handleMenuToggle = (e: any) => {};

  const handleSubmit = () => {};

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {id, value} = e.target;
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
        className={`w-full flex flex-col border-2 border-white border-opacity-20 rounded-lg`}>
        {/* MAP THE LINE PROMPTS */}
        {poemInput.map((inputObj: PagePartInput, idx: number) => (
          <div key={`${inputObj.domID}`}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
              Input {idx}:
            </label>
            <select
              id={`${inputObj.domID}`}
              onChange={(e)=>handleInputChange(e)}
              name={`${inputObj.domID}`}
              className="bg-charcoal mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              {linestarters.map((line: PartContentSub, idx2: number) => (
                <option key={`line_${idx}_${idx2}`}>{line.value}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <button
        className={`self-center w-auto px-3 h-8 bg-yellow-500 text-gray-900 flex justify-center items-center rounded-xl mt-2 text-gray-200`}>
        Save and Edit Your Poem
      </button>
    </div>
  );
};

export default WritingBlock;
