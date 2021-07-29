import React from 'react';
import RichTextEditor from '../../../../Atoms/RichTextEditor';

interface EditingBlockProps {
  id?: string;
  poemWriting?: string;
  handleUpdateStudentData?: (domID: string, input: string[]) => void;
}

const EditingBlock = (props: EditingBlockProps) => {
  const {id, poemWriting, handleUpdateStudentData} = props;

  const setEditorContent = (html: string, text: string, idKey: string) => {
    handleUpdateStudentData(id, [html]);
  };
  // handleUpdateStudentData(id, [html]);

  return (
    <div className="w-full flex flex-col">
      <div className={`w-full h-full rounded-xl p-4 text-black`}>
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
