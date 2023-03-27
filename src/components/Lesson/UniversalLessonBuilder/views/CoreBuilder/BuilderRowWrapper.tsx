import {RowWrapperProps} from 'interfaces/UniversalLessonBuilderInterfaces';

export const BuilderRowWrapper = (props: RowWrapperProps) => {
  const {dataIdAttribute, contentID, children} = props;

  return (
    <div id={contentID} data-id={dataIdAttribute} className={`relative transition-all`}>
      <div className={` builderWrapper`}>
        <div className="relative ">{children}</div>
      </div>
    </div>
  );
};
