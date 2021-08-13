import React, {useContext, useState} from 'react';
import {nanoid} from 'nanoid';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {AiOutlinePlus} from 'react-icons/ai';
import {
  StudentPageInput,
  PartContentSub,
} from '../../../../../interfaces/UniversalLessonInterfaces';
import {GlobalContext} from '../../../../../contexts/GlobalContext';

interface WritingBlockProps {
  id?: string;
  linestarters?: PartContentSub[];
  poemInput?: StudentPageInput[];
  setPoemInput?: React.Dispatch<React.SetStateAction<StudentPageInput[]>>;
  setPoemWriting?: React.Dispatch<React.SetStateAction<string>>;
  saveAndEdit?: boolean;
  handleUpdateStudentData?: (domID: string, input: string[]) => void;
  setSaveAndEdit?: React.Dispatch<React.SetStateAction<boolean>>;
  fields?: {poemHtml: string; poemText: string};
  setFields?: React.Dispatch<React.SetStateAction<{poemHtml: string; poemText: string}>>;
}

const WritingBlock = (props: WritingBlockProps) => {
  const {
    id,
    setPoemWriting,
    linestarters,
    poemInput,
    setPoemInput,
    setFields,
    fields,
    handleUpdateStudentData,
  } = props;

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
    const filtered = poemInput.filter((input: StudentPageInput) => input.domID !== id);
    setPoemInput(filtered);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {id, value} = e.target as HTMLSelectElement;
    const mapped = poemInput.map((input: StudentPageInput) => {
      if (input.domID === id) {
        return {
          domID: input.domID,
          input: [value],
        };
      } else {
        return input;
      }
    });
    setPoemInput(mapped);
  };

  const onAddClick = () => {
    const modifiedHTML = `${selectedLS.text}`;
    const conc = fields.poemText.concat(modifiedHTML);

    setFields({poemText: conc, poemHtml: `<p>${conc}</p>`});
    // handleUpdateStudentData(id, [modifiedHTML]);
  };

  const [selectedLS, setSelectedLS] = useState({
    text: '',
  });

  return (
    <div className="w-full flex items-center space-x-4">
      <div className={`w-full flex flex-col   rounded-lg`}>
        {/* MAP THE LINE PROMPTS */}
        {poemInput.map((inputObj: StudentPageInput, idx: number) => (
          <div key={`${inputObj.domID}`}>
            <select
              id={`${inputObj.domID}`}
              value={selectedLS.text}
              onChange={(e) => setSelectedLS({...selectedLS, text: e.target.value})}
              name={`${inputObj.domID}`}
              className={`bg-gray-200 dark:bg-charcoal block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${themeTextColor} rounded-md`}>
              <option value={''} disabled selected>
                Select a line starter
              </option>
              {linestarters.map((line: PartContentSub, idx2: number) => (
                <option value={line.value} key={`line_${idx}_${idx2}`}>
                  {line.value}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div
        onClick={onAddClick}
        tabIndex={0}
        role="button"
        className="w-auto p-3 bg-gray-200 dark:bg-indigo-400  rounded-md">
        <AiOutlinePlus className="dark:text-white text-gray-600" />
      </div>
    </div>
  );
};

export default WritingBlock;
