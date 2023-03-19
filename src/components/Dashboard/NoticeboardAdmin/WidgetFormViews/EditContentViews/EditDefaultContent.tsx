import RichTextEditor from "atoms/RichTextEditor";
import { useGlobalContext } from "contexts/GlobalContext";
import useDictionary from "customHooks/dictionary";
import { Fragment } from "react";
import { NoticeboardFormProps } from "../../NoticeboardAdminContent";

// Standard widget card view
export const EditDefaultContent = (props: NoticeboardFormProps) => {
  const { widgetObj, setEditorContent } = props;
  const { userLanguage } = useGlobalContext();
  const { noticeboardDict } = useDictionary();
  return (
    <div className={`mt-2 mb-2 p-2`}>
      <Fragment>
        <label
          htmlFor={`${widgetObj?.id}`}
          className="block text-xs font-semibold leading-5 text-gray-700"
        >
          {noticeboardDict[userLanguage].FORM.CONTENT}
        </label>
        <RichTextEditor
          initialValue={widgetObj?.content?.text || ""}
          onChange={(htmlContent, plainText) =>
            setEditorContent(
              htmlContent,
              plainText,
              `content_${widgetObj?.type}_${widgetObj?.id}`
            )
          }
        />
      </Fragment>
    </div>
  );
};
