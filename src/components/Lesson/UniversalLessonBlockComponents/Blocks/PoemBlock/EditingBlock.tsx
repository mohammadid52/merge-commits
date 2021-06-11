import React from 'react';
import RichTextEditor from '../../../../Atoms/RichTextEditor';

interface EditingBlockProps {
  id?: string;
  poemWriting?: string;
  setPoemWriting?: React.Dispatch<React.SetStateAction<string>>;
}

const EditingBlock = (props: EditingBlockProps) => {
  const {id, poemWriting, setPoemWriting} = props;

  const setEditorContent = (html: string, text: string, idKey: string) =>
    setPoemWriting(html);

  return (
    <div className="w-full flex flex-col">
      <div className={`w-full h-full rounded-xl z-10 p-4 text-black`}>
        <h3
          className={`relative w-auto pb-2 mb-2  mt-4 flex flex-row items-center border-b-4 border-sea-green font-medium text-left text-gray-100 text-xl`}>
          Edit
        </h3>
        <RichTextEditor
          initialValue={poemWriting}
          onChange={(htmlContent, plainText) =>
            setEditorContent(htmlContent, plainText, id)
          }
        />
      </div>
    </div>
  );
};

export default EditingBlock;
