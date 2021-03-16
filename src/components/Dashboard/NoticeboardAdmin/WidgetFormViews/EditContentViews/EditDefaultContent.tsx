import React, { Fragment } from 'react';
import { NoticeboardFormProps } from '../../NoticeboardAdminContent';
import RichTextEditor from '../../../../Atoms/RichTextEditor';

// Standard widget card view
export const EditDefaultContent = (props: NoticeboardFormProps) => {
  const {
    widgetObj,
    setEditorContent,
    handleActivation,
    handleEditUpdateDefault,
    handleEditUpdateQuotes,
    viewEditMode,
    setNewWidgetData,
    setWidgetData,
    widgetData,
  } = props;
  return (
    <div className={`mt-2 mb-2`}>
      <Fragment>
        <label htmlFor={`${widgetObj.id}`} className="block text-xs font-semibold leading-5 text-gray-700">
          {`Content`}
        </label>
        <RichTextEditor
          initialValue={widgetObj.content.text}
          onChange={(htmlContent, plainText) =>
            setEditorContent(htmlContent, plainText, `content_${widgetObj.type}_${widgetObj.id}`)
          }
        />
      </Fragment>
    </div>
  )
};