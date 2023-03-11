import UploadMedia from "molecules/UploadMedia";
import { IFile } from "interfaces/UniversalLessonInterfaces";
import React, { useRef, useState } from "react";
import { useGlobalContext } from "contexts/GlobalContext";
import useDictionary from "customHooks/dictionary";
import { IContentTypeComponentProps } from "interfaces/UniversalLessonBuilderInterfaces";
import { removeExtension } from "utilities/functions";
import { updateLessonPageToDB } from "utilities/updateLessonPageToDB";
import Buttons from "atoms/Buttons";
import { FORM_TYPES } from "../common/constants";

interface IDocsDialogProps extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
}

const DocsModal = (props: IDocsDialogProps) => {
  const {
    closeAction,

    createNewBlockULBHandler,
    updateBlockContentULBHandler,
    askBeforeClose,
  } = props;

  const [isEditingMode] = useState<boolean>(false);

  const customRef = useRef<any>(null);

  const { userLanguage } = useGlobalContext();

  const { EditQuestionModalDict } = useDictionary();

  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };

    await updateLessonPageToDB(input);
  };

  const onDocsCreate = async () => {
    const _files = [
      file && {
        id: file.id,
        label: removeExtension(file?.fileName || file?.file?.name || "") || "",
        value: file.fileKey,
      },
    ].filter(Boolean);

    if (isEditingMode) {
      const updatedList: any = updateBlockContentULBHandler(
        "",
        "",
        FORM_TYPES.DOCS,
        _files,
        0,
        ""
      );

      await addToDB(updatedList);
    } else {
      const updatedList: any = createNewBlockULBHandler(
        "",
        "",
        FORM_TYPES.DOCS,

        _files,
        0,
        ""
      );
      await addToDB(updatedList);
    }
  };

  const [file, setFile] = useState<IFile | null>(null);
  const [_, setError] = useState("");

  return (
    <div>
      <UploadMedia
        file={file}
        uploadKey={"ULB/"}
        setFile={setFile}
        accept=".pdf, .docx"
        setError={setError}
        customRef={customRef}
      />
      <div className="flex mt-8 justify-center px-6 pb-4">
        <div className="flex justify-end">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={EditQuestionModalDict[userLanguage]["BUTTON"]["CANCEL"]}
            onClick={askBeforeClose}
            transparent
          />
          <Buttons
            btnClass="py-1 px-8 text-xs ml-2"
            label={EditQuestionModalDict[userLanguage]["BUTTON"]["SAVE"]}
            onClick={onDocsCreate}
          />
        </div>
      </div>
    </div>
  );
};

export default DocsModal;
