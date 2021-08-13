import {ContentState, convertFromHTML, EditorState} from 'draft-js';
import React from 'react';
import RichTextEditor from '../../../../Atoms/RichTextEditor';
import CustomRichTextEditor from '../HighlighterBlock/CustomRichTextEditor';

interface EditingBlockProps {
  id?: string;
  poemWriting?: string;
  handleUpdateStudentData?: (domID: string, input: string[]) => void;
  setPoemWriting?: React.Dispatch<React.SetStateAction<string>>;
  fields?: {poemHtml: string; poemText: string};
  setFields?: React.Dispatch<React.SetStateAction<{poemHtml: string; poemText: string}>>;
}

const EditingBlock = (props: EditingBlockProps) => {
  const {
    id,
    poemWriting,
    fields,
    setFields,
    setPoemWriting,
    handleUpdateStudentData,
  } = props;

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
          className={`w-full h-64 py-2 px-4 dark:text-white text-gray-900 mt-2 rounded-xl bg-gray-200 dark:bg-darker-gray`}
          name="story"
          // onChange={isInLesson && isStudent ? (e) => onChange(e) : () => {}}
          // value={isInLesson ? getValue(inputID) : value}
          value={fields.poemText}
          rows={3}
          cols={250}
          onChange={(e) => setFields({...fields, poemText: e.target.value})}
        />
      </div>
    </div>
  );
};

export default EditingBlock;
