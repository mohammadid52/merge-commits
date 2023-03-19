import { useGlobalContext } from "contexts/GlobalContext";
import useDictionary from "customHooks/dictionary";
import { Widget as NoticeboardWidgetMapItem } from "interfaces/ClassroomComponentsInterfaces";

// Standard widget card view
export const ViewModeView = (props: {
  widgetObj: NoticeboardWidgetMapItem;
}) => {
  const { widgetObj } = props;
  const { theme, userLanguage } = useGlobalContext();
  const { noticeboardDict } = useDictionary();
  return (
    <>
      {/**
       *  section: TOP INFO
       */}
      <div className={`flex pb-2 mb-2 border-b-0 ${theme.lessonCard.border}`}>
        <span className={`text-left ${theme.lessonCard.subtitle}`}>
          {noticeboardDict[userLanguage].FORM.WIDGET_STATUS}:
          {widgetObj.active ? (
            <span className="ml-2 text-xs font-semibold text-green-400">
              {noticeboardDict[userLanguage].FORM.ACTIVE}:
            </span>
          ) : (
            <span className="ml-2 text-xs font-semibold text-gray-400">
              {noticeboardDict[userLanguage].FORM.INACTIVE}
            </span>
          )}
        </span>
        <span className={`text-right ${theme.lessonCard.subtitle}`}>
          {noticeboardDict[userLanguage].FORM.PLACEMENT}: {widgetObj.placement}
        </span>
      </div>
      {/**
       *  section: TITLE
       */}
      <div className={``}>
        <h4 className={`w-auto ${theme.lessonCard.title}`}>
          {widgetObj.title ? widgetObj.title : `Untitled widget`}
        </h4>
      </div>
      {/**
       *  section: DESCRIPTION
       */}
    </>
  );
};
