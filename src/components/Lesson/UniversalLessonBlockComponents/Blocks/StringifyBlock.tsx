import { RowWrapperProps } from "interfaces/UniversalLessonBuilderInterfaces";

interface StringifyBlockProps extends RowWrapperProps {
  id: string;
  anyObj: any;
}

export const StringifyBlock = (props: StringifyBlockProps) => {
  const { id, anyObj } = props;
  return (
    <div id={id} className="">
      <p className={`bg-white bg-opacity-20 px-4 py-5 sm:p-6`}>
        {JSON.stringify(anyObj)}
      </p>
    </div>
  );
};
