import React, {useContext} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useInLessonCheck from '../../../../../customHooks/checkIfInLesson';

interface EditingBlockProps {
  id?: string;
  poemWriting?: string;
  handleUpdateStudentData?: (domID: string, input: string[]) => void;
}

const EditingBlock = (props: EditingBlockProps) => {
  const {id, poemWriting, handleUpdateStudentData} = props;

  const {
    state: {user},
  } = useContext(GlobalContext);

  const onChange = (e: any) => {
    handleUpdateStudentData(id, [e.target.value]);
  };

  const isInLesson = useInLessonCheck();
  const isStudent = user.role === 'ST';

  return (
    <div className="w-full flex flex-col">
      <div className={`w-full h-full rounded-xl text-black`}>
        {/* <RichTextEditor
          initialValue={fields.poemHtml}
          onChange={(html, text) =>
            setFields({...fields, poemText: text, poemHtml: html})
          }
        /> */}

        <textarea
          id={id}
          className={`editingBlock w-full h-64 py-2 px-4 dark:text-white text-gray-900 mt-2 rounded-xl bg-gray-200 dark:bg-darker-gray`}
          name="story"
          onChange={isInLesson && isStudent ? (e) => onChange(e) : () => {}}
          value={poemWriting}
          rows={3}
          cols={250}
        />
      </div>
    </div>
  );
};

export default EditingBlock;
