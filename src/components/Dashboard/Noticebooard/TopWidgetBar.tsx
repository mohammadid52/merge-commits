import { useGlobalContext } from "contexts/GlobalContext";
import { Widget } from "interfaces/ClassroomComponentsInterfaces";

const TopWidgetBar = () => {
  const { state } = useGlobalContext();
  const {
    roomData: { widgets },
  } = state;

  const getTopWidgets = (): any[] => {
    const thereAreWidgets = widgets.length > 0;
    if (thereAreWidgets) {
      return widgets.filter((widgetObj) => {
        return widgetObj?.placement === "topbar" && widgetObj?.active;
      });
    } else {
      return [];
    }
  };

  return getTopWidgets().length > 0 ? (
    // <ContentCard hasBackground={false}>
    <div className={`w-full h-auto min-h-16 flex`}>
      {getTopWidgets().map((_: Widget, idx: number) => {
        return (
          <div key={`topbar_widget_${idx}_parent`} className={`my-4 w-48 mr-4`}>
            {/* {switchWidgets(widgetObj, idx)} */}
          </div>
        );
      })}
    </div>
  ) : // </ContentCard>
  null;
};

export default TopWidgetBar;
